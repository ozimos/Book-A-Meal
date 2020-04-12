import {
  dashboardTypes
} from '../types';

export const dashboardInitialState = {
  connecting: false,
  loadingMeals: false,
  orderError: null,
  orderMealsError: null,
  orders: [],
  orderMeals: [],
  daysTotal: {
    revenue: 0,
    users: 0,
    orders: 0
  },
  total: 0,
  mealsPagination: {
    limits: 5,
    offset: 0,
    count: 1,
    pages: 1 },
  pagination: {
    limits: 10,
    offset: 0,
    count: 1,
    pages: 1 }
};

export default (state = dashboardInitialState, action) => {
  switch (action.type) {

    case dashboardTypes.ORDER_DASHBOARD_REQUEST:
      return {
        ...state,
        connecting: true,
        orderError: null
      };

    case dashboardTypes.ORDER_DASHBOARD_HISTORY_SUCCESS:
      return {
        ...state,
        connecting: false,
        orders: action.orders,
        pagination: action.pagination,
      };

    case dashboardTypes.ORDER_DASHBOARD_FAILURE:
      return {
        ...state,
        connecting: false,
        orderError: action.error
      };

    case dashboardTypes.ORDER_DASHBOARD_HISTORY_FAILURE:
      return {
        ...state,
        connecting: false,
        orderError: action.error
      };

    case dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST:
      return {
        ...state,
        loadingMeals: true
      };

    case dashboardTypes.ORDER_MEALS_DASHBOARD_FAILURE:
      return {
        ...state,
        loadingMeals: false,
        orderMealsError: action.orderMealsError,
      };

    case dashboardTypes.ORDER_MEALS_DASHBOARD_SUCCESS:
      return {
        ...state,
        loadingMeals: false,
        orderMeals: action.orderMeals,
        mealsPagination: action.mealsPagination,
      };

    case dashboardTypes.ORDER_DASHBOARD_TOTAL_SUCCESS:
      return {
        ...state,
        total: action.total
      };

    case dashboardTypes.DASHBOARD_TOTAL_SUCCESS:
      return {
        ...state,
        daysTotal: action.total
      };

    default:
      return state;
  }
};
