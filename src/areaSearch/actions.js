// @flow

import {createAction} from 'redux-actions';
import type {
  AreaSearchesNotFoundAction,
  AttributesNotFoundAction, FetchAreaSearchListAction,
  FetchAttributesAction, ReceiveAreaSearchListAction,
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

export const receiveAreaSearchList = (payload: Object): ReceiveAreaSearchListAction =>
  createAction('mvj/areaSearch/RECEIVE_ALL')(payload);

export const areaSearchesNotFound = (): AreaSearchesNotFoundAction =>
  createAction('mvj/areaSearch/NOT_FOUND')();
