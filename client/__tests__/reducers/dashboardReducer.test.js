import dashboardReducer from '../../src/redux/reducers/dashboardReducer';
import { dashboardTypes } from '../../src/redux/types';
import { allOrders } from '../__mocks__/orderDataMock';

describe('dashboardReducer', () => {
  const initialState = {
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

  it('should return the initial state for unknown action type', () => {
    expect(dashboardReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle ORDER_DASHBOARD_REQUEST', () => {
    const newState = {
      connecting: true,
      orderError: null,
      orders: []
    };
    const action = { type: dashboardTypes.ORDER_DASHBOARD_REQUEST };
    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle ORDER_DASHBOARD_HISTORY_SUCCESS', () => {
    const newState = {
      connecting: false,
      orders: allOrders.data,
      pagination: initialState.pagination
    };
    const action = { type: dashboardTypes.ORDER_DASHBOARD_HISTORY_SUCCESS,
      orders: allOrders.data,
      pagination: initialState.pagination };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle ORDER_DASHBOARD_FAILURE', () => {
    const newState = {
      connecting: false,
      orderError: { message: 'error' },
      orders: []
    };
    const action = { type: dashboardTypes.ORDER_DASHBOARD_FAILURE,
      error: { message: 'error' } };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle ORDER_DASHBOARD_HISTORY_FAILURE', () => {
    const newState = {
      connecting: false,
      orderError: { message: 'error' },
      orders: []
    };
    const action = { type: dashboardTypes.ORDER_DASHBOARD_HISTORY_FAILURE,
      error: { message: 'error' } };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle ORDER_MEALS_DASHBOARD_SUCCESS', () => {
    const newState = {
      loadingMeals: false,
      orderMeals: allOrders.data,
      mealsPagination: initialState.mealsPagination
    };
    const action = { type: dashboardTypes.ORDER_MEALS_DASHBOARD_SUCCESS,
      orderMeals: allOrders.data,
      mealsPagination: initialState.mealsPagination };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle ORDER_MEALS_DASHBOARD_REQUEST', () => {
    const newState = {
      loadingMeals: true,
    };
    const action = { type: dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle ORDER_MEALS_DASHBOARD_FAILURE', () => {
    const newState = {
      loadingMeals: false,
      orderMealsError: { message: 'error' },
    };
    const action = { type: dashboardTypes.ORDER_MEALS_DASHBOARD_FAILURE,
      orderMealsError: { message: 'error' } };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle ORDER_DASHBOARD_TOTAL_SUCCESS', () => {
    const newState = {
      total: 10,
    };
    const action = { type: dashboardTypes.ORDER_DASHBOARD_TOTAL_SUCCESS,
      total: 10 };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle DASHBOARD_TOTAL_SUCCESS', () => {
    const newState = {
      daysTotal: { revenue: 10, users: 2, orders: 4 },
    };
    const action = { type: dashboardTypes.DASHBOARD_TOTAL_SUCCESS,
      total: { revenue: 10, users: 2, orders: 4 } };

    expect(dashboardReducer(undefined, action)).toMatchObject(newState);
  });
});
