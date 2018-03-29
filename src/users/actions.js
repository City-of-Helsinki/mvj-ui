// @flow

import {createAction} from 'redux-actions';

import type {
  UserList,
  FetchUsersAction,
  ReceiveUsersAction,
  UsersNotFoundAction,
} from './types';

export const fetchUsers = (search: string): FetchUsersAction =>
  createAction('mvj/users/FETCH_ALL')(search);

export const receiveUsers = (users: UserList): ReceiveUsersAction =>
  createAction('mvj/users/RECEIVE_ALL')(users);

export const notFound = (): UsersNotFoundAction =>
  createAction('mvj/users/NOT_FOUND')();
