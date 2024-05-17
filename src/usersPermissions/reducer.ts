import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "../types";
import type { UserGroups, UsersPermissions, UserServiceUnits, UserServiceUnit, ReceiveUserGroupsAction, ReceiveUsersPermissionsAction, ReceiveUserServiceUnitsAction, SetUserActiveServiceUnitAction } from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/usersPermissions/FETCH_ALL': () => true,
  'mvj/usersPermissions/NOT_FOUND': () => false,
  'mvj/usersPermissions/RECEIVE_ALL': () => false
}, false);
const usersPermissionsReducer: Reducer<UsersPermissions> = handleActions({
  ['mvj/usersPermissions/RECEIVE_ALL']: (state: UsersPermissions, {
    payload: permissions
  }: ReceiveUsersPermissionsAction) => {
    return permissions;
  }
}, []);
const groupsReducer: Reducer<UserGroups> = handleActions({
  ['mvj/usersPermissions/RECEIVE_GROUPS']: (state: UserGroups, {
    payload: groups
  }: ReceiveUserGroupsAction) => {
    return groups;
  }
}, []);
const serviceUnitsReducer: Reducer<UserServiceUnits> = handleActions({
  ['mvj/usersPermissions/RECEIVE_SERVICE_UNITS']: (state: UserServiceUnits, {
    payload: serviceUnits
  }: ReceiveUserServiceUnitsAction) => {
    return serviceUnits;
  }
}, []);
const activeServiceUnitReducer: Reducer<UserServiceUnit> = handleActions({
  ['mvj/usersPermissions/SET_ACTIVE_SERVICE_UNIT']: (state: UserServiceUnit, {
    payload: serviceUnit
  }: SetUserActiveServiceUnitAction) => {
    return serviceUnit;
  }
}, null);
export default combineReducers<Record<string, any>, any>({
  activeServiceUnit: activeServiceUnitReducer,
  isFetching: isFetchingReducer,
  groups: groupsReducer,
  permissions: usersPermissionsReducer,
  serviceUnits: serviceUnitsReducer
});