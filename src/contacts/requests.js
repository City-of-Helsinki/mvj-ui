// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Contact, ContactId} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl(`contact/`), {method: 'OPTIONS'}));
};

export const createContact = (contact: Contact): Generator<> => {
  const body = JSON.stringify(contact);

  return callApi(new Request(createUrl(`contact/`), {
    method: 'POST',
    body,
  }));
};

export const editContact = (contact: Contact): Generator<> => {
  const {id} = contact;
  const body = JSON.stringify(contact);

  return callApi(new Request(createUrl(`contact/${id}/`), {
    method: 'PUT',
    body,
  }));
};

export const fetchContacts = (search: string) => {
  return callApi(new Request(createUrl(`contact/${search}`)));
};

export const fetchSingleContact = (id: ContactId): Generator<> => {
  return callApi(new Request(createUrl(`contact/${id}/`)));
};
