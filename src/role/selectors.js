// @flow

import type {Selector} from '../types';
import type {User, UserState} from './types';

export const getUser: Selector<User, void> = (state): UserState =>
  state.user;
