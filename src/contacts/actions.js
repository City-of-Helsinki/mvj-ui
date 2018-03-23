// @flow

import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  Contact,
  ContactList,
  ContactNotFoundAction,
  CreateContactAction,
  FetchContactsAction,
  ReceiveContactsAction,
  ReceiveContactFormValidAction,
} from './types';

export const notFound = (): ContactNotFoundAction =>
  createAction('mvj/contacts/NOT_FOUND')();

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/contacts/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/contacts/RECEIVE_ATTRIBUTES')(attributes);

export const createContact = (contact: Contact): CreateContactAction =>
  createAction('mvj/contacts/CREATE')(contact);

export const fetchContacts = (search: string): FetchContactsAction =>
  createAction('mvj/contacts/FETCH_ALL')(search);

export const receiveContacts = (contacts: ContactList): ReceiveContactsAction =>
  createAction('mvj/contacts/RECEIVE_ALL')(contacts);

export const receiveContactFormValid = (valid: boolean): ReceiveContactFormValidAction =>
  createAction('mvj/contacts/RECEIVE_CONTACT_FORM_VALID')(valid);
