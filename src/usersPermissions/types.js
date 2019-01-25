// @flow

import type {Action} from '../types';

export type UsersPermissions = Array<Object>;

export type UsersPermissionsState = {
  isFetching: boolean,
  permissions: UsersPermissions,
};

export type FetchUsersPermissionsAction = Action<'mvj/usersPermissions/FETCH_ALL', void>;
export type ReceiveUsersPermissionsAction = Action<'mvj/usersPermissions/RECEIVE_ALL', UsersPermissions>;
export type NotFoundAction = Action<'mvj/usersPermissions/NOT_FOUND', void>;
