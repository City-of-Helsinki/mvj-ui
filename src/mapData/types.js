// @flow
import type {Action} from '../types';

export type MapDataState = Object;

export type MapDataType = string;
export type MapData = Object;

export type FetchMapDataByTypeAction = Action<'mvj/mapdata/FETCH_BY_TYPE', string>;
export type ReceiveMapDataByTypeAction = Action<'mvj/mapdata/RECEIVE_BY_TYPE', MapData>;

export type MapDataNotFoundAction = Action<'mvj/mapdata/NOT_FOUND', void>;
