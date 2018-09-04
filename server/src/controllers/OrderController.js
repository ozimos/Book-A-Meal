import Sequelize, { Op } from 'sequelize';
import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import addDays from 'date-fns/add_days';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Controller from './Controller';
import cashTotal from './util/cashTotal';
import uniqueUsers from './util/uniqueUsers';

const currentDate = format(new Date(), 'YYYY-MM-DD');

export default class OrderController extends Controller {

  /**
   * Express middleware to check if orders can still be made
   * @param {obj} res express response object
   * @param {obj} req express request object
   * @param {obj} next express callback
   */

  static orderClose(req, res, next) {

    const hourInterval = parseInt(process.env.ORDER_INTERVAL_HOUR, 10) || 4;
    const minuteInterval = parseInt(process.env.ORDER_INTERVAL_MIN, 10) || 0;

    const computedCloseHour
    = parseInt(process.env.ORDER_START_HOUR, 10) + hourInterval;

    const computedCloseMin = parseInt(process.env.ORDER_START_MIN, 10) +
      minuteInterval;

    const closeHour
    = parseInt(process.env.ORDER_CLOSE_HOUR, 10) || computedCloseHour || 23;

    const closeMin
    = parseInt(process.env.ORDER_CLOSE_MIN, 10) || computedCloseMin || 50;

    const closeDate = new Date().setHours(closeHour, closeMin, 0);
    const date = new Date();

    if ((date - closeDate) >= 0) {
      const message = `Orders for the day have closed.
       Please place your order before ${closeHour}:${closeMin} Hours`;
      return res.status(403).json({
        message
      });
    }
    return next();
  }

  /**
   * Checks if order is editable
   * @param {obj} date Date object
   */

  static isOrderEditable(date) {
    const hasEditMinutes = (parseInt(process.env.ORDER_EDIT_MINUTES, 10) || 15)
     - differenceInMinutes(new Date(), date) > 0;
    return (isToday(date) && hasEditMinutes);
  }

  /**
 * Gets the total sales for the day
 * @param {obj} req express request object
 */

  getTotalSales(req, input = {}) {
    let scope;
    const { userId, isCaterer } = req.decoded;
    const settings = {
      where: {},
      distinct: false,
      attributes: ['userId']
    };
    const options = { ...settings, ...input };
    if (isCaterer) {
      scope = [{ method: ['forCaterersOrders', userId] }];
    } else {
      options.where.userId = userId;
      scope = 'forNonCaterersOrders';
    }
    return this.Model.scope(scope).findAll(options)
      .then((data) => {
        const revenue = cashTotal(data);
        const users = uniqueUsers(data);
        const orders = data.length;
        return Controller.defaultResponse({ revenue, orders, users });
      })
      .catch(error => Controller.errorResponse(error.message));
  }

  getTotalDaySales(req) {
    const date = req.query.date || currentDate;
    const nextDate = addDays(date, 1);
    const options = {
      where: { createdAt: { [Op.gte]: date, [Op.lt]: nextDate } }
    };
    return this.getTotalSales(req, options);
  }

  getTotalOrderSales(req) {
    const { id } = req.params;
    const options = { where: { id } };
    return this.getTotalSales(req, options);
  }
  /**
   * Gets orders that match the query options
   * Meals are not included
   * @param {obj} req  express request object
   * @param {obj} options seequelize query options object
   * @returns {obj}
   */

  getOrdersWithMealLinks(req) {

    let scope;
    const { userId, isCaterer } = req.decoded;
    const options = {
      include: [{
        association: 'User',
        attributes: ['firstName', 'lastName', 'email']
      },
      {
        association: 'Meals',
        attributes: [[Sequelize
          .literal('"Meals"."price" * "Meals->MealOrders"."quantity"'),
        'subTotal']],
        where: (isCaterer) && { userId },
        paranoid: true,
        through: {
          attributes: [],
        },
      }
      ],
      distinct: true,
      where: (!isCaterer) && { userId },
      order: [['updatedAt', 'DESC']]
    };

    return this.getAllRecords(req, scope, options, { raw: true })
      .then(({ limit, offset, pages, count, rows }) => {
        const newRows = rows ? rows.map((row) => {
          row.dataValues.MealsURL = `/api/v1/orders/${row.id}/meals`;
          return row.dataValues;
        }) : [];

        if (!newRows.length) {
          return OrderController.errorResponse('no records available', 404);
        }

        return OrderController.defaultResponse({
          limit,
          offset,
          pages,
          count,
          rows: newRows });
      })
      .catch(error => OrderController.errorResponse(error.message));
  }


  /**
   * Gets meals that match the order id parameter supplied in the route
   * for caterers, gets only the meals created by caterer
   * for users, gets the meals only if the order belongs to user
   * @param {obj} req express request object
   * @param {obj} options seequelize query options object
   * @returns {obj}
   */

  getMealsInOrder(req, options = {}) {

    options.where = { id: req.params.id };
    options.order = [['updatedAt', 'DESC']];

    const { userId, isCaterer } = req.decoded;

    let message, scope;
    const acceptCallback = rows => rows[0].Meals.length > 0;

    if (isCaterer) {
      scope = [{ method: ['forCaterers', userId] }];
      message = 'This order does not have your meals';
    } else {
      message = 'This order does not belong to you';
      options.where.userId = userId;
      scope = 'forNonCaterers';
    }

    return this.getAllRecords(req, scope, options, { message, acceptCallback })
      .catch(error => OrderController.errorResponse(error.message));
  }

  /**
   * Creates a new order
   * @param {obj} req express request object
   * @returns {obj}
   */

  postOrder(req) {

    const {
      userId
    } = req.decoded;

    return this.Model.create({
      userId
    })
      .then(order => this.processOrder(order, req, 201))
      .catch(err => OrderController.errorResponse(err.message));
  }

  /**
   * Updates an order
   * @param {obj} req express request object
   * @returns {obj}
   */

  updateOrder(req) {

    let orderRef;

    return this.Model.findById(req.params.id)
      .then(async (order) => {
        orderRef = order;
        if (OrderController.isOrderEditable(order.createdAt)) {
          return order.setMeals([]);
        }
        return Promise.reject(new Error('Order edit period has expired'));
      })
      .then(() => orderRef.reload())
      .then(reloadedOrder => this.processOrder(reloadedOrder, req))
      .catch(err => OrderController.errorResponse(err.message));
  }

  /**
   * Handles common logic for order creation and modification
   * @param {obj} req express request object
   * @returns {obj}
   */

  async processOrder(order, req, successCode = 200) {
    try {

      const promise = req.body.meals.map(meal =>
        order.addMeal(meal.id, {
          through: {
            quantity: meal.quantity
          }
        }));

      await Promise.all(promise);
      const options = { where: { id: order.id } };
      const { userId, isCaterer } = req.decoded;
      let scope;

      if (isCaterer) {
        scope = [{ method: ['forCaterers', userId] }];
      } else {
        scope = 'forNonCaterers';
      }

      const { pages, count, rows }
        = await this.getAllRecords(req, scope, options, { raw: true });

      if (rows.length > 0) {
        return OrderController
          .defaultResponse({ pages, count, rows }, successCode);
      }

      return OrderController
        .errorResponse('Order was not processed. Try again', 404);

    } catch (error) {
      return OrderController.errorResponse(error.message);
    }
  }
}
