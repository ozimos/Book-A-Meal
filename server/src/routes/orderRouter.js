import express from "express";
import { createValidator } from "express-joi-validation";

import OrderController from "../controllers/OrderController";
import {
  orderSchema,
  querySchemas,
  paramSchemas
} from "../middleware/joi/schemas";
import { passError, joi } from "../middleware/joi/validationSettings";
import Authenticate from "../middleware/Authenticate";
import db from "../models";

const orderRouter = express.Router();
const validator = createValidator({ passError });
const orderController = new OrderController(db.Order);

orderRouter
  .route("/")
  .get(
    Authenticate.isUser,
    validator.query(querySchemas, { joi }),
    orderController.getOrdersWithMealLinks
  )
  .post(
    Authenticate.isUser,
    validator.query(querySchemas, { joi }),
    validator.body(orderSchema, { joi }),
    OrderController.orderClose,
    orderController.postOrder
  );

orderRouter
  .route("/date/:date?")
  .get(
    Authenticate.isUser,
    validator.params(paramSchemas, { joi }),
    orderController.getOrdersWithMealLinksByDate
  );

orderRouter
  .route("/total/date")
  .get(
    Authenticate.isUser,
    validator.query(querySchemas, { joi }),
    orderController.getTotalDaySales
  );

orderRouter
  .route("/total/:id")
  .get(
    Authenticate.isUser,
    validator.params(paramSchemas, { joi }),
    orderController.getTotalOrderSales
  );

orderRouter
  .route("/:id")
  .get(
    Authenticate.isUser,
    validator.params(paramSchemas, { joi }),
    OrderController.orderClose,
    orderController.getSingleOrder
  )
  .put(
    Authenticate.isUser,
    validator.params(paramSchemas, { joi }),
    validator.query(querySchemas, { joi }),
    validator.body(orderSchema, { joi }),
    OrderController.orderClose,
    orderController.updateOrder
  )
  .delete(
    Authenticate.isUser,
    validator.params(paramSchemas, { joi }),
    validator.body(orderSchema, { joi }),
    OrderController.orderClose,
    orderController.deleteOrder
  );

orderRouter
  .route("/:id/meals")
  .get(
    Authenticate.isUser,
    validator.params(paramSchemas, { joi }),
    validator.query(querySchemas, { joi }),
    orderController.getMealsInOrder
  );

export default orderRouter;
