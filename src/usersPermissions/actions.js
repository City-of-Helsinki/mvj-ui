// @flow

import {createAction} from 'redux-actions';

import type {
  UserGroups,
  UsersPermissions,
  FetchUsersPermissionsAction,
  ReceiveUserGroupsAction,
  ReceiveUsersPermissionsAction,
  NotFoundAction,
} from './types';

export const fetchUsersPermissions = (): FetchUsersPermissionsAction =>
  createAction('mvj/usersPermissions/FETCH_ALL')();

export const receiveUserGroups = (groups: UserGroups): ReceiveUserGroupsAction =>
  createAction('mvj/usersPermissions/RECEIVE_GROUPS')(groups);

export const receiveUsersPermissions = (permissions: UsersPermissions): ReceiveUsersPermissionsAction =>
  createAction('mvj/usersPermissions/RECEIVE_ALL')(permissions);

export const notFound = (): NotFoundAction =>
  createAction('mvj/usersPermissions/NOT_FOUND')();
