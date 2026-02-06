import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "hds-react";
import LandUseApp from "@/landUse/LandUseApp";
import { loginProviderProperties } from "@/auth/constants";
import "@/landUse/landUse.scss"; // Only import landUse styles

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter basename="/maankayttosopimukset">
    <LoginProvider {...loginProviderProperties}>
      <LandUseApp />
    </LoginProvider>
  </BrowserRouter>,
);
