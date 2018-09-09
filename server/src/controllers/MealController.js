import Controller from './Controller';

export default class MealController extends Controller {

  /**
   * get all the caterer's meals
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  getMeals(req) {
    const options = {
      where: { userId: req.decoded.userId },
      order: [['createdAt', 'DESC']]
    };
    return this.getAllRecords(req, options);
  }

  /**
   * add a new meal to the database
   * @param {obj} req express request object
   * @returns {obj}
   *
   */
  addMeal(req) {
    if (req.decoded && req.decoded.userId) {
      req.body.userId = req.decoded.userId;
      req.body.deletedAt = new Date(2100, 0);
      return this.postRecord(req);
    }
    return MealController.errorResponse('userId not supplied');
  }
}
