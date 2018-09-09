import {
  expect,
  defaultMeal3,
  defaultMeal4,
  defaultUser,
  menuController
} from '../../../../testHelpers/controllerHelper';

describe('Integration Controller Post Menu', () => {


  const body = {
    meals: [defaultMeal3.id, defaultMeal4.id]
  };

  it('postMenu returns error message if meal is not in db', async () => {
    const phantomMealId = '91bf8437-b2f3-4e2b-a8ac-d86fd643dfb7';

    const req = {
      body: {
        meals: [phantomMealId]
      },
      decoded: { userId: defaultUser.id }
    };
    const response = await menuController.postMenu(req);

    expect(response.message).to.be.a('string');
    expect(response.statusCode).to.equal(400);
  });
  it('postMenu sets the environment variables', async () => {

    const hour = new Date().getHours();
    const mins = new Date().getMinutes();
    await menuController.postMenu({
      body,
      decoded: { userId: defaultUser.id }
    });

    expect(process.env.ORDER_START_HOUR).to.equal(hour.toString());
    expect(parseInt(process.env.ORDER_START_MINS, 10)).to.be.closeTo(mins, 1);
  });
});
