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
  const { login: oidcLogin, logout: oidcLogout } = useOidcClient();
  const authenticatedUser = useAuthenticatedUser();
  const dispatch = useDispatch();
  const [apiTokensClientSignal, apiTokensClientSignalReset] =
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
  }, [authenticatedUser, setLoggedInIfApiTokenExists, dispatch]);

  useEffect(() => {
    // Signal call order
    // 1.
    if (isApiTokensRemovedSignal(apiTokensClientSignal)) {
      // Placeholder for future use
    }
    // 2.
    if (isApiTokensRenewalStartedSignal(apiTokensClientSignal)) {
      // Placeholder for future use
    }
    // 3.
    if (isApiTokensUpdatedSignal(apiTokensClientSignal)) {
      setLoggedInIfApiTokenExists();
    }

    return apiTokensClientSignalReset;
  }, [apiTokensClientSignal, setLoggedInIfApiTokenExists, dispatch]);

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

  return {
    loggedIn,
    authenticatedUser,
    login,
    logout,
    setLoggedInIfApiTokenExists,
  };
};

export default useAuth;
