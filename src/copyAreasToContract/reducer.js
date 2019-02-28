// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Methods, Reducer} from '../types';
import type {
  ReceiveMethodsAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/copyAreasToContract/FETCH_ATTRIBUTES': () => true,
  'mvj/copyAreasToContract/RECEIVE_METHODS': () => false,
  'mvj/copyAreasToContract/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/copyAreasToContract/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);


export default combineReducers<Object, any>({
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
