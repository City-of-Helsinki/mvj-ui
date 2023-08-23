// @flow
import {createAction} from 'redux-actions';

import type {
  ApplicantInfoCheckAttributesNotFoundAction,
  ApplicationRelatedAttachmentsNotFoundAction,
  AttachmentAttributesNotFoundAction,
  AttributesNotFoundAction,
  DeleteUploadAction,
  FetchApplicantInfoCheckAttributesAction,
  FetchApplicationRelatedAttachmentsAction,
  FetchAttachmentAttributesAction,
  FetchAttributesAction,
  FetchFormAttributesAction,
  FetchPendingUploadsAction,
  FormAttributesNotFoundAction,
  PendingUploadsNotFoundAction,
  ReceiveApplicantInfoCheckAttributesAction,
  ReceiveApplicationRelatedAttachmentsAction,
  ReceiveAttachmentAttributesAction,
  ReceiveAttachmentMethodsAction,
  ReceiveAttributesAction,
  ReceiveFileOperationFinishedAction,
  ReceiveFormAttributesAction,
  ReceiveMethodsAction,
  ReceivePendingUploadsAction,
  ReceiveUpdatedApplicantInfoCheckItemAction,
  ReceiveUpdatedTargetInfoCheckItemAction,
  UploadFileAction,
} from '$src/application/types';
import type {Attributes, Methods} from '$src/types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/application/FETCH_ATTRIBUTES')();
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/application/RECEIVE_METHODS')(methods);
export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/application/ATTRIBUTES_NOT_FOUND')();
export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/application/RECEIVE_ATTRIBUTES')(attributes);
export const fetchApplicantInfoCheckAttributes = (): FetchApplicantInfoCheckAttributesAction =>
  createAction('mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES')();
export const receiveApplicantInfoCheckAttributes = (payload: Object): ReceiveApplicantInfoCheckAttributesAction =>
  createAction('mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES')(payload);
export const applicantInfoCheckAttributesNotFound = (): ApplicantInfoCheckAttributesNotFoundAction =>
  createAction('mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND')();
export const receiveUpdatedApplicantInfoCheckItem = (payload: Object): ReceiveUpdatedApplicantInfoCheckItemAction =>
  createAction('mvj/application/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM')(payload);
export const receiveUpdatedTargetInfoCheckItem = (payload: Object): ReceiveUpdatedTargetInfoCheckItemAction =>
  createAction('mvj/application/RECEIVE_UPDATED_TARGET_INFO_CHECK_ITEM')(payload);
export const fetchFormAttributes = (payload: Object): FetchFormAttributesAction =>
  createAction('mvj/application/FETCH_FORM_ATTRIBUTES')(payload);
export const formAttributesNotFound = (): FormAttributesNotFoundAction =>
  createAction('mvj/application/FORM_ATTRIBUTES_NOT_FOUND')();
export const receiveFormAttributes = (attributes: Attributes): ReceiveFormAttributesAction =>
  createAction('mvj/application/RECEIVE_FORM_ATTRIBUTES')(attributes);
export const fetchAttachmentAttributes = (): FetchAttachmentAttributesAction =>
  createAction('mvj/application/FETCH_ATTACHMENT_ATTRIBUTES')();
export const receiveAttachmentAttributes = (payload: Object): ReceiveAttachmentAttributesAction =>
  createAction('mvj/application/RECEIVE_ATTACHMENT_ATTRIBUTES')(payload);
export const receiveAttachmentMethods = (payload: Object): ReceiveAttachmentMethodsAction =>
  createAction('mvj/application/RECEIVE_ATTACHMENT_METHODS')(payload);
export const attachmentAttributesNotFound = (): AttachmentAttributesNotFoundAction =>
  createAction('mvj/application/ATTACHMENT_ATTRIBUTES_NOT_FOUND')();
export const fetchApplicationRelatedAttachments = (payload: Object): FetchApplicationRelatedAttachmentsAction =>
  createAction('mvj/application/FETCH_ATTACHMENTS')(payload);
export const receiveApplicationRelatedAttachments = (payload: Object): ReceiveApplicationRelatedAttachmentsAction =>
  createAction('mvj/application/RECEIVE_ATTACHMENTS')(payload);
export const applicationRelatedAttachmentsNotFound = (payload: Object): ApplicationRelatedAttachmentsNotFoundAction =>
  createAction('mvj/application/ATTACHMENTS_NOT_FOUND')(payload);
export const deleteUploadedAttachment = (payload: Object): DeleteUploadAction =>
  createAction('mvj/application/DELETE_UPLOAD')(payload);
export const uploadAttachment = (payload: Object): UploadFileAction =>
  createAction('mvj/application/UPLOAD_FILE')(payload);
export const fetchPendingUploads = (): FetchPendingUploadsAction =>
  createAction('mvj/application/FETCH_PENDING_UPLOADS')();
export const receivePendingUploads = (payload: Object): ReceivePendingUploadsAction =>
  createAction('mvj/application/RECEIVE_PENDING_UPLOADS')(payload);
export const pendingUploadsNotFound = (): PendingUploadsNotFoundAction =>
  createAction('mvj/application/PENDING_UPLOADS_NOT_FOUND')();
export const receiveFileOperationFinished = (): ReceiveFileOperationFinishedAction =>
  createAction('mvj/application/RECEIVE_FILE_OPERATION_FINISHED')();
