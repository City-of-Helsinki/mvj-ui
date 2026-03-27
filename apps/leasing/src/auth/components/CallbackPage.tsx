import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginCallbackHandler, isHandlingLoginCallbackError } from "hds-react";
import type { OidcClientError, User } from "hds-react";
import { getRedirectUrlFromSessionStorage } from "@/util/storage";
import { getRouteById, Routes } from "@/root/routes";

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const onSuccess = (user: User) => {
    navigate(getRedirectUrlFromSessionStorage() || getRouteById(Routes.LEASES));
  };
  const onError = (error: OidcClientError) => {
    // "HANDLING_LOGIN_CALLBACK cannot be handled by a callback" is a known error in HDS
    // https://hds.hel.fi/components/login/api/#logincallbackhandler
    if (isHandlingLoginCallbackError(error)) {
      return;
    }
    console.error("Login Callback Error:", error);
  };

  return (
    <LoginCallbackHandler onError={onError} onSuccess={onSuccess}>
      <div></div>
    </LoginCallbackHandler>
  );
};

export default CallbackPage;
