import type { Selector } from "@/types";
import type { ApiToken, AuthState } from "./types";
import type { User } from 'hds-react';
// Helper functions to select state
export const getApiToken: Selector<ApiToken, void> = (state: Record<string, any>): AuthState => state.auth.apiToken[import.meta.env.VITE_OPENID_CONNECT_API_TOKEN_KEY || 'https://api.hel.fi/auth/mvj'];
export const getIsFetching: Selector<ApiToken, void> = (state: Record<string, any>): AuthState => state.auth.isFetching;
export const getLoggedInUser: Selector<Record<string, any>, void> = (state: Record<string, any>): User | null => state.oidc.user;