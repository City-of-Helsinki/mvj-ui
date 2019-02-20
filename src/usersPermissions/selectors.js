// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {UserGroups, UsersPermissions} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.usersPermissions.isFetching;

export const getUserGroups: Selector<UserGroups, void> = (state: RootState): UserGroups =>
  state.usersPermissions.groups;

export const getUsersPermissions: Selector<UsersPermissions, void> = (state: RootState): UsersPermissions =>
  state.usersPermissions.permissions;
