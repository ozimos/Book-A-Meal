/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  defaultMeal,
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

describe('Integration Controller Orders Post,', () => {

  it('postOrder posts the order', async () => {

    const response = await orderController.postOrder({
      decoded,
      body,
      query
    });
    expect(response.data.rows[0].id).to.be.a('string');
    expect(response.statusCode).to.equal(201);
  });

});
