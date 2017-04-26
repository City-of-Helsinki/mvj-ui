// @flow

import type {Action} from '../types';

export type CurrentUser = Object;
export type UserList = Array<any>;

export type UserState = Object;

export type FetchUsersAction = Action<'mvj/user/FETCH', void>;
export type ReceiveUsersAction = Action<'mvj/user/RECEIVE', UserList>;
export type UserNotFoundAction = Action<'mvj/user/NOT_FOUND', void>;
export type ChangeUserAction = Action<'mvj/user/CHANGE', CurrentUser>;
