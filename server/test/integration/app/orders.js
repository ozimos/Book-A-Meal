/* eslint-disable no-console */
import {
  expect,
  request,
  rootURL,
  defaultMeal,
  menuMeal,
  extraMeal,
  token,
} from '../../../testHelpers/appHelper';
import app from '../../../src/app';

const ordersUrl = `${rootURL}/orders`;

context('orders integration test', () => {

  const newOrder = {
    meals: [{
      id: defaultMeal.id,
      quantity: 2
    }]
  };

  // Get All Orders
  describe('GET /orders', () => {
    it('should return error message if no orders', () => request(app).get(ordersUrl)
      .set('authorization', `JWT ${token}`)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('no records available');
      }));
  });
  // Create An Order
  describe('POST /orders', () => {

    it('should create an order', () => request(app).post(ordersUrl)
      .set('authorization', `JWT ${token}`).send(newOrder)
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body.data.mealList).to.include(newOrder.meals[0].id);
        expect(res.body.data.quantityList).to.include(newOrder.meals[0].quantity);
      }));
  });
  // Get All Orders
  describe('GET /orders', () => {
    it('should return all orders', () => request(app).get(ordersUrl)
      .set('authorization', `JWT ${token}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data[0].id).to.be.a('string');
        expect(res.body.data[0].Meals).to.be.an('array');
      }));
  });

  // Update An Order
  describe('PUT /orders/:id', () => {

    let orderId;
    before('create an order', async () => {
      const response = await request(app).post(ordersUrl)
        .set('authorization', `JWT ${token}`).send(newOrder);

      orderId = response.body.data.id;
    });

    const updatedOrder = {
      meals: [{
        id: extraMeal.id,
        quantity: 2
      },
      {
        id: menuMeal.id,
        quantity: 4
      }
      ]
    };
    const mealKey = updatedOrder.meals;
    it('should update an order', () => request(app).put(`${rootURL}/orders/${orderId}`)
      .set('authorization', `JWT ${token}`)
      .send(updatedOrder)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.mealList).to.not.include(newOrder.meals[0].id);
        expect(res.body.data.mealList).to.include.members([mealKey[0].id, mealKey[1].id]);
        expect(res.body.data.quantityList).to.include.members([
          mealKey[0].quantity, mealKey[1].quantity]);
      }));
  });
});