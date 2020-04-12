import orderReducer,
{ initialOrderState } from '../../src/redux/reducers/orderReducer';
import { orderTypes } from '../../src/redux/types';
import { orderMeals,
  previousOrders,
  updatedOrders,
  newOrders,
  pagination,
  mealsPagination
} from '../__mocks__/orderDataMock';

describe(' orderReducer', () => {


  it('should return the initial state for unknown action type', () => {
    expect(orderReducer(undefined, {})).toEqual(initialOrderState);
  });

  it('should set loading state on fetching orders', () => {
    const newState = {
      ...initialOrderState,
      connecting: true,
      orderError: null,
      orders: []
    };
    const action = { type: orderTypes.ORDER_REQUEST };
    expect(orderReducer(undefined, action)).toMatchObject(newState);
  });

  it('should set loading state on fetching meals', () => {
    const newState = {
      ...initialOrderState,
      loadingMeals: true
    };
    const action = { type: orderTypes.ORDER_MEALS_REQUEST };
    expect(orderReducer(undefined, action)).toMatchObject(newState);
  });

  it('should add fetched orders to state', () => {
    const newState = {
      ...initialOrderState,
      orders: previousOrders
    };
    const action = { type: orderTypes.GET_ORDER_ALL_SUCCESS,
      pagination,
      orders: previousOrders, };

    expect(orderReducer(undefined, action)).toMatchObject(newState);
  });

  it('should add the error message on failing to fetch orders', () => {
    const newState = {
      connecting: false,
      orderError: { message: 'error' },
      orders: []
    };
    const action = { type: orderTypes.ORDER_FAILURE,
      error: { message: 'error' } };

    expect(orderReducer(undefined, action)).toMatchObject(newState);
  });

  it('should add the error message on failing to fetch order meals ', () => {
    const newState = {
      loadingMeals: false,
      orderMealsError: { message: 'error' },
    };
    const action = { type: orderTypes.GET_ORDER_MEAL_FAILURE,
      orderMealsError: { message: 'error' } };

    expect(orderReducer(undefined, action)).toMatchObject(newState);
  });

  it('should add new orders to state', () => {
    const oldState = {
      orders: previousOrders,
    };
    const newState = {
      orders: newOrders,
    };
    const action = { type: orderTypes.POST_ORDER_SUCCESS, orders: newOrders };
    expect(orderReducer(oldState, action)).toMatchObject(newState);
  });

  it('should add fetched meals to state', () => {

    const newState = {
      loadingMeals: false,
      orderMeals,
    };
    const action = { type: orderTypes.GET_ORDER_MEAL_SUCCESS,
      orderMeals,
      mealsPagination };
    expect(orderReducer(undefined, action)).toMatchObject(newState);
  });

  it('should add updated orders to state', () => {
    const oldState = {
      orders: previousOrders,
    };
    const newState = {
      orders: updatedOrders,
    };

    const action = { type: orderTypes.UPDATE_ORDER_SUCCESS,
      orders: updatedOrders };
    expect(orderReducer(oldState, action)).toMatchObject(newState);
  });

  it('should add order total to state', () => {

    const newState = {
      total: 20
    };

    const action = { type: orderTypes.GET_ORDER_TOTAL_SUCCESS,
      total: 20 };
    expect(orderReducer(undefined, action)).toMatchObject(newState);
  });
});

