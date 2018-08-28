import { Op } from 'sequelize';
import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import addDays from 'date-fns/add_days';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Controller from './Controller';

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
   * Gets orders that match the query options
   * Meals are not included
   * @param {obj} req  express request object
   * @param {obj} options seequelize query options object
   * @returns {obj}
   */
  getOrdersWithMealLinks(req, options = {}) {
    let scope;
    const { userId, isCaterer } = req.decoded;
    options.include = [{
      association: 'Meals',
      attributes: ['price'],
      through: {
        attributes: ['quantity']
      },
      required: true,
      duplicating: false,
      paranoid: false }];
    options.distinct = false;
    options.subQuery = false;
    if (isCaterer) {
      options.include[0].where = { userId };
    } else {
      options.where = { userId };
    }
    return this.getAllRecords(req, scope, options, { raw: true })
      .then(({ limit, page, pages, count, rows }) => {
        const newRows = rows.map((row) => {
          row.dataValues.MealsURL = `/api/v1/orders/${row.id}/meals`;
          return row.dataValues;
        });
        return OrderController.defaultResponse({ limit,
          page,
          pages,
          count,
          rows: newRows });
      })
      .catch(error => OrderController.errorResponse(error.message));
  }
  /**
   * Gets orders that match the query options
   * orders are for the current day or the date in query params
   * Meals are not included
   * @param {obj} req  express request object
   * @param {obj} options seequelize query options object
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
   * @param {obj} options seequelize query options object
   * @returns {obj}
   */
  getMealsInOrder(req, options = {}) {
    options.where = { id: req.params.id };
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
          await order.setMeals([]);
        }
        return Promise.reject(new Error('Order edit period has expired'));
      })
      .then(() => orderRef.reload())
      .then(reloadedOrder => OrderController.processOrder(reloadedOrder, req))
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
