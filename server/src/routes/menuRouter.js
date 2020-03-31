// Dependencies
import express from "express";
import { createValidator } from "express-joi-validation";

import MenuController from "../controllers/MenuController";
import {menuSchema, querySchema} from "../middleware/joi/schemas";
import validationSettings from "../middleware/joi/validationSettings";
import Authenticate from "../middleware/Authenticate";
import db from "../models";

const menuRouter = express.Router();
const validator = createValidator(validationSettings);
const menuController = new MenuController(db.Menu, db.Meal);

menuRouter
  .route("/")
  .get(
    Authenticate.isUser,
    validator.query(querySchema),
    MenuController.select(menuController, "getMenu")
  )
  .post(
    Authenticate.isUser,
    Authenticate.isAdmin,
    validator.query(querySchema),
    validator.body(menuSchema),
    MenuController.select(menuController, "postMenu")
  );

// Return menuRouter
export default menuRouter;
