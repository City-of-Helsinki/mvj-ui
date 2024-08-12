// @ts-ignore: Module '"oidc-client"' has no exported member 'Global'
// oidc-client has exported Global, but it is not in the types, so we ignore the error.
// TODO: migrate to oidc-client-ts, because oidc-client is not maintained anymore
import { Global, Log, UserManager, WebStorageStateStore } from "oidc-client";
const userManagerConfig = {
  authority: process.env.OPENID_CONNECT_AUTHORITY_URL || 'https://api.hel.fi/sso/openid/',
  automaticSilentRenew: true,
  client_id: process.env.OPENID_CONNECT_CLIENT_ID || '',
  filterProtocolClaims: true,
  loadUserInfo: true,
  redirect_uri: `${location.origin}/callback`,
  response_type: 'id_token token',
  scope: process.env.OPENID_CONNECT_SCOPE || 'openid profile https://api.hel.fi/auth/mvj',
  silent_redirect_uri: `${location.origin}/silent_renew.html`,
  userStore: new WebStorageStateStore({
    store: Global.localStorage
  })
};

class MvjUserManager extends UserManager {
  _signinStart(args, navigator, navigatorParams: any = {}) {
    return navigator.prepare(navigatorParams).then(handle => {
      Log.debug('UserManager._signinStart: got navigator window handle');
      return this.createSigninRequest(args).then(signinRequest => {
        Log.debug('UserManager._signinStart: got signin request');

        if (!signinRequest.url.match('authorize/')) {
          // Add missing / if needed
          navigatorParams.url = signinRequest.url.replace('authorize', 'authorize/');
        } else {
          navigatorParams.url = signinRequest.url;
        }

        navigatorParams.id = signinRequest.state.id;
        return handle.navigate(navigatorParams);
      }).catch(err => {
        if (handle.close) {
          Log.debug('UserManager._signinStart: Error after preparing navigator, closing navigator window');
          handle.close();
        }

        throw err;
      });
    });
  }

}

const userManager = new MvjUserManager(userManagerConfig);
export default userManager;