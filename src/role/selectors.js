// @flow

import type {Selector} from '../types';
import type {User} from './types';

export const getUser: Selector<User, { user: User }> = (state): User =>
  state.user;
