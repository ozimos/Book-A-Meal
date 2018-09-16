// Dependencies
import express from 'express';
import Validator from 'express-joi-validation';

import MealController from '../controllers/MealController';
import schemas from '../middleware/mealSchemas';
import paramSchema from '../middleware/paramSchema';
import querySchema from '../middleware/querySchema';

import Authenticate from '../middleware/Authenticate';
import db from '../models';

const mealRouter = express.Router();
const validator = Validator({ passError: true });
const mealController = new MealController(db.Meal);

mealRouter.use(Authenticate.isUser, Authenticate.isAdmin);

mealRouter.route('/')
  .get(
    validator.query(querySchema),
    MealController.select(mealController, 'getMeals')
  )
  .post(
    validator.query(querySchema),
    validator.body(schemas.createMeal),
    MealController.select(mealController, 'addMeal')
  );

mealRouter.route('/:id')
  .get(
    validator.params(paramSchema),
    validator.query(querySchema),
    MealController.select(mealController, 'getSingleRecord')
  )
  .put(
    validator.params(paramSchema),
    validator.query(querySchema),
    validator.body(schemas.modifyMeal),
    MealController.select(mealController, 'updateRecord')
  )
  .delete(
    validator.params(paramSchema),
    validator.query(querySchema),
    MealController.select(mealController, 'deleteMeal')
  );


// Return mealRouter
export default mealRouter;
