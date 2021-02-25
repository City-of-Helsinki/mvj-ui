// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  CreateLandUseAgreementAttachmentAction,
  CreateLandUseAgreementAttachmentPayload,
  DeleteLandUseAgreementAttachmentAction,
  DeleteLandUseAgreementAttachmentPayload,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/landUseAgreementAttachment/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/landUseAgreementAttachment/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/landUseAgreementAttachment/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/landUseAgreementAttachment/ATTRIBUTES_NOT_FOUND')();

export const createLandUseAgreementAttachment = (payload: CreateLandUseAgreementAttachmentPayload): CreateLandUseAgreementAttachmentAction =>
  createAction('mvj/landUseAgreementAttachment/CREATE')(payload);

export const deleteLandUseAgreementAttachment = (payload: DeleteLandUseAgreementAttachmentPayload): DeleteLandUseAgreementAttachmentAction =>
  createAction('mvj/landUseAgreementAttachment/DELETE')(payload);
