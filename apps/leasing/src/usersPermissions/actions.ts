import { createAction } from "redux-actions";
import { receiveError } from "@/api/slice";
import type {
  UserGroups,
  UsersPermissions,
  UserServiceUnits,
  UserServiceUnit,
  FetchUsersPermissionsAction,
  ReceiveUserGroupsAction,
  ReceiveUsersPermissionsAction,
  ReceiveUserServiceUnitsAction,
  SetUserActiveServiceUnitAction,
  NotFoundAction,
} from "./types";

export const fetchUsersPermissions = (): FetchUsersPermissionsAction =>
  createAction("mvj/usersPermissions/FETCH_ALL")();
export const receiveUserGroups = (
  groups: UserGroups,
): ReceiveUserGroupsAction =>
  createAction("mvj/usersPermissions/RECEIVE_GROUPS")(groups);
export const receiveUsersPermissions = (
  permissions: UsersPermissions,
): ReceiveUsersPermissionsAction =>
  createAction("mvj/usersPermissions/RECEIVE_ALL")(permissions);
export const receiveUserServiceUnits = (
  serviceUnits: UserServiceUnits,
): ReceiveUserServiceUnitsAction =>
  createAction("mvj/usersPermissions/RECEIVE_SERVICE_UNITS")(serviceUnits);
export const setUserActiveServiceUnit = (
  activeServiceUnit: UserServiceUnit,
): SetUserActiveServiceUnitAction | ReturnType<typeof receiveError> => {
  if (!activeServiceUnit) {
    return receiveError(
      new Error(
        `Käyttäjälle ei ole asetettu palvelukokonaisuuksia. Kokeile päivittää sivu, ja ota yhteyttä tukeen, jotta puuttuvat käyttäjäryhmät voidaan asettaa.
        User has no service units assigned. Try to refresh the page and contact support to configure correct user groups.`,
      ),
    );
  }
  return createAction("mvj/usersPermissions/SET_ACTIVE_SERVICE_UNIT")(
    activeServiceUnit,
  );
};
export const notFound = (): NotFoundAction =>
  createAction("mvj/usersPermissions/NOT_FOUND")();
