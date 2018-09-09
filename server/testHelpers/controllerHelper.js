/* eslint import/no-extraneous-dependencies: off */
import chai from 'chai';

import UserController from '../src/controllers/UserController';
import OrderController from '../src/controllers/OrderController';
import MealController from '../src/controllers/MealController';
import MenuController from '../src/controllers/MenuController';
import {
  seedUsers, seedMeals
} from '../src/seedFiles';
import db from '../src/models';

export const { expect } = chai;
export const defaultUser = seedUsers[0];
export const defaultUser2 = seedUsers[1];
export const defaultMeal = seedMeals[0];
export const defaultMeal2 = seedMeals[1];
export const defaultMeal3 = seedMeals[4];
export const defaultMeal4 = seedMeals[5];
export const deleteMeal = seedMeals[3];
export const defaultPassword = 'test';
export const userController = new UserController(db.User);
export const orderController = new OrderController(db.Order);
export const mealController = new MealController(db.Meal);
export const menuController = new MenuController(db.Menu);
