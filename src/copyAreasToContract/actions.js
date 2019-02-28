// @flow
import {createAction} from 'redux-actions';

import type {Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/copyAreasToContract/FETCH_ATTRIBUTES')();

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/copyAreasToContract/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/copyAreasToContract/ATTRIBUTES_NOT_FOUND')();
