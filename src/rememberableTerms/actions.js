// @flow
import {createAction} from 'redux-actions';

import type {
  RememberableTerm,
  RememberableTermList,
  FetchRememberableTermListAction,
  ReceiveRememberableTermListAction,
  CreateRememberableTermAction,
  DeleteRememberableTermAction,
  EditRememberableTermAction,
  RememberableTermNotFoundAction,
  ShowEditModeAction,
  HideEditModeAction,
  InitializeAction,
} from './types';

export const fetchRememberableTermList = (search: string): FetchRememberableTermListAction =>
  createAction('mvj/rememberableterm/FETCH_ALL')(search);

export const receiveRememberableTermList = (terms: RememberableTermList): ReceiveRememberableTermListAction =>
  createAction('mvj/rememberableterm/RECEIVE_ALL')(terms);

export const createRememberableTerm = (term: RememberableTerm): CreateRememberableTermAction =>
  createAction('mvj/rememberableterm/CREATE')(term);

export const deleteRememberableTerm = (id: number): DeleteRememberableTermAction =>
  createAction('mvj/rememberableterm/DELETE')(id);

export const editRememberableTerm = (term: RememberableTerm): EditRememberableTermAction =>
  createAction('mvj/rememberableterm/EDIT')(term);

export const notFound = (): RememberableTermNotFoundAction =>
  createAction('mvj/rememberableterm/NOT_FOUND')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/rememberableterm/SHOW_EDIT_MODE')();

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/rememberableterm/HIDE_EDIT_MODE')();

export const initializeRememberableTerm = (term: Object): InitializeAction =>
  createAction('mvj/rememberableterm/INITIALIZE')(term);
