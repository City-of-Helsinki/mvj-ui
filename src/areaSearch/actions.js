// @flow

import {createAction} from 'redux-actions';
import type {
  AreaSearchesByBBoxNotFoundAction,
  AreaSearchesNotFoundAction,
  AttributesNotFoundAction, FetchAreaSearchListAction, FetchAreaSearchListByBBoxAction,
  FetchAttributesAction, ReceiveAreaSearchListAction, ReceiveAreaSearchListByBBoxAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/areaSearch/types';
import type {Attributes, Methods} from '$src/types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/areaSearch/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/areaSearch/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/areaSearch/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/areaSearch/ATTRIBUTES_NOT_FOUND')();

export const fetchAreaSearchList = (payload: Object): FetchAreaSearchListAction =>
  createAction('mvj/areaSearch/FETCH_ALL')(payload);

export const fetchAreaSearchListByBBox = (payload: Object): FetchAreaSearchListByBBoxAction =>
  createAction('mvj/areaSearch/FETCH_ALL_BY_BBOX')(payload);

export const receiveAreaSearchList = (payload: Object): ReceiveAreaSearchListAction =>
  createAction('mvj/areaSearch/RECEIVE_ALL')(payload);

export const receiveAreaSearchByBBoxList = (payload: Object): ReceiveAreaSearchListByBBoxAction =>
  createAction('mvj/areaSearch/RECEIVE_ALL_BY_BBOX')(payload);

export const areaSearchesNotFound = (): AreaSearchesNotFoundAction =>
  createAction('mvj/areaSearch/NOT_FOUND')();

export const areaSearchesByBBoxNotFound = (): AreaSearchesByBBoxNotFoundAction =>
  createAction('mvj/areaSearch/NOT_FOUND_BY_BBOX')();
