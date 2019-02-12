// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  MapDataMap,
  ReceiveMapDataByTypeAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/mapdata/FETCH_BY_TYPE': () => true,
  'mvj/mapdata/NOT_FOUND': () => false,
  'mvj/mapdata/RECEIVE_BY_TYPE': () => false,
}, false);


const byTypeReducer: Reducer<MapDataMap> = handleActions({
  ['mvj/mapdata/RECEIVE_BY_TYPE']: (state: MapDataMap, {payload: list}: ReceiveMapDataByTypeAction) => {
    return {
      ...state,
      [list.type]: list.data,
    };
  },
}, {});

export default combineReducers<Object, any>({
  byType: byTypeReducer,
  isFetching: isFetchingReducer,
});
