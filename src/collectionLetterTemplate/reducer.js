// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  CollectionLetterTemplates,
  ReceiveCollectionLetterTemplatesAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/collectionLetterTemplate/FETCH_ATTRIBUTES': () => true,
  'mvj/collectionLetterTemplate/RECEIVE_ATTRIBUTES': () => false,
  'mvj/collectionLetterTemplate/RECEIVE_METHODS': () => false,
  'mvj/collectionLetterTemplate/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/collectionLetterTemplate/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/collectionLetterTemplate/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, {});

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/collectionLetterTemplate/FETCH_ALL': () => true,
  'mvj/collectionLetterTemplate/NOT_FOUND': () => false,
  'mvj/collectionLetterTemplate/RECEIVE_ALL': () => false,
}, false);

const collectionLetterTemplatesReducer: Reducer<CollectionLetterTemplates> = handleActions({
  ['mvj/collectionLetterTemplate/RECEIVE_ALL']: (state: CollectionLetterTemplates, {payload: templates}: ReceiveCollectionLetterTemplatesAction) => {
    return templates;
  },
}, []);

export default combineReducers({
  attributes: attributesReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  list: collectionLetterTemplatesReducer,
  methods: methodsReducer,
});
