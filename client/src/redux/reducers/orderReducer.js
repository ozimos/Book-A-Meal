import {
  orderTypes
} from '../types';

const initialState = {
  connecting: false,
  orderError: null,
  orders: [],
  meals: [],
  pagination: {
    limits: 10,
    offset: 0,
    count: 1,
    pages: 1 },
  mealPagination: {
    limits: 10,
    offset: 0,
    count: 1,
    pages: 1 },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case orderTypes.ORDER_REQUEST:
      return {
        ...state,
        connecting: true,
        orderError: null
      };
    case orderTypes.GET_ORDER_ALL_SUCCESS:
      return {
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
        orders: [...state.orders, action.order],
        meals: action.order.Meals,
        pagination: { ...state.pagination,
          count: state.pagination.count + 1 },
        mealPagination: action.mealPagination,
      };
    case orderTypes.UPDATE_ORDER_SUCCESS:
      return {
        orders: state.orders.map((order) => {
          if (order.id === action.order.id) {
            return action.order;
          }
          return order;
        }),
        meals: action.order.Meals,
        pagination: { ...state.pagination,
          count: state.pagination.count + 1 },
        mealPagination: action.mealPagination,
      };
    case orderTypes.GET_ORDER_MEAL_SUCCESS:
      return {
        orders: state.orders.map((order) => {
          if (order.id === action.order.id) {
            return action.order;
          }
          return order;
        }),
        meals: action.order.Meals,
        mealPagination: action.mealPagination,
      };
    default:
      return state;
  }
};
