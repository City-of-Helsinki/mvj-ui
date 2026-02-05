import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import { LoginProvider } from "hds-react";
import configureStore from "@/root/configureStore";
import AppRoutes from "@/root/routes";
import { loginProviderProperties } from "@/auth/constants";
import LandUseApp from "@/landUse/LandUseApp";

export const store = configureStore();

const container = document.getElementById("root");
const root = createRoot(container);

const LeaseReduxApp = () => (
  <Provider store={store}>
    <LoginProvider {...loginProviderProperties}>
      <AppRoutes />
    </LoginProvider>
  </Provider>
);

const LandUseWithLogin = () => (
  <LoginProvider {...loginProviderProperties}>
    <LandUseApp />
  </LoginProvider>
);

root.render(
  <BrowserRouter>
    <RouterRoutes>
      <Route path="/maankayttosopimukset/*" element={<LandUseWithLogin />} />
      <Route path="/*" element={<LeaseReduxApp />} />
    </RouterRoutes>
  </BrowserRouter>,
);
