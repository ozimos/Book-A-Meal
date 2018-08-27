import {
  orderTypes
} from '../types';

const initialState = {
  connecting: false,
  orderError: null,
  orders: [],
  pagination: {
    limits: 10,
    offset: 0,
    count: 1,
    pages: 1 }
};

export default (state = initialState, action) => {
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
        orders: state.orders.map((order) => {
          if (order.id === action.order.id) {
            return { ...order, ...action.order };
          }
          return order;
        }),
      };
    case orderTypes.GET_ORDER_MEAL_FAILURE:
      return {
        ...state,
        connecting: false,
        orders: state.orders.map((order) => {
          if (order.id === action.order.id) {
            return { ...order, ...action.order };
          }
          return order;
        }),
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
        pagination: { ...state.pagination,
          count: state.pagination.count + 1 },
      };
    case orderTypes.UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        connecting: false,
        orders: state.orders.map((order) => {
          if (order.id === action.order.id) {
            return action.order;
          }
          return order;
        }),
      };
    case orderTypes.GET_ORDER_MEAL_SUCCESS:
      return {
        ...state,
        connecting: false,
        orders: state.orders.map((order) => {
          if (order.id === action.order.id) {
            return action.order;
          }
          return order;
        }),
      };
    default:
      return state;
  }
};
