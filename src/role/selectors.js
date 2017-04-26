// @flow

import type {Selector} from '../types';
import type {CurrentUser, UserState} from './types';

export const getIsFetching: Selector<CurrentUser, void> = (state): UserState =>
  state.user.isFetching;

export const getUserList: Selector<CurrentUser, void> = (state): UserState =>
  state.user.list;

export const getUser: Selector<CurrentUser, void> = (state): UserState =>
  state.user.current;
