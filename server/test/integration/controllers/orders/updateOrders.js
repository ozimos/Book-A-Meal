/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  defaultMeal,
  defaultMeal2,
  defaultUser,
  orderController
} from '../../../../testHelpers/controllerHelper';

const decoded = {
  userId: defaultUser.id,
  isCaterer: defaultUser.isCaterer
};
const body = {
  meals: [{
    id: defaultMeal.id,
    quantity: 1
  }]
};
const query = { offset: 0, limit: 8 };

let orderId;
describe('Modify Order:', () => {

  before('add order to db', async () => {
    const response = await orderController.postOrder({
      decoded,
      body,
      query
    });
    orderId = response.data.rows[0].id;
  });

  describe('Modify Order:', () => {

    it('updateOrder returns all orders in db', async () => {
      const body2 = {
        meals: [{
          id: defaultMeal.id,
          quantity: 1
        },
        {
          id: defaultMeal2.id,
          quantity: 3
        }
        ]
      };

      const params = {
        id: orderId
      };
      const req = {
        params,
        decoded,
        body: body2,
        query
      };
      const response = await orderController.updateOrder(req);

      expect(response.data.rows[0].id).to.be.a('string');
      expect(response.statusCode).to.equal(200);
    });
  });
});
