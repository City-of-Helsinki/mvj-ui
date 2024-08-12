import type { Selector } from "@/types";
import type { ApiToken, AuthState } from "./types";
// Helper functions to select state
export const getApiToken: Selector<ApiToken, void> = (state: Record<string, any>): AuthState => state.auth.apiToken[import.meta.env.VITE_OPENID_CONNECT_API_TOKEN_KEY || 'https://api.hel.fi/auth/mvj'];
export const getApiTokenExpires: Selector<ApiToken, void> = (state: Record<string, any>): AuthState => state.auth.apiToken['expires_at'];
export const getIsFetching: Selector<ApiToken, void> = (state: Record<string, any>): AuthState => state.auth.isFetching;
export const getLoggedInUser: Selector<Record<string, any>, void> = (state: Record<string, any>): Record<string, any> => state.oidc.user;