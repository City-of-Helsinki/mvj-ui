// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  InfillDevelopment,
  InfillDevelopmentList,
  ReceiveInfillDevelopmentListAction,
  ReceiveSingleInfillDevelopmentAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/infillDevelopment/FETCH_ALL': () => true,
  'mvj/infillDevelopment/FETCH_SINGLE': () => true,
  'mvj/infillDevelopment/NOT_FOUND': () => false,
  'mvj/infillDevelopment/RECEIVE_ALL': () => false,
  'mvj/infillDevelopment/RECEIVE_SINGLE': () => false,
}, false);

const infillDevelopmentListReducer: Reducer<InfillDevelopmentList> = handleActions({
  ['mvj/infillDevelopment/RECEIVE_ALL']: (state: InfillDevelopmentList, {payload: infillDevelopments}: ReceiveInfillDevelopmentListAction) => {
    return infillDevelopments;
  },
}, {});

const currentInfillDevelopmentReducer: Reducer<InfillDevelopment> = handleActions({
  ['mvj/infillDevelopment/RECEIVE_SINGLE']: (state: InfillDevelopment, {payload: infillDevelopment}: ReceiveSingleInfillDevelopmentAction) => {
    return infillDevelopment;
  },
}, {});

export default combineReducers({
  current: currentInfillDevelopmentReducer,
  isFetching: isFetchingReducer,
  list: infillDevelopmentListReducer,
});
