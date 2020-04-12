import express from "express";
import OrderController from "../controllers/OrderController";
import {
  paramValidator,
  queryValidator,
  orderValidator,
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
    orderController.getOrdersWithLinksByDate
  )
  .post(
    Authenticate.isUser,
    queryValidator,
    orderValidator,
    OrderController.orderClose,
    orderController.postOrder
  );

orderRouter
  .route("/total")
  .get(Authenticate.isUser, queryValidator, orderController.getTotalDaySales);

orderRouter
  .route("/:id")
  .get(
    Authenticate.isUser,
    paramValidator,
    orderController.getSingleOrderWithLinks
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
    OrderController.orderClose,
    orderController.deleteRecord
  );

orderRouter
  .route("/:id/total")
  .get(Authenticate.isUser, paramValidator, orderController.getTotalOrderSales);

export default orderRouter;
