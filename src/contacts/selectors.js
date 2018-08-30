// @flow

import type {Selector} from '../types';

import type {
  Attributes,
  Contact,
  ContactList,
  ContactModalSettings,
  ContactState,
} from './types';

export const getInitialContactFormValues: Selector<Contact, void> = (state: ContactState): Contact =>
  state.contacts.initialContactFormValues;

export const getIsContactFormValid: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isContactFormValid;

export const getIsContactModalOpen: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isContactModalOpen;

export const getIsEditMode: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isFetching;

export const getIsSaveClicked: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isSaveClicked;

export const getAttributes: Selector<Attributes, void> = (state: ContactState): Attributes =>
  state.contacts.attributes;

export const getContactList: Selector<ContactList, void> = (state: ContactState): ContactList =>
  state.contacts.list;

export const getContactModalSettings: Selector<ContactModalSettings, void> = (state: ContactState): ContactModalSettings =>
  state.contacts.contactModalSettings;

export const getLessors: Selector<ContactList, void> = (state: ContactState): ContactList =>
  state.contacts.lessors;

export const getCurrentContact: Selector<Contact, void> = (state: ContactState): Contact =>
  state.contacts.currentContact;
