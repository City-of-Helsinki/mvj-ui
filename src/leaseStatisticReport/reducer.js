// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/FETCH_ATTRIBUTES': () => true,
  'mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leaseStatisticReport/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
});
