import { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useApiTokens,
  useOidcClient,
  useApiTokensClientTracking,
  isApiTokensUpdatedSignal,
  isApiTokensRemovedSignal,
  isApiTokensRenewalStartedSignal,
  useAuthenticatedUser
} from 'hds-react';
import { setRedirectUrlToSessionStorage } from '@/util/storage';
import { Routes, getRouteById } from '@/root/routes';
import { clearApiToken, clearUser, userFound, receiveApiToken } from './actions';


const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { login: oidcLogin, logout: oidcLogout, isRenewing: oidcIsRenewing } = useOidcClient();
  const authenticatedUser = useAuthenticatedUser();
  const dispatch = useDispatch();
  const [apiTokensClientSignal, apiTokensClientSignalReset] = useApiTokensClientTracking();
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
      setLoggedIn(false);
    }
    if (isApiTokensRenewalStartedSignal(apiTokensClientSignal)) {
      // Placeholder for future use
    }

    return apiTokensClientSignalReset;
  }, [apiTokensClientSignal, dispatch]);

  const login = useCallback((redirectPath: string) => {
    setRedirectUrlToSessionStorage(redirectPath || getRouteById(Routes.LEASES));
    oidcLogin();
  }, [oidcLogin]);

  const logout = useCallback(() => {
    dispatch(clearApiToken());
    dispatch(clearUser());
    setLoggedIn(false);
    oidcLogout();
  }, [oidcLogout, dispatch]);

  const isRenewing = useCallback(() => {
    oidcIsRenewing
  }, [oidcIsRenewing]);
  return { loggedIn, authenticatedUser, login, logout, isRenewing, setLoggedInIfApiTokenExists };
};

export default useAuth;
