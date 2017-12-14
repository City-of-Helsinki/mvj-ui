// @flow

import type {Action} from '../types';

export type ApiToken = Object | null;
export type AuthState = Object | null;

export type FetchApiTokenAction = Action<'mvj/auth/FETCH_API_TOKEN', string>;

export type ReceiveApiTokenAction = Action<'mvj/auth/RECEIVE_API_TOKEN', Object>;
