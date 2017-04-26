// @flow

import {createAction} from 'redux-actions';

import type {
  ChangeUserAction,
  CurrentUser,
  UserList,
  FetchUsersAction,
  ReceiveUsersAction,
  UserNotFoundAction,
} from './types';

export const fetchUsers = (): FetchUsersAction =>
  createAction('mvj/user/FETCH')();

export const receiveUsers = (users: UserList): ReceiveUsersAction =>
  createAction('mvj/user/RECEIVE')(users);

export const notFound = (): UserNotFoundAction =>
  createAction('mvj/user/NOT_FOUND')();

export const changeUser = (user: CurrentUser): ChangeUserAction =>
  createAction('mvj/user/CHANGE')(user);
