import {
  push
} from 'react-router-redux';
import {
  userTypes
} from '../types';
import requestServices from '../../services/requestServices';

const login = userData => (dispatch) => {
  dispatch({
    type: userTypes.LOGIN_REQUEST,
    user: {
      email: userData.email
    }
  });

  return requestServices('/api/v1/auth/login', 'post', userData)
    .then(
      (response) => {
        const user = response.data;
        if (user && user.token) {
          dispatch({
            type: userTypes.LOGIN_SUCCESS,
            user: user.data,
          });
          localStorage.setItem('token', JSON.stringify(user.token));
          if (user.data.isCaterer) {
            dispatch(push('/meals'));
          } else { dispatch(push('/orders')); }
        }
      },
      (error) => {
        dispatch({
          type: userTypes.LOGIN_FAILURE,
          error: error.response.data.message,
        });
      }
    );
};

const logout = () => {
  localStorage.removeItem('token');
  return {
    type: userTypes.LOGOUT
  };
};

const signUp = user => (dispatch) => {
  dispatch({
    type: userTypes.SIGNUP_REQUEST,
    user,
  });

  return requestServices('/api/v1/auth/signup', 'post', user)
    .then(
      (response) => {
        const userResults = response.data;
        if (userResults && userResults.token) {
          dispatch({
            type: userTypes.SIGNUP_SUCCESS,
            user: userResults.data,
          });
          dispatch({
            type: userTypes.LOGIN_SUCCESS,
            user: userResults.data,
          });
          localStorage.setItem('token', JSON.stringify(userResults.token));
          if (userResults.data.isCaterer) {
            dispatch(push('/meals'));
          } else { dispatch(push('/orders')); }
        }
      },
      (error) => {
        dispatch({
          type: userTypes.SIGNUP_FAILURE,
          error: error.response.data.message,
        });
      }
    );
};


export default {
  login,
  logout,
  signUp
};
