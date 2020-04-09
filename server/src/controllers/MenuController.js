import { Op } from "sequelize";
import addDays from "date-fns/addDays";
import Controller from "./Controller";

const today = new Date().setHours(0, 0, 0, 0);
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
    this.baseOptions = {
      rejectOnEmpty: true,
      attributes: ["id", "menuDate"],
      include: [
        {
          association: "Meals",
          attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
          required: true,
          through: { attributes: [] },
        },
      ],
    };
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
    const { userId, isCaterer } = req.decoded;

    const date = (req.query && req.query.date) || today;
    const nextDate = addDays(date, 1);
    let where = {
      menuDate: { [Op.gte]: date, [Op.lt]: nextDate },
    };

    if (isCaterer) {
      where.userId = userId;
    }
    this.statusCode = 200;
    this.message = "menu for the day has not been set";
    this.options = { ...this.baseOptions, where };
    return this.getAllRecords(req, res, next).catch((error) =>
      res.status(400).json({ message: error.message })
    );
  }

  /**
   * post a menu
   * @param {obj} req express request object
   * @returns {obj}
   *
   */

  postMenu(req, res, next) {
    const { userId } = req.decoded;
    const date = (req.query && req.query.date) || today;
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
        this.options = { ...this.baseOptions, where: { id: menu.id } };
        this.statusCode = 201;
        return this.getAllRecords(req, res, next);
      })
      .catch((err) => next(error));
  }
}
