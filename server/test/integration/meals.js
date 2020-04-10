/* eslint-disable no-console */
import faker from "faker/locale/en";

import {
  expect,
  request,
  rootURL,
  tokenGenerator,
  userFactory,
  mealFactory
} from "../appHelper";
import app from "../../src/app";
import db from "../../src/models";

const defaultCaterer = userFactory();
const defaultMeal = mealFactory(defaultCaterer);
const deletedMeal = mealFactory(defaultCaterer);
const catererToken = tokenGenerator(defaultCaterer);
const mealsUrl = `${rootURL}/meals`;
const getMealsUrl = `${mealsUrl}?offset=0&limit=8`;
const mealIdUrl = `${mealsUrl}/${defaultMeal.id}`;
context("meals integration test GET", () => {
  const meals = [defaultMeal, deletedMeal];
  before("set up meals", async () => {
    await db.Meal.truncate({ cascade: true });
    await db.User.truncate({ cascade: true });
    await db.User.bulkCreate([defaultCaterer]);
    await db.Meal.bulkCreate(meals);
  });

  it("GET /meals should return all meals", () =>
    request(app)
      .get(getMealsUrl)
      .set("authorization", `JWT ${catererToken}`)
      .then(res => {
        expect(res.body.data.rows).to.containSubset(meals);
      }));

  it("GET /meals/:id should return a meal", () =>
    request(app)
      .get(mealIdUrl)
      .set("authorization", `JWT ${catererToken}`)
      .then(res => {
        expect(res.body.data).to.containSubset(defaultMeal);
      }));
});

context("meals integration test except GET", () => {
  const anotherCaterer = userFactory();
  const secondMeal = mealFactory(defaultCaterer);
  const strangeMeal = mealFactory(anotherCaterer);
  const meals = [defaultMeal, deletedMeal, secondMeal, strangeMeal];

  before("set up meals", async () => {
    await db.Meal.truncate({ cascade: true });
    await db.User.truncate({ cascade: true });
    await db.User.bulkCreate([defaultCaterer, anotherCaterer]);
    await db.Meal.bulkCreate(meals);
  });
  // Create A Meal
  describe("POST /meals", () => {
    const meal = mealFactory(defaultCaterer);
    const { id, ...newMeal } = meal;
    it("should create a meal", () =>
      request(app)
        .post(mealsUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send({ extraField: "handled without error", ...newMeal })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body.data).to.containSubset(newMeal);
        }));
    it("should not create a meal when required fields are not supplied", () =>
      request(app)
        .post(mealsUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send({})
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.deep.equal({
            description: '"description" is required',
            imageUrl: '"imageUrl" is required',
            price: '"price" is required',
            title: '"title" is required'
          });
        }));
    it("a caterer's meal titles should be unique for only their meals", () =>
      request(app)
        .post(mealsUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send({ ...newMeal, title: defaultMeal.title })
        .then(res => {
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal(
            'duplicate key value violates unique constraint "userTitle2"'
          );
        }));
    it("a caterer's meal title can be the same as another caterer", () => {
      const copyMeal = { ...newMeal, title: strangeMeal.title };
      request(app)
        .post(mealsUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send(copyMeal)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body.data).to.containSubset(copyMeal);
        });
    });
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
        .send({ extraField: "handled without error", ...updatedMeal })
        .then(res => {
          expect(res.body.data).to.containSubset({
            ...defaultMeal,
            ...updatedMeal
          });
        }));

    it("should not update a meal when all fields are not supplied", () =>
      request(app)
        .put(mealIdUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send({})
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.deep.equal({
            error: '"value" must have at least 1 key'
          });
        }));
    it("a caterer's meal titles should be unique for only their meals", () =>
      request(app)
        .put(mealIdUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send({ ...updatedMeal, title: secondMeal.title })
        .then(res => {
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal(
            'duplicate key value violates unique constraint "userTitle2"'
          );
        }));
    it("a caterer's meal title can be the same as another caterer", () => {
      const copyMeal = { ...updatedMeal, title: strangeMeal.title };
      request(app)
        .put(mealIdUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send(copyMeal)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.containSubset(copyMeal);
        });
    });
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
});
