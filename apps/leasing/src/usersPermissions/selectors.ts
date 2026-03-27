import type { Selector } from "types";
import type { RootState } from "@/root/types";
import type {
  UserGroups,
  UsersPermissions,
  UserServiceUnit,
  UserServiceUnits,
} from "./types";
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.usersPermissions.isFetching;
export const getUserGroups: Selector<UserGroups, void> = (
  state: RootState,
): UserGroups => state.usersPermissions.groups;
export const getUsersPermissions: Selector<UsersPermissions, void> = (
  state: RootState,
): UsersPermissions => state.usersPermissions.permissions;
export const getUserServiceUnits: Selector<UserServiceUnits, void> = (
  state: RootState,
): UserServiceUnits => state.usersPermissions.serviceUnits;
export const getUserActiveServiceUnit: Selector<UserServiceUnit, void> = (
  state: RootState,
): UserServiceUnit => state.usersPermissions.activeServiceUnit;
