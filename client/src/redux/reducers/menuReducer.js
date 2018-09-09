import {
  menuTypes
} from '../types';

export const initialMenuState = {
  connecting: false,
  menuError: null,
  menu: [],
  pagination: {
    limit: 10,
    offset: 0,
    count: 1,
    pages: 1 }
};

export default (state = initialMenuState, action) => {
  switch (action.type) {

    case menuTypes.MENU_REQUEST:
      return {
        ...state,
        connecting: true,
        menuError: null
      };

    case menuTypes.GET_MENU_SUCCESS:
      return {
        ...state,
        connecting: false,
        menu: action.menu,
        pagination: action.pagination
      };

    case menuTypes.MENU_FAILURE:
      return {
        ...state,
        connecting: false,
        menuError: action.error
      };

    case menuTypes.POST_MENU_SUCCESS:
      return {
        ...state,
        connecting: false,
        menu: action.menu,
        pagination: action.pagination
      };

    default:
      return state;
  }
};
