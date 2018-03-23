// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  ContactList,
  ReceiveContactsAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/contacts/FETCH_ALL': () => true,
  'mvj/contacts/NOT_FOUND': () => false,
  'mvj/contacts/RECEIVE_ALL': () => false,
}, false);

const contactsListReducer: Reducer<ContactList> = handleActions({
  ['mvj/contacts/RECEIVE_ALL']: (state: ContactList, {payload: contacts}: ReceiveContactsAction) => {
    return contacts;
  },
}, []);

export default combineReducers({
  isFetching: isFetchingReducer,
  list: contactsListReducer,
});
