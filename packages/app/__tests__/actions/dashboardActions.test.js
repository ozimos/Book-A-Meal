import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import dashboardActions from '../../src/redux/actions/dashboardActions';
import dashboardTypes from '../../src/redux/types/dashboardTypes';
import { allOrders, order } from '../__mocks__/orderDataMock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  connecting: false,
  error: null,
  orders: []
});
describe('order async actions', () => {

  beforeEach(() => {
    moxios.install();
    store.clearActions();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('dispatches ORDER_DASHBOARD_REQUEST and ORDER_DASHBOARD_HISTORY_SUCCESS' +
  ' on successfully fetching orders', () => {

    moxios.stubRequest('/api/v1/orders?limit=10&offset=0', {
      status: 200,
      response: allOrders
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_DASHBOARD_HISTORY_SUCCESS,
        orders: allOrders.data.rows },
    ];

    return store.dispatch(dashboardActions.getOrdersWithMealLinks())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_DASHBOARD_REQUEST and ORDER_DASHBOARD_HISTORY_SUCCESS' +
  ' on successfully fetching orders by date', () => {

    moxios.stubRequest('/api/v1/orders/date/?limit=10&offset=0', {
      status: 200,
      response: allOrders
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_DASHBOARD_HISTORY_SUCCESS,
        orders: allOrders.data.rows },
    ];

    return store.dispatch(dashboardActions.getOrdersWithMealLinksByDate())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_DASHBOARD_REQUEST and ORDER_DASHBOARD_HISTORY_FAILURE ' +
  'on failing to fetch all orders', () => {

    moxios.stubRequest('/api/v1/orders?limit=10&offset=0', {
      status: 400,
      response: { message: 'problem' }
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_DASHBOARD_HISTORY_FAILURE,
        error: 'problem' },
    ];

    return store.dispatch(dashboardActions.getOrdersWithMealLinks())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_DASHBOARD_REQUEST and ORDER_DASHBOARD_HISTORY_FAILURE ' +
  'on failing to fetch all orders by date', () => {

    moxios.stubRequest('/api/v1/orders/date/?limit=10&offset=0', {
      status: 400,
      response: { message: 'problem' }
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_DASHBOARD_HISTORY_FAILURE,
        error: 'problem' },
    ];

    return store.dispatch(dashboardActions.getOrdersWithMealLinksByDate())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and GET_ORDER_ALL_SUCCESS' +
  ' on successfully fetching meal orders', () => {

    moxios.stubRequest(

      // eslint-disable-next-line
      '/api/v1/orders/51c6b0ee-0ac0-43b2-9972-7d44683dfe07/meals?limit=5&offset=0',
      {
        status: 200,
        response: order
      }
    );

    const expectedActions = [
      { type: dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_MEALS_DASHBOARD_SUCCESS,
        orderMeals: order.data.rows[0].Meals },
    ];

    return store.dispatch(dashboardActions
      .getMealsInOrder('51c6b0ee-0ac0-43b2-9972-7d44683dfe07'))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and ORDER_FAILURE' +
  ' on failing to fetch meal orders', () => {

    moxios.stubRequest(
      // eslint-disable-next-line
      '/api/v1/orders/51c6b0ee-0ac0-43b2-9972-7d44683dfe07/meals?limit=5&offset=0',
      {
        status: 400,
        response: { message: 'problem' }
      }
    );

    const expectedActions = [
      { type: dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_MEALS_DASHBOARD_FAILURE,
        orderMealsError: 'problem' },
    ];

    return store.dispatch(dashboardActions
      .getMealsInOrder('51c6b0ee-0ac0-43b2-9972-7d44683dfe07'))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_MEALS_DASHBOARD_REQUEST and ' +
  'ORDER_DASHBOARD_TOTAL_SUCCESS' +
   ' on successfully fetching total revenue for an order', () => {

    const orderId = 'abc';

    moxios.stubRequest(`/api/v1/orders/total/${orderId}`, {
      status: 200,
      response: { data: { revenue: 10 } }
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_DASHBOARD_TOTAL_SUCCESS, total: 10 },
    ];

    return store.dispatch(dashboardActions.getOrderTotal(orderId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_MEALS_DASHBOARD_REQUEST and' +
   ' ORDER_MEALS_DASHBOARD_FAILURE' +
  ' on failing to fetch total revenue for an order', () => {
    const orderId = 'abc';

    moxios.stubRequest(`/api/v1/orders/total/${orderId}`, {
      status: 400,
      response: { message: 'problem' }
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_MEALS_DASHBOARD_FAILURE,
        orderMealsError: 'problem' },
    ];

    return store.dispatch(dashboardActions.getOrderTotal(orderId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_DASHBOARD_REQUEST and ' +
  'DASHBOARD_TOTAL_SUCCESS' +
   ' on successfully fetching total revenue for the day', () => {

    const orderId = 'abc';
    const total = {
      revenue: 2000, orders: 2, users: 2
    };

    moxios.stubRequest('/api/v1/orders/total/date', {
      status: 200,
      response: { data: total }
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_DASHBOARD_REQUEST },
      { type: dashboardTypes.DASHBOARD_TOTAL_SUCCESS, total },
    ];

    return store.dispatch(dashboardActions.getDaysOrdersTotal(orderId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_DASHBOARD_REQUEST and' +
   ' ORDER_DASHBOARD_FAILURE' +
  ' on failing to fetch total revenue for the day', () => {
    const orderId = 'abc';

    moxios.stubRequest('/api/v1/orders/total/date', {
      status: 400,
      response: { message: 'problem' }
    });

    const expectedActions = [
      { type: dashboardTypes.ORDER_DASHBOARD_REQUEST },
      { type: dashboardTypes.ORDER_DASHBOARD_FAILURE,
        error: 'problem' },
    ];

    return store.dispatch(dashboardActions.getDaysOrdersTotal(orderId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });
});
