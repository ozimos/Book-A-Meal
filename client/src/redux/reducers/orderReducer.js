import {
  orderTypes
} from '../types';

export const initialOrderState = {
  connecting: false,
  loadingMeals: false,
  orderError: null,
  orderMealsError: null,
  orders: [],
  orderMeals: [],
  orderEditMeals: [],
  total: 0,
  mealsPagination: {
    limit: 5,
    offset: 0,
    count: 1,
    pages: 1 },
  pagination: {
    limit: 10,
    offset: 0,
    count: 1,
    pages: 1 }
};

export default (state = initialOrderState, action) => {
  switch (action.type) {

    case orderTypes.ORDER_REQUEST:
      return {
        ...state,
        connecting: true,
        orderError: null
      };

    case orderTypes.ORDER_MEALS_REQUEST:
      return {
        ...state,
        loadingMeals: true
      };

    case orderTypes.GET_ORDER_MEAL_FAILURE:
      return {
        ...state,
        loadingMeals: false,
        orderMealsError: action.orderMealsError,
      };

    case orderTypes.GET_ORDER_ALL_SUCCESS:
      return {
        ...state,
        connecting: false,
        orders: action.orders,
        pagination: action.pagination
      };

    case orderTypes.ORDER_FAILURE:
      return {
        ...state,
        connecting: false,
        orderError: action.error
      };

    case orderTypes.POST_ORDER_SUCCESS:
      return {
        ...state,
        connecting: false,
        orders: action.orders,
        pagination: action.pagination
      };

    case orderTypes.UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        connecting: false,
        orders: action.orders,
        pagination: action.pagination,
        orderEditMeals: [],
      };

    case orderTypes.GET_ORDER_MEAL_SUCCESS:
      return {
        ...state,
        loadingMeals: false,
        orderMeals: action.orderMeals,
        mealsPagination: action.mealsPagination,
      };

    case orderTypes.GET_ORDER_MEAL_EDIT_SUCCESS:
      return {
        ...state,
        loadingMeals: false,
        orderEditMeals: action.orderEditMeals,
      };

    case orderTypes.GET_ORDER_TOTAL_SUCCESS:
      return {
        ...state,
        total: action.total
      };

    default:
      return state;
  }
};
