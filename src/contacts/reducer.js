// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  Contact,
  ContactList,
  InitializeContactFormValuesAction,
  ReceiveAttributesAction,
  ReceiveContactsAction,
  ReceiveCompleteContactListAction,
  ReceiveSingleContactAction,
  ReceiveContactFormValidAction,
} from './types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/contacts/HIDE_EDIT': () => false,
  'mvj/contacts/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/contacts/FETCH_ALL': () => true,
  'mvj/contacts/FETCH_SINGLE': () => true,
  'mvj/contacts/NOT_FOUND': () => false,
  'mvj/contacts/RECEIVE_ALL': () => false,
  'mvj/contacts/RECEIVE_SINGLE': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/contacts/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const contactsListReducer: Reducer<ContactList> = handleActions({
  ['mvj/contacts/RECEIVE_ALL']: (state: ContactList, {payload: contacts}: ReceiveContactsAction) => {
    return contacts;
  },
}, {});

const completeContactListReducer: Reducer<ContactList> = handleActions({
  ['mvj/contacts/RECEIVE_COMPLETE']: (state: ContactList, {payload: contacts}: ReceiveCompleteContactListAction) => {
    return contacts;
  },
}, {});

const contactReducer: Reducer<Contact> = handleActions({
  ['mvj/contacts/RECEIVE_SINGLE']: (state: Contact, {payload: contact}: ReceiveSingleContactAction) => {
    return contact;
  },
}, {});

const initialValuesReducer: Reducer<Contact> = handleActions({
  ['mvj/contacts/INITIALIZE_FORM']: (state: Contact, {payload: contact}: InitializeContactFormValuesAction) => {
    return contact;
  },
}, {
  decisions: [''],
  prices: [{}],
  real_estate_ids: [''],
});

const isContactFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/contacts/RECEIVE_CONTACT_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveContactFormValidAction) => {
    return valid;
  },
}, false);

export default combineReducers({
  allContacts: completeContactListReducer,
  attributes: attributesReducer,
  current: contactReducer,
  initialContactFormValues: initialValuesReducer,
  isContactFormValid: isContactFormValidReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  list: contactsListReducer,
});
