// @flow

import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  Contact,
  ContactId,
  ContactList,
  ContactNotFoundAction,
  CreateContactAction,
  EditContactAction,
  InitializeContactFormValuesAction,
  FetchContactsAction,
  ReceiveContactsAction,
  FetchCompleteContactListAction,
  ReceiveCompleteContactListAction,
  FetchSingleContactAction,
  ReceiveSingleContactAction,
  ReceiveContactFormValidAction,
  HideEditModeAction,
  ShowEditModeAction,
} from './types';

export const notFound = (): ContactNotFoundAction =>
  createAction('mvj/contacts/NOT_FOUND')();

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/contacts/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/contacts/RECEIVE_ATTRIBUTES')(attributes);

export const createContact = (contact: Contact): CreateContactAction =>
  createAction('mvj/contacts/CREATE')(contact);

export const editContact = (contact: Contact): EditContactAction =>
  createAction('mvj/contacts/EDIT')(contact);

export const fetchContacts = (search: string): FetchContactsAction =>
  createAction('mvj/contacts/FETCH_ALL')(search);

export const receiveContacts = (contacts: ContactList): ReceiveContactsAction =>
  createAction('mvj/contacts/RECEIVE_ALL')(contacts);

export const fetchCompleteContactList = (search: string): FetchCompleteContactListAction =>
  createAction('mvj/contacts/FETCH_COMPLETE')(search);

export const receiveCompleteContactList = (contacts: ContactList): ReceiveCompleteContactListAction =>
  createAction('mvj/contacts/RECEIVE_COMPLETE')(contacts);

export const fetchSingleContact = (contactId: ContactId): FetchSingleContactAction =>
  createAction('mvj/contacts/FETCH_SINGLE')(contactId);

export const receiveSingleContact = (contact: Contact): ReceiveSingleContactAction =>
  createAction('mvj/contacts/RECEIVE_SINGLE')(contact);

export const initializeContactForm = (contact: Contact): InitializeContactFormValuesAction =>
 createAction('mvj/contacts/INITIALIZE_FORM')(contact);

export const receiveContactFormValid = (valid: boolean): ReceiveContactFormValidAction =>
  createAction('mvj/contacts/RECEIVE_CONTACT_FORM_VALID')(valid);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/contacts/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/contacts/SHOW_EDIT')();
