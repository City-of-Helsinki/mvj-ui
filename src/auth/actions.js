// @flow

import {createAction} from 'redux-actions';

import type {
  PerformLoginAction,
  FailLoginAction,
  ReceiveLoginAction,
  FetchUserAction,
  ReceiveUserAction,
  PerformRefreshAction,
  PerformLogoutAction,
} from './types';

export const performLogin = (username: string, password: string): PerformLoginAction =>
  createAction('mvj/auth/PERFORM_LOGIN')({
    username,
    password,
  });

export const failLogin = (message: string): FailLoginAction =>
  createAction('mvj/auth/FAIL_LOGIN')(message);

export const receiveLogin = (data: Object): ReceiveLoginAction =>
  createAction('mvj/auth/RECEIVE_LOGIN')(data);

export const fetchUser = (): FetchUserAction =>
  createAction('mvj/auth/FETCH_USER')();

export const receiveUser = (data: Object): ReceiveUserAction =>
  createAction('mvj/auth/RECEIVE_USER')(data);

export const performRefresh = (): PerformRefreshAction =>
  createAction('mvj/auth/PERFORM_REFRESH')();

export const performLogout = (): PerformLogoutAction =>
  createAction('mvj/auth/PERFORM_LOGOUT')();
