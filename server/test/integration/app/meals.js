/* eslint-disable no-console */
import {
  expect,
  request,
  rootURL,
  defaultMeal,
  deleteMeal,
  token,
  templateTest
} from '../../../testHelpers/appHelper';
import app from '../../../src/app';

const mealsUrl = `${rootURL}/meals`;
const getMealsUrl = `${rootURL}/meals?page=1`;
const mealIdUrl = `${rootURL}/meals/${defaultMeal.id}`;
const mealIdUrl2 = `${rootURL}/meals/${deleteMeal.id}`;

context('meals integration test', () => {

  // Get All Meals
  describe('GET /meals', () => {
    it('should return all meals', () => request(app).get(getMealsUrl)
      .set('authorization', `JWT ${token}`)
      .then((res) => {
        expect(res.body.data.rows[0].id).to.equal(defaultMeal.id);
        expect(res.body.data.rows[0].price).to.equal(defaultMeal.price);
      }));
    templateTest('Get All Meals', 'get', getMealsUrl, null, 'rows', 'object');
  });

  // Get One Meal
  describe('GET /meals/:id', () => {
    it('should return a meal', () =>
      request(app).get(mealIdUrl)
        .set('authorization', `JWT ${token}`)
        .then((res) => {
          expect(res.body.data.title).to.equal(defaultMeal.title);
          expect(res.body.data.price).to.equal(defaultMeal.price);
        }));
    templateTest('Get Meal', 'get', mealIdUrl, null, 'price', 'object');
  });
  // Update A Meal
  describe('PUT /meals/:id', () => {
    const updatedMeal = {
      title: 'Updated meal',
      price: 1500,
    };

    it('should update a meal', () => request(app).put(mealIdUrl)
      .set('authorization', `JWT ${token}`)
      .send(updatedMeal)
      .then((res) => {
        expect(res.body.data.title).to.equal(updatedMeal.title);
        expect(res.body.data.price).to.equal(updatedMeal.price);
      }));
    templateTest(
      'Modify Meal', 'put',
      mealIdUrl, updatedMeal, 'price', 'object'
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
      .set('authorization', `JWT ${token}`).send(newMeal)
      .then((res) => {
        expect(res.body.data.title).to.equal(newMeal.title);
        expect(res.body.data.description).to.equal(newMeal.description);
      }));
    templateTest(
      'Add Meal', 'post',
      mealsUrl, newMeal, 'price', 'object', '201'
    );
  });

  // Delete A Meal
  describe('DELETE /meals', () => {
    it('should delete a meal', () => request(app).delete(mealIdUrl2)
      .set('authorization', `JWT ${token}`)
      .then((res) => {
        expect(res).to.have.status(200);
      }));
  });
});
