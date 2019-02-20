// @flow

import type {Action} from '../types';

export type UserGroups = Array<string>;

export type UsersPermissions = Array<Object>;

export type UsersPermissionsState = {
  groups: UserGroups,
  isFetching: boolean,
  permissions: UsersPermissions,
};

export type FetchUsersPermissionsAction = Action<'mvj/usersPermissions/FETCH_ALL', void>;
export type ReceiveUserGroupsAction = Action<'mvj/usersPermissions/RECEIVE_GROUPS', UserGroups>;
export type ReceiveUsersPermissionsAction = Action<'mvj/usersPermissions/RECEIVE_ALL', UsersPermissions>;
export type NotFoundAction = Action<'mvj/usersPermissions/NOT_FOUND', void>;
