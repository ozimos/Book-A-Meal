import express from "express";
import { createValidator } from "express-joi-validation";

import UserController from "../controllers/UserController";
import Authenticate from "../middleware/Authenticate";
import { userSchemas, paramSchemas } from "../middleware/joi/schemas";
import { passError, joi } from "../middleware/joi/validationSettings";
import db from "../models";

const authRouter = express.Router();
const validator = createValidator({ passError });
const userController = new UserController(db.User);

authRouter.post(
  "/signup",
  validator.body(userSchemas.signup, { joi }),
  userController.signUp
);

authRouter.post(
  "/login",
  validator.body(userSchemas.login, { joi }),
  userController.login
);
authRouter.get(
  "/user/:id",
  Authenticate.isUser,
  validator.params(paramSchemas, { joi }),
  userController.getSingleRecord
);

// Return authRouter
export default authRouter;
