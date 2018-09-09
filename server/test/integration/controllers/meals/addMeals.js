/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  defaultMeal,
  defaultUser,
  defaultUser2,
  mealController
} from '../../../../testHelpers/controllerHelper';

const decoded = {
  userId: defaultUser.id
};
const body = {
  title: 'Beef Barbecue',
  description: 'roasted ground beef',
  imageUrl: `https://cdn.pixabay.com/photo/2017/
  11/23/13/50/pumpkin-soup-2972858_960_720.jpg`,
  price: 2000,
};

describe('Integration Controller Meal AddMeal', () => {

  it('does not add meal without userId', async () => {

    const expected = {
      message: 'userId not supplied',
      statusCode: 400
    };
    const response = await mealController.addMeal({ body });

    expect(response).to.eql(expected);
  });

  it('does add duplicate meal title by different user', async () => {

    const decoded2 = { ...decoded
    };
    const newBody = { ...body
    };
    newBody.title = defaultMeal.title;
    decoded2.userId = defaultUser2.id;
    const req = {
      decoded: decoded2,
      body: newBody
    };
    const response = await mealController.addMeal(req);

    expect(response.data.title).to.equal(newBody.title);
    expect(response.data.description).to.equal(newBody.description);
    expect(response.data.price).to.equal(newBody.price);

  });

  it('does create new meal', async () => {
    const response = await mealController.addMeal({ decoded, body });

    expect(response.data.title).to.equal(body.title);
    expect(response.data.description).to.equal(body.description);
    expect(response.data.price).to.equal(body.price);
  });
});
