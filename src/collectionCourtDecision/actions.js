// @flow
import {createAction} from 'redux-actions';
import type {LeaseId} from '$src/leases/types';

import type {
  UploadCollectionCourtDecisionPayload,
  DeleteCollectionCourtDecisionPayload,
  FetchCollectionCourtDecisionsByLeaseAction,
  ReceiveCollectionCourtDecisionsByLeaseAction,
  CollectionCourtDecisionsNotFoundByLeaseAction,
  UploadCollectionCourtDecisionAction,
  DeleteCollectionCourtDecisionAction,
} from './types';

export const fetchCollectionCourtDecisionsByLease = (lease: LeaseId): FetchCollectionCourtDecisionsByLeaseAction =>
  createAction('mvj/collectionCourtDecision/FETCH_BY_LEASE')(lease);

export const receiveCollectionCourtDecisionsByLease = (payload: Object): ReceiveCollectionCourtDecisionsByLeaseAction =>
  createAction('mvj/collectionCourtDecision/RECEIVE_BY_LEASE')(payload);

export const notFoundByLease = (lease: LeaseId): CollectionCourtDecisionsNotFoundByLeaseAction =>
  createAction('mvj/collectionCourtDecision/NOT_FOUND_BY_LEASE')(lease);

export const uploadCollectionCourtDecision = (payload: UploadCollectionCourtDecisionPayload): UploadCollectionCourtDecisionAction =>
  createAction('mvj/collectionCourtDecision/UPLOAD')(payload);

export const deleteCollectionCourtDecision = (payload: DeleteCollectionCourtDecisionPayload): DeleteCollectionCourtDecisionAction =>
  createAction('mvj/collectionCourtDecision/DELETE')(payload);
