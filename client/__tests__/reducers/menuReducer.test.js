import menuReducer from '../../src/redux/reducers/menuReducer';
import { menuTypes } from '../../src/redux/types';
import { menuMeals } from '../__mocks__/menuDataMock';

describe('post menuReducer', () => {
  const initialState = {
    connecting: false,
    menuError: null,
    menu: [],
    pagination: {
      limit: 10,
      offset: 0,
      count: 1,
      pages: 1 }
  };
  it('should return the initial state for unknown action type', () => {
    expect(menuReducer(undefined, {})).toEqual(initialState);
  });

  it('should set connecting on menu request', () => {
    const newState = {
      connecting: true,
      menuError: null,
      menu: [],
      pagination: {
        limit: 10,
        offset: 0,
        count: 1,
        pages: 1 }
    };
    const action = { type: menuTypes.MENU_REQUEST };
    expect(menuReducer(undefined, action)).toEqual(newState);
  });

  it('should add fetched menu to state', () => {
    const newState = {
      connecting: false,
      pagination: {
        limit: 10,
        offset: 0,
        count: 1,
        pages: 1 },
      menu: menuMeals
    };
    const action = {
      type: menuTypes.GET_MENU_SUCCESS,
      menu: menuMeals,
      pagination: {
        limit: 10,
        offset: 0,
        count: 1,
        pages: 1
      },

    };

    expect(menuReducer(undefined, action)).toMatchObject(newState);
  });

  it('should add error message on failing to fetch menu to state', () => {
    const newState = {
      connecting: false,
      menuError: { message: 'error' },
      menu: []
    };
    const action = {
      type: menuTypes.MENU_FAILURE, error: { message: 'error' } };

    expect(menuReducer(undefined, action)).toMatchObject(newState);
  });

  it('should add new menu meals to state', () => {
    const newState = {
      menu: menuMeals,
      pagination: {
        limit: 10,
        offset: 0,
        count: 1,
        pages: 1 }
    };
    const action = {
      type: menuTypes.POST_MENU_SUCCESS,
      menu: menuMeals,
      pagination: {
        limit: 10,
        offset: 0,
        count: 1,
        pages: 1
      }
    };
    expect(menuReducer(undefined, action)).toMatchObject(newState);
  });
});
