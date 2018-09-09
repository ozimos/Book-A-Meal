/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  defaultMeal2,
  mealController
} from '../../../../testHelpers/controllerHelper';

const params = {
  id: defaultMeal2.id
};

const sampleBody = {
  title: 'Beef Barbecue',
  description: 'roasted ground beef',
  price: 2000,
};

describe('Integration Controller Meal ModifyMeal', () => {

  it('does modify a meal', async () => {

    const req = {
      params,
      body: sampleBody
    };

    const response = await mealController.updateRecord(req);

    expect(response.data.title).to.equal(sampleBody.title);
    expect(response.data.description).to.equal(sampleBody.description);
    expect(response.data.price).to.equal(sampleBody.price);
  });
});
