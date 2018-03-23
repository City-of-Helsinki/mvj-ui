// @flow

import type {Selector} from '../types';
import get from 'lodash/get';

import type {Attributes, Contact, ContactState, ContactList} from './types';

export const getIsContactFormValid: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isContactFormValid;

export const getIsFetching: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: ContactState): Attributes =>
  state.contacts.attributes;

export const getContactList: Selector<ContactList, void> = (state: ContactState): ContactList =>
  state.contacts.list;

export const getContactFormValues: Selector<Contact, void> = (state: ContactState): Contact =>
  get(state, 'form.contact-form.values');
