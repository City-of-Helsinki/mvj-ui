import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginCallbackHandler, isHandlingLoginCallbackError } from "hds-react";
import type { OidcClientError, User } from "hds-react";
import { getRedirectUrlFromSessionStorage } from "@/landUse/utils/storage";
import { getRouteById, Routes } from "@/landUse/routes";

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();

  const onSuccess = (_user: User) => {
    navigate(getRedirectUrlFromSessionStorage() || getRouteById(Routes.LIST), {
      replace: true,
    });
  };

  const onError = (error: OidcClientError) => {
    // HDS can emit a known callback handling error which can be safely ignored.
    if (isHandlingLoginCallbackError(error)) {
      return;
    }
    console.error("Login Callback Error:", error);
  };

  return (
    <LoginCallbackHandler onError={onError} onSuccess={onSuccess}>
      <div />
    </LoginCallbackHandler>
  );
};

export default CallbackPage;
