import signupReducer from '../../src/redux/reducers/signupReducer';
import { userTypes } from '../../src/redux/types';


describe('signupReducer', () => {

  const initialState = {};

  it('should return the initial state for unknown action type', () => {
    expect(signupReducer(undefined, {})).toEqual(initialState);
  });

  it('should add the registering status to state on attempted signup', () => {
    const newState = { registering: true };
    const action = { type: userTypes.SIGNUP_REQUEST };
    expect(signupReducer(undefined, action)).toMatchObject(newState);
  });

  it(
    'should remove the registering status from state on successful signup',
    () => {
      const newState = {};
      const action = { type: userTypes.SIGNUP_SUCCESS };
      expect(signupReducer(undefined, action)).toMatchObject(newState);
    }
  );

  it('should add signup error to state', () => {
    const newState = {
      signupError: { password: 'wrong password' }
    };
    const action = {
      type: userTypes.SIGNUP_FAILURE, error: { password: 'wrong password' } };

    expect(signupReducer(undefined, action)).toMatchObject(newState);
  });
});
