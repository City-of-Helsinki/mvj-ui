// @flow

import get from 'lodash/get';

import type {Selector} from '../types';
import type {User} from './types';

export const getIsAuthenticated: Selector<boolean, void> = (state) =>
  Boolean(get(state, 'auth.session'));

export const getAccessToken: Selector<string, void> = (state) =>
  get(state, 'auth.session.access_token');

export const getRefreshToken: Selector<string, void> = (state) =>
  get(state, 'auth.session.refresh_token');

export const getUser: Selector<User, void> = (state) =>
  get(state, 'auth.user');
