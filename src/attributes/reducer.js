// @flow
// import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {AttributesState, ReceiveAttributesAction} from './types';

// const isFetchingReducer: Reducer<boolean> = handleActions({
//   'mvj/attribute/FETCH': () => true,
//   'mvj/attribute/RECEIVE': () => false,
//   'mvj/attribute/NOT_FOUND': () => false,
// }, false);

const attributeTypesReducer: Reducer<AttributesState> = handleActions({
  ['mvj/attribute/RECEIVE']: (state: AttributesState, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

export default attributeTypesReducer;
