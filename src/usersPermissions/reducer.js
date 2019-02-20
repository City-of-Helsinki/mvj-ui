// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  UserGroups,
  UsersPermissions,
  ReceiveUserGroupsAction,
  ReceiveUsersPermissionsAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/usersPermissions/FETCH_ALL': () => true,
  'mvj/usersPermissions/NOT_FOUND': () => false,
  'mvj/usersPermissions/RECEIVE_ALL': () => false,
}, false);

const usersPermissionsReducer: Reducer<UsersPermissions> = handleActions({
  ['mvj/usersPermissions/RECEIVE_ALL']: (state: UsersPermissions, {payload: permissions}: ReceiveUsersPermissionsAction) => {
    return permissions;
  },
}, []);

const groupsReducer: Reducer<UserGroups> = handleActions({
  ['mvj/usersPermissions/RECEIVE_GROUPS']: (state: UserGroups, {payload: groups}: ReceiveUserGroupsAction) => {
    return groups;
  },
}, []);

export default combineReducers<Object, any>({
  isFetching: isFetchingReducer,
  groups: groupsReducer,
  permissions: usersPermissionsReducer,
});
