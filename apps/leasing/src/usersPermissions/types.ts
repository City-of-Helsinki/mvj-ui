import type { Action } from "@/types";
import type { ServiceUnit } from "@/serviceUnits/types";

export type UserGroups = Array<string>;
export type UsersPermissions = Array<Record<string, any>>;
export type UserServiceUnit = ServiceUnit;
export type UserServiceUnits = Array<UserServiceUnit>;
export type UsersPermissionsState = {
  activeServiceUnit: ServiceUnit | null;
  groups: UserGroups;
  isFetching: boolean;
  permissions: UsersPermissions;
  serviceUnits: UserServiceUnits;
};
