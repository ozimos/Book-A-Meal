import {
  expect,
  defaultUser,
  defaultMeal,
  defaultMeal2,
  orderController
} from '../../../../testHelpers/controllerHelper';

import db from '../../../../src/models';

describe('Integration Controller Get Orders', () => {

  beforeEach('truncate orders db', async () => {
    await db.Order.truncate({
      cascade: true
    });
  });
  const query = { offset: 0, limit: 8 };
  const decoded = { userId: defaultUser.id, isCaterer: defaultUser.isCaterer };

  it(
    'getOrdersWithMealLinks returns error message if no orders in db',
    async () => {
      const response = await orderController
        .getOrdersWithMealLinks({ query, decoded });
      expect(response.message).to.equal('no records available');
      expect(response.statusCode).to.equal(404);
    }
  );

  it('getOrdersWithMealLinks returns all orders in db', async () => {

    const body = {
      meals: [{
        id: defaultMeal.id,
        quantity: 1
      },
      {
        id: defaultMeal2.id,
        quantity: 2
      }
      ]
    };

    await orderController.postOrder({
      decoded,
      body
    });

    const response = await orderController
      .getOrdersWithMealLinks({ query, decoded });
    expect(response.data.rows[0].id).to.be.a('string');
    expect(response.statusCode).to.equal(200);
  });

});
