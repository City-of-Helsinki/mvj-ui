// @flow
import {createAction} from 'redux-actions';
import type {LeaseId} from '$src/leases/types';

import type {
  UploadCollectionLetterPayload,
  DeleteCollectionLetterPayload,
  FetchCollectionLettersByLeaseAction,
  ReceiveCollectionLettersByLeaseAction,
  CollectionLettersNotFoundByLeaseAction,
  UploadCollectionLetterAction,
  DeleteCollectionLetterAction,
} from './types';

export const fetchCollectionLettersByLease = (lease: LeaseId): FetchCollectionLettersByLeaseAction =>
  createAction('mvj/collectionLetter/FETCH_BY_LEASE')(lease);

export const receiveCollectionLettersByLease = (payload: Object): ReceiveCollectionLettersByLeaseAction =>
  createAction('mvj/collectionLetter/RECEIVE_BY_LEASE')(payload);

export const notFoundByLease = (lease: LeaseId): CollectionLettersNotFoundByLeaseAction =>
  createAction('mvj/collectionLetter/NOT_FOUND_BY_LEASE')(lease);

export const uploadCollectionLetter = (payload: UploadCollectionLetterPayload): UploadCollectionLetterAction =>
  createAction('mvj/collectionLetter/UPLOAD')(payload);

export const deleteCollectionLetter = (payload: DeleteCollectionLetterPayload): DeleteCollectionLetterAction =>
  createAction('mvj/collectionLetter/DELETE')(payload);
