import { Op } from 'sequelize';
import addDays from 'date-fns/add_days';
import Controller from './Controller';

const today = new Date().setHours(0, 0, 0, 0, 0);
const nextDate = addDays(today, 1);
export default class MenuController extends Controller {
  getMenu(req, msg) {

    const options = {};
    if (req.body.id) {
      options.where = { id: req.body.id };
    } else {
      options.where = {
        menuDate: { [Op.gte]: today, [Op.lt]: nextDate }
      };
    }
    const message = msg || 'menu for the day has not been set';
    if (req.decoded.isCaterer) {
      const { userId } = req.decoded;
      const scope = [{ method: ['forCaterers2', userId] }];

      return super
        .getAllRecords(req, scope, options, { message });
    }
    return super
      .getAllRecords(req, 'forNonCaterers', options, { message })
      .catch(error => MenuController.errorResponse(error.message));

  }
  getMenuMeals(req, msg) {
    const options = {
      where: {
        menuDate: { [Op.gte]: today, [Op.lt]: nextDate }
      }
    };
    const message = msg || 'menu for the day has not been set';
    const acceptCallback = rows => rows[0].Meals[0];
    if (req.decoded.isCaterer) {
      const { userId } = req.decoded;
      const scope = [{ method: ['forCaterers', userId] }];

      return super
        .getAllRecords(req, scope, options, { message, acceptCallback });
    }
    return super.getAllRecords(
      req, 'forNonCaterers',
      options, { message, acceptCallback }
    )
      .catch(error => MenuController.errorResponse(error.message));

  }
  postMenu(req) {
    const { userId } = req.decoded;
    return this.Model.findOrCreate({
      where: {
        menuDate: { [Op.gte]: today, [Op.lt]: nextDate }
      },
      defaults: {
        menuDate: new Date().setHours(0, 0, 0, 0, 0),
      }
    })
      .then(async ([menu]) => {
        const req2 = { ...req };
        req2.body.id = menu.id;
        try {
          await menu.setMeals(req.body.meals, { through: { userId } });
        } catch (err) { return MenuController.errorResponse(err.message); }
        return req2;
      })
      .then((req2) => {
        process.env.ORDER_START_HOUR = new Date().getHours();
        process.env.ORDER_START_MINS = new Date().getMinutes();
        return this.getMenu(req2, 'Menu was not posted. Try again');
      })
      .catch(err => MenuController.errorResponse(err.message));
  }
}
