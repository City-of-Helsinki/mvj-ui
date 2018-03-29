// @flow

import type {Selector} from '../types';
import type {UserState, UserList} from './types';

export const getIsFetching: Selector<boolean, void> = (state: UserState): boolean =>
  state.users.isFetching;

export const getUsers: Selector<UserList, void> = (state: UserState): UserList =>
  state.users.list;
