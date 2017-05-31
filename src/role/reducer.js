// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {CurrentUser, UserList, ChangeUserAction, ReceiveUsersAction} from './types';

import {setStorageItem} from '../util/storage';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/user/FETCH': () => true,
  'mvj/user/RECEIVE': () => false,
  'mvj/user/NOT_FOUND': () => false,
}, false);

const currentUserReducer: Reducer<CurrentUser> = handleActions({
  ['mvj/user/CHANGE']: (state: CurrentUser, {payload: user}: ChangeUserAction) => {
    setStorageItem('TOKEN', user.username);
    return {
      ...state,
      ...user,
    };
  },
}, {});

const userListReducer: Reducer<UserList> = handleActions({
  ['mvj/user/RECEIVE']: (state: UserList, {payload: users}: ReceiveUsersAction) => {
    return users;
  },
}, []);

export default combineReducers({
  list: userListReducer,
  current: currentUserReducer,
  isFetching: isFetchingReducer,
});
