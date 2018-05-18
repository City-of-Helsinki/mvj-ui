// @flow
import {createAction} from 'redux-actions';

import type {
  MapDataType,
  MapData,
  FetchMapDataByTypeAction,
  ReceiveMapDataByTypeAction,
  MapDataNotFoundAction,
} from './types';

export const notFound = (): MapDataNotFoundAction =>
  createAction('mvj/mapdata/NOT_FOUND')();

export const fetchMapDataByType = (type: MapDataType): FetchMapDataByTypeAction =>
  createAction('mvj/mapdata/FETCH_BY_TYPE')(type);

export const receiveMapDataByType = (data: MapData): ReceiveMapDataByTypeAction  =>
  createAction('mvj/mapdata/RECEIVE_BY_TYPE')(data);
