import { userIncludes } from './userDataMock';
import { rows } from './mealDataMock';

const Meals = rows.map(meal =>
  ({ ...meal, MealOrders: { quantity: 2 } }));
const template = {
  id: 'orderId',
  updatedAt: '2018-08-24T16:47:55.783Z',
  userId: 'userId',
  Meals,
  User: userIncludes,
};
export const order = {
  data: {
    pages: 1,
    offset: 0,
    rows: [template]
  }
};
export const orderActionData = {
  order: template

};
export const allOrders = {
  data: {
    rows: [{ ...template, id: 'order1' },
      { ...template, id: 'order2' }] }
};
