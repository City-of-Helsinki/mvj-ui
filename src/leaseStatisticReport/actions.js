// @flow
import {createAction} from 'redux-actions';

import type {Attributes} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  AttributesNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leaseStatisticReport/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES')(attributes);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/leaseStatisticReport/ATTRIBUTES_NOT_FOUND')();
