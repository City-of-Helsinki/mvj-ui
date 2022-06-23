// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {ServiceUnits, ReceiveServiceUnitsAction} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/serviceUnits/FETCH_ALL': () => true,
  'mvj/serviceUnits/NOT_FOUND': () => false,
  'mvj/serviceUnits/RECEIVE_ALL': () => false,
}, false);

const serviceUnitsReducer: Reducer<ServiceUnits> = handleActions({
  ['mvj/serviceUnits/RECEIVE_ALL']: (state: ServiceUnits, {payload: serviceUnits}: ReceiveServiceUnitsAction) => {
    return serviceUnits;
  },
}, []);

export default combineReducers<Object, any>({
  isFetching: isFetchingReducer,
  serviceUnits: serviceUnitsReducer,
});
