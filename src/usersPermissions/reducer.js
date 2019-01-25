// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  UsersPermissions,
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

export default combineReducers({
  isFetching: isFetchingReducer,
  permissions: usersPermissionsReducer,
});
