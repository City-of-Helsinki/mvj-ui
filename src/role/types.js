// @flow

import type {Action} from '../types';

export type UsetState = User;

export type User = Object;

export type ChangeRoleAction = Action<'mvj/user/CHANGE_ROLE', User>;
