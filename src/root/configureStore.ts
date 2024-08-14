import { applyMiddleware, compose, createStore } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware as createRouterMiddleware } from "connected-react-router";
import createRootReducer from "./createRootReducer";
import createSagaMiddleware from "redux-saga";
import createRootSaga from "./createRootSaga";
import { loadUser } from "redux-oidc";
import userManager from "@/auth/util/user-manager";
export const history = createBrowserHistory();

// needed so Typescript doesn't complain about the window object not having the __REDUX_DEVTOOLS_EXTENSION__ property
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof Function;
  }
}

export default (() => {
  const rootReducer = createRootReducer(history);
  const rootSaga = createRootSaga();
  const routerMiddleware = createRouterMiddleware(history);
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(applyMiddleware(sagaMiddleware, routerMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);
  const store = createStore(rootReducer, enhancer);
  loadUser(store, userManager);
  sagaMiddleware.run(rootSaga);

  return store;
});