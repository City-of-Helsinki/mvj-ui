import type { Selector } from "@/types";
import type { ApiToken, AuthState } from "./types";
import type { User } from 'hds-react';
import { useTunnistamoOpenIdConnect } from "@/auth/constants";
// Helper functions to select state
export const getApiToken: Selector<ApiToken, void> = (state: Record<string, any>): AuthState => {
  if (useTunnistamoOpenIdConnect()) {
    return state.auth.apiToken[import.meta.env.VITE_OPENID_CONNECT_API_TOKEN_KEY || 'https://api.hel.fi/auth/mvj'];
  }
  return state.auth.apiToken[import.meta.env.VITE_TUNNISTUS_OIDC_API_AUDIENCE || 'mvj-api'];
};
export const getLoggedInUser: Selector<Record<string, any>, void> = (state: Record<string, any>): User | null => state.auth.user;
