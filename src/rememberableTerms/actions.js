// @flow
import {createAction} from 'redux-actions';

import type {
  FetchRememberableTermListAction,
  ReceiveRememberableTermListAction,
  RememberableTermList,
  RememberableTermNotFoundAction,
} from './types';

export const fetchRememberableTermList = (search: string): FetchRememberableTermListAction =>
  createAction('mvj/rememberableterm/FETCH_ALL')(search);

export const receiveRememberableTermList = (rentbasis: RememberableTermList): ReceiveRememberableTermListAction =>
  createAction('mvj/rememberableterm/RECEIVE_ALL')(rentbasis);

export const notFound = (): RememberableTermNotFoundAction =>
  createAction('mvj/rememberableterm/NOT_FOUND')();
