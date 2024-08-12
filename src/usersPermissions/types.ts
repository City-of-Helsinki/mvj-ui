import type { Action } from "../types";
export type UserGroups = Array<string>;
export type UsersPermissions = Array<Record<string, any>>;
export type UserServiceUnit = Record<string, any>;
export type UserServiceUnits = Array<Record<string, any>>;
export type UsersPermissionsState = {
  activeServiceUnit: UserServiceUnit;
  groups: UserGroups;
  isFetching: boolean;
  permissions: UsersPermissions;
  serviceUnits: UserServiceUnits;
};
export type FetchUsersPermissionsAction = Action<string, void>;
export type ReceiveUserGroupsAction = Action<string, UserGroups>;
export type ReceiveUsersPermissionsAction = Action<string, UsersPermissions>;
export type ReceiveUserServiceUnitsAction = Action<string, UserServiceUnits>;
export type SetUserActiveServiceUnitAction = Action<string, UserServiceUnit>;
export type NotFoundAction = Action<string, void>;