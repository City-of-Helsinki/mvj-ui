// @flow

import {createAction} from 'redux-actions';

import type {Role, ChangeRoleAction} from './types';

export const changeRole = (role: Role): ChangeRoleAction =>
  createAction('mvj/user/CHANGE_ROLE')(role);
