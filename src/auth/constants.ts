import type { LoginProviderProps } from 'hds-react';

// Tunnistus SSO
const loginProviderTunnistusProperties: LoginProviderProps = {
  userManagerSettings: {
    authority: import.meta.env.VITE_TUNNISTUS_OIDC_AUTHORITY_URL || 'https://tunnistus.hel.fi/auth/realms/helsinki-tunnistus',
    client_id: import.meta.env.VITE_TUNNISTUS_OIDC_CLIENT_ID || '',
    scope: import.meta.env.VITE_TUNNISTUS_OIDC_SCOPE || 'openid profile',
    redirect_uri: `${location.origin}/callback`,
  },
  apiTokensClientSettings: {
    url: import.meta.env.VITE_TUNNISTUS_OIDC_API_TOKEN_URL || 'https://tunnistus.hel.fi/auth/realms/helsinki-tunnistus/protocol/openid-connect/token',
    queryProps: {
      grantType: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      permission: '#access',
    },
    audiences: [import.meta.env.VITE_TUNNISTUS_OIDC_API_AUDIENCE],
  },
  sessionPollerSettings: { pollIntervalInMs: 300000 } // 300000ms = 5min
};

export const loginProviderProperties = loginProviderTunnistusProperties;
const tunnistusApiTokenKeyName: string = import.meta.env.VITE_TUNNISTUS_OIDC_API_AUDIENCE || 'mvj-api';
export const apiTokenKeyName = tunnistusApiTokenKeyName;