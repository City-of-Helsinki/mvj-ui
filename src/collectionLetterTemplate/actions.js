// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  CollectionLetterTemplateAttributesNotFoundAction,
  CollectionLetterTemplates,
  FetchCollectionLetterTemplatesAction,
  ReceiveCollectionLetterTemplatesAction,
  CollectionLetterTemplatesNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/collectionLetterTemplate/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/collectionLetterTemplate/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/collectionLetterTemplate/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): CollectionLetterTemplateAttributesNotFoundAction =>
  createAction('mvj/collectionLetterTemplate/ATTRIBUTES_NOT_FOUND')();

export const fetchCollectionLetterTemplates = (): FetchCollectionLetterTemplatesAction =>
  createAction('mvj/collectionLetterTemplate/FETCH_ALL')();

export const receiveCollectionLetterTemplates = (templates: CollectionLetterTemplates): ReceiveCollectionLetterTemplatesAction =>
  createAction('mvj/collectionLetterTemplate/RECEIVE_ALL')(templates);

export const notFound = (): CollectionLetterTemplatesNotFoundAction =>
  createAction('mvj/collectionLetterTemplate/NOT_FOUND')();
