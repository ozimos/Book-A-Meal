import express from "express";
import OrderController from "../controllers/OrderController";
import {
  paramValidator,
  queryValidator,
  orderValidator
} from "../middleware/joi";
import Authenticate from "../middleware/Authenticate";
import db from "../models";

const orderRouter = express.Router();
const orderController = new OrderController(db.Order);

orderRouter
  .route("/")
  .get(
    Authenticate.isUser,
    queryValidator,
    orderController.getOrdersWithMealLinks
  )
  .post(
    Authenticate.isUser,
    queryValidator,
    orderValidator,
    OrderController.orderClose,
    orderController.postOrder
  );

orderRouter
  .route("/date/:date?")
  .get(
    Authenticate.isUser,
    paramValidator,
    orderController.getOrdersWithMealLinksByDate
  );

orderRouter
  .route("/total/date")
  .get(Authenticate.isUser, queryValidator, orderController.getTotalDaySales);

orderRouter
  .route("/total/:id")
  .get(Authenticate.isUser, paramValidator, orderController.getTotalOrderSales);

orderRouter
  .route("/:id")
  .get(
    Authenticate.isUser,
    paramValidator,
    OrderController.orderClose,
    orderController.getSingleOrder
  )
  .put(
    Authenticate.isUser,
    paramValidator,
    queryValidator,
    orderValidator,
    OrderController.orderClose,
    orderController.updateOrder
  )
  .delete(
    Authenticate.isUser,
    paramValidator,
    orderValidator,
    OrderController.orderClose,
    orderController.deleteOrder
  );

orderRouter
  .route("/:id/meals")
  .get(
    Authenticate.isUser,
    paramValidator,
    queryValidator,
    orderController.getMealsInOrder
  );

export default orderRouter;
