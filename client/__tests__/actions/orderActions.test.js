import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import orderActions from '../../src/redux/actions/orderActions';
import orderTypes from '../../src/redux/types/orderTypes';
import { allOrders, order, orderActionData } from '../__mocks__/orderDataMock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  connecting: false,
  mealError: null,
  orders: [],
  pendingOrders: [],
});

describe('order async actions', () => {
  beforeEach(() => {
    moxios.install();
    store.clearActions();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('dispatches ORDER_REQUEST and GET_ORDER_ALL_SUCCESS' +
   ' on successfully fetching all orders', () => {

    moxios.stubRequest('/api/v1/orders?limit=10&offset=0', {
      status: 200,
      response: allOrders
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.GET_ORDER_ALL_SUCCESS, orders: allOrders.data.rows },
    ];
    return store.dispatch(orderActions.getOrdersWithMealLinks())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and GET_ORDER_ALL_SUCCESS' +
   ' on successfully fetching all orders by date', () => {

    moxios.stubRequest('/api/v1/orders/date/?limit=10&offset=0', {
      status: 200,
      response: allOrders
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.GET_ORDER_ALL_SUCCESS, orders: allOrders.data.rows },
    ];
    return store.dispatch(orderActions.getOrdersWithMealLinksByDate())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and ORDER_FAILURE on failing' +
   ' to fetch all orders', () => {

    moxios.stubRequest('/api/v1/orders?limit=10&offset=0', {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.ORDER_FAILURE, error: 'problem' },
    ];
    return store.dispatch(orderActions.getOrdersWithMealLinks())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and ORDER_FAILURE on failing' +
   ' to fetch all orders by date', () => {

    moxios.stubRequest('/api/v1/orders/date/?limit=10&offset=0', {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.ORDER_FAILURE, error: 'problem' },
    ];
    return store.dispatch(orderActions.getOrdersWithMealLinksByDate())
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
      { type: orderTypes.ORDER_MEALS_REQUEST },
      { type: orderTypes.GET_ORDER_MEAL_SUCCESS,
        orderMeals: order.data.rows[0].Meals },
    ];
    return store.dispatch(orderActions
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
      { type: orderTypes.ORDER_MEALS_REQUEST },
      { type: orderTypes.GET_ORDER_MEAL_FAILURE, orderMealsError: 'problem' },
    ];
    return store.dispatch(orderActions
      .getMealsInOrder('51c6b0ee-0ac0-43b2-9972-7d44683dfe07'))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and POST_ORDER_SUCCESS' +
  ' on successfully creating a order', () => {

    moxios.stubRequest('/api/v1/orders', {
      status: 200,
      response: order
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.POST_ORDER_SUCCESS, ...orderActionData },
    ];
    return store.dispatch(orderActions.postOrder({}))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and ORDER_FAILURE' +
  ' on failing to create a order', () => {

    moxios.stubRequest('/api/v1/orders', {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.ORDER_FAILURE, error: 'problem' },
    ];
    return store.dispatch(orderActions.postOrder({}))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and UPDATE_ORDER_SUCCESS' +
  ' on successfully updating a order', () => {
    const mealId = 'abc';
    moxios.stubRequest(`/api/v1/orders/${mealId}`, {
      status: 200,
      response: order
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.UPDATE_ORDER_SUCCESS, ...orderActionData },
    ];
    return store.dispatch(orderActions.updateOrder({}, mealId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_REQUEST and ORDER_FAILURE' +
  ' on failing to update an order', () => {
    const mealId = 'abc';

    moxios.stubRequest(`/api/v1/orders/${mealId}`, {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: orderTypes.ORDER_REQUEST },
      { type: orderTypes.ORDER_FAILURE, error: 'problem' },
    ];
    return store.dispatch(orderActions.updateOrder({}, mealId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches ORDER_MEALS_REQUEST and GET_ORDER_TOTAL_SUCCESS' +
   ' on successfully fetching total revenue for an order', () => {

    const orderId = 'abc';

    moxios.stubRequest(`/api/v1/orders/total/${orderId}`, {
      status: 200,
      response: { data: { revenue: 10 } }
    });
    const expectedActions = [
      { type: orderTypes.ORDER_MEALS_REQUEST },
      { type: orderTypes.GET_ORDER_TOTAL_SUCCESS, total: 10 },
    ];
    return store.dispatch(orderActions.getOrderTotal(orderId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches ORDER_MEALS_REQUEST and GET_ORDER_MEAL_FAILURE' +
  ' on failing to fetch total revenue for an order', () => {
    const orderId = 'abc';

    moxios.stubRequest(`/api/v1/orders/total/${orderId}`, {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: orderTypes.ORDER_MEALS_REQUEST },
      { type: orderTypes.GET_ORDER_MEAL_FAILURE, orderMealsError: 'problem' },
    ];
    return store.dispatch(orderActions.getOrderTotal(orderId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });
});
