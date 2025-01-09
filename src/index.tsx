import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { LoginProvider } from "hds-react";
import configureStore, { history } from "@/root/configureStore";
import routes from "@/root/routes";
import { loginProviderProperties } from "@/auth/constants";

import "./polyfills";

export const store = configureStore();

const container = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <LoginProvider {...loginProviderProperties}>
      <ConnectedRouter history={history}>{routes}</ConnectedRouter>
    </LoginProvider>
  </Provider>,
  container,
);
