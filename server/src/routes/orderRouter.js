// Dependencies
import express from 'express';
import Validator from 'express-joi-validation';

import OrderController from '../controllers/OrderController';
import orderSchema from '../middleware/orderSchemas';
import Authenticate from '../middleware/Authenticate';
import db from '../models';

const orderRouter = express.Router();
const validator = Validator({ passError: true });
const orderController = new OrderController(db.Order, db.Meal);

// Params validation


orderRouter
  .route('/')
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin,
    OrderController.select(orderController, 'getAllOrders')
  )
  .post(
    Authenticate.isUser,
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, 'postOrder')
  );

orderRouter
  .route('/:id')
  .put(
    Authenticate.isUser,
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, 'updateOrder')
  );
orderRouter
  .route('/meals/:id')
  .get(
    Authenticate.isUser,
    OrderController.select(orderController, 'getOrderMeals')
  );
orderRouter
  .route('/user/:date?')
  .get(
    Authenticate.isUser,
    OrderController.select(orderController, 'getUserOrdersByDate')
  );

orderRouter
  .route('/all/:date?')
  .get(
    Authenticate.isUser,
    OrderController.select(orderController, 'getOrdersByDate')
  );

// Return orderRouter
export default orderRouter;
