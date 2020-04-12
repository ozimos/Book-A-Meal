// Dependencies
import express from "express";

import MealController from "../controllers/MealController";
import {
  paramValidator,
  queryValidator,
  updateMealValidator,
  createMealValidator
} from "../middleware/joi";

import Authenticate from "../middleware/Authenticate";
import db from "../models";

const mealRouter = express.Router();
const mealController = new MealController(db.Meal);

mealRouter
  .route("/")
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin,
    queryValidator,
    mealController.getMeals
  )
  .post(
    Authenticate.isUser,
    Authenticate.isAdmin,
    queryValidator,
    createMealValidator,
    mealController.addMeal
  );

mealRouter
  .route("/:id")
  .get(
    Authenticate.isUser,
    paramValidator,
    queryValidator,
    mealController.getSingleRecord
  )
  .put(
    Authenticate.isUser,
    Authenticate.isAdmin,
    paramValidator,
    queryValidator,
    updateMealValidator,
    mealController.updateRecord
  )
  .delete(
    Authenticate.isUser,
    Authenticate.isAdmin,
    paramValidator,
    mealController.deleteRecord
  );

// Return mealRouter
export default mealRouter;
