// @flow

import {createAction} from 'redux-actions';

import type {
  CollectionLetterTemplates,
  FetchCollectionLetterTemplatesAction,
  ReceiveCollectionLetterTemplatesAction,
  CollectionLetterTemplatesNotFoundAction,
} from './types';

export const fetchCollectionLetterTemplates = (): FetchCollectionLetterTemplatesAction =>
  createAction('mvj/collectionLetterTemplate/FETCH_ALL')();

export const receiveCollectionLetterTemplates = (templates: CollectionLetterTemplates): ReceiveCollectionLetterTemplatesAction =>
  createAction('mvj/collectionLetterTemplate/RECEIVE_ALL')(templates);

export const notFound = (): CollectionLetterTemplatesNotFoundAction =>
  createAction('mvj/collectionLetterTemplate/NOT_FOUND')();
