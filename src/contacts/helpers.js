// @flow
import type {Contact} from './types';
import {addEmptyOption} from '$util/helpers';
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

/**
 * Get options for contact field
 * @param contacts
 */
export const getContactOptions = (contacts: Array<Object>) => {
  if(!contacts || !contacts.length) {
    return [];
  }

  return addEmptyOption(contacts.map((contact) => {
    return {
      value: contact.id,
      label: getContactFullName(contact),
    };
  }).sort(function(a, b){
    const keyA = a.label,
      keyB = b.label;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  }));
};
