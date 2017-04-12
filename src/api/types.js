// @flow

import type {Action} from '../types';

export type ApiError = Object | null;

export type ReceiveErrorAction = Action<'mvj/api/RECEIVE_ERROR', ApiError>;
export type ClearErrorAction = Action<'mvj/api/CLEAR_ERROR', void>;

export type ApiState = {
  error: ApiError,
};
