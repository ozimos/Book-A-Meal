// Dependencies
import express from 'express';
import Validator from 'express-joi-validation';

import MenuController from '../controllers/MenuController';
import menuSchema from '../middleware/menuSchemas';
import querySchema from '../middleware/querySchema';
import Authenticate from '../middleware/Authenticate';
import db from '../models';

const menuRouter = express.Router();
const validator = Validator({ passError: true });
const menuController = new MenuController(db.Menu, db.Meal);

menuRouter.use(Authenticate.isUser);

menuRouter.route('/')
  .get(
    validator.query(querySchema),
    MenuController.select(menuController, 'getMenu')
  )
  .post(
    Authenticate.isAdmin,
    validator.query(querySchema),
    validator.body(menuSchema),
    MenuController.select(menuController, 'postMenu')
  );

// Return menuRouter
export default menuRouter;
