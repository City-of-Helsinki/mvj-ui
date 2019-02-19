// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Reducer} from '$src/types';
import type {
  ReceiveAttributesAction,
} from '$src/leaseCreateCharge/types';


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseCreateCharge/FETCH_ATTRIBUTES': () => true,
  'mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, null);

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
});
