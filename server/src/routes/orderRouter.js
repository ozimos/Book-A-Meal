import express from "express";
import { createValidator } from "express-joi-validation";

import OrderController from "../controllers/OrderController";
import orderSchema from "../middleware/joi/schemas/orderSchemas";
import paramSchema from "../middleware/joi/schemas/paramSchemas";
import querySchema from "../middleware/joi/schemas/querySchemas";
import Authenticate from "../middleware/Authenticate";
import db from "../models";

const orderRouter = express.Router();
const validator = createValidator({ passError: true });
const orderController = new OrderController(db.Order);

orderRouter
  .route("/")
  .get(
    Authenticate.isUser,
    validator.query(querySchema),
    OrderController.select(orderController, "getOrdersWithMealLinks")
  )
  .post(
    Authenticate.isUser,
    validator.query(querySchema),
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, "postOrder")
  );

orderRouter
  .route("/date/:date?")
  .get(
    Authenticate.isUser,
    validator.params(paramSchema),
    OrderController.select(orderController, "getOrdersWithMealLinksByDate")
  );

orderRouter
  .route("/total/date")
  .get(
    Authenticate.isUser,
    validator.query(querySchema),
    OrderController.select(orderController, "getTotalDaySales")
  );

orderRouter
  .route("/total/:id")
  .get(
    Authenticate.isUser,
    validator.params(paramSchema),
    OrderController.select(orderController, "getTotalOrderSales")
  );

orderRouter
  .route("/:id")
  .get(
    Authenticate.isUser,
    validator.params(paramSchema),
    OrderController.orderClose,
    OrderController.select(orderController, "getSingleOrder")
  )
  .put(
    Authenticate.isUser,
    validator.params(paramSchema),
    validator.query(querySchema),
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, "updateOrder")
  )
  .delete(
    Authenticate.isUser,
    validator.params(paramSchema),
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, "deleteOrder")
  );

orderRouter
  .route("/:id/meals")
  .get(
    Authenticate.isUser,
    validator.params(paramSchema),
    validator.query(querySchema),
    OrderController.select(orderController, "getMealsInOrder")
  );

export default orderRouter;
