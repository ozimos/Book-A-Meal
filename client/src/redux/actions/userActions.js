import {
  push
} from 'react-router-redux';
import {
  userTypes
} from '../types';
import requestServices from '../../services/requestServices';

const request = (user, actionType) => ({
  type: actionType,
  user
});
const success = (user, actionType) => ({
  type: actionType,
  user
});
const failure = (error, actionType) => ({
  type: actionType,
  error
});

const login = userData => (dispatch) => {
  dispatch(request({
    data: {
      email: userData.email
    }
  }, userTypes.LOGIN_REQUEST));

  return requestServices('/api/v1/auth/login', 'post', userData)
    .then(
      (response) => {
        const user = response.data;
        if (user && user.token) {
          dispatch(success(user, userTypes.LOGIN_SUCCESS));
          localStorage.setItem('user', JSON.stringify(user));
          if (user.data.isCaterer) {
            dispatch(push('/meals'));
          } else { dispatch(push('/orders')); }
        }
      },
      (error) => {
        dispatch(failure(
          error.response.data.message,
          userTypes.LOGIN_FAILURE
        ));
      }
    );
};

const logout = () => {
  localStorage.removeItem('user');
  return {
    type: userTypes.LOGOUT
  };
};

const signUp = user => (dispatch) => {
  dispatch(request(user, userTypes.SIGNUP_REQUEST));

  return requestServices('/api/v1/auth/signup', 'post', user)
    .then(
      (response) => {
        const userResults = response.data;
        if (userResults && userResults.token) {
          dispatch(success(userResults, userTypes.SIGNUP_SUCCESS));
          dispatch(success(userResults, userTypes.LOGIN_SUCCESS));
          localStorage.setItem('user', JSON.stringify(userResults));
          if (userResults.data.isCaterer) {
            dispatch(push('/meals'));
          } else { dispatch(push('/orders')); }
        }
      },
      (error) => {
        dispatch(failure(
          error.response.data.message,
          userTypes.SIGNUP_FAILURE
        ));
      }
    );
};

const getAll = () => (dispatch) => {
  dispatch(request(null, userTypes.GETALL_REQUEST));

  return requestServices('/api/v1/auth/all')
    .then(
      response => dispatch(success(
        response.data.data,
        userTypes.GETALL_SUCCESS
      )),
      error => dispatch(failure(
        error.response.data.message,
        userTypes.GETALL_FAILURE
      ))
    );
};


export default {
  login,
  logout,
  signUp,
  getAll,
};
