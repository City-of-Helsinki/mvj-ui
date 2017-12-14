// @flow

import {createAction} from 'redux-actions';

import type {FetchApiTokenAction, ReceiveApiTokenAction} from './types';

export const fetchApiToken = (token: string): FetchApiTokenAction =>
  createAction('mvj/auth/FETCH_API_TOKEN')(token);

export const receiveApiToken = (token: Object): ReceiveApiTokenAction =>
  createAction('mvj/auth/RECEIVE_API_TOKEN')(token);
