// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/relatedLease/types';


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/relatedLease/FETCH_ATTRIBUTES': () => true,
  'mvj/relatedLease/RECEIVE_ATTRIBUTES': () => false,
  'mvj/relatedLease/RECEIVE_METHODS': () => false,
  'mvj/relatedLease/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/relatedLease/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/relatedLease/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
