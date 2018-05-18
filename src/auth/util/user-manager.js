// @flow
import {createUserManager} from 'redux-oidc';
import {Global, WebStorageStateStore} from 'oidc-client';
/* global OPENID_CONNECT_AUTHORITY_URL */
/* global OPENID_CONNECT_CLIENT_ID */
/* global OPENID_CONNECT_SCOPE */

const userManagerConfig = {
  // $FlowFixMe
  authority: OPENID_CONNECT_AUTHORITY_URL || 'https://api.hel.fi/sso/openid/',
  automaticSilentRenew: true,
  // $FlowFixMe
  client_id: OPENID_CONNECT_CLIENT_ID,
  filterProtocolClaims: true,
  loadUserInfo: true,
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'id_token token',
  // $FlowFixMe
  scope: OPENID_CONNECT_SCOPE || 'openid profile https://api.hel.fi/auth/mvj',
  silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  userStore: new WebStorageStateStore({store: Global.localStorage}),
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
