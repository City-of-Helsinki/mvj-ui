// @flow
import type {Action} from '../types';

export type RememberableTermState = Object;

export type RememberableTermId = number;
export type RememberableTerm = Object;
export type RememberableTermList = Array<RememberableTerm>;

export type FetchRememberableTermListAction = Action<'mvj/rememberableterm/FETCH_ALL', string>;
export type ReceiveRememberableTermListAction = Action<'mvj/rememberableterm/RECEIVE_ALL', RememberableTermList>;

export type RememberableTermNotFoundAction = Action<'mvj/rememberableterm/NOT_FOUND', void>;
