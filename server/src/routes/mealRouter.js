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

mealRouter.route('/')
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin, validator.query(querySchema),
    MealController.select(mealController, 'getMeals')
  )
  .post(
    Authenticate.isUser,
    Authenticate.isAdmin, validator.query(querySchema),
    validator.body(schemas.createMeal),
    MealController.select(mealController, 'addMeal')
  );

mealRouter.route('/:id')
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin, validator.params(paramSchema),
    validator.query(querySchema),
    MealController.select(mealController, 'getSingleRecord')
  )
  .put(
    Authenticate.isUser,
    Authenticate.isAdmin, validator.params(paramSchema),
    validator.query(querySchema),
    validator.body(schemas.modifyMeal),
    MealController.select(mealController, 'updateRecord')
  )
  .delete(
    Authenticate.isUser,
    Authenticate.isAdmin, validator.params(paramSchema),
    validator.query(querySchema),
    MealController.select(mealController, 'deleteRecord')
  );


// Return mealRouter
export default mealRouter;
