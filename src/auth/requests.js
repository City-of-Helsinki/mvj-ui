// @flow

/* global OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET */

import createUrl from '../api/createUrl';
import callApi from '../api/callApi';

export const loginRequest = (username: string, password: string): Generator<> => {
  const body = new FormData();

  // $FlowFixMe
  body.append('client_id', OAUTH_CLIENT_ID);
  // $FlowFixMe
  body.append('client_secret', OAUTH_CLIENT_SECRET);
  body.append('grant_type', 'password');
  body.append('username', username);
  body.append('password', password);

  return callApi(new Request(createUrl('auth/login'), {method: 'POST', body}));
};

export const fetchUserRequest = (): Generator<> =>
  callApi(new Request(createUrl('me')));

export const refreshRequest = (refreshToken: string): Generator<> => {
  const body = new FormData();

  // $FlowFixMe
  body.append('client_id', OAUTH_CLIENT_ID);
  // $FlowFixMe
  body.append('client_secret', OAUTH_CLIENT_SECRET);
  body.append('grant_type', 'refresh_token');
  body.append('refresh_token', refreshToken);

  return callApi(new Request(createUrl('auth/refresh'), {method: 'POST', body}));
};
