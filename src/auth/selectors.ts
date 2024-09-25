import type { Selector } from "@/types";
import type { ApiToken, AuthState } from "./types";
import type { User } from 'hds-react';
import { apiTokenKeyName } from "@/auth/constants";
// Helper functions to select state
export const getApiToken: Selector<ApiToken, void> = (state: Record<string, any>): AuthState => {
  return state.auth.apiToken[apiTokenKeyName];
};
export const getLoggedInUser: Selector<Record<string, any>, void> = (state: Record<string, any>): User | null => state.auth.user;
