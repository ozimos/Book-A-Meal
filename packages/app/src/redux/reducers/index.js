import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import mealsReducer from './mealsReducer';
import menuReducer from './menuReducer';
import orderReducer from './orderReducer';
import dashboardReducer from './dashboardReducer';

const rootReducer = combineReducers({
  router: routerReducer,
  loginReducer,
  signupReducer,
  mealsReducer,
  menuReducer,
  orderReducer,
  dashboardReducer
});

export default rootReducer;
