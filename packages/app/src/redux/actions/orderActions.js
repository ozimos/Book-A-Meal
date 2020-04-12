import {
  orderTypes
} from '../types';
import requestServices from '../../services/requestServices';
import paginationExtract from '../../utils/paginationExtract';

const baseUrl = '/api/v1/orders';


const getOrdersWithMealLinks = ({ limit = 10, offset = 0 } = {}) =>
  (dispatch) => {
    dispatch({ type: orderTypes.ORDER_REQUEST });

    return requestServices(`${baseUrl}?limit=${limit}&offset=${offset}`)
      .then(
        response =>
          dispatch({
            type: orderTypes.GET_ORDER_ALL_SUCCESS,
            orders: response.data.data.rows,
            pagination: paginationExtract(response.data.data)
          }),
        error =>
          dispatch({
            type: orderTypes.ORDER_FAILURE,
            error: error.response.data.message
          })
      );
  };

const getOrdersWithMealLinksByDate
  = (date, { limit = 10, offset = 0 } = {}) => (dispatch) => {

    const url = date ? `${baseUrl}/date/${date}?limit=${limit}&offset=${offset}`
      : `${baseUrl}/date/?limit=${limit}&offset=${offset}`;

    dispatch({ type: orderTypes.ORDER_REQUEST });

    return requestServices(url)
      .then(
        response =>
          dispatch({
            type: orderTypes.GET_ORDER_ALL_SUCCESS,
            orders: response.data.data.rows,
            pagination: paginationExtract(response.data.data)

          }),
        error =>
          dispatch({
            type: orderTypes.ORDER_FAILURE,
            error: error.response.data.message
          })

      );
  };

const getMealsInOrder =
(orderId, { offset = 0 } = {}) => (dispatch) => {
  const url = `${baseUrl}/${orderId}/meals?limit=5&offset=${offset}`;
  dispatch({ type: orderTypes.ORDER_MEALS_REQUEST });
  return requestServices(url)
    .then(
      response => dispatch({
        type: orderTypes.GET_ORDER_MEAL_SUCCESS,
        orderMeals: response.data.data.rows[0].Meals,
        mealsPagination: paginationExtract(response.data.data),
      }),
      error =>
        dispatch({
          type: orderTypes.GET_ORDER_MEAL_FAILURE,
          orderMealsError: error.response.data.message
        })

    );
};

const getOrderTotal = orderId => (dispatch) => {
  const url = `${baseUrl}/total/${orderId}`;
  dispatch({ type: orderTypes.ORDER_MEALS_REQUEST });
  return requestServices(url)
    .then(
      response => dispatch({
        type: orderTypes.GET_ORDER_TOTAL_SUCCESS,
        total: response.data.data.revenue
      }),
      error =>
        dispatch({
          type: orderTypes.GET_ORDER_MEAL_FAILURE,
          orderMealsError: error.response.data.message
        })

    );
};
const postOrder = order => (dispatch) => {
  dispatch({ type: orderTypes.ORDER_REQUEST });

  return requestServices(baseUrl, 'post', order)
    .then(
      response => dispatch({
        type: orderTypes.POST_ORDER_SUCCESS,
        orders: response.data.data.rows,
        pagination: paginationExtract(response.data.data)
      }),
      error =>
        dispatch({
          type: orderTypes.ORDER_FAILURE,
          error: error.response.data.message,
        })

    );
};

const getOrderForUpdate = orderId => (dispatch) => {
  dispatch({ type: orderTypes.ORDER_MEALS_REQUEST });

  return requestServices(`${baseUrl}/${orderId}`)
    .then(
      response => dispatch({
        type: orderTypes.GET_ORDER_MEAL_EDIT_SUCCESS,
        orderEditMeals: response.data.data,
      }),
      error =>
        dispatch({
          type: orderTypes.GET_ORDER_MEAL_FAILURE,
          error: error.response.data.message
        })

    );
};
const updateOrder = (order, orderId) => (dispatch) => {
  dispatch({ type: orderTypes.ORDER_REQUEST });

  return requestServices(`${baseUrl}/${orderId}`, 'put', order)
    .then(
      response => dispatch({
        type: orderTypes.UPDATE_ORDER_SUCCESS,
        orders: response.data.data.rows,
        pagination: paginationExtract(response.data.data)
      }),
      error =>
        dispatch({
          type: orderTypes.ORDER_FAILURE,
          error: error.response.data.message
        })

    );
};
const deleteOrder = orderId => (dispatch) => {
  dispatch({ type: orderTypes.ORDER_REQUEST });

  return requestServices(`${baseUrl}/${orderId}`, 'delete')
    .then(
      response => dispatch({
        type: orderTypes.DELETE_ORDER_SUCCESS,
        orders: response.data.data.rows,
        pagination: paginationExtract(response.data.data)
      }),
      error =>
        dispatch({
          type: orderTypes.ORDER_FAILURE,
          error: error.response.data.message
        })

    );
};

export default {
  getOrdersWithMealLinks,
  getOrdersWithMealLinksByDate,
  getOrderForUpdate,
  getMealsInOrder,
  getOrderTotal,
  postOrder,
  updateOrder,
  deleteOrder
};
