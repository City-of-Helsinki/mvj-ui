// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  UiDataList,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchUiDataListAction,
  ReceiveUiDataListAction,
  NotFoundAction,
} from '$src/uiData/types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/uiData/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/uiData/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/uiData/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/uiData/ATTRIBUTES_NOT_FOUND')();

export const fetchUiDataList = (query: Object): FetchUiDataListAction =>
  createAction('mvj/uiData/FETCH_ALL')(query);

export const receiveUiDataList = (uiDataList: UiDataList): ReceiveUiDataListAction =>
  createAction('mvj/uiData/RECEIVE_ALL')(uiDataList);

export const notFound = (): NotFoundAction =>
  createAction('mvj/uiData/NOT_FOUND')();
