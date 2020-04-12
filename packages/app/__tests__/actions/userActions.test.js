import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import userActions from '../../src/redux/actions/userActions';
import userTypes from '../../src/redux/types/userTypes';
import { catererDetails, userInput } from '../__mocks__/userDataMock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

const customerDetails = { ...catererDetails };
customerDetails.data = { ...catererDetails.data };
customerDetails.data.isCaterer = false;

describe('user actions', () => {

  beforeEach(() => {
    moxios.install();
    store.clearActions();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it(
    'dispatches LOGIN_REQUEST and LOGIN_SUCCESS on successful caterer login',
    () => {

      moxios.stubRequest('/api/v1/auth/login', {
        status: 200,
        response: catererDetails
      });

      const expectedActions = [
        { type: userTypes.LOGIN_REQUEST, user: userInput.data },
        { type: userTypes.LOGIN_SUCCESS, user: catererDetails.data },
        { type: '@@router/CALL_HISTORY_METHOD',
          payload: { args: ['/meals'], method: 'push' } }
      ];

      return store.dispatch(userActions.login(userInput.data))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
        });
    }
  );
  it(
    'dispatches LOGIN_REQUEST and LOGIN_SUCCESS on successful customer login',
    () => {

      moxios.stubRequest('/api/v1/auth/login', {
        status: 200,
        response: customerDetails
      });

      const expectedActions = [
        { type: userTypes.LOGIN_REQUEST, user: userInput.data },
        { type: userTypes.LOGIN_SUCCESS, user: customerDetails.data },
        { type: '@@router/CALL_HISTORY_METHOD',
          payload: { args: ['/orders'], method: 'push' } }
      ];

      return store.dispatch(userActions.login(userInput.data))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
        });
    }
  );
  it(
    'dispatches LOGIN_REQUEST and LOGIN_FAILURE on failing to login user',
    () => {

      moxios.stubRequest('/api/v1/auth/login', {
        status: 400,
        response: { message: 'problem' }
      });

      const expectedActions = [
        { type: userTypes.LOGIN_REQUEST, user: userInput.data },
        { type: userTypes.LOGIN_FAILURE, error: 'problem' },
      ];

      return store.dispatch(userActions.login(userInput.data))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
        });
    }
  );
  it(
    'dispatches SIGNUP_REQUEST and SIGNUP_SUCCESS' +
    ' on successful caterer signup',
    () => {

      moxios.stubRequest('/api/v1/auth/signup', {
        status: 200,
        response: catererDetails
      });

      const expectedActions = [
        { type: userTypes.SIGNUP_REQUEST, user: userInput.data },
        { type: userTypes.SIGNUP_SUCCESS, user: catererDetails.data },
        { type: userTypes.LOGIN_SUCCESS, user: catererDetails.data },
        { type: '@@router/CALL_HISTORY_METHOD',
          payload: { args: ['/meals'], method: 'push' } }
      ];

      return store.dispatch(userActions.signUp(userInput.data))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
        });
    }
  );
  it(
    'dispatches SIGNUP_REQUEST and SIGNUP_SUCCESS' +
    ' on successful customer signup',
    () => {

      moxios.stubRequest('/api/v1/auth/signup', {
        status: 200,
        response: customerDetails
      });

      const expectedActions = [
        { type: userTypes.SIGNUP_REQUEST, user: userInput.data },
        { type: userTypes.SIGNUP_SUCCESS, user: customerDetails.data },
        { type: userTypes.LOGIN_SUCCESS, user: customerDetails.data },
        { type: '@@router/CALL_HISTORY_METHOD',
          payload: { args: ['/orders'], method: 'push' } }
      ];

      return store.dispatch(userActions.signUp(userInput.data))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
        });
    }
  );

  it(
    'dispatches SIGNUP_REQUEST and SIGNUP_FAILURE on failing to signup user',
    () => {

      moxios.stubRequest('/api/v1/auth/signup', {
        status: 400,
        response: { message: 'problem' }
      });

      const expectedActions = [
        { type: userTypes.SIGNUP_REQUEST, user: userInput.data },
        { type: userTypes.SIGNUP_FAILURE, error: 'problem' },
      ];

      return store.dispatch(userActions.signUp(userInput.data))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
        });
    }
  );
});
