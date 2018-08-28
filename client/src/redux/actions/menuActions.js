import {
  menuTypes
} from '../types';
import requestServices from '../../services/requestServices';
import paginationExtract from '../../utils/paginationExtract';


const getMenu = ({ limit = 8, offset = 0 } = {}) => (dispatch) => {
  dispatch({ type: menuTypes.MENU_REQUEST });
  return requestServices(`/api/v1/menu?limit=${limit}&offset=${offset}`)
    .then(
      response =>
        dispatch({
          type: menuTypes.GET_MENU_SUCCESS,
          menu: response.data.data.rows[0].Meals,
          menuDetails: { id: response.data.data.rows[0].id,
            date: response.data.data.rows[0].menuDate },
          pagination: paginationExtract(response.data.data)
        }),
      error =>
        dispatch({
          type: menuTypes.MENU_FAILURE,
          error: error.response.data.message
        })
    );
};


const postMenu = menu => (dispatch) => {
  dispatch({ type: menuTypes.MENU_REQUEST });

  return requestServices('/api/v1/menu', 'post', menu)
    .then(
      response => dispatch({
        type: menuTypes.POST_MENU_SUCCESS,
        menu: response.data.data.rows[0].Meals,
        menuDetails: { id: response.data.data.rows[0].id,
          date: response.data.data.rows[0].menuDate },
        pagination: paginationExtract(response.data.data)
      }),
      error => dispatch({
        type: menuTypes.MENU_FAILURE,
        error: error.response.data.message
      })
    );
};


export default {
  getMenu,
  postMenu,
};
