import React, { useState } from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import { useOidcClient, useAuthenticatedUser } from "hds-react";
import LoginPage from "@/auth/components/LoginPage";
import LandUseListPage from "@/landUse/components/LandUseListPage";
import LandUseDetailPage from "@/landUse/components/LandUseDetailPage";
import LandUseHeader from "@/landUse/components/LandUseHeader";
import "@/landUse/landUse.scss";

const LandUseApp: React.FC = () => {
  const { login } = useOidcClient();
  const authenticatedUser = useAuthenticatedUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    login();
  };

  if (!authenticatedUser) {
    return (
      <div className="landuse-app">
        <LoginPage buttonDisabled={isLoggingIn} onLoginClick={handleLogin} />
      </div>
    );
  }

  return (
    <div className="landuse-app">
      <LandUseHeader />
      <RouterRoutes>
        <Route index element={<LandUseListPage />} />
        <Route path=":id" element={<LandUseDetailPage />} />
      </RouterRoutes>
    </div>
  );
};

export default LandUseApp;
