// @flow

import {createAction} from 'redux-actions';

import type {
  AttributesState,
  FetchAttributesAction,
  ReceiveAttributesAction,
  AttributesNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/attribute/FETCH')();

export const receiveAttributes = (attributes: AttributesState): ReceiveAttributesAction =>
  createAction('mvj/attribute/RECEIVE')(attributes);

export const notFound = (): AttributesNotFoundAction =>
  createAction('mvj/attribute/NOT_FOUND')();
