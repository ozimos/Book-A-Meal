import Controller from "./Controller";

export default class MealController extends Controller {
  /**
   * Creates an instance of MealController.
   * @param {any} Model
   * @memberof MealController
   */
  constructor(Model) {
    super(Model);
    this.getMeals = this.getMeals.bind(this);
    this.addMeal = this.addMeal.bind(this);
  }

  /**
   * get all the caterer's meals
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  getMeals(req, res, next) {
    this.config = {
      options: {
        where: { userId: req.decoded.userId },
        order: [["createdAt", "DESC"]],
      },
    };
    return this.getAllRecords(req, res, next).catch((error) => next(error));
  }

  /**
   * add a new meal to the database
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  addMeal(req, res, next) {
    req.body.userId = req.decoded.userId;
    return this.postRecord(req, res, next).catch((error) => next(error));
  }
}
