import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "hds-react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import LandUseApp from "@/landUse/LandUseApp";
import { loginProviderProperties } from "@/landUse/auth/constants";
import { seedLandUseDb } from "@/landUse/api/landUseSeed";
import { createLandUsePersister } from "@/landUse/api/landUseQueryPersister";
import "@/landUse/landUse.scss"; // Only import landUse styles
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });

const LandUseBootstrap: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    seedLandUseDb()
      .catch((error) => {
        console.error("Failed to seed land use data", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
};

const container = document.getElementById("root");
const root = createRoot(container);
const persister = createLandUsePersister();
const queryClient = createQueryClient();

root.render(
  <BrowserRouter>
    <LoginProvider {...loginProviderProperties}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <LandUseBootstrap>
          <LandUseApp />
        </LandUseBootstrap>
      </PersistQueryClientProvider>
    </LoginProvider>
  </BrowserRouter>,
);
