// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  DistrictListMap,
  ReceiveDistrictsByMunicipalityAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/district/FETCH_BY_MUNICIPALITY': () => true,
  'mvj/district/NOT_FOUND': () => false,
  'mvj/district/RECEIVE_BY_MUNICIPALITY': () => false,
}, false);


const byMunicipalityReducer: Reducer<DistrictListMap> = handleActions({
  ['mvj/district/RECEIVE_BY_MUNICIPALITY']: (state: DistrictListMap, {payload: list}: ReceiveDistrictsByMunicipalityAction) => {
    return {
      ...state,
      [list.municipality]: list.districts,
    };
  },
}, {});

export default combineReducers({
  byMunicipality: byMunicipalityReducer,
  isFetching: isFetchingReducer,
});
