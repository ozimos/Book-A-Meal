import {
  applyMiddleware,
  createStore,
  compose
} from 'redux';
import thunk from 'redux-thunk';

import {
  routerMiddleware
} from 'react-router-redux';
import {
  createLogger
} from 'redux-logger';
import rootReducer from './redux/reducers';
import history from './history';

const loggerMiddleware = createLogger();
const middlewares = [routerMiddleware(history), thunk];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware);
}

const appliedMiddleware = applyMiddleware(...middlewares);
const store = createStore(rootReducer, compose(
  appliedMiddleware,
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;

