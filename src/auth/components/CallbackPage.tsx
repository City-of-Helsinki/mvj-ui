import React from "react";
import { withRouter } from "react-router";
import { LoginCallbackHandler } from "hds-react";
import type { OidcClientError, User } from "hds-react";
import { getRedirectUrlFromSessionStorage } from "@/util/storage";
import { getRouteById, Routes } from "@/root/routes";

type Props = {
  history: Record<string, any>;
};

const CallbackPage = (props: Props) => {
  const onSuccess = (user: User) => {
    const { history } = props;
    history.push(getRedirectUrlFromSessionStorage() || getRouteById(Routes.LEASES));
  };
  const onError = (error: OidcClientError) => {
    console.error("Login Callback Error:", error);
  };

  return (
      <LoginCallbackHandler onError={onError} onSuccess={onSuccess}>
        <div></div>
      </LoginCallbackHandler>
  )
}

export default withRouter(CallbackPage);