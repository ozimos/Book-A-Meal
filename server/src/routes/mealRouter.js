// Dependencies
import express from "express";
import { createValidator } from "express-joi-validation";

import MealController from "../controllers/MealController";
import {paramSchema, querySchema, mealSchemas} from "../middleware/joi/mealSchemas";
import validationSettings from "../middleware/joi/validationSettings";

import Authenticate from "../middleware/Authenticate";
import db from "../models";

const mealRouter = express.Router();
const validator = createValidator(validationSettings);
const mealController = new MealController(db.Meal);

mealRouter
  .route("/")
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.query(querySchema),
    mealController.getMeals
  )
  .post(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.query(querySchema),
    validator.body(mealSchemas.createMeal),
    mealController.addMeal
  );

mealRouter
  .route("/:id")
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.params(paramSchema),
    validator.query(querySchema),
    mealController.getSingleRecord
  )
  .put(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.params(paramSchema),
    validator.query(querySchema),
    validator.body(mealSchemas.modifyMeal),
    mealController.updateRecord
  )
  .delete(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.params(paramSchema),
    validator.query(querySchema),
    mealController.deleteMeal
  );

// Return mealRouter
export default mealRouter;
