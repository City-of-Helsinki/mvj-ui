// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  LandUseContractState,
  LandUseContract,
  LandUseContractList,
  ReceiveAttributesAction,
  ReceiveLandUseContractListAction,
  ReceiveSingleLandUseContractAction,
} from './types';

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/landUseContract/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseContract/FETCH_ALL']: () => true,
  ['mvj/landUseContract/RECEIVE_ALL']: () => false,
}, false);

const landUseContractListReducer: Reducer<LandUseContractList> = handleActions({
  ['mvj/landUseContract/RECEIVE_ALL']: (state: LandUseContractState, {payload: list}: ReceiveLandUseContractListAction) => list,
}, {});

const currentLandUseContractReducer: Reducer<LandUseContract> = handleActions({
  ['mvj/landUseContract/RECEIVE_SINGLE']: (state: LandUseContractState, {payload: contract}: ReceiveSingleLandUseContractAction) => contract,
}, {});

export default combineReducers({
  attributes: attributesReducer,
  current: currentLandUseContractReducer,
  isFetching: isFetchingReducer,
  list: landUseContractListReducer,
});
