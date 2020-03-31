// Dependencies
import express from "express";
import { createValidator } from "express-joi-validation";

import MenuController from "../controllers/MenuController";
import { menuSchemas, querySchemas } from "../middleware/joi/schemas";
import { passError, joi } from "../middleware/joi/validationSettings";
import Authenticate from "../middleware/Authenticate";
import db from "../models";

const menuRouter = express.Router();
const validator = createValidator({ passError });
const menuController = new MenuController(db.Menu, db.Meal);

menuRouter
  .route("/")
  .get(
    Authenticate.isUser,
    validator.query(querySchemas, { joi }),
    menuController.getMenu
  )
  .post(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.query(querySchemas, { joi }),
    validator.body(menuSchemas, { joi }),
    menuController.postMenu
  );

// Return menuRouter
export default menuRouter;
