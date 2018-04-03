// @flow

import type {Action} from '../types';

export type ContactState = Object;

export type Attributes = Object;

export type Contact = Object;

export type ContactId = number;

export type ContactList = Object;

export type ContactNotFoundAction = Action<'mvj/contacts/NOT_FOUND', void>;

export type FetchAttributesAction = Action<'mvj/contacts/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/contacts/RECEIVE_ATTRIBUTES', Attributes>;

export type CreateContactAction = Action<'mvj/contacts/CREATE', Contact>;
export type EditContactAction = Action<'mvj/contacts/EDIT', Contact>;

export type FetchContactsAction = Action<'mvj/contacts/FETCH_ALL', string>;
export type ReceiveContactsAction = Action<'mvj/contacts/RECEIVE_ALL', ContactList>;

export type FetchCompleteContactListAction = Action<'mvj/contacts/FETCH_COMPLETE', string>;
export type ReceiveCompleteContactListAction = Action<'mvj/contacts/RECEIVE_COMPLETE', ContactList>;
export type ReceiveNewContactToCompleteListAction = Action<'mvj/contacts/RECEIVE_NEW_TO_COMPLETE', Contact>;
export type ReceiveEditedContactToCompleteListAction = Action<'mvj/contacts/RECEIVE_EDITED_TO_COMPLETE', Contact>;

export type FetchSingleContactAction = Action<'mvj/contacts/FETCH_SINGLE', ContactId>;
export type ReceiveSingleContactAction = Action<'mvj/contacts/RECEIVE_SINGLE', Contact>;

export type InitializeContactFormValuesAction = Action<'mvj/contacts/INITIALIZE_FORM', Contact>;
export type ReceiveContactFormValidAction = Action<'mvj/contacts/RECEIVE_CONTACT_FORM_VALID', boolean>;
export type HideEditModeAction = Action<'mvj/contacts/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/contacts/SHOW_EDIT', void>;
