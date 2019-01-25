// @flow

import {createAction} from 'redux-actions';

import type {
  UsersPermissions,
  FetchUsersPermissionsAction,
  ReceiveUsersPermissionsAction,
  NotFoundAction,
} from './types';

export const fetchUsersPermissions = (): FetchUsersPermissionsAction =>
  createAction('mvj/usersPermissions/FETCH_ALL')();

export const receiveUsersPermissions = (permissions: UsersPermissions): ReceiveUsersPermissionsAction =>
  createAction('mvj/usersPermissions/RECEIVE_ALL')(permissions);

export const notFound = (): NotFoundAction =>
  createAction('mvj/usersPermissions/NOT_FOUND')();
