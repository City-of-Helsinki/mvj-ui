// @flow

import type {Action} from '../types';

export type UserState = User;

export type User = Object;

export type ChangeUserAction = Action<'mvj/user/CHANGE_USER', User>;
