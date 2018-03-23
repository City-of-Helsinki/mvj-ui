// @flow

import {createAction} from 'redux-actions';

import type {
  ContactList,
  ContactNotFoundAction,
  FetchContactsAction,
  ReceiveContactsAction,
} from './types';

export const notFound = (): ContactNotFoundAction =>
  createAction('mvj/contacts/NOT_FOUND')();

export const fetchContacts = (search: string): FetchContactsAction =>
  createAction('mvj/contacts/FETCH_ALL')(search);

export const receiveContacts = (contacts: ContactList): ReceiveContactsAction =>
  createAction('mvj/contacts/RECEIVE_ALL')(contacts);
