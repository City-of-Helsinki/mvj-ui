// @flow

import type {Action, CombinedReducer} from 'redux';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  ApplicationState,
  ReceiveApplicantInfoCheckAttributesAction,
  ReceiveApplicationRelatedAttachmentsAction,
  ReceiveAttachmentAttributesAction,
  ReceiveAttachmentMethodsAction,
  ReceiveAttributesAction,
  ReceiveFormAttributesAction,
  ReceiveMethodsAction,
} from '$src/application/types';

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/application/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/application/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/application/FETCH_ATTRIBUTES']: () => true,
  ['mvj/application/RECEIVE_ATTRIBUTES']: () => false,
  ['mvj/application/ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/application/RECEIVE_METHODS']: () => false,
}, false);

const applicantInfoCheckAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveApplicantInfoCheckAttributesAction) => attributes,
  ['mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const isFetchingApplicantInfoCheckAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES']: () => true,
  ['mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES']: () => false,
  ['mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => false,
}, false);

export const isFetchingFormAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/application/FETCH_FORM_ATTRIBUTES']: () => true,
  ['mvj/application/FORM_ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/application/RECEIVE_FORM_ATTRIBUTES']: () => false,
}, false);

export const formAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/application/RECEIVE_FORM_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveFormAttributesAction) => {
    return attributes;
  },
}, null);

export const fieldTypeMappingReducer: Reducer<{ [id: number]: string }> = handleActions({
  ['mvj/application/RECEIVE_FORM_ATTRIBUTES']: (state: { [id: number]: string }, {payload: attributes}: ReceiveFormAttributesAction) => {
    return attributes?.sections?.child?.children.fields?.child?.children.type?.choices?.reduce(
      (acc, choice) => {
        acc[choice.value] = choice.display_name;
        return acc;
      },
      {},
    ) || {};
  },
}, {});

const attachmentAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/application/RECEIVE_ATTACHMENT_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttachmentAttributesAction) => attributes,
  ['mvj/application/ATTACHMENT_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const attachmentMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/application/RECEIVE_ATTACHMENT_METHODS']: (state: Methods, {payload: methods}: ReceiveAttachmentMethodsAction) => methods,
  ['mvj/application/ATTACHMENT_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const isFetchingAttachmentAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/application/FETCH_ATTACHMENT_ATTRIBUTES']: () => true,
  ['mvj/application/RECEIVE_ATTACHMENT_ATTRIBUTES']: () => false,
  ['mvj/application/ATTACHMENT_ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/application/RECEIVE_ATTACHMENT_METHODS']: () => false,
}, false);

const applicationAttachmentsReducer: Reducer<Object> = handleActions({
  ['mvj/application/FETCH_ATTACHMENTS']: () => null,
  ['mvj/application/RECEIVE_ATTACHMENTS']: (state: Object, {payload: attachments}: ReceiveApplicationRelatedAttachmentsAction) => attachments,
}, null);

const isFetchingApplicationAttachmentsReducer: Reducer<boolean> = handleActions({
  ['mvj/application/FETCH_ATTACHMENTS']: () => true,
  ['mvj/application/RECEIVE_ATTACHMENTS']: () => false,
  ['mvj/application/ATTACHMENTS_NOT_FOUND']: () => false,
}, false);

export const pendingUploadsReducer: Reducer<Array<Object>> = handleActions({
  ['mvj/application/FETCH_PENDING_UPLOADS']: () => [],
  ['mvj/application/RECEIVE_PENDING_UPLOADS']: (state, {payload}) => payload,
}, []);

export const isFetchingPendingUploadsReducer: Reducer<boolean> = handleActions({
  ['mvj/application/FETCH_PENDING_UPLOADS']: () => true,
  ['mvj/application/RECEIVE_PENDING_UPLOADS']: () => false,
  ['mvj/application/PENDING_UPLOADS_NOT_FOUND']: () => false,
}, false);

const isPerformingFileOperationReducer: Reducer<boolean> = handleActions({
  ['mvj/application/UPLOAD_FILE']: () => true,
  ['mvj/application/DELETE_UPLOAD']: () => true,
  ['mvj/application/RECEIVE_FILE_OPERATION_FINISHED']: () => false,
}, false);

export default (combineReducers<Object, Action<any>>({
  attributes: attributesReducer,
  methods: methodsReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFetchingApplicantInfoCheckAttributes: isFetchingApplicantInfoCheckAttributesReducer,
  applicantInfoCheckAttributes: applicantInfoCheckAttributesReducer,
  isFetchingFormAttributes: isFetchingFormAttributesReducer,
  formAttributes: formAttributesReducer,
  fieldTypeMapping: fieldTypeMappingReducer,
  isFetchingAttachmentAttributes: isFetchingAttachmentAttributesReducer,
  attachmentAttributes: attachmentAttributesReducer,
  attachmentMethods: attachmentMethodsReducer,
  applicationAttachments: applicationAttachmentsReducer,
  isFetchingApplicationAttachments: isFetchingApplicationAttachmentsReducer,
  pendingUploads: pendingUploadsReducer,
  isFetchingPendingUploads: isFetchingPendingUploadsReducer,
  isPerformingFileOperation: isPerformingFileOperationReducer,
}): CombinedReducer<ApplicationState, Action<any>>);
