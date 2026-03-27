import React, { useState } from "react";
import {
  Navigate,
  Routes as RouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import { useOidcClient, useAuthenticatedUser } from "hds-react";
import LoginPage from "@/landUse/auth/LoginPage";
import { setRedirectUrlToSessionStorage } from "@/landUse/utils/storage";
import LandUseListPage from "@/landUse/components/LandUseListPage";
import LandUseDetailPage from "@/landUse/components/LandUseDetailPage";
import LandUseHeader from "@/landUse/components/LandUseHeader";
import CallbackPage from "@/landUse/auth/CallbackPage";
import { getRouteById, Routes } from "@/landUse/routes";
import "@/landUse/landUse.scss";

const LandUseApp: React.FC = () => {
  const { login } = useOidcClient();
  const authenticatedUser = useAuthenticatedUser();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);

    const redirectPath =
      location.pathname === getRouteById(Routes.CALLBACK)
        ? getRouteById(Routes.LIST)
        : `${location.pathname}${location.search}${location.hash}`;

    setRedirectUrlToSessionStorage(redirectPath);
    login();
  };

  return (
    <div className="landuse-app">
      {authenticatedUser ? <LandUseHeader /> : null}
      <RouterRoutes>
        <Route
          path={getRouteById(Routes.CALLBACK)}
          element={<CallbackPage />}
        />
        {authenticatedUser ? (
          <>
            <Route
              path={getRouteById(Routes.LIST)}
              element={<LandUseListPage />}
            />
            <Route
              path={getRouteById(Routes.DETAIL)}
              element={<LandUseDetailPage />}
            />
            <Route
              path="*"
              element={<Navigate to={getRouteById(Routes.LIST)} replace />}
            />
          </>
        ) : (
          <Route
            path="*"
            element={
              <LoginPage
                buttonDisabled={isLoggingIn}
                onLoginClick={handleLogin}
              />
            }
          />
        )}
      </RouterRoutes>
    </div>
  );
};

export default LandUseApp;
