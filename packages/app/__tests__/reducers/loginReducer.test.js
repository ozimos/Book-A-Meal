import jwt from 'jsonwebtoken';
import loginReducer from '../../src/redux/reducers/loginReducer';
import { userTypes } from '../../src/redux/types';
import { catererDetails } from '../__mocks__/userDataMock';

const payload = { isCaterer: true, firstName: 'bla', userId: 'userId' };
const catererToken = jwt.sign(payload, 'secret', { expiresIn: '2h' });

describe('loginReducer', () => {

  const initialState = {
    authenticated: false,
    user: {}
  };

  it('should return the initial state for unknown action type', () => {
    expect(loginReducer(undefined, {})).toEqual(initialState);
  });

  it('should add user name for login request', () => {
    localStorage.setItem('token', JSON.stringify(catererToken));

    const newState = {
      loggingIn: true,
      user: { email: catererDetails.data.email }
    };
    const action = { type: userTypes.LOGIN_REQUEST,
      user: { email: catererDetails.data.email } };
    expect(loginReducer(undefined, action)).toMatchObject(newState);
  });

  it('should log the user in', () => {
    const newState = {
      authenticated: true,
      user: {}
    };
    const action = { type: userTypes.LOGIN_SUCCESS };
    expect(loginReducer(undefined, action)).toMatchObject(newState);
  });

  it('should remove user from state on logout', () => {
    const newState = { authenticated: false, user: {} };
    const action = { type: userTypes.LOGOUT };
    expect(loginReducer(undefined, action)).toMatchObject(newState);
  });

  it('should return error on login failure', () => {
    const newState = {
      loginError: { password: 'wrong password' }
    };
    const action = {
      type: userTypes.LOGIN_FAILURE, error: { password: 'wrong password' } };

    expect(loginReducer(undefined, action)).toMatchObject(newState);
  });
});
