import { Op } from "sequelize";
import addDays from "date-fns/addDays";
import Controller from "./Controller";

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

  getMenu(req, res, next) {
    const extraConfig = this.cloneResetConfig();
    this.config = {
      scopes: ["basic", this.setAccessMode(req), this.setDiscrimDate(req)],
      options: { rejectOnEmpty: true },
      message: "menu for the day has not been set",
    };
    this.mergeOptions(this.config, extraConfig);
    return this.getAllRecords(req, res, next).catch((error) => next(error));
  }

  /**
   * post a menu
   * @param {obj} req express request object
   * @returns {obj}
   *
   */

  postMenu(req, res, next) {
    const { userId } = req.decoded;
    const date = (req.query && req.query.date) || new Date().setHours(0, 0, 0, 0);
    const nextDate = addDays(date, 1);
    return this.Model.findOrCreate({
      where: {
        menuDate: { [Op.gte]: date, [Op.lt]: nextDate },
        userId,
      },
      defaults: {
        menuDate: date,
        userId,
      },
    })
      .then(async ([menu]) => {
        await menu.setMeals(req.body);
        return menu;
      })
      .then((menu) => {
        req.query.caterer = true
        this.config = {
          scopes: [{ method: ["forId", menu.id] }],
          message: "menu for the day was set but cannot fetch created menu",
          statusCode: 201,
        };
        return this.getMenu(req, res, next);
      })
      .catch((error) => next(error));
  }
}
