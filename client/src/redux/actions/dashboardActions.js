import {
  dashboardTypes
} from '../types';
import requestServices from '../../services/requestServices';

const baseUrl = '/api/v1/orders';


const getOrdersWithMealLinksByDate = date => (dispatch) => {
  const url = date ? `${baseUrl}/date/${date}` : `${baseUrl}/date/`;
  dispatch({ type: dashboardTypes.ORDER_DASHBOARD_REQUEST });
  return requestServices(url)
    .then(
      response =>
        dispatch({
          type: dashboardTypes.ORDER_DASHBOARD_SUCCESS,
          orders: response.data.data
        }),
      error =>
        dispatch({
          type: dashboardTypes.ORDER_DASHBOARD_FAILURE,
          error: error.response.data.message
        })
    );
};
const getOrdersWithMealLinks = () => (dispatch) => {
  const url = baseUrl;
  dispatch({ type: dashboardTypes.ORDER_DASHBOARD_REQUEST });
  return requestServices(url)
    .then(
      response =>
        dispatch({
          type: dashboardTypes.ORDER_DASHBOARD_HISTORY_SUCCESS,
          orders: response.data.data
        }),
      error =>
        dispatch({
          type: dashboardTypes.ORDER_DASHBOARD_HISTORY_FAILURE,
          error: error.response.data.message
        })
    );
};
const getMealsInOrder = () => (dispatch) => {
  const url = baseUrl;
  dispatch({ type: dashboardTypes.ORDER_DASHBOARD_REQUEST });
  return requestServices(url)
    .then(
      response =>
        dispatch({
          type: dashboardTypes.ORDER_MEALS_DASHBOARD_SUCCESS,
          orders: response.data.data
        }),
      error =>
        dispatch({
          type: dashboardTypes.ORDER_MEALS_DASHBOARD_FAILURE,
          error: error.response.data.message
        })
    );
};


export default {
  getOrdersWithMealLinksByDate,
  getOrdersWithMealLinks,
  getMealsInOrder
};
