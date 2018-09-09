import {
  mealTypes
} from '../types';
import requestServices from '../../services/requestServices';
import paginationExtract from '../../utils/paginationExtract';

const getAllMeals = ({ limit = 8, offset = 0 } = {}) => (dispatch) => {
  dispatch({ type: mealTypes.MEALS_REQUEST });

  return requestServices(`/api/v1/meals?limit=${limit}&offset=${offset}`)
    .then(
      response =>
        dispatch({
          type: mealTypes.ALL_MEALS_SUCCESS,
          meals: response.data.data.rows,
          pagination: paginationExtract(response.data.data)
        }),
      error =>
        dispatch({ error: error.response.data.message,
          type: mealTypes.MEALS_FAILURE })
    );
};

const createMeal = meal => (dispatch) => {
  dispatch({ type: mealTypes.MEALS_REQUEST });

  return requestServices('/api/v1/meals', 'post', meal)
    .then(
      response =>
        dispatch({
          type: mealTypes.CREATE_MEAL_SUCCESS,
          meal: response.data.data
        }),
      error =>
        dispatch({ error: error.response.data.message,
          type: mealTypes.MEALS_FAILURE })

    );
};

const updateMeal = (meal, mealId) => (dispatch) => {
  dispatch({ type: mealTypes.MEALS_REQUEST });

  return requestServices(`/api/v1/meals/${mealId}`, 'put', meal)
    .then(
      response =>
        dispatch({
          type: mealTypes.UPDATE_MEAL_SUCCESS,
          meal: response.data.data
        }),
      error => dispatch({
        error: error.response.data.message,
        type: mealTypes.MEALS_FAILURE
      })
    );
};

const deleteMeal = mealId => (dispatch) => {
  dispatch({ type: mealTypes.MEALS_REQUEST });

  return requestServices(`/api/v1/meals/${mealId}`, 'delete')
    .then(
      (response) => {
        if (response.data.data) {
          return dispatch({
            type: mealTypes.DELETE_MEAL_SUCCESS,
            id: mealId
          });
        }
      },
      error => dispatch({
        error: error.response.data.message,
        type: mealTypes.MEALS_FAILURE
      })
    );
};

export default {
  getAllMeals,
  createMeal,
  updateMeal,
  deleteMeal
};
