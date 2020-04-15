import express from 'express';
import UserController from '../controllers/UserController';
import Authenticate from '../middleware/Authenticate';
import { userSignupValidator, userLoginValidator, paramValidator } from '../middleware/joi';
import db from '../models';

const authRouter = express.Router();
const userController = new UserController(db.User);

authRouter.post('/signup', userSignupValidator, userController.signUp);

authRouter.post('/login', userLoginValidator, userController.login);
authRouter.get('/user/:id', Authenticate.isUser, paramValidator, userController.getSingleRecord);

// Return authRouter
export default authRouter;
