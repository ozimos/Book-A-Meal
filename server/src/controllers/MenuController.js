import { Op } from 'sequelize';
import addDays from 'date-fns/add_days';
import Controller from './Controller';

const today = new Date().setHours(0, 0, 0, 0, 0);
export default class MenuController extends Controller {
  getMenu(req, msg) {
    let scope;
    const date = (req.query && req.query.date) || today;
    const nextDate = addDays(date, 1);

    const options = { subQuery: false, distinct: false };
    if (req.body && req.body.id) {
      options.where = { id: req.body.id };
    } else {
      options.where = {
        menuDate: { [Op.gte]: date, [Op.lt]: nextDate }
      };
    }
    const acceptCallback = rows =>
      (req.body && !req.body.meals[0]) ||
     rows[0].Meals.length > 0;
    const message = msg || 'menu for the day has not been set';
    const { userId, isCaterer } = req.decoded;
    if (isCaterer) {
      scope = [{ method: ['forCaterers', userId] }];
    } else {
      scope = 'forNonCaterers';
    }
    return this
      .getAllRecords(req, scope, options, { message, acceptCallback })
      .catch(error => MenuController.errorResponse(error.message));

  }

  postMenu(req) {
    const { userId } = req.decoded;
    const date = (req.query && req.query.date) || today;
    const nextDate = addDays(date, 1);
    return this.Model.findOrCreate({
      where: {
        menuDate: { [Op.gte]: date, [Op.lt]: nextDate }
      },
      defaults: {
        menuDate: date,
      }
    })
      .then(async ([menu]) => {
        const req2 = { ...req };
        req2.body.id = menu.id;
        try {
          if (req.body.meals[0]) {
            const promise = req.body.meals.map(id =>
              menu.addMeal(id, { through: { userId } }));
            await Promise.all(promise);
          } else {
            await menu.setMeals(req.body.meals, { through: { userId } });
          }
          return req2;
        } catch (err) { throw new Error(err); }
      })
      .then((req2) => {
        process.env.ORDER_START_HOUR = new Date().getHours();
        process.env.ORDER_START_MINS = new Date().getMinutes();
        return this.getMenu(req2, 'Menu was not posted. Try again');
      })
      .catch(err => MenuController.errorResponse(err.message));
  }
  removeFromMenu(req) {
    const { userId } = req.decoded;
    return this.Model.find({
      where: {
        id: req.body.id
      }
    })
      .then(async (menu) => {
        try {
          if (req.body.meals[0]) {
            const promise = req.body.meals.map(id =>
              menu.removeMeal(id));
            await Promise.all(promise);
          } else {
            await menu.setMeals(req.body.meals, { through: { userId } });
          }
        } catch (err) { throw new Error(err); }
      })
      .then(() => {
        process.env.ORDER_START_HOUR = new Date().getHours();
        process.env.ORDER_START_MINS = new Date().getMinutes();
        return this.getMenu(req, 'Menu was not modified. Try again');
      })
      .catch(err => MenuController.errorResponse(err.message));
  }
}
