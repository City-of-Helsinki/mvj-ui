// @flow

import {createAction} from 'redux-actions';

import type {User, ChangeUserAction} from './types';

export const changeUser = (role: User): ChangeUserAction =>
  createAction('mvj/user/CHANGE_USER')(role);
