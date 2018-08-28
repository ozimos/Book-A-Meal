import express from 'express';
import Validator from 'express-joi-validation';

import UserController from '../controllers/UserController';
import Authenticate from '../middleware/Authenticate';
import schemas from '../middleware/userSchemas';
import db from '../models';

const authRouter = express.Router();
const validator = Validator({ passError: true });
const userController = new UserController(db.User);

authRouter.post(
  '/signup', validator.body(schemas.signup),
  UserController.select(userController, 'signUp')
);

authRouter.post(
  '/login',
  validator.body(schemas.login),
  UserController.select(userController, 'login')
);
authRouter.get(
  '/all',
  Authenticate.isUser, Authenticate.isAdmin,
  UserController.select(userController, 'getAllRecords')
);

// Return authRouter
export default authRouter;
