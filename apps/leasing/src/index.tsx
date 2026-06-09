import React from "react";
import * as Sentry from "@sentry/react";
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
  <Sentry.ErrorBoundary
    fallback={
      <p>
        Järjestelmässä tapahtui odottamaton virhe. Ole hyvä ja lataa sivu
        uudelleen.
      </p>
    }
    showDialog // Shows Sentry's report dialog
  >
    <Provider store={store}>
      <LoginProvider {...loginProviderProperties}>
        <BrowserRouter>{routes}</BrowserRouter>
      </LoginProvider>
    </Provider>
  </Sentry.ErrorBoundary>,
);
