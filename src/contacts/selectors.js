// @flow

import type {Selector} from '../types';
import get from 'lodash/get';

import type {Attributes, Contact, ContactState, ContactList} from './types';

export const getInitialContactFormValues: Selector<Contact, void> = (state: ContactState): Contact =>
  state.contacts.initialContactFormValues;

export const getIsContactFormValid: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isContactFormValid;

export const getIsEditMode: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: ContactState): Attributes =>
  state.contacts.attributes;

export const getContactList: Selector<ContactList, void> = (state: ContactState): ContactList =>
  state.contacts.list;

export const getCompleteContactList: Selector<Array<Contact>, void> = (state: ContactState): Array<Contact> =>
  state.contacts.allContacts;

export const getCurrentContact: Selector<Contact, void> = (state: ContactState): Contact =>
  state.contacts.current;

export const getContactFormTouched: Selector<Contact, void> = (state: ContactState): Contact =>
  get(state, 'form.contact-form.anyTouched');

export const getContactFormValues: Selector<Contact, void> = (state: ContactState): Contact =>
  get(state, 'form.contact-form.values');
