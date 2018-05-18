// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  MapData,
  MapDataState,
  ReceiveMapDataByTypeAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/mapdata/FETCH_BY_TYPE': () => true,
  'mvj/mapdata/NOT_FOUND': () => false,
  'mvj/mapdata/RECEIVE_BY_TYPE': () => false,
}, false);


const byTypeReducer: Reducer<MapData> = handleActions({
  ['mvj/mapdata/RECEIVE_BY_TYPE']: (state: MapDataState, {payload: list}: ReceiveMapDataByTypeAction) => {
    return {
      ...state,
      [list.type]: list.data,
    };
  },
}, {});

export default combineReducers({
  byType: byTypeReducer,
  isFetching: isFetchingReducer,
});
