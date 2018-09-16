/* eslint-disable no-console */
import {
  expect,
  request,
  rootURL,
  defaultMeal,
  tovieyeCatererToken,
} from '../../../testHelpers/appHelper';
import { catererTovieye, seedMeals } from '../../../src/seedFiles';
import app from '../../../src/app';
import db from '../../../../server/src/models';

const catererTovieyeMeals = seedMeals.slice(0, 2);
const deletedMeal = {
  id: 'e71e6f38-a794-4bfb-b9a2-f28f8ff0aab5',
  userId: catererTovieye.id,
  title: 'Starch and Something',
  description: 'affordable',
  imageUrl: 'https://res.cloudinary.com/tovieyeozim/image/' +
  'upload/c_fill,w_200,h_200/v1532723402/ifzj4ynikksdo6tdtvko.jpg',
  price: 1800,
  deletedAt: new Date(2100, 0)
};
const mealsUrl = `${rootURL}/meals`;
const getMealsUrl = `${rootURL}/meals?offset=0&limit=8`;
const mealIdUrl = `${rootURL}/meals/${defaultMeal.id}`;

context('meals integration test', () => {
  before('set up meals', async () => {
    await db.Meal.create(deletedMeal);
  });

  // Get All Meals
  describe('GET /meals', () => {
    it(
      'should return all meals for caterer',
      () => request(app).get(getMealsUrl)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          const mealIdList = res.body.data.rows.map(meal => meal.id);
          const catererMealsIdList = catererTovieyeMeals.map(meal => meal.id);
          expect(res).to.have.status(200);
          expect(res.body.data.rows[0].id).to.equal(deletedMeal.id);
          expect(res.body.data.rows[0].price).to.equal(deletedMeal.price);
          expect(mealIdList).to.include.members(catererMealsIdList);
        })
    );
  });

  // Get One Meal
  describe('GET /meals/:id', () => {

    it('should return a meal', () =>
      request(app).get(mealIdUrl)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.title).to.equal(defaultMeal.title);
          expect(res.body.data.price).to.equal(defaultMeal.price);
        }));

  });

  // Update A Meal
  describe('PUT /meals/:id', () => {
    const updatedMeal = {
      title: 'Updated meal',
      price: 1500,
    };

    it('should update a meal', () => request(app).put(mealIdUrl)
      .set('authorization', `JWT ${tovieyeCatererToken}`)
      .send(updatedMeal)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.title).to.equal(updatedMeal.title);
        expect(res.body.data.price).to.equal(updatedMeal.price);
      }));

  });

  // Delete A Meal
  describe('DELETE /meals/:id', () => {

    it(
      'should delete a meal',
      () => request(app).delete(`${mealsUrl}/${deletedMeal.id}`)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.rows[0].id).to.not.equal(deletedMeal.id);
          expect(res.body.data.rows[0].price).to.not.equal(deletedMeal.price);
        })
    );
    it(
      'should return error if deleted meal id does not exist',
      () => request(app).delete(`${mealsUrl}/${deletedMeal.id}`)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('meal was not deleted');
        })
    );
  });

  // Create A Meal
  describe('POST /meals', () => {
    const newMeal = {
      title: 'Beef with Rice',
      description: 'plain rice with ground beef',
      // eslint-disable-next-line max-len
      imageUrl: 'https://cdn.pixabay.com/photo/2017/11/23/13/50/pumpkin-soup-2972858_960_720.jpg',
      price: 1500,
    };
    it('should create a meal', () => request(app).post(mealsUrl)
      .set('authorization', `JWT ${tovieyeCatererToken}`).send(newMeal)
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body.data.title).to.equal(newMeal.title);
        expect(res.body.data.description).to.equal(newMeal.description);
      }));
  });

});
