import { Op } from "sequelize";
import addDays from "date-fns/addDays";
import Controller from "./Controller";

const today = new Date().setHours(0, 0, 0, 0, 0);
export default class MenuController extends Controller {
  /**
   * Creates an instance of MenuController.
   * @param {any} Model
   * @memberof MenuController
   */
  constructor(Model) {
    super(Model);
    this.getMenu = this.getMenu.bind(this);
    this.postMenu = this.postMenu.bind(this);
  }

  /**
   * get the menu
   * @param {obj} req express request object
   * @param {string} msg message
   * @param {number} statusCode response status
   * @returns {obj}
   *
   */

  getMenuBase(req, res, msg, statusCode = 200) {
  
    const options = {
      subQuery: false,
      distinct: false,
      include: [
        {
          association: "Meals",
          required: true,
          through: {
            attributes: ["userId"]
          }
        }
      ]
    };
   

    return this.getAllRecords(req, res, options, scope, { raw: true })
      .then(({ ...rest, rows }) => {
        const newRows = [
          {
            Meals: []
          }
        ];
        if (rows && rows.length) {
          rows.forEach(row => {
            newRows[0].Meals = [...newRows[0].Meals, ...row.dataValues.Meals];
          });
        }
        const isEmptyMenu =
          req.body && req.body.meals && !req.body.meals.length;
        if (!newRows[0].Meals.length && !isEmptyMenu) {
          return;
        }

        return  {
            ...rest,
            rows: newRows
          };
      })
  }

  /**
   * get the menu
   * @param {obj} req express request object
   * @param {string} msg message
   * @param {number} statusCode response status
   * @returns {obj}
   *
   */

  getMenu(req, res, msg, statusCode = 200) {
    let scope;
    const date = (req.query && req.query.date) || today;
    const nextDate = addDays(date, 1);
    const { userId, isCaterer } = req.decoded;

    const options = {
      subQuery: false,
      distinct: false,
      include: [
        {
          association: "Meals",
          required: true,
          where: isCaterer && { userId },
          through: {
            attributes: ["userId"]
          }
        }
      ]
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
    const message = msg || "menu for the day has not been set";

    return this.getAllRecords(req, res, options, scope, { raw: true })
      .then(({ limit, offset, pages, count, rows }) => {
        const newRows = [
          {
            Meals: []
          }
        ];
        if (rows && rows.length) {
          rows.forEach(row => {
            newRows[0].Meals = [...newRows[0].Meals, ...row.dataValues.Meals];
          });
        }
        const isEmptyMenu =
          req.body && req.body.meals && !req.body.meals.length;
        if (!newRows[0].Meals.length && !isEmptyMenu) {
          return res.status(404).json({message});
        }

        return res.status(statusCode).json({
          data: {
            limit,
            offset,
            pages,
            count,
            rows: newRows
          }
        });
      })
      .catch(error => res.status(400).json({message: error.message}));
  }

  /**
   * post a menu
   * @param {obj} req express request object
   * @returns {obj}
   *
   */

  postMenu(req, res) {
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
        } catch (err) {
          throw new Error(err);
        }
      })
      .then(req2 => {
        process.env.ORDER_START_HOUR = new Date().getHours();
        process.env.ORDER_START_MINS = new Date().getMinutes();
        return this.getMenu(req2, "Menu was not posted. Try again", 201);
      })
      .catch(err => res.status(400).json({message: err.message}));
  }
}
