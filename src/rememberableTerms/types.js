// @flow
import type {Action} from '../types';

export type RememberableTermState = Object;

export type RememberableTermId = number;
export type RememberableTerm = Object;
export type RememberableTermList = Array<RememberableTerm>;

export type FetchRememberableTermListAction = Action<'mvj/rememberableterm/FETCH_ALL', string>;
export type ReceiveRememberableTermListAction = Action<'mvj/rememberableterm/RECEIVE_ALL', RememberableTermList>;
export type CreateRememberableTermAction = Action<'mvj/rememberableterm/CREATE', RememberableTerm>;
export type DeleteRememberableTermAction = Action<'mvj/rememberableterm/DELETE', number>;
export type EditRememberableTermAction = Action<'mvj/rememberableterm/EDIT', RememberableTerm>;

export type RememberableTermNotFoundAction = Action<'mvj/rememberableterm/NOT_FOUND', void>;

export type ShowEditModeAction = Action<'mvj/rememberableterm/SHOW_EDIT_MODE', void>;
export type HideEditModeAction = Action<'mvj/rememberableterm/HIDE_EDIT_MODE', void>;
export type InitializeAction = Action<'mvj/rememberableterm/INITIALIZE', Object>;
