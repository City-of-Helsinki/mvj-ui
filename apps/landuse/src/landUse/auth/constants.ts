import { createTokenizedFetchModule, type LoginProviderProps } from "hds-react";

const tunnistusApiTokenKeyName: string =
  import.meta.env.VITE_TUNNISTUS_OIDC_API_AUDIENCE || "mvj-api";
export const apiTokenKeyName = tunnistusApiTokenKeyName;

export const landUseTokenizedFetchModule = createTokenizedFetchModule({
  tokenSetter: (_headers, apiTokens) => {
    const apiToken = apiTokens[apiTokenKeyName];

    return apiToken ? { Authorization: `Bearer ${apiToken}` } : {};
  },
});

// Tunnistus SSO
const loginProviderTunnistusProperties: LoginProviderProps = {
  userManagerSettings: {
    authority:
      import.meta.env.VITE_TUNNISTUS_OIDC_AUTHORITY_URL ||
      "https://tunnistus.hel.fi/auth/realms/helsinki-tunnistus",
    client_id: import.meta.env.VITE_TUNNISTUS_OIDC_CLIENT_ID || "",
    scope: import.meta.env.VITE_TUNNISTUS_OIDC_SCOPE || "openid profile",
    redirect_uri: `${location.origin}/callback`,
  },
  apiTokensClientSettings: {
    url:
      import.meta.env.VITE_TUNNISTUS_OIDC_API_TOKEN_URL ||
      "https://tunnistus.hel.fi/auth/realms/helsinki-tunnistus/protocol/openid-connect/token",
    queryProps: {
      grantType: "urn:ietf:params:oauth:grant-type:uma-ticket",
      permission: "#access",
    },
    audiences: [import.meta.env.VITE_TUNNISTUS_OIDC_API_AUDIENCE],
  },
  sessionPollerSettings: { pollIntervalInMs: 300000 }, // 300000ms = 5min
  modules: [landUseTokenizedFetchModule],
};

export const loginProviderProperties = loginProviderTunnistusProperties;
