import {
  userTypes
} from '../types';

export default (state = {}, action) => {
  switch (action.type) {

    case userTypes.SIGNUP_REQUEST:
      return {
        registering: true
      };

    case userTypes.SIGNUP_SUCCESS:
      return {};

    case userTypes.SIGNUP_FAILURE:
      return {
        signupError: action.error
      };

    default:
      return state;
  }
};
