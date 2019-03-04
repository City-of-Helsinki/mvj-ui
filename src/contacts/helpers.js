// @flow
import get from 'lodash/get';
import {isDirty} from 'redux-form';

import {ContactTypes, FormNames} from './enums';
import {TableSortOrder} from '$components/enums';
import {getIsEditMode} from '$src/contacts/selectors';
import {removeSessionStorageItem} from '$util/storage';

export const getContactFullName = (contact: ?Object) => {
  if(!contact || !contact.type) return '';

  return contact.type === ContactTypes.PERSON
    ? `${contact.last_name ? `${contact.last_name} ` : ''} ${contact.first_name || ''}`
    : contact.name;
};

export const getContentContact = (contact: Object) => {
  return {
    id: get(contact, 'id'),
    value: get(contact, 'id'),
    label: getContactFullName(contact),
    type: get(contact, 'type'),
    first_name: get(contact, 'first_name'),
    last_name: get(contact, 'last_name'),
    name: get(contact, 'name'),
    business_id: get(contact, 'business_id'),
    address: get(contact, 'address'),
    postal_code: get(contact, 'postal_code'),
    city: get(contact, 'city'),
    care_of: contact.care_of,
    email: get(contact, 'email'),
    phone: get(contact, 'phone'),
    language: get(contact, 'language'),
    national_identification_number: get(contact, 'national_identification_number'),
    address_protection: get(contact, 'address_protection'),
    customer_number: get(contact, 'customer_number'),
    sap_customer_number: get(contact, 'sap_customer_number'),
    electronic_billing_address: get(contact, 'electronic_billing_address'),
    partner_code: get(contact, 'partner_code'),
    is_lessor: get(contact, 'is_lessor'),
  };
};

/**
* Get contact options from contact list
* @param {Object[]} contacts
* @returns {Object[]}
*/
export const getContactOptions = (contacts: Array<Object>): Array<Object> =>
  contacts && contacts.length
    ? contacts.map((contact) => ({value: contact.id, label: getContactFullName(contact)}))
    : [];

export const isContactFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && isDirty(FormNames.CONTACT)(state);
};

/**
* Map contact search filters for API
* @param {Object} query
* @returns {Object}
*/
export const mapContactSearchFilters = (query: Object) => {
  const searchQuery = {...query};

  if(searchQuery.sort_key) {
    if(searchQuery.sort_key === 'names') {
      searchQuery.ordering = [
        'names',
        'first_name',
      ];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if(searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.CONTACT);
  removeSessionStorageItem('contactId');
};
