// @flow

import type {Action} from '../types';

export type UserGroups = Array<string>;
export type UsersPermissions = Array<Object>;
export type UserServiceUnit = Object;
export type UserServiceUnits = Array<Object>;

export type UsersPermissionsState = {
  activeServiceUnit: UserServiceUnit,
  groups: UserGroups,
  isFetching: boolean,
  permissions: UsersPermissions,
  serviceUnits: UserServiceUnits,
};

export type FetchUsersPermissionsAction = Action<'mvj/usersPermissions/FETCH_ALL', void>;
export type ReceiveUserGroupsAction = Action<'mvj/usersPermissions/RECEIVE_GROUPS', UserGroups>;
export type ReceiveUsersPermissionsAction = Action<'mvj/usersPermissions/RECEIVE_ALL', UsersPermissions>;
export type ReceiveUserServiceUnitsAction = Action<'mvj/usersPermissions/RECEIVE_SERVICE_UNITS', UserServiceUnits>;
export type SetUserActiveServiceUnitAction = Action<'mvj/usersPermissions/SET_ACTIVE_SERVICE_UNIT', UserServiceUnit>;
export type NotFoundAction = Action<'mvj/usersPermissions/NOT_FOUND', void>;
