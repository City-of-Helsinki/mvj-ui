// @flow

import type {Action} from '../types';

export type Session = Object | null;
export type User = Object | null;

export type AuthState = {
  isAuthenticated: boolean,
  session: Session,
  user: User,
}

export type PerformLoginAction = Action<'mvj/auth/PERFORM_LOGIN', { username: string, password: string }>;
export type FailLoginAction = Action<'mvj/auth/FAIL_LOGIN', string>;
export type ReceiveLoginAction = Action<'mvj/auth/RECEIVE_LOGIN', Session>;
export type FetchUserAction = Action<'mvj/auth/FETCH_USER', void>;
export type ReceiveUserAction = Action<'mvj/auth/RECEIVE_USER', User>;
export type PerformRefreshAction = Action<'mvj/auth/PERFORM_REFRESH', void>;
export type PerformLogoutAction = Action<'mvj/auth/PERFORM_LOGOUT', void>;
