import {
  dashboardTypes
} from '../types';
import requestServices from '../../services/requestServices';
import paginationExtract from '../../utils/paginationExtract';


const baseUrl = '/api/v1/orders';


const getOrdersWithMealLinks = ({ limit = 10, offset = 0 } = {}) =>
  (dispatch) => {
    dispatch({ type: dashboardTypes.ORDER_DASHBOARD_REQUEST });

    return requestServices(`${baseUrl}?limit=${limit}&offset=${offset}`)
      .then(
        response =>
          dispatch({
            type: dashboardTypes.ORDER_DASHBOARD_HISTORY_SUCCESS,
            orders: response.data.data.rows,
            pagination: paginationExtract(response.data.data)
          }),
        error =>
          dispatch({
            type: dashboardTypes.ORDER_DASHBOARD_HISTORY_FAILURE,
            error: error.response.data.message
          })
      );
  };

const getOrdersWithMealLinksByDate
  = (date, { limit = 10, offset = 0 } = {}) => (dispatch) => {

    const url = date ? `${baseUrl}/date/${date}?limit=${limit}&offset=${offset}`
      : `${baseUrl}/date/?limit=${limit}&offset=${offset}`;

    dispatch({ type: dashboardTypes.ORDER_DASHBOARD_REQUEST });

    return requestServices(url)
      .then(
        response =>
          dispatch({
            type: dashboardTypes.ORDER_DASHBOARD_HISTORY_SUCCESS,
            orders: response.data.data.rows,
            pagination: paginationExtract(response.data.data)

          }),
        error =>
          dispatch({
            type: dashboardTypes.ORDER_DASHBOARD_HISTORY_FAILURE,
            error: error.response.data.message
          })

      );
  };

const getMealsInOrder
= (orderId, { offset = 0 } = {}) => (dispatch) => {
  const url = `${baseUrl}/${orderId}/meals?limit=5&offset=${offset}`;
  dispatch({ type: dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST });

  return requestServices(url)
    .then(
      response => dispatch({
        type: dashboardTypes.ORDER_MEALS_DASHBOARD_SUCCESS,
        orderMeals: response.data.data.rows[0].Meals,
        mealsPagination: paginationExtract(response.data.data)
      }),
      error =>
        dispatch({
          type: dashboardTypes.ORDER_MEALS_DASHBOARD_FAILURE,
          orderMealsError: error.response.data.message
        })
    );
};

const getOrderTotal = orderId => (dispatch) => {
  const url = `${baseUrl}/total/${orderId}`;
  dispatch({ type: dashboardTypes.ORDER_MEALS_DASHBOARD_REQUEST });
  return requestServices(url)
    .then(
      response => dispatch({
        type: dashboardTypes.ORDER_DASHBOARD_TOTAL_SUCCESS,
        total: response.data.data.revenue
      }),
      error =>
        dispatch({
          type: dashboardTypes.ORDER_MEALS_DASHBOARD_FAILURE,
          orderMealsError: error.response.data.message
        })
    );
};

const getDaysOrdersTotal = () => (dispatch) => {
  const url = `${baseUrl}/total/date`;
  dispatch({ type: dashboardTypes.ORDER_DASHBOARD_REQUEST });

  return requestServices(url)
    .then(
      response => dispatch({
        type: dashboardTypes.DASHBOARD_TOTAL_SUCCESS,
        total: response.data.data
      }),
      error =>
        dispatch({
          type: dashboardTypes.ORDER_DASHBOARD_FAILURE,
          error: error.response.data.message
        })

    );
};

export default {
  getOrdersWithMealLinks,
  getOrdersWithMealLinksByDate,
  getMealsInOrder,
  getDaysOrdersTotal,
  getOrderTotal
};
