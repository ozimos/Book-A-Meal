
import {
  expect,
  request,
  rootURL,
  tovieyeCatererToken,
  defaultMeal,
} from '../../../testHelpers/appHelper';
import app from '../../../src/app';

const ordersUrl = `${rootURL}/orders`;
const getOrdersUrl = `${rootURL}/orders?offset=0&limit=5`;

describe('orders integration test', () => {

  const newOrder = {
    meals: [{
      id: defaultMeal.id,
      quantity: 2
    }]
  };

  // Get All Orders
  describe('GET /orders', () => {

    it(
      'should return error message if no orders',
      () => request(app).get(getOrdersUrl)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('no records available');
        })
    );
  });

  // Get All Orders for current user by date
  describe('GET /orders/date/:date', () => {

    it(
      'should return error message if no orders',
      () => request(app).get(`${ordersUrl}/date`)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('no records available');
        })
    );
  });

  // Create An Order
  describe('POST /orders', () => {

    it('should create an order', () => request(app).post(ordersUrl)
      .set('authorization', `JWT ${tovieyeCatererToken}`).send(newOrder)
      .then((res) => {
        expect(res).to.have.status(201);
      }));
  });

  // Get All Orders
  describe('GET /orders', () => {

    it('should return all orders', () => request(app).get(getOrdersUrl)
      .set('authorization', `JWT ${tovieyeCatererToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.rows[0].id).to.be.a('string');
      }));
  });

  // Get Total Amount for a day's Orders
  describe('GET /orders/total/date', () => {

    it(
      'should return the total amount for the day',
      () => request(app).get(`${ordersUrl}/total/date`)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.revenue).to.be.a('number');
        })
    );
  });

  // Get Total Amount for an Order
  describe('GET /orders/total/date', () => {

    let orderId;
    before('create an order', async () => {
      const response = await request(app).post(ordersUrl)
        .set('authorization', `JWT ${tovieyeCatererToken}`).send(newOrder);

      orderId = response.body.data.rows[0].id;
    });

    it(
      'should return the total amount for the day',
      () => request(app).get(`${ordersUrl}/total/${orderId}`)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.revenue).to.be.a('number');
        })
    );
  });

  // Get All Orders for current user by date
  describe('GET /orders/date/:date', () => {

    it('should return all orders', () => request(app).get(`${ordersUrl}/date`)
      .set('authorization', `JWT ${tovieyeCatererToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.rows[0].id).to.be.a('string');
      }));
  });

  // Get All meals in an order
  describe('GET /orders/:id/meals', () => {
    let orderId;
    before('create an order', async () => {
      const response = await request(app).post(ordersUrl)
        .set('authorization', `JWT ${tovieyeCatererToken}`).send(newOrder);

      orderId = response.body.data.rows[0].id;
    });

    it(
      'should return all orders',
      () => request(app).get(`${ordersUrl}/${orderId}/meals?offset=0&limit=5`)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.rows[0].id).to.be.a('string');
          expect(res.body.data.rows[0].Meals).to.be.an('array');
        })
    );
  });

  // Update An Order
  describe('PUT /orders/:id', () => {

    let orderId;
    before('create an order', async () => {
      const response = await request(app).post(ordersUrl)
        .set('authorization', `JWT ${tovieyeCatererToken}`).send(newOrder);

      orderId = response.body.data.rows[0].id;
    });

    const updatedOrder = {
      meals: [{
        id: defaultMeal.id,
        quantity: 4
      }
      ]
    };

    it(
      'should update an order',
      () => request(app).put(`${rootURL}/orders/${orderId}`)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .send(updatedOrder)
        .then((res) => {
          expect(res).to.have.status(200);
        })
    );
  });

});
