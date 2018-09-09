import { userIncludes } from './userDataMock';

export const orderMeals = [
  { id: 'meal1',
    price: 1200,
    subTotal: 2400,
    title: 'Eba and Egusi',
    MealOrders: {
      quantity: 2
    }
  },
  { id: 'meal2',
    price: 2000,
    subTotal: 6000,
    title: 'Rice and Stew',
    MealOrders: {
      quantity: 3
    }
  }
];

export const pagination = {
  limit: 10,
  offset: 0,
  count: 1,
  pages: 1,
};

export const mealsPagination = {
  limit: 5,
  offset: 0,
  count: 1,
  pages: 1,
};

const orderDetails = {
  id: 'order1',
  updatedAt: '2018-08-24T16:47:55.783Z',
  userId: 'userId',
  MealsURL: 'url',
  User: userIncludes,
};

const orderMealDetails = {
  id: 'order1',
  updatedAt: '2018-08-24T16:47:55.783Z',
  userId: 'userId',
  Meals: orderMeals,
  User: userIncludes,
};

export const order = {
  data: {
    ...mealsPagination,
    rows: [{ ...orderDetails }]
  }
};

export const newOrder = { ...orderMealDetails, id: 'order4' };

export const modifiedOrder = { ...orderMealDetails, id: 'order1' };

export const modifiedOrderResponse = {
  data: {
    ...mealsPagination,
    rows: [{ ...modifiedOrder }]
  }
};

export const previousOrders = [
  { ...orderDetails, id: 'order1' },
  { ...orderDetails, id: 'order2' },
  { ...orderDetails, id: 'order3' },
];

export const allOrders = {
  data: {
    ...pagination,
    rows: previousOrders
  }
};

export const updatedOrders = [
  { ...orderMealDetails, id: 'order1' },
  { ...orderDetails, id: 'order2' },
  { ...orderDetails,
    id: 'order3',
    updatedAt: '2018-08-24T16:55:55.783Z' },
];

export const updatedOrdersResponse = {
  data: {
    ...pagination,
    rows: updatedOrders
  }
};

export const newOrders = [
  { ...orderDetails, id: 'order1' },
  { ...orderDetails, id: 'order2' },
  { ...orderDetails, id: 'order3' },
  { ...orderDetails, id: 'order4' },
];

export const newOrdersResponse = {
  data: {
    limit: 10,
    offset: 0,
    count: 2,
    pages: 1,
    rows: newOrders
  }
};
