// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Contact} from './types';

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

export const fetchContacts = (search: string) => {
  return callApi(new Request(createUrl(`contact/${search}`)));
};
