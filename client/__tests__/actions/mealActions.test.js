import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mealActions from '../../src/redux/actions/mealActions';
import mealTypes from '../../src/redux/types/mealTypes';
import { allMeals, meal, Meals, pagination } from '../__mocks__/mealDataMock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  connecting: false,
  mealError: null,
  meals: []
});

describe('meal actions', () => {
  beforeEach(() => {
    moxios.install();
    store.clearActions();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('dispatches MEALS_REQUEST and ALL_MEALS_SUCCESS' +
  ' on successfully fetching meals', () => {

    moxios.stubRequest('/api/v1/meals?limit=8&offset=0', {
      status: 200,
      response: allMeals
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.ALL_MEALS_SUCCESS, meals: Meals, pagination },
    ];
    return store.dispatch(mealActions.getAllMeals())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toMatchObject(expectedActions);
      });
  });

  it('dispatches MEALS_REQUEST and MEALS_FAILURE' +
  ' on failing fetching meals', () => {

    moxios.stubRequest('/api/v1/meals?limit=8&offset=0', {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.MEALS_FAILURE, error: 'problem' },
    ];
    return store.dispatch(mealActions.getAllMeals())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches MEALS_REQUEST and CREATE_MEAL_SUCCESS ' +
  'on successfully creating a meal', () => {

    moxios.stubRequest('/api/v1/meals', {
      status: 200,
      response: { data: meal }
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.CREATE_MEAL_SUCCESS, meal },
    ];
    return store.dispatch(mealActions.createMeal({}))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches MEALS_REQUEST and MEALS_FAILURE' +
  'on failing creating a meal', () => {

    moxios.stubRequest('/api/v1/meals', {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.MEALS_FAILURE, error: 'problem' },
    ];
    return store.dispatch(mealActions.createMeal({}))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches MEALS_REQUEST and UPDATE_MEAL_SUCCESS ' +
  'on successfully updating a meal', () => {
    const mealId = 'abc';
    moxios.stubRequest(`/api/v1/meals/${mealId}`, {
      status: 200,
      response: { data: meal }
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.UPDATE_MEAL_SUCCESS, meal },
    ];
    return store.dispatch(mealActions.updateMeal({}, mealId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches MEALS_REQUEST and MEALS_FAILURE' +
  'on failing updating a meal', () => {
    const mealId = 'abc';

    moxios.stubRequest(`/api/v1/meals/${mealId}`, {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.MEALS_FAILURE, error: 'problem' },
    ];
    return store.dispatch(mealActions.updateMeal({}, mealId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches MEALS_REQUEST and DELETE_MEAL_SUCCESS' +
  ' on successfully deleting a meal', () => {
    const mealId = 'abc';
    moxios.stubRequest(`/api/v1/meals/${mealId}`, {
      status: 200,
      response: { data: meal }
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.DELETE_MEAL_SUCCESS, id: mealId },
    ];
    return store.dispatch(mealActions.deleteMeal(mealId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });

  it('dispatches MEALS_REQUEST and MEALS_FAILURE' +
  'on failing to delete a meal', () => {
    const mealId = 'abc';
    moxios.stubRequest(`/api/v1/meals/${mealId}`, {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: mealTypes.MEALS_REQUEST },
      { type: mealTypes.MEALS_FAILURE, error: 'problem' },
    ];
    return store.dispatch(mealActions.deleteMeal(mealId))
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });
});
