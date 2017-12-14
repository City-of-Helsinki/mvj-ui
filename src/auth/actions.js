// @flow

import {createAction} from 'redux-actions';

import type {FetchApiTokenAction, ReceiveApiTokenAction, TokenNotFoundAction} from './types';

export const fetchApiToken = (accessToken: string): FetchApiTokenAction =>
  createAction('mvj/auth/FETCH_API_TOKEN')(accessToken);

export const receiveApiToken = (token: Object): ReceiveApiTokenAction =>
  createAction('mvj/auth/RECEIVE_API_TOKEN')(token);

export const tokenNotFound = (): TokenNotFoundAction =>
  createAction('mvj/auth/TOKEN_NOT_FOUND')();
