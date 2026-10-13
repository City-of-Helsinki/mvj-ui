import React from "react";
import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { LoginProvider } from "hds-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandUseApp from "@/landUse/LandUseApp";
import { loginProviderProperties } from "@/landUse/auth/constants";
import "@/landUse/landUse.scss"; // Only import landUse styles
import { LANDUSE_BASE_PATH } from "./../../constants";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });

const container = document.getElementById("root");
const root = createRoot(container);
const queryClient = createQueryClient();

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
    <BrowserRouter basename={LANDUSE_BASE_PATH}>
      <LoginProvider {...loginProviderProperties}>
        <QueryClientProvider client={queryClient}>
          <LandUseApp />
        </QueryClientProvider>
      </LoginProvider>
    </BrowserRouter>
  </Sentry.ErrorBoundary>,
);
