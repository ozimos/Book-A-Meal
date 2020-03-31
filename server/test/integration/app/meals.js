/* eslint-disable no-console */
import faker from "faker/locale/en";

import {
  expect,
  request,
  rootURL,
  tokenGenerator,
  userFactory,
  mealFactory
} from "../../../testHelpers/appHelper";
import app from "../../../src/app";
import db from "../../../../server/src/models";

const defaultCaterer = userFactory();
const defaultMeal = mealFactory(defaultCaterer);
const deletedMeal = mealFactory(defaultCaterer);
const catererToken = tokenGenerator(defaultCaterer);
const mealsUrl = `${rootURL}/meals`;
const getMealsUrl = `${mealsUrl}?offset=0&limit=8`;
const mealIdUrl = `${mealsUrl}/${defaultMeal.id}`;
const meals = [defaultMeal, deletedMeal];
context("meals integration test", () => {
  before("set up meals", async () => {
    await db.User.create(defaultCaterer);
    await db.Meal.bulkCreate(meals);
  });

  // Get All Meals
  describe("GET /meals", () => {
    it("should return all meals", () =>
      request(app)
        .get(getMealsUrl)
        .set("authorization", `JWT ${catererToken}`)
        .then(res => {
          expect(res.body.data.rows).to.containSubset(meals);
        }));
  });

  // Get One Meal
  describe("GET /meals/:id", () => {
    it("should return a meal", () =>
      request(app)
        .get(mealIdUrl)
        .set("authorization", `JWT ${catererToken}`)
        .then(res => {
          expect(res.body.data).to.containSubset(defaultMeal);
        }));
  });

  // Update A Meal
  describe("PUT /meals/:id", () => {
    const updatedMeal = {
      title: "Updated meal",
      price: 1500
    };

    it("should update a meal", () =>
      request(app)
        .put(mealIdUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send(updatedMeal)
        .then(res => {
          expect(res.body.data).to.containSubset({
            ...defaultMeal,
            ...updatedMeal
          });
        }));
  });

  // Delete A Meal
  describe("DELETE /meals/:id", () => {
    it("should delete a meal", () =>
      request(app)
        .delete(`${mealsUrl}/${deletedMeal.id}`)
        .set("authorization", `JWT ${catererToken}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal("record was deleted");
        }));
    it("should return error if deleted meal id does not exist", () =>
      request(app)
        .delete(`${mealsUrl}/${faker.random.uuid()}`)
        .set("authorization", `JWT ${catererToken}`)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal("record was not deleted");
        }));
  });

  // Create A Meal
  describe("POST /meals", () => {
    const meal = mealFactory(defaultCaterer);
    const { id, ...newMeal } = meal;
    it("should create a meal", () =>
      request(app)
        .post(mealsUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send(newMeal)
        .then(res => {
          expect(res.body.data).to.containSubset(newMeal);
        }));
  });
});
