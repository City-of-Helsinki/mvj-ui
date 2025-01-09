import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useApiTokens,
  useOidcClient,
  useApiTokensClientTracking,
  isApiTokensUpdatedSignal,
  isApiTokensRemovedSignal,
  isApiTokensRenewalStartedSignal,
  useAuthenticatedUser,
} from "hds-react";
import { setRedirectUrlToSessionStorage } from "@/util/storage";
import { Routes, getRouteById } from "@/root/routes";
import {
  clearApiToken,
  clearUser,
  userFound,
  receiveApiToken,
} from "./actions";

const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const {
    login: oidcLogin,
    logout: oidcLogout,
    isRenewing: oidcIsRenewing,
  } = useOidcClient();
  const authenticatedUser = useAuthenticatedUser();
  const dispatch = useDispatch();
  const [apiTokensClientSignal, apiTokensClientSignalReset, apiTokensClient] =
    useApiTokensClientTracking();
  const { getStoredApiTokens } = useApiTokens();

  const setLoggedInIfApiTokenExists = useCallback(() => {
    const [_error, apiToken] = getStoredApiTokens();
    if (apiToken) {
      dispatch(receiveApiToken(apiToken));
      setLoggedIn(true);
    }
  }, [getStoredApiTokens, dispatch]);

  useEffect(() => {
    if (authenticatedUser) {
      dispatch(userFound(authenticatedUser));
      setLoggedInIfApiTokenExists();
    } else {
      dispatch(clearApiToken());
      dispatch(clearUser());
      setLoggedIn(false);
    }
  }, [authenticatedUser, dispatch, setLoggedInIfApiTokenExists]);

  useEffect(() => {
    if (isApiTokensUpdatedSignal(apiTokensClientSignal)) {
      setLoggedInIfApiTokenExists();
    }
    if (isApiTokensRemovedSignal(apiTokensClientSignal)) {
      dispatch(clearApiToken());
    }
    if (isApiTokensRenewalStartedSignal(apiTokensClientSignal)) {
      // Placeholder for future use
    }

    return apiTokensClientSignalReset;
  }, [apiTokensClientSignal, dispatch]);

  const determineRedirectPath = (redirectPath: string): string => {
    if (!redirectPath || redirectPath.startsWith("/callback")) {
      return getRouteById(Routes.LEASES);
    }
    return redirectPath;
  };

  const login = useCallback(
    (redirectPath: string) => {
      // avoid setting redirectPath to `/callback`, which could happen if there was an error during login
      // and user returns to the callback url with error, and then tries to log in again
      const finalRedirectPath = determineRedirectPath(redirectPath);
      setRedirectUrlToSessionStorage(finalRedirectPath);
      oidcLogin();
    },
    [oidcLogin],
  );

  const logout = useCallback(() => {
    dispatch(clearApiToken());
    dispatch(clearUser());
    setLoggedIn(false);
    oidcLogout();
  }, [oidcLogout, dispatch]);

  const isRenewing = () => {
    return oidcIsRenewing() || apiTokensClient.isRenewing();
  };

  return {
    loggedIn,
    authenticatedUser,
    login,
    logout,
    isRenewing,
    setLoggedInIfApiTokenExists,
  };
};

export default useAuth;
