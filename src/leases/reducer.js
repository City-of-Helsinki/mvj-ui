// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {Identifiers, ReceiveIdentifiersAction} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/lease/FETCH_IDENTIFIERS': () => true,
  'mvj/lease/RECEIVE_IDENTIFIERS': () => false,
}, false);

const identifiersReducer: Reducer<Identifiers> = handleActions({
  ['mvj/lease/RECEIVE_IDENTIFIERS']: (state: Identifiers, {payload: identifiers}: ReceiveIdentifiersAction) => {
    return identifiers;
  },
}, {});

export default combineReducers({
  identifiers: identifiersReducer,
  isFetching: isFetchingReducer,
});
