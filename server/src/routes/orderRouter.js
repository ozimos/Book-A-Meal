import express from 'express';
import Validator from 'express-joi-validation';

import OrderController from '../controllers/OrderController';
import orderSchema from '../middleware/orderSchemas';
import paramSchema from '../middleware/paramSchema';
import querySchema from '../middleware/querySchema';
import Authenticate from '../middleware/Authenticate';
import db from '../models';

const orderRouter = express.Router();
const validator = Validator({ passError: true });
const orderController = new OrderController(db.Order);

orderRouter.use(Authenticate.isUser);

orderRouter
  .route('/')
  .get(
    validator.query(querySchema),
    OrderController.select(orderController, 'getOrdersWithMealLinks')
  )
  .post(
    validator.query(querySchema),
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, 'postOrder')
  );

orderRouter
  .route('/date/:date?')
  .get(
    validator.params(paramSchema),
    OrderController.select(orderController, 'getOrdersWithMealLinksByDate')
  );

orderRouter
  .route('/total/date')
  .get(
    validator.query(querySchema),
    OrderController.select(orderController, 'getTotalDaySales')
  );

orderRouter
  .route('/total/:id')
  .get(
    validator.params(paramSchema),
    OrderController.select(orderController, 'getTotalOrderSales')
  );

orderRouter
  .route('/:id')
  .get(
    validator.params(paramSchema),
    OrderController.orderClose,
    OrderController.select(orderController, 'getSingleOrder')
  )
  .put(
    validator.params(paramSchema),
    validator.query(querySchema),
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, 'updateOrder')
  )
  .delete(
    validator.params(paramSchema),
    validator.body(orderSchema),
    OrderController.orderClose,
    OrderController.select(orderController, 'deleteOrder')
  );

orderRouter
  .route('/:id/meals')
  .get(
    validator.params(paramSchema),
    validator.query(querySchema),
    OrderController.select(orderController, 'getMealsInOrder')
  );

export default orderRouter;
