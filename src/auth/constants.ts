import type { LoginProviderProps } from 'hds-react';

export const loginProviderProperties: LoginProviderProps = {
  userManagerSettings: {
    authority: import.meta.env.VITE_OPENID_CONNECT_AUTHORITY_URL || 'https://api.hel.fi/sso/openid/',
    client_id: import.meta.env.VITE_OPENID_CONNECT_CLIENT_ID || '',
    scope: import.meta.env.VITE_OPENID_CONNECT_SCOPE || 'openid profile https://api.hel.fi/auth/mvj',
    redirect_uri: `${location.origin}/callback`,
  },
  apiTokensClientSettings: { url: import.meta.env.VITE_OPENID_CONNECT_API_TOKEN_URL },
  sessionPollerSettings: { pollIntervalInMs: 300000 } // 300000ms = 5min
};
