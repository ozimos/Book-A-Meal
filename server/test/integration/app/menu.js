/* eslint-disable no-console */
import {
  expect,
  tokenGenerator,
  request,
  rootURL,
  userFactory,
  mealFactory,
  menuFactory,
  mealMenuFactory
} from "../../../testHelpers/appHelper";

import app from "../../../src/app";
import db from "../../../../server/src/models";

const defaultCaterer = userFactory();
const catererToken = tokenGenerator(defaultCaterer);
const meals = Array.from({ length: 4 }, () => mealFactory(defaultCaterer));
const mealsId = meals.map(meal => meal.id);

const menu = menuFactory(defaultCaterer);
const mealMenus = mealMenuFactory(menu, meals);

context.only("menu integration test", () => {
  before("set up menu db", async () => {
    await db.MealMenus.truncate({cascade: true});
    await db.Menu.truncate({cascade: true});
    await db.Meal.truncate({cascade: true});
    await db.User.truncate({cascade: true});
    await db.User.create(defaultCaterer);
    await db.Meal.bulkCreate(meals);
  });

  beforeEach("remove previous menu", async () => {
    await db.MealMenus.truncate({cascade: true});
    await db.Menu.truncate({cascade: true});
  });

  // Post Menu
  describe("POST /menu", () => {
    const newMenu = {
      meals: mealsId
    };

    it.only("should create a menu for today", () =>
      request(app)
        .post(`${rootURL}/menu`)
        .set("authorization", `Bearer ${catererToken}`)
        .send(newMenu)
        .then(res => {

          expect(res.body.data.rows[0].Meals[0].id).to.equal(menuMeal.id);
        }));
  });

  // Get  Menu
  describe("GET /menu", () => {
    beforeEach("set up menu meals", async () => {
      await db.Menu.create(menu);
      await db.MealMenus.bulkCreate(mealMenus);
    });
    it("should return the menu for today", () =>
      request(app)
        .get(`${rootURL}/menu?offset=0&limit=8`)
        .set("authorization", `Bearer ${catererToken}`)
        .then(res => {
          expect(res.body.data.rows[0].Meals).to.containSubset(meals);
        }));
  });
});
