// @flow

import type {Action} from '../types';

export type ContactState = Object;

export type Attributes = Object;

export type Contact = Object;

export type ContactList = Array<Contact>;

export type ContactNotFoundAction = Action<'mvj/contacts/NOT_FOUND', void>;

export type FetchAttributesAction = Action<'mvj/contacts/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/contacts/RECEIVE_ATTRIBUTES', Attributes>;

export type CreateContactAction = Action<'mvj/contacts/CREATE', Contact>;
export type FetchContactsAction = Action<'mvj/contacts/FETCH_ALL', string>;
export type ReceiveContactsAction = Action<'mvj/contacts/RECEIVE_ALL', ContactList>;

export type ReceiveContactFormValidAction = Action<'mvj/contacts/RECEIVE_CONTACT_FORM_VALID', boolean>;
