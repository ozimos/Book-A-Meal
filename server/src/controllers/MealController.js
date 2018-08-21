import Controller from './Controller';

export default class MealController extends Controller {

  getMeals(req) {
    const options = {
      where: { userId: req.decoded.userId },
      order: [['createdAt', 'DESC']]
    };
    return this.getAllRecords(req, options);
  }
  addMeal(req) {
    if (req.decoded && req.decoded.userId) {
      req.body.userId = req.decoded.userId;
      req.body.deletedAt = new Date(2100, 0);
      return this.postRecord(req);
    }
    return MealController.errorResponse('userId not supplied');
  }
}
