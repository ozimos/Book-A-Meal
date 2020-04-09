/* eslint import/no-extraneous-dependencies: off */
import chai from "chai";
import chaiHttp from "chai-http";
import chaiSubset from "chai-subset";

import {
  seedPassword,
  seedOrders,
  seedMealOrders,
} from "../src/seedFiles";
export {
  userFactory,
  mealFactory,
  menuFactory,
  orderFactory,
  getRandomInt,
  mealMenuFactory,
  mealOrderFactory,
} from "../src/factories";
export {default as tokenGenerator} from "../src/controllers/util/tokenGenerator";

chai.use(chaiHttp);
chai.use(chaiSubset);
export const { expect, request } = chai;

export const defaultPassword = seedPassword;
export const defaultOrders = seedOrders;
export const defaultMealOrders = seedMealOrders;

export function getUserInfo(user, extraProp) {
  const { firstName, lastName, isCaterer, email } = user;
  const value = {
    firstName,
    lastName,
    isCaterer,
    email,
  };
  if (extraProp && user[extraProp]) {
    value[extraProp] = user[extraProp];
  }
  return value;
}

export const rootURL = "/api/v1";
