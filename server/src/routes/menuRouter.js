// Dependencies
import express from "express";

import MenuController from "../controllers/MenuController";
import { menuValidator, queryValidator } from "../middleware/joi";
import Authenticate from "../middleware/Authenticate";
import db from "../models";

const menuRouter = express.Router();
const menuController = new MenuController(db.Menu);

menuRouter
  .route("/")
  .get(Authenticate.isUser, queryValidator, menuController.getMenu)
  .post(
    Authenticate.isUser,
    Authenticate.isAdmin,
    queryValidator,
    menuValidator,
    menuController.postMenu
  );

export default menuRouter;
