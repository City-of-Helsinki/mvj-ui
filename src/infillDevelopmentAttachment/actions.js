// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  CreateInfillDevelopmentAttachmentAction,
  CreateInfillDevelopmentAttachmentPayload,
  DeleteInfillDevelopmentAttachmentAction,
  DeleteInfillDevelopmentAttachmentPayload,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/infillDevelopmentAttachment/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/infillDevelopmentAttachment/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/infillDevelopmentAttachment/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/infillDevelopmentAttachment/ATTRIBUTES_NOT_FOUND')();

export const createInfillDevelopmentAttachment = (payload: CreateInfillDevelopmentAttachmentPayload): CreateInfillDevelopmentAttachmentAction =>
  createAction('mvj/infillDevelopmentAttachment/CREATE')(payload);

export const deleteInfillDevelopmentAttachment = (payload: DeleteInfillDevelopmentAttachmentPayload): DeleteInfillDevelopmentAttachmentAction =>
  createAction('mvj/infillDevelopmentAttachment/DELETE')(payload);
