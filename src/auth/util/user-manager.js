// @flow
import {createUserManager} from 'redux-oidc';
/* global OPENID_CONNECT_CLIENT_ID */

const userManagerConfig = {
  authority: 'https://api.hel.fi/sso/openid/',
  automaticSilentRenew: true,
  // $FlowFixMe
  client_id: OPENID_CONNECT_CLIENT_ID,
  filterProtocolClaims: true,
  loadUserInfo: true,
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'id_token token',
  scope: 'openid profile https://api.hel.fi/auth/mvj',
  silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
