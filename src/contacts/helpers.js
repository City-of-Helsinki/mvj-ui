// @flow
import {ContactType, FormNames} from './enums';
import {addEmptyOption} from '$util/helpers';
import {removeSessionStorageItem} from '$util/storage';

import type {Contact} from './types';

export const getContactFullName = (contact: ?Object) => {
  if(!contact || !contact.type) {
    return '';
  }
  return contact.type === ContactType.PERSON
    ? `${contact.last_name ? `${contact.last_name} ` : ''} ${contact.first_name || ''}`
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

/**
 * Get options for lessor field
 * @param lessors
 */
export const getLessorOptions = (lessors: Array<Object>) => {
  if(!lessors || !lessors.length) {
    return [];
  }
  return addEmptyOption(lessors.map((item) => {
    return {
      value: item.id,
      label: getContactFullName(item),
    };
  }));
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.CONTACT);
  removeSessionStorageItem('contactId');
};
