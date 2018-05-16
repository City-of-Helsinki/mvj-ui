// @flow
import type {Selector} from '../types';
import type {
  MapData,
  MapDataState,
  MapDataType,
} from './types';

export const getIsFetching: Selector<boolean, void> = (state: MapDataState): boolean =>
  state.mapData.isFetching;

export const getMapDataByType: Selector<MapData, MapDataType> = (state: MapDataState, type: MapDataType): MapData => {
  return state.mapData.byType[type];
};
