import { applyMiddleware, compose, createStore } from "redux";
import createRootReducer from "./createRootReducer";
import createSagaMiddleware from "redux-saga";
import createRootSaga from "./createRootSaga";

// needed so Typescript doesn't complain about the window object not having the __REDUX_DEVTOOLS_EXTENSION__ property
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof Function;
  }
}

export default () => {
  const rootReducer = createRootReducer();
  const rootSaga = createRootSaga();
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(
    applyMiddleware(sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f: Function) => f,
  );
  const store = createStore(rootReducer, enhancer);
  sagaMiddleware.run(rootSaga);

  return store;
};
