// @flow
import type {Action} from '../types';

export type MapDataState = {
  byType: MapDataMap,
  isFetching: boolean,
};

export type MapDataType = string;
export type MapData = Object;
export type MapDataMap = {[key: MapDataType]: MapData};

export type FetchMapDataByTypeAction = Action<'mvj/mapdata/FETCH_BY_TYPE', MapDataType>;
export type ReceiveMapDataByTypeAction = Action<'mvj/mapdata/RECEIVE_BY_TYPE', MapData>;

export type MapDataNotFoundAction = Action<'mvj/mapdata/NOT_FOUND', void>;
