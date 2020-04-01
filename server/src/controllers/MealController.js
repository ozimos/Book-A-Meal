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
  getMeals(req, res) {
    this.options = {
      where: { userId: req.decoded.userId },
      order: [["createdAt", "DESC"]]
    };
    return this.getAllRecords(req, res).catch(error =>
      res.status(400).json({ message: error.message })
    );
  }

  /**
   * add a new meal to the database
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  addMeal(req, res) {
    req.body.userId = req.decoded.userId;
    req.body.deletedAt = new Date(2100, 0);
    return this.postRecord(req, res).catch(error =>
      res.status(400).json({ message: error.message })
    );
  }
}
