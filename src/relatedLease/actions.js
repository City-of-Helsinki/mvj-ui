// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  RelatedLeaseAttributesNotFoundAction,
  CreateRelatedLeasePayload,
  CreateRelatedLeaseAction,
  DeleteRelatedLeasePayload,
  DeleteRelatedLeaseAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/relatedLease/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/relatedLease/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/relatedLease/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): RelatedLeaseAttributesNotFoundAction =>
  createAction('mvj/relatedLease/ATTRIBUTES_NOT_FOUND')();

export const createReleatedLease = (payload: CreateRelatedLeasePayload): CreateRelatedLeaseAction =>
  createAction('mvj/relatedLease/CREATE')(payload);

export const deleteReleatedLease = (payload: DeleteRelatedLeasePayload): DeleteRelatedLeaseAction =>
  createAction('mvj/relatedLease/DELETE')(payload);
