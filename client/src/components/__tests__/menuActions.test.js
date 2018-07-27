import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import menuActions from '../../redux/actions/menuActions';
import menuTypes from '../../redux/types/menuTypes';
import menu from '../mocks/menuDataMock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});
describe('meal async actions', () => {
  beforeEach(() => {
    moxios.install();
    store.clearActions();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('dispatches MENU_REQUEST and GET_MENU_SUCCESS on successfully fetching menu', () => {

    moxios.stubRequest('/api/v1/menu', {
      status: 200,
      response: menu
    });
    const expectedActions = [
      { type: menuTypes.MENU_REQUEST },
      { type: menuTypes.GET_MENU_SUCCESS, menu: menu.data },
    ];
    return store.dispatch(menuActions.getMenu())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });
  it('dispatches MENU_REQUEST and MENU_FAILURE on failing creating menu', () => {

    moxios.stubRequest('/api/v1/menu', {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: menuTypes.MENU_REQUEST },
      { type: menuTypes.MENU_FAILURE, error: 'problem' },
    ];
    return store.dispatch(menuActions.getMenu())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });
  it('dispatches MENU_REQUEST and POST_MENU_SUCCESS on successfully creating menu', () => {

    moxios.stubRequest('/api/v1/menu', {
      status: 200,
      response: menu
    });
    const expectedActions = [
      { type: menuTypes.MENU_REQUEST },
      { type: menuTypes.POST_MENU_SUCCESS, menu: menu.data },
    ];
    return store.dispatch(menuActions.postMenu())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });
  it('dispatches MENU_REQUEST and MENU_FAILURE on failing creating menu', () => {

    moxios.stubRequest('/api/v1/menu', {
      status: 400,
      response: { message: 'problem' }
    });
    const expectedActions = [
      { type: menuTypes.MENU_REQUEST },
      { type: menuTypes.MENU_FAILURE, error: 'problem' },
    ];
    return store.dispatch(menuActions.postMenu())
      .then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
      });
  });
});