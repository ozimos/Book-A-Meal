import signupReducer from '../../src/redux/reducers/signupReducer';
import { userTypes } from '../../src/redux/types';


describe('signupReducer', () => {

  const initialState = {};

  it('should return the initial state for unknown action type', () => {
    expect(signupReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SIGNUP_REQUEST', () => {
    const newState = { registering: true };
    const action = { type: userTypes.SIGNUP_REQUEST };
    expect(signupReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle SIGNUP_SUCCESS', () => {
    const newState = {};
    const action = { type: userTypes.SIGNUP_SUCCESS };
    expect(signupReducer(undefined, action)).toMatchObject(newState);
  });

  it('should handle SIGNUP_FAILURE', () => {
    const newState = {
      signupError: { password: 'wrong password' }
    };
    const action = {
      type: userTypes.SIGNUP_FAILURE, error: { password: 'wrong password' } };

    expect(signupReducer(undefined, action)).toMatchObject(newState);
  });
});
