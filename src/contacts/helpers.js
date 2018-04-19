// @flow
import type {Contact} from './types';
import {ContactType} from './enums';

export const getContactFullName = (contact: ?Object) => {
  if(!contact || !contact.type) {
    return '';
  }
  return contact.type === ContactType.PERSON
    ? `${contact.last_name} ${contact.first_name}`
    : contact.name;
};

export const getContactById = (allContacts: Array<Contact>, contactId: string) => {
  if(!allContacts || !allContacts.length) {
    return {};
  }
  return allContacts.find((x) => x.id === contactId);
};
