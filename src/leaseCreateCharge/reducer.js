// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/leaseCreateCharge/types';


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseCreateCharge/FETCH_ATTRIBUTES': () => true,
  'mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leaseCreateCharge/RECEIVE_METHODS': () => false,
  'mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/leaseCreateCharge/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});


export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
