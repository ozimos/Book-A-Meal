// Dependencies
import express from "express";
import { createValidator } from "express-joi-validation";

import MealController from "../controllers/MealController";
import {
  paramSchemas,
  querySchemas,
  mealSchemas
} from "../middleware/joi/schemas";
import { passError, joi } from "../middleware/joi/validationSettings";

import Authenticate from "../middleware/Authenticate";
import db from "../models";

const mealRouter = express.Router();
const validator = createValidator({ passError });
const mealController = new MealController(db.Meal);

mealRouter
  .route("/")
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.query(querySchemas, { joi }),
    mealController.getMeals
  )
  .post(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.query(querySchemas, { joi }),
    validator.body(mealSchemas, {
      joi: {
        presence: "required",
        ...joi
      }
    }),
    mealController.addMeal
  );

mealRouter
  .route("/:id")
  .get(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.params(paramSchemas, { joi }),
    validator.query(querySchemas, { joi }),
    mealController.getSingleRecord
  )
  .put(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.params(paramSchemas, { joi }),
    validator.query(querySchemas, { joi }),
    validator.body(mealSchemas, { joi }),
    mealController.updateRecord
  )
  .delete(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.params(paramSchemas, { joi }),
    validator.query(querySchemas, { joi }),
    mealController.deleteRecord
  );

// Return mealRouter
export default mealRouter;
