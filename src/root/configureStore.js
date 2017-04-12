// @flow

import {applyMiddleware, compose, createStore} from 'redux';
import {browserHistory} from 'react-router';
import {routerMiddleware as createRouterMiddleware} from 'react-router-redux';
import createRootReducer from './createRootReducer';
import createSagaMiddleware from 'redux-saga';
import createRootSaga from './createRootSaga';

export default () => {
  const rootReducer = createRootReducer();
  const rootSaga = createRootSaga();
  const routerMiddleware = createRouterMiddleware(browserHistory);
  const sagaMiddleware = createSagaMiddleware();

  const enhancer = compose(
    applyMiddleware(sagaMiddleware, routerMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  const store = createStore(rootReducer, enhancer);

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    // $FlowFixMe
    module.hot.accept('./createRootReducer', () => {
      const nextRootReducer = require('./createRootReducer').default();
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
