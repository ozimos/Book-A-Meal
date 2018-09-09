import { Op } from 'sequelize';
import addDays from 'date-fns/add_days';
import Controller from './Controller';

const today = new Date().setHours(0, 0, 0, 0, 0);
export default class MenuController extends Controller {

  /**
   * get the menu
   * @param {obj} req express request object
   * @param {string} msg message
   * @param {number} statusCode response status
   * @returns {obj}
   *
   */

  getMenu(req, msg, statusCode = 200) {
    let scope;
    const date = (req.query && req.query.date) || today;
    const nextDate = addDays(date, 1);
    const { userId, isCaterer } = req.decoded;

    const options = {
      subQuery: false,
      distinct: false,
      include: [{
        association: 'Meals',
        required: true,
        where: (isCaterer) && { userId },
        through: {
          attributes: ['userId'],
        }
      }]
    };
    let whereOptions;
    // getMenu method is used by postMenu method
    // postMenu inserts id into req body
    if (req.body && req.body.id) {
      whereOptions = { id: req.body.id };
    } else {
      whereOptions = {
        menuDate: { [Op.gte]: date, [Op.lt]: nextDate }
      };
    }

    if (isCaterer) {
      whereOptions = { ...whereOptions, userId };
    }
    options.where = whereOptions;
    const message = msg || 'menu for the day has not been set';

    return this
      .getAllRecords(
        req, scope, options,
        { raw: true }
      )
      .then(({ limit, offset, pages, count, rows }) => {
        const newRows = [{
          Meals: []
        }];
        if (rows && rows.length) {
          rows.forEach((row) => {
            newRows[0].Meals = [...newRows[0].Meals, ...row.dataValues.Meals];
          });

        }

        if (!newRows[0].Meals.length) {
          return MenuController.errorResponse(message, 404);
        }

        return MenuController.defaultResponse({
          limit,
          offset,
          pages,
          count,
          rows: newRows }, statusCode);
      })
      .catch(error => MenuController.errorResponse(error.message));

  }

  /**
   * post a menu
   * @param {obj} req express request object
   * @returns {obj}
   *
   */

  postMenu(req) {
    const { userId } = req.decoded;
    const date = (req.query && req.query.date) || today;
    const nextDate = addDays(date, 1);
    return this.Model.findOrCreate({
      where: {
        menuDate: { [Op.gte]: date, [Op.lt]: nextDate },
        userId
      },
      defaults: {
        menuDate: date,
        userId
      }
    })
      .then(async ([menu]) => {
        const req2 = { ...req };
        req2.body.id = menu.id;
        try {
          await menu.setMeals(req.body.meals, { through: { userId } });
          return req2;
        } catch (err) { throw new Error(err); }
      })
      .then((req2) => {
        process.env.ORDER_START_HOUR = new Date().getHours();
        process.env.ORDER_START_MINS = new Date().getMinutes();
        return this.getMenu(req2, 'Menu was not posted. Try again', 201);
      })
      .catch(err => MenuController.errorResponse(err.message));
  }

}
