// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  FetchCollectionCourtDecisionsByLeaseAction,
  ReceiveCollectionCourtDecisionsByLeaseAction,
  CollectionCourtDecisionsNotFoundByLeaseAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/collectionCourtDecision/FETCH_ATTRIBUTES': () => true,
  'mvj/collectionCourtDecision/RECEIVE_ATTRIBUTES': () => false,
  'mvj/collectionCourtDecision/RECEIVE_METHODS': () => false,
  'mvj/collectionCourtDecision/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/collectionCourtDecision/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/collectionCourtDecision/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const isModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/collectionCourtDecision/HIDE_MODAL': () => false,
  'mvj/collectionCourtDecision/SHOW_MODAL': () => true,
}, false);

const isFetchingByLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionCourtDecision/FETCH_BY_LEASE']: (state: Object, {payload: lease}: FetchCollectionCourtDecisionsByLeaseAction) => {
    return {
      ...state,
      [lease]: true,
    };
  },
  ['mvj/collectionCourtDecision/RECEIVE_BY_LEASE']: (state: Object, {payload: {lease}}: ReceiveCollectionCourtDecisionsByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
  ['mvj/collectionCourtDecision/NOT_FOUND_BY_LEASE']: (state: Object, {payload: lease}: CollectionCourtDecisionsNotFoundByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
}, {});

const byLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionCourtDecision/RECEIVE_BY_LEASE']: (state: Object, {payload}: ReceiveCollectionCourtDecisionsByLeaseAction) => {
    return {
      ...state,
      [payload.lease]: payload.collectionCourtDecisions,
    };
  },
}, {});

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
  isModalOpen: isModalOpenReducer,
  methods: methodsReducer,
});
