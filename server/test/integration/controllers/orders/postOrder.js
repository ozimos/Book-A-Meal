/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  defaultMeal,
  defaultUser,
  orderController
} from '../../../../testHelpers/controllerHelper';

const decoded = {
  userId: defaultUser.id
};
const body = {
  meals: [{
    id: defaultMeal.id,
    quantity: 1
  }]
};
describe('Integration Controller Orders Post,', () => {

  it('postOrder posts the order', async () => {

    const response = await orderController.postOrder({
      decoded,
      body
    });
    expect(response.data.Meals[0].id).to.equal(body.meals[0].id);
    expect(response.data.Meals[0].MealOrders.quantity).to.equal(body.meals[0].quantity);
    // eslint-disable-next-line
    expect(response.data.id).to.exist;
    expect(response.statusCode).to.equal(201);
  });
});