// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
} from '$src/leaseholdTransfer/types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leaseholdTransfer/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leaseholdTransfer/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/leaseholdTransfer/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/leaseholdTransfer/ATTRIBUTES_NOT_FOUND')();
