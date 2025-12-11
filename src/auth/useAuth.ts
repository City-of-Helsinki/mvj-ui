import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { getApiToken, getLoggedInUser } from "./selectors";
import { apiTokenKeyName } from "@/auth/constants";

const useAuth = () => {
  const { login: oidcLogin, logout: oidcLogout } = useOidcClient();
  const authenticatedUser = useAuthenticatedUser();
  const dispatch = useDispatch();
  const [apiTokensClientSignal, apiTokensClientSignalReset] =
    useApiTokensClientTracking();
  const { getStoredApiTokens } = useApiTokens();

  const reduxUser = useSelector(getLoggedInUser);
  const reduxApiToken = useSelector(getApiToken);

  // Sync user updates
  useEffect(() => {
    if (authenticatedUser) {
      const isUserEqual =
        JSON.stringify(authenticatedUser) === JSON.stringify(reduxUser);
      if (!reduxUser || !isUserEqual) dispatch(userFound(authenticatedUser));
    } else {
      if (reduxApiToken) dispatch(clearApiToken());
      if (reduxUser) dispatch(clearUser());
    }
  }, [authenticatedUser, dispatch, reduxApiToken, reduxUser]);

  // Initial sync for apiToken
  useEffect(() => {
    const [_error, apiToken] = getStoredApiTokens();
    if (apiToken) {
      dispatch(receiveApiToken(apiToken));
    }
  }, [dispatch, getStoredApiTokens]);

  // Sync apiToken updates
  useEffect(() => {
    // Signal call order
    // 1. Always called in the renew cycle, does not indicate itention to only remove
    if (isApiTokensRemovedSignal(apiTokensClientSignal)) {
      // Placeholder for future use
    }
    // 2.
    if (isApiTokensRenewalStartedSignal(apiTokensClientSignal)) {
      // Placeholder for future use
    }
    // 3.
    if (isApiTokensUpdatedSignal(apiTokensClientSignal)) {
      const [_error, apiToken] = getStoredApiTokens();
      if (apiToken && apiToken?.[apiTokenKeyName] !== reduxApiToken) {
        dispatch(receiveApiToken(apiToken));
      }
    }

    return apiTokensClientSignalReset;
  }, [
    apiTokensClientSignal,
    apiTokensClientSignalReset,
    getStoredApiTokens,
    dispatch,
    reduxApiToken,
  ]);

  const loggedIn = Boolean(reduxUser) && Boolean(reduxApiToken);

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
    oidcLogout();
  }, [oidcLogout, dispatch]);

  return {
    loggedIn,
    authenticatedUser,
    login,
    logout,
  };
};

export default useAuth;
