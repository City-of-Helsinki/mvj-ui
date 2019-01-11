// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/copyAreasToContract/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/copyAreasToContract/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/copyAreasToContract/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/copyAreasToContract/ATTRIBUTES_NOT_FOUND')();
