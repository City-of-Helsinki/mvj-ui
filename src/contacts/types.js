// @flow

import type {Action} from '../types';

export type ContactState = Object;

export type Attributes = Object;

export type Contact = Object;

export type ContactList = Array<Contact>;

export type ContactNotFoundAction = Action<'mvj/contacts/NOT_FOUND', void>;

export type FetchContactsAction = Action<'mvj/contacts/FETCH_ALL', string>;
export type ReceiveContactsAction = Action<'mvj/contacts/RECEIVE_ALL', ContactList>;
