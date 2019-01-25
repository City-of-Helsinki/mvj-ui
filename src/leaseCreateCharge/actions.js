// @flow
import {createAction} from 'redux-actions';

import type {Attributes} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  AttributesNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leaseCreateCharge/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES')(attributes);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND')();
