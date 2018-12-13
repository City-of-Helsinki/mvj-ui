// @flow
import type {Attributes, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {Contact, ContactList, ContactModalSettings} from './types';

export const getInitialContactFormValues: Selector<Contact, void> = (state: RootState): Contact =>
  state.contact.initialContactFormValues;

export const getIsContactFormValid: Selector<boolean, void> = (state: RootState): boolean =>
  state.contact.isContactFormValid;

export const getIsContactModalOpen: Selector<boolean, void> = (state: RootState): boolean =>
  state.contact.isContactModalOpen;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.contact.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.contact.isFetching;

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.contact.isSaveClicked;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.contact.attributes;

export const getContactList: Selector<ContactList, void> = (state: RootState): ContactList =>
  state.contact.list;

export const getContactModalSettings: Selector<ContactModalSettings, void> = (state: RootState): ContactModalSettings =>
  state.contact.contactModalSettings;

export const getCurrentContact: Selector<Contact, void> = (state: RootState): Contact =>
  state.contact.currentContact;
