// @flow

import {createAction} from 'redux-actions';

import type {ApiError, ReceiveErrorAction, ClearErrorAction} from './types';

export const receiveError = (error: ApiError): ReceiveErrorAction =>
  createAction('mvj/api/RECEIVE_ERROR')(error);

export const clearError = (): ClearErrorAction =>
  createAction('mvj/api/CLEAR_ERROR')();
