import Sequelize, { Op } from "sequelize";
import isToday from "date-fns/isToday";
import formatISO from "date-fns/formatISO";
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
    this.getOrderWithLinks = this.getOrderWithLinks.bind(this);
    this.postOrder = this.postOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.processOrder = this.processOrder.bind(this);
    this.setDateOptions = this.setDateOptions.bind(this);
    this.options = {
      where: {},
      attributes: ["userId", "updatedAt"],
      distinct: true,
      order: [["updatedAt", "DESC"]],
      include: [
        {
          association: "Meals",
          // right: true,
          required: true,
          where: {},
          paranoid: false,
          attributes: [
            [
              Sequelize.literal(
                '"Meals"."price" * "Meals->MealOrders"."quantity"'
              ),
              "subTotal",
            ],
            "price",
            "id",
          ],
          through: {
            attributes: ["quantity"],
          },
        },
        {
          association: "User",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    };
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
    const { userId, isCaterer } = req.decoded;

    if (isCaterer && req.query.caterer) {
      this.options.include[0].where.userId = userId;
    } else {
      this.options.where.userId = userId;
    }

    return this.Model.findAll(this.options)
      .then((response) => {
        const revenue = cashTotal(response);
        const users = uniqueUsers(response);
        const orders = response.length;
        return res.status(this.statusCode).json({
          data: { revenue, orders, users },
        });
      })
      .catch((error) => next(error));
  }

  setDateOptions(req) {
    const date = req.query.date;
    if (date !== "all") {
      const startDate = date ? new Date(date) : new Date();
      const start = formatISO(startDate.setHours(0, 0, 0, 0));
      const endDate = req.query.end ? new Date(req.query.end) : new Date();
      const end = formatISO(endDate.setHours(23, 59, 0, 0));
      this.options.where.updatedAt = { [Op.between]: [start, end] };
    }
  }
  /**
   * Gets the total sales for the day
   * @param {obj} req express request object
   * @param {obj} sequelize query options object
   * @returns {obj} revenue, orders and unique users
   *
   */
  getTotalDaySales(req, res, next) {
    setDateOptions(req);
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
    this.options.where.id = req.params.id;
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
    const { userId, isCaterer } = req.decoded;
    if (isCaterer && req.query.caterer) {
      // this.options.include[0].where.userId = userId;
      this.options.where['$Meals.userId$'] = userId
    } else {
      this.options.where.userId = userId;
    }
    return this.getAllRecords(req, res, next).catch((error) =>
      res.status(400).json({ message: error.message })
    );
  }

  transformer(response) {
    const rows = response.rows.toJSON().map((row) => {
      row.MealsURL = `/api/v1/orders/${row.id}`;
      return row;
    });
    const revenue = cashTotal(response);
    const users = uniqueUsers(response);
    return { ...response, rows, revenue, users };
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
    this.setDateOptions(req);
    return this.getOrdersWithLinks(req, res, next).catch((error) =>
      res.status(400).json({ message: error.message })
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

  getOrderWithLinks(req, res, next) {
    const { isCaterer } = req.decoded;

    const mealIncludeOptions = {
      association: "Meals",
      duplicating: false,
      paranoid: false,
      attributes: [
        "id",
        "userId",
        "title",
        "description",
        "price",
        "updatedAt",
        [
          Sequelize.literal('"Meals"."price" * "Meals->MealOrders"."quantity"'),
          "subTotal",
        ],
      ],
      through: {
        attributes: ["quantity"],
      },
    };

    if (isCaterer && req.query.caterer) {
      this.message = "This order does not have your meals";
    } else {
      this.message = "This order does not belong to you";
    }
    this.options.where.id = req.params.id;
    this.options.include[0] = mealIncludeOptions;
    return this.getOrdersWithLinks(req, res, next).catch((error) =>
      res.status(400).json({ message: error.message })
    );
  }

  /**
   * Creates a new order
   * @param {obj} req express request object
   * @returns {obj}
   */

  postOrder(req, res, next) {
    const { userId } = req.decoded;
    this.statusCode = 201;
    return this.Model.create({
      userId,
    })
      .then((order) => this.processOrder(order, req))
      .catch((error) => res.status(400).json({ message: error.message }));
  }

  /**
   * Updates an order
   * @param {obj} req express request object
   * @returns {obj}
   */

  updateOrder(req, res, next) {
    let orderRef;

    return this.Model.findByPk(req.params.id)
      .then(async (order) => {
        orderRef = order;
        if (OrderController.isOrderEditable(order.createdAt)) {
          return order.setMeals([]);
        }
        return Promise.reject(new Error("Order edit period has expired"));
      })
      .then(() => orderRef.reload())
      .then((reloadedOrder) => this.processOrder(reloadedOrder, req, res, next))
      .catch((error) => res.status(400).json({ message: error.message }));
  }

  /**
   * Handles common logic for order creation and modification
   * @param {obj} req express request object
   * @returns {obj}
   */

  async processOrder(order, req, res, next) {
    try {
      const promise = req.body.map(({ mealId, quantity }) =>
        order.addMeal(mealId, { through: { quantity } })
      );

      await Promise.all(promise);
      req.query = { limit: 10 };
      this.message = "Order was not processed. Try again";
      return this.getOrderWithLinks(req, res, next);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * delete an order from the database
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  deleteOrder(req, res, next) {
    return this.Model.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          return this.getOrdersWithLinks(req);
        }
        return res.status(400).json({ message: "order was not deleted" });
      })
      .catch((error) => res.status(400).json({ message: error.message }));
  }
}
