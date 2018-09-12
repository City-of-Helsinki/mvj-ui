// @flow
import {createAction} from 'redux-actions';
import type {LeaseId} from '$src/leases/types';

import type {
  CollectionLetterFileData,
  CollectionLetterDeleteData,
  FetchCollectionLettersByLeaseAction,
  ReceiveCollectionLettersByLeaseAction,
  CollectionLettersNotFoundByLeaseAction,
  UploadCollectionLetterFileAction,
  DeleteCollectionLetterFileAction,
} from './types';

export const fetchCollectionLettersByLease = (lease: LeaseId): FetchCollectionLettersByLeaseAction =>
  createAction('mvj/collectionLetter/FETCH_BY_LEASE')(lease);

export const receiveCollectionLettersByLease = (payload: Object): ReceiveCollectionLettersByLeaseAction =>
  createAction('mvj/collectionLetter/RECEIVE_BY_LEASE')(payload);

export const notFoundByLease = (lease: LeaseId): CollectionLettersNotFoundByLeaseAction =>
  createAction('mvj/collectionLetter/NOT_FOUND_BY_LEASE')(lease);

export const uploadCollectionLetterFile = (payload: CollectionLetterFileData): UploadCollectionLetterFileAction =>
  createAction('mvj/collectionLetter/UPLOAD_FILE')(payload);

export const deleteCollectionLetterFile = (payload: CollectionLetterDeleteData): DeleteCollectionLetterFileAction =>
  createAction('mvj/collectionLetter/DELETE_FILE')(payload);
