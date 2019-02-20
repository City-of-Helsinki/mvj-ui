// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  IndexList,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchIndexListAction,
  ReceiveIndexListAction,
  NotFoundAction,
} from '$src/index/types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/index/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/index/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/index/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/index/ATTRIBUTES_NOT_FOUND')();

export const fetchIndexList = (query: Object): FetchIndexListAction =>
  createAction('mvj/index/FETCH_ALL')(query);

export const receiveIndexList= (indexList: IndexList): ReceiveIndexListAction =>
  createAction('mvj/index/RECEIVE_ALL')(indexList);

export const notFound = (): NotFoundAction =>
  createAction('mvj/index/NOT_FOUND')();
