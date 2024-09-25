import type { LoginProviderProps } from 'hds-react';

type OidcProviderName = 'tunnistamo' | 'tunnistus';

// Tunnistamo SSO (legacy)
const loginProviderTunnistamoProperties: LoginProviderProps = {
  userManagerSettings: {
    authority: import.meta.env.VITE_OPENID_CONNECT_AUTHORITY_URL || 'https://api.hel.fi/sso/openid/',
    client_id: import.meta.env.VITE_OPENID_CONNECT_CLIENT_ID || '',
    scope: import.meta.env.VITE_OPENID_CONNECT_SCOPE || 'openid profile https://api.hel.fi/auth/mvj',
    redirect_uri: `${location.origin}/callback`,
  },
  apiTokensClientSettings: { url: import.meta.env.VITE_OPENID_CONNECT_API_TOKEN_URL },
  sessionPollerSettings: { pollIntervalInMs: 300000 } // 300000ms = 5min
};

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

export const oidcProviderName: OidcProviderName = import.meta.env.VITE_OIDC_PROVIDER || 'tunnistus';
// By default use Tunnistus SSO
export const loginProviderProperties = oidcProviderName === 'tunnistamo' ? loginProviderTunnistamoProperties : loginProviderTunnistusProperties;
const tunnistamoApiTokenKeyName: string = import.meta.env.VITE_OPENID_CONNECT_API_TOKEN_KEY || 'https://api.hel.fi/auth/mvj';
const tunnistusApiTokenKeyName: string = import.meta.env.VITE_TUNNISTUS_OIDC_API_AUDIENCE || 'mvj-api';
export const apiTokenKeyName = oidcProviderName === 'tunnistamo' ? tunnistamoApiTokenKeyName : tunnistusApiTokenKeyName;