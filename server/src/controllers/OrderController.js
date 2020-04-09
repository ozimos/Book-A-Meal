import isToday from "date-fns/isToday";
import differenceInMinutes from "date-fns/differenceInMinutes";
import Controller from "./Controller";
import cashTotal from "./util/cashTotal";
import uniqueUsers from "./util/uniqueUsers";

export default class OrderController extends Controller {
  /**
   * Creates an instance of OrderController.
   * @param {any} Model
   * @memberof OrderController
   */
  constructor(Model) {
    super(Model);
    this.getOrdersWithLinksByDate = this.getOrdersWithLinksByDate.bind(this);
    this.getTotalSales = this.getTotalSales.bind(this);
    this.getTotalDaySales = this.getTotalDaySales.bind(this);
    this.getTotalOrderSales = this.getTotalOrderSales.bind(this);
    this.getOrdersWithLinks = this.getOrdersWithLinks.bind(this);
    this.getOrdersWithLinksByDate = this.getOrdersWithLinksByDate.bind(this);
    this.getSingleOrderWithLinks = this.getSingleOrderWithLinks.bind(this);
    this.postOrder = this.postOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.processOrder = this.processOrder.bind(this);
  }

  /**
   * Express middleware to check if orders can still be made
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @param {obj} next express callback
   */

  static orderClose(req, res, next) {
    const closeHour = Math.min(parseInt(process.env.ORDER_CLOSE_HOUR, 10), 23);

    const closeMin = Math.min(parseInt(process.env.ORDER_CLOSE_MIN, 10), 59);

    const closeDate = new Date().setHours(closeHour, closeMin, 0);
    const date = new Date();

    if (date - closeDate >= 0) {
      const message = `Orders for the day have closed.
       Please place your order before ${closeHour}:${closeMin} Hours`;
      return res.status(403).json({
        message,
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
    const hasEditMinutes =
      (parseInt(process.env.ORDER_EDIT_MINUTES, 10) || 15) -
        differenceInMinutes(new Date(), date) >
      0;
    return isToday(date) && hasEditMinutes;
  }

  /**
   * Gets the total sales
   * @param {obj} req express request object
   * @param {obj} sequelize query options object
   * @returns {obj} revenue, orders and unique users
   *
   */

  getTotalSales(req, res, next) {
    const {
      scopes: extraScopes = [],
      statusCode = 200,
    } = this.cloneResetConfig();

    const scopes = ["basic", this.setAccessMode(req)].concat(extraScopes);
    return this.Model.scope(scopes)
      .findAll({ rejectOnEmpty: true })
      .then((response) => {
        const revenue = cashTotal(response);
        const users = uniqueUsers(response);
        const orders = response.length;
        return res.status(statusCode).json({
          data: { revenue, orders, users },
        });
      })
      .catch((error) => {
        next(error);
      });
  }

  /**
   * Gets the total sales for the day
   * @param {obj} req express request object
   * @param {obj} sequelize query options object
   * @returns {obj} revenue, orders and unique users
   *
   */
  getTotalDaySales(req, res, next) {
    this.config = { scopes: [this.setDiscrimDate(req)] };
    return this.getTotalSales(req, res, next);
  }

  /**
   * Gets the total sales for the order
   * @param {obj} req express request object
   * @param {obj} sequelize query options object
   * @returns {obj} revenue, orders and unique users
   *
   */
  getTotalOrderSales(req, res, next) {
    this.config = { scopes: [{ method: ["forId", req.params.id] }] };
    return this.getTotalSales(req, res, next);
  }

  /**
   * Gets orders that match the query options
   * Meals are not included
   * @param {obj} req  express request object
   * @param {obj} options seequelize query options object
   * @returns {obj}
   */

  getOrdersWithLinks(req, res, next) {
    const extraConfig = this.cloneResetConfig();
    this.config = {
      scopes: ["basic", "allWithCount", this.setAccessMode(req)],
      options: { rejectOnEmpty: true },
    };
    this.mergeOptions(this.config, extraConfig);
    return this.getAllRecords(req, res, next).catch((error) => next(error));
  }

  transformer(response) {
    response.rows = response.rows.map((row) => {
      const newRow = row.toJSON();
      newRow.MealsURL = `/api/v1/orders/${newRow.id}`;
      return newRow;
    });
    return response;
  }
  /**
   * Gets orders that match the query options
   * orders are for the current day or the date in query params
   * Meals are not included
   * @param {obj} req  express request object
   * @param {obj} options sequelize query options object
   * @returns {obj}
   */
  getOrdersWithLinksByDate(req, res, next) {
    this.config = { scopes: [this.setDiscrimDate(req)] };
    return this.getOrdersWithLinks(req, res, next).catch((error) =>
      next(error)
    );
  }

  /**
   * Gets meals that match the order id parameter supplied in the route
   * for caterers, gets only the meals created by caterer
   * for users, gets the meals only if the order belongs to user
   * @param {obj} req express request object
   * @param {obj} options sequelize query options object
   * @returns {obj}
   */

  getSingleOrderWithLinks(req, res, next) {
    const { isCaterer } = req.decoded;
    const extraConfig = this.cloneResetConfig();

    let message;
    if (isCaterer && req.query.caterer) {
      message = "This order does not have your meals";
    } else {
      message = "This order does not belong to you";
    }
    this.config = {
      scopes: [{ method: ["forId", req.params.id] }, "orderDetail"],
      message,
    };
    this.mergeOptions(this.config, extraConfig);

    return this.getOrdersWithLinks(req, res, next).catch((error) =>
      next(error)
    );
  }

  /**
   * Creates a new order
   * @param {obj} req express request object
   * @returns {obj}
   */

  postOrder(req, res, next) {
    const { userId } = req.decoded;
    return this.Model.create({
      userId,
    })
      .then((order) => {
        const param = { order, req, res, next, options: { statusCode: 201 } };
        return this.processOrder(param);
      })
      .catch((error) => next(error));
  }

  /**
   * Updates an order
   * @param {obj} req express request object
   * @returns {obj}
   */

  updateOrder(req, res, next) {
    const { userId } = req.decoded;
    let orderRef;

    return this.Model.findByPk(req.params.id, {
      rejectOnEmpty: true,
      where: { userId },
    })
      .then(async (order) => {
        orderRef = order;
        if (OrderController.isOrderEditable(order.createdAt)) {
          return order.setMeals([]);
        }
        return Promise.reject(new Error("Order edit period has expired"));
      })
      .then(() => orderRef.reload())
      .then((order) => this.processOrder({ order, req, res, next }))
      .catch((error) => next(error));
  }

  /**
   * Handles common logic for order creation and modification
   * @param {obj} req express request object
   * @returns {obj}
   */

  async processOrder({ order, req, res, next, options = {} }) {
    try {
      const promise = req.body.map(({ mealId, quantity }) =>
        order.addMeal(mealId, { through: { quantity } })
      );

      await Promise.all(promise);
      if (!req.query.limit) {
        req.query.limit = 10;
      }
      req.params.id = order.id;
      this.config = {
        message: "Order was not processed. Try again",
        ...options,
      };
      return this.getSingleOrderWithLinks(req, res, next);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * delete an order from the database
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  deleteOrder(req, res, next) {
    const { userId } = req.decoded;
    this.config = {
      options: {
        rejectOnEmpty: true,
        where: { userId },
      },
    };
    return this.deleteRecord(req, res, next).catch((error) => next(error));
  }
}
