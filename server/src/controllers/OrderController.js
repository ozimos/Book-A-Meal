import Sequelize, { Op } from 'sequelize';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import addDays from 'date-fns/addDays';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import Controller from './Controller';
import cashTotal from './util/cashTotal';
import uniqueUsers from './util/uniqueUsers';

const currentDate = format(new Date(), 'YYYY-MM-DD');

export default class OrderController extends Controller {

  /**
   * Express middleware to check if orders can still be made
   * @param {obj} req express request object
   * @param {obj} res express response object
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
   * @returns {Boolean}
   *
   */

  static isOrderEditable(date) {
    const hasEditMinutes = (parseInt(process.env.ORDER_EDIT_MINUTES, 10) || 15)
     - differenceInMinutes(new Date(), date) > 0;
    return (isToday(date) && hasEditMinutes);
  }

  /**
  * Gets the total sales
  * @param {obj} req express request object
  * @param {obj} sequelize query options object
  * @returns {obj} revenue, orders and unique users
  *
  */

  getTotalSales(req, input = {}) {
    const { userId, isCaterer } = req.decoded;
    let scope;
    const settings = {
      where: {},
      attributes: ['userId'],
      include: [{
        association: 'Meals',
        where: (isCaterer) && { userId },
        paranoid: false,
        attributes: [[Sequelize
          .literal('"Meals"."price" * "Meals->MealOrders"."quantity"'),
        'subTotal']],
        through: {
          attributes: []
        }
      },
      {
        association: 'User',
        attributes: ['firstName', 'lastName', 'email']
      }]
    };
    const options = { ...settings, ...input };
    if (!isCaterer) {
      options.where.userId = userId;
    }
    return this.Model.scope(scope).findAll(options)
      .then((response) => {
        const revenue = cashTotal(response);
        const users = uniqueUsers(response);
        const orders = response.length;
        return Controller.defaultResponse({ revenue, orders, users });
      })
      .catch(error => Controller.errorResponse(error.message));
  }

  /**
  * Gets the total sales for the day
  * @param {obj} req express request object
  * @param {obj} sequelize query options object
  * @returns {obj} revenue, orders and unique users
  *
  */
  getTotalDaySales(req) {
    const date = req.query.date || currentDate;
    const nextDate = addDays(date, 1);
    const options = {
      where: { createdAt: { [Op.gte]: date, [Op.lt]: nextDate } }
    };
    return this.getTotalSales(req, options);
  }

  /**
  * Gets the total sales for the order
  * @param {obj} req express request object
  * @param {obj} sequelize query options object
  * @returns {obj} revenue, orders and unique users
  *
  */
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

  getOrdersWithMealLinks(req, newOptions = {}, successCode = 200, message) {

    let scope;
    const { userId, isCaterer } = req.decoded;
    const defaultOptions = {
      include: [{
        association: 'User',
        attributes: ['firstName', 'lastName', 'email']
      },
      {
        association: 'Meals',
        attributes: [],
        where: (isCaterer) && { userId },
        paranoid: false,
        through: {
          attributes: [],
        },
      }
      ],
      distinct: true,
      where: (!isCaterer) && { userId },
      order: [['updatedAt', 'DESC']]
    };
    const options = { ...defaultOptions, ...newOptions };
    if (!isCaterer) {
      options.where.userId = userId;
    }
    return this.getAllRecords(req, scope, options, { raw: true })
      .then(({ limit, offset, pages, count, rows }) => {
        const newRows = rows ? rows.map((row) => {
          row.dataValues.MealsURL = `/api/v1/orders/${row.id}/meals`;
          return row.dataValues;
        }) : [];

        if (!newRows.length) {
          const msg = message || 'no records available';
          return OrderController.errorResponse(msg, 404);
        }

        return OrderController.defaultResponse({
          limit,
          offset,
          pages,
          count,
          rows: newRows }, successCode);
      })
      .catch(error => OrderController.errorResponse(error.message));
  }

  /**
   * Gets orders that match the query options
   * orders are for the current day or the date in query params
   * Meals are not included
   * @param {obj} req  express request object
   * @param {obj} options sequelize query options object
   * @returns {obj}
   */
  getOrdersWithMealLinksByDate(req) {
    const date = req.params.date || currentDate;
    const nextDate = addDays(date, 1);

    const options = {
      where: { createdAt: { [Op.gte]: date, [Op.lt]: nextDate } },
    };
    return this.getOrdersWithMealLinks(req, options)
      .catch(error => OrderController.errorResponse(error.message));
  }

  /**
   * Gets meals that match the order id parameter supplied in the route
   * for caterers, gets only the meals created by caterer
   * for users, gets the meals only if the order belongs to user
   * @param {obj} req express request object
   * @param {obj} options sequelize query options object
   * @returns {obj}
   */

  getMealsInOrder(req) {
    const { userId, isCaterer } = req.decoded;
    let scope;

    const options = {
      where: { id: req.params.id },
      include: [{
        association: 'Meals',
        where: (isCaterer) && { userId },
        duplicating: false,
        paranoid: false,
        attributes: ['id', 'userId', 'title', 'description', 'price',
          'updatedAt',
          [Sequelize
            .literal('"Meals"."price" * "Meals->MealOrders"."quantity"'),
          'subTotal']],
        through: {
          attributes: ['quantity'],
        }
      },
      {
        association: 'User',
        attributes: ['firstName', 'lastName', 'email']
      }]
    };


    let message;
    const acceptCallback = rows => rows[0].Meals.length > 0;

    if (isCaterer) {
      message = 'This order does not have your meals';
    } else {
      message = 'This order does not belong to you';
      options.where.userId = userId;
    }

    return this.getAllRecords(req, scope, options, { message, acceptCallback })
      .catch(error => OrderController.errorResponse(error.message));
  }

  /**
   * gets all the meals ia an order for editing
   * @param {obj} req express request object
   * @returns {obj}
   */

  getSingleOrder(req) {
    const options = {
      include: [{
        association: 'Meals',
        attributes: ['id', 'userId', 'title', 'description', 'price',
          'updatedAt'],
        through: {
          attributes: ['quantity'],
        }
      }
      ]
    };
    return this.getSingleRecord(req, options);
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
      req.query = { limit: 10 };
      const message = 'Order was not processed. Try again';
      return this.getOrdersWithMealLinks(req, {}, successCode, message);


    } catch (error) {
      return OrderController.errorResponse(error.message);
    }
  }

  /**
   * delete an order from the database
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  deleteOrder(req) {
    return this.Model
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then((result) => {
        if (result) { return this.getOrdersWithMealLinks(req); }
        return OrderController.errorResponse('order was not deleted', 404);
      })
      .catch(error => OrderController.errorResponse(error.message));
  }
}
