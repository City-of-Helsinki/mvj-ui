// @flow

import type {Selector} from '../types';

import type {ContactState, ContactList} from './types';

export const getIsFetching: Selector<boolean, void> = (state: ContactState): boolean =>
  state.contacts.isFetching;

export const getContactList: Selector<ContactList, void> = (state: ContactState): ContactList =>
  state.contacts.list;
