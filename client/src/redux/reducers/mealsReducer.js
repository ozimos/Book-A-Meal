import {
  mealTypes
} from '../types';

const initialState = {
  connecting: false,
  mealError: null,
  meals: [],
  pagination: {
    limit: 10,
    offset: 0,
    count: 1,
    pages: 1 }
};

export default (state = initialState, action) => {
  switch (action.type) {

    case mealTypes.MEALS_REQUEST:
      return {
        ...state,
        connecting: true,
        mealError: null
      };

    case mealTypes.ALL_MEALS_SUCCESS:
      return {
        ...state,
        connecting: false,
        meals: action.meals,
        pagination: action.pagination
      };

    case mealTypes.MEALS_FAILURE:
      return {
        ...state,
        connecting: false,
        mealError: action.error
      };

    case mealTypes.CREATE_MEAL_SUCCESS:
      return {
        ...state,
        connecting: false,
        meals: [...state.meals, action.meal],
      };

    case mealTypes.UPDATE_MEAL_SUCCESS:
      return {
        ...state,
        connecting: false,
        meals: state.meals.map((meal) => {
          if (meal.id === action.meal.id) {
            return action.meal;
          }
          return meal;
        })
      };

    case mealTypes.DELETE_MEAL_SUCCESS:
      return {
        ...state,
        connecting: false,
        meals: state.meals.filter(meal => meal.id !== action.id),
      };

    default:
      return state;
  }
};
