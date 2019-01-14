// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {MapData, MapDataType} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.mapData.isFetching;

export const getMapDataByType: Selector<MapData, MapDataType> = (state: RootState, type: MapDataType): MapData => {
  return state.mapData.byType[type];
};
