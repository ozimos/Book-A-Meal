import {
  expect,
  request,
  rootURL,
  tokenGenerator,
  userFactory,
  mealFactory,
  getRandomInt,
  orderFactory,
  mealOrderFactory,
} from "../../../testHelpers/appHelper";
import app from "../../../src/app";
import db from "../../../src/models";

const limit = 5;
const offset = 0;
const ordersUrl = `${rootURL}/orders`;
const getOrdersUrl = `${rootURL}/orders?offset=${offset}&limit=${limit}`;
const defaultCaterer = userFactory();
const anotherCaterer = userFactory();
const notCaterer = userFactory({ isCaterer: false });
const catererToken = tokenGenerator(defaultCaterer);
const meals = Array.from({ length: 4 }, () => mealFactory(defaultCaterer));
const otherMeals = Array.from({ length: 4 }, () => mealFactory(anotherCaterer));
const order = orderFactory(notCaterer);
const mealOrders = mealOrderFactory(order, meals.concat(otherMeals), 4);
describe.only("orders integration test", () => {
  before("before set up order db", async () => {
    await db.Meal.truncate({ cascade: true });
    await db.User.truncate({ cascade: true });
    await db.User.bulkCreate([defaultCaterer, anotherCaterer, notCaterer]);
    await db.Meal.bulkCreate(meals.concat(otherMeals));
  });
  beforeEach("set up order db", async () => {
    await db.MealOrder.truncate({ cascade: true });
    await db.Order.truncate({ cascade: true });
  });
  describe("GET should return error message if no orders", () => {
    it("/orders", () =>
      request(app)
        .get(getOrdersUrl)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal("no records available");
        }));
    it("/orders?date=all", () =>
      request(app)
        .get(`${getOrdersUrl}?date=all`)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal("no records available");
        }));
  });

  // Create An Order
  describe("POST /orders", () => {
    const newOrder = mealOrders.map(({ mealId, quantity }) => ({
      mealId,
      quantity,
    }));
    it("should create an order", () =>
      request(app)
        .post(ordersUrl)
        .set("authorization", `JWT ${catererToken}`)
        .send(newOrder)
        .then((res) => {
          expect(res).to.have.status(201);
        }));
  });

  // Get All Orders
  describe("GET", () => {
    beforeEach("seed orders in db", async () => {
      await db.Order.bulkCreate([order]);
      await db.MealOrder.bulkCreate(mealOrders);
    });
    it(" /orders should return all orders", () =>
      request(app)
        .get(getOrdersUrl)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.rows[0].id).to.be.a("string");
        }));

    it("/orders/total/date should return the total amount for the day", () =>
      request(app)
        .get(`${ordersUrl}/total/date`)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.revenue).to.be.a("number");
        }));

    it("/orders/total/date should return the total amount for the day", () =>
      request(app)
        .get(`${ordersUrl}/total/${order.id}`)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.revenue).to.be.a("number");
        }));

    it("/orders/date/:date should return all orders", () =>
      request(app)
        .get(`${ordersUrl}/date`)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.rows[0].id).to.be.a("string");
        }));

    it("/orders/:id/meals should return all orders", () =>
      request(app)
        .get(`${ordersUrl}/${order.id}/meals?offset=0&limit=5`)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.rows[0].id).to.be.a("string");
          expect(res.body.data.rows[0].Meals).to.be.an("array");
        }));
  });

  // Update An Order
  describe("PUT /orders/:id", () => {
    let orderId;
    beforeEach("seed orders in db", async () => {
      await db.Order.bulkCreate([order]);
      await db.MealOrder.bulkCreate(mealOrders);
    });
    const updatedOrder = mealOrders.map(({ mealId }) => ({
      mealId,
      quantity: getRandomInt(1, 10),
    }));

    it("should update an order", () =>
      request(app)
        .put(`${rootURL}/orders/${order.id}`)
        .set("authorization", `JWT ${catererToken}`)
        .send(updatedOrder)
        .then((res) => {
          expect(res).to.have.status(200);
        }));
  });

  // Delete An Order
  describe("DELETE /orders/:id", () => {
    beforeEach("seed orders in db", async () => {
      await db.Order.bulkCreate([order]);
      await db.MealOrder.bulkCreate(mealOrders);
    });

    it("should delete an order", () =>
      request(app)
        .delete(`${rootURL}/orders/${order.id}`)
        .set("authorization", `JWT ${catererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
        }));
  });
});
