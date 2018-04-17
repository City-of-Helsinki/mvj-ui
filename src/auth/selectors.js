// @flow

import type {Selector} from '../types';
import type {ApiToken, AuthState} from './types';
/* global OPENID_CONNECT_API_TOKEN_KEY */

// Helper functions to select state
export const getApiToken: Selector<ApiToken, void> = (state: Object): AuthState =>
  // $FlowFixMe
  state.auth.apiToken[OPENID_CONNECT_API_TOKEN_KEY || 'https://api.hel.fi/auth/mvj'];

export const getApiTokenExpires: Selector<ApiToken, void> = (state: Object): AuthState =>
  state.auth.apiToken['expires_at'];

export const getIsFetching: Selector<ApiToken, void> = (state: Object): AuthState =>
  state.auth.isFetching;

export const getLoggedInUser: Selector<Object, void> = (state: Object): Object =>
  state.oidc.user;
