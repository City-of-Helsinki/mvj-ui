import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "hds-react";
import configureStore from "@/root/configureStore";
import routes from "@/root/routes";
import { loginProviderProperties } from "@/auth/constants";

export const store = configureStore();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <LoginProvider {...loginProviderProperties}>
      <BrowserRouter>{routes}</BrowserRouter>
    </LoginProvider>
  </Provider>,
);
