import express from "express";
import { createValidator } from "express-joi-validation";

import UserController from "../controllers/UserController";
import Authenticate from "../middleware/Authenticate";
import userSchemas from "../middleware/joi/schemas/userSchemas";
import paramSchema from "../middleware/joi/schemas/paramSchemas";

import db from "../models";

const authRouter = express.Router();
const validator = createValidator({ passError: true });
const userController = new UserController(db.User);

authRouter.post(
  "/signup",
  validator.body(userSchemas.signup),
  userController.signUp
);

authRouter.post(
  "/login",
  validator.body(userSchemas.login),
  userController.login
);
authRouter.get(
  "/user/:id",
  Authenticate.isUser,
  validator.params(paramSchema),
  userController.getSingleRecord
);

// Return authRouter
export default authRouter;
