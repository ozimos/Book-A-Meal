/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  deleteMeal,
  mealController
} from '../../../../testHelpers/controllerHelper';

const phantomMealId = '91bf8437-b2f3-4e2b-a8ac-d86fd643dfb7';

describe('Integration Controller Meal All, Single, Delete', () => {
  describe('AllMeals:', () => {

    it('returns all meals in db', async () => {
      const query = { page: 1 };
      const response = await mealController.getAllRecords({ query });
      expect(response.data.rows[0].title).to.be.a('string');
      expect(response.data.rows[0].description).to.be.a('string');
      expect(response.data.rows[0].price).to.be.a('number');
    });
  });
  describe('SingleMeal:', () => {

    it('returns single meal in db', async () => {
      const req = {
        params: {
          id: deleteMeal.id
        }
      };
      const response = await mealController.getSingleRecord(req);
      expect(response.data.title).to.equal(deleteMeal.title);
      expect(response.data.description).to.equal(deleteMeal.description);
      expect(response.data.price).to.equal(deleteMeal.price);
    });
    it('returns error message if meal is not in db', async () => {
      const req = {
        params: {
          id: phantomMealId
        }
      };
      const response = await mealController.getSingleRecord(req);
      expect(response.message).to.equal('no records available');
      expect(response.statusCode).to.equal(404);
    });
  });
  describe('DeleteMeal:', () => {

    it('removes meal from db', async () => {
      const req = {
        params: {
          id: deleteMeal.id
        }
      };
      const response = await mealController.deleteRecord(req);
      expect(response.data).to.equal(1);
      expect(response.statusCode).to.equal(200);
    });
    it('returns error message if meal not in db', async () => {
      const req = {
        params: {
          id: phantomMealId
        }
      };
      const response = await mealController.deleteRecord(req);
      expect(response.message).to.equal('no records available');
      expect(response.statusCode).to.equal(404);
    });
  });
});
