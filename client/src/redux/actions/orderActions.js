import {
  orderTypes
} from '../types';
import requestServices from '../../services/requestServices';
import paginationExtract from '../../utils/paginationExtract';

const baseUrl = '/api/v1/orders';


const getOrdersWithMealLinks = ({ limit = 8, offset = 0 } = {}) =>
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

const getOrdersWithMealLinksByDate = date => (dispatch) => {
  const url = date ? `${baseUrl}/date/${date}` : `${baseUrl}/date/`;
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
const getMealsInOrder = orderId => (dispatch) => {
  const url = `${baseUrl}/${orderId}/meals`;
  dispatch({ type: orderTypes.ORDER_REQUEST });
  return requestServices(url)
    .then(
      response =>
        dispatch({
          type: orderTypes.GET_ORDER_MEAL_SUCCESS,
          order: response.data.data.rows[0],
          mealPagination: paginationExtract(response.data.data)
        }),
      error =>
        dispatch({
          type: orderTypes.GET_ORDER_MEAL_FAILURE,
          error: error.response.data.message,
        })

    );
};

const postOrder = order => (dispatch) => {
  dispatch({ type: orderTypes.ORDER_REQUEST });

  return requestServices(baseUrl, 'post', order)
    .then(
      response =>
        dispatch({
          type: orderTypes.POST_ORDER_SUCCESS,
          order: response.data.data.rows[0],
          mealPagination: paginationExtract(response.data.data)

        }),
      error =>
        dispatch({
          type: orderTypes.ORDER_FAILURE,
          error: error.response.data.message,
        })

    );
};

const updateOrder = (order, orderId) => (dispatch) => {
  dispatch({ type: orderTypes.ORDER_REQUEST });

  return requestServices(`${baseUrl}/${orderId}`, 'put', order)
    .then(
      response =>
        dispatch({
          type: orderTypes.UPDATE_ORDER_SUCCESS,
          order: response.data.data.rows[0],
          mealPagination: paginationExtract(response.data.data)

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
  getMealsInOrder,
  postOrder,
  updateOrder
};
