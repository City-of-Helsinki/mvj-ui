// @flow
import {ContactType, FormNames} from './enums';
import {removeSessionStorageItem} from '$util/storage';

export const getContactFullName = (contact: ?Object) => {
  if(!contact || !contact.type) {
    return '';
  }
  return contact.type === ContactType.PERSON
    ? `${contact.last_name ? `${contact.last_name} ` : ''} ${contact.first_name || ''}`
    : contact.name;
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.CONTACT);
  removeSessionStorageItem('contactId');
};
