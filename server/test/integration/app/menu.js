/* eslint-disable no-console */
import {
  expect,
  request,
  rootURL,
  menuMeal,
  tovieyeCatererToken,
  templateTest
} from '../../../testHelpers/appHelper';

import app from '../../../src/app';

const menuUrl = `${rootURL}/menu`;
const getMenuUrl = `${rootURL}/menu?offset=0&limit=8`;

context('menu integration test', () => {

  // Post Menu
  describe('POST /menu', () => {
    const newMenu = {
      meals: [menuMeal.id]
    };

    templateTest('Add Menu', 'post', menuUrl, newMenu, 'rows', 'object', '201');
  });

  // Get  Menu
  describe('GET /menu', () => {

    it('should return the menu for today', () =>
      request(app)
        .get(getMenuUrl)
        .set('authorization', `JWT ${tovieyeCatererToken}`)
        .then((res) => {
          expect(res.body.data.rows[0].Meals[0].id).to.equal(menuMeal.id);
        }));

    templateTest('Get Menu', 'get', getMenuUrl, null, 'rows', 'object');
  });

});
