// @flow
import {createAction} from 'redux-actions';
import type {Attributes, Methods} from '$src/types';

import type {
  ApplicationRelatedAttachmentsNotFoundAction,
  ApplicationRelatedFormNotFoundAction,
  ApplicationRelatedPlotSearchNotFoundAction,
  ApplicationsNotFoundAction,
  AttachmentAttributesNotFoundAction,
  AttributesNotFoundAction,
  BatchEditPlotApplicationInfoChecksAction,
  ClearFormValidFlagsAction,
  CreatePlotApplicationAction,
  DeleteTargetInfoCheckMeetingMemoAction,
  DeleteUploadAction,
  EditPlotApplicationAction,
  FetchApplicationRelatedAttachmentsAction,
  FetchApplicationRelatedFormAction,
  FetchApplicationRelatedPlotSearchAction,
  FetchAttachmentAttributesAction,
  FetchAttributesAction,
  FetchPendingUploadsAction,
  FetchPlotApplicationsByBBoxAction,
  FetchPlotApplicationsListAction,
  FetchPlotSearchSubtypesAction,
  FetchSinglePlotApplicationAction,
  FetchTargetInfoChecksForPlotSearchAction,
  HideEditModeAction,
  InfoCheckBatchEditData,
  InfoCheckBatchEditErrors,
  InitializeFormEntriesForApplicationAction,
  NotFoundByBBoxAction,
  PendingUploadsNotFoundAction,
  PlotApplication,
  PlotApplicationsList,
  PlotSearchSubtypesNotFoundAction,
  ReceiveApplicationRelatedAttachmentsAction,
  ReceiveApplicationRelatedFormAction,
  ReceiveApplicationRelatedPlotSearchAction,
  ReceiveAttachmentAttributesAction,
  ReceiveAttachmentMethodsAction,
  ReceiveAttributesAction,
  ReceiveCollapseStatesAction,
  ReceiveFileOperationFinishedAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveMethodsAction,
  ReceivePendingUploadsAction,
  ReceivePlotApplicationInfoCheckBatchEditFailureAction,
  ReceivePlotApplicationInfoCheckBatchEditSuccessAction,
  ReceivePlotApplicationSavedAction,
  ReceivePlotApplicationSaveFailedAction,
  ReceivePlotApplicationsByBBoxAction,
  ReceivePlotApplicationsListAction,
  ReceivePlotSearchSubtypesAction,
  ReceiveSinglePlotApplicationAction,
  ReceiveTargetInfoCheckMeetingMemoUploadedAction,
  ReceiveTargetInfoChecksForPlotSearchAction,
  ReceiveUpdatedTargetInfoCheckItemAction,
  SetCurrentEditorTargetsAction,
  ShowEditModeAction,
  TargetInfoCheckMeetingMemoUploadFailedAction,
  TargetInfoChecksForPlotSearchNotFoundAction,
  UploadFileAction,
  UploadTargetInfoCheckMeetingMemoAction,
} from '$src/plotApplications/types';

export const fetchPlotApplicationsList = (search: string): FetchPlotApplicationsListAction =>
  createAction('mvj/plotApplications/FETCH_ALL')(search);

export const receivePlotApplicationsList = (list: PlotApplicationsList): ReceivePlotApplicationsListAction =>
  createAction('mvj/plotApplications/RECEIVE_ALL')(list);

export const fetchSinglePlotApplication = (id: number): FetchSinglePlotApplicationAction =>
  createAction('mvj/plotApplications/FETCH_SINGLE')(id);

export const receiveSinglePlotApplication = (plotApplication: PlotApplication): ReceiveSinglePlotApplicationAction =>
  createAction('mvj/plotApplications/RECEIVE_SINGLE')(plotApplication);

export const fetchPlotApplicationsByBBox = (params: Object): FetchPlotApplicationsByBBoxAction =>
  createAction('mvj/plotApplications/FETCH_BY_BBOX')(params);

export const receivePlotApplicationsByBBox = (leases: PlotApplicationsList): ReceivePlotApplicationsByBBoxAction =>
  createAction('mvj/plotApplications/RECEIVE_BY_BBOX')(leases);

export const notFoundByBBox = (): NotFoundByBBoxAction =>
  createAction('mvj/plotApplications/NOT_FOUND_BY_BBOX')();

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/plotApplications/FETCH_ATTRIBUTES')();

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/plotApplications/RECEIVE_METHODS')(methods);

export const applicationsNotFound = (): ApplicationsNotFoundAction =>
  createAction('mvj/plotApplications/APPLICATIONS_NOT_FOUND')();

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/plotApplications/ATTRIBUTES_NOT_FOUND')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTRIBUTES')(attributes);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/plotApplications/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/plotApplications/SHOW_EDIT')();

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/plotApplications/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/plotApplications/RECEIVE_COLLAPSE_STATES')(status);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/plotApplications/CLEAR_FORM_VALID_FLAGS')();

export const createPlotApplication = (plotApplication: PlotApplication): CreatePlotApplicationAction =>
  createAction('mvj/plotApplications/CREATE')(plotApplication);

export const editPlotApplication = (plotApplication: PlotApplication): EditPlotApplicationAction =>
  createAction('mvj/plotApplications/EDIT')(plotApplication);

export const fetchPlotSearchSubtypes = (payload: Object): FetchPlotSearchSubtypesAction =>
  createAction('mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES')(payload);

export const plotSearchSubtypesNotFound = (): PlotSearchSubtypesNotFoundAction =>
  createAction('mvj/plotApplications/PLOT_SEARCH_SUB_TYPES_NOT_FOUND')();

export const receivePlotSearchSubtypes = (subTypes: Object): ReceivePlotSearchSubtypesAction =>
  createAction('mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES')(subTypes);

export const receivePlotApplicationSaved = (id: number): ReceivePlotApplicationSavedAction =>
  createAction('mvj/plotApplications/RECEIVE_SAVED')(id);

export const receivePlotApplicationSaveFailed = (): ReceivePlotApplicationSaveFailedAction =>
  createAction('mvj/plotApplications/RECEIVE_SAVE_FAILED')();

export const fetchApplicationRelatedForm = (payload: Object): FetchApplicationRelatedFormAction =>
  createAction('mvj/plotApplications/FETCH_FORM')(payload);

export const receiveApplicationRelatedForm = (payload: Object): ReceiveApplicationRelatedFormAction =>
  createAction('mvj/plotApplications/RECEIVE_FORM')(payload);

export const applicationRelatedFormNotFound = (payload: Object): ApplicationRelatedFormNotFoundAction =>
  createAction('mvj/plotApplications/FORM_NOT_FOUND')(payload);

export const fetchApplicationRelatedPlotSearch = (payload: Object): FetchApplicationRelatedPlotSearchAction =>
  createAction('mvj/plotApplications/FETCH_PLOT_SEARCH')(payload);

export const receiveApplicationRelatedPlotSearch = (payload: Object): ReceiveApplicationRelatedPlotSearchAction =>
  createAction('mvj/plotApplications/RECEIVE_PLOT_SEARCH')(payload);

export const applicationRelatedPlotSearchNotFound = (payload: Object): ApplicationRelatedPlotSearchNotFoundAction =>
  createAction('mvj/plotApplications/PLOT_SEARCH_NOT_FOUND')(payload);

export const fetchApplicationRelatedAttachments = (payload: Object): FetchApplicationRelatedAttachmentsAction =>
  createAction('mvj/plotApplications/FETCH_ATTACHMENTS')(payload);

export const receiveApplicationRelatedAttachments = (payload: Object): ReceiveApplicationRelatedAttachmentsAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTACHMENTS')(payload);

export const applicationRelatedAttachmentsNotFound = (payload: Object): ApplicationRelatedAttachmentsNotFoundAction =>
  createAction('mvj/plotApplications/ATTACHMENTS_NOT_FOUND')(payload);

export const initializeFormEntriesForApplication = (payload: Object): InitializeFormEntriesForApplicationAction =>
  createAction('mvj/plotApplications/INITIALIZE_FORM_ENTRIES')(payload);

export const fetchPendingUploads = (): FetchPendingUploadsAction =>
  createAction('mvj/plotApplications/FETCH_PENDING_UPLOADS')();

export const receivePendingUploads = (payload: Object): ReceivePendingUploadsAction =>
  createAction('mvj/plotApplications/RECEIVE_PENDING_UPLOADS')(payload);

export const pendingUploadsNotFound = (): PendingUploadsNotFoundAction =>
  createAction('mvj/plotApplications/PENDING_UPLOADS_NOT_FOUND')();

export const deleteUploadedAttachment = (payload: Object): DeleteUploadAction =>
  createAction('mvj/plotApplications/DELETE_UPLOAD')(payload);

export const uploadAttachment = (payload: Object): UploadFileAction =>
  createAction('mvj/plotApplications/UPLOAD_FILE')(payload);

export const receiveFileOperationFinished = (): ReceiveFileOperationFinishedAction =>
  createAction('mvj/plotApplications/RECEIVE_FILE_OPERATION_FINISHED')();

export const fetchAttachmentAttributes = (): FetchAttachmentAttributesAction =>
  createAction('mvj/plotApplications/FETCH_ATTACHMENT_ATTRIBUTES')();

export const receiveAttachmentAttributes = (payload: Object): ReceiveAttachmentAttributesAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTACHMENT_ATTRIBUTES')(payload);

export const receiveAttachmentMethods = (payload: Object): ReceiveAttachmentMethodsAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTACHMENT_METHODS')(payload);

export const attachmentAttributesNotFound = (): AttachmentAttributesNotFoundAction =>
  createAction('mvj/plotApplications/ATTACHMENT_ATTRIBUTES_NOT_FOUND')();

export const setCurrentEditorTargets = (payload: Array<Object>): SetCurrentEditorTargetsAction =>
  createAction('mvj/plotApplications/SET_CURRENT_EDITOR_TARGETS')(payload);

export const receiveUpdatedTargetInfoCheckItem = (payload: Object): ReceiveUpdatedTargetInfoCheckItemAction =>
  createAction('mvj/plotApplications/RECEIVE_UPDATED_TARGET_INFO_CHECK_ITEM')(payload);

export const deleteTargetInfoCheckMeetingMemo = (payload: Object): DeleteTargetInfoCheckMeetingMemoAction =>
  createAction('mvj/plotApplications/DELETE_MEETING_MEMO')(payload);

export const uploadTargetInfoCheckMeetingMemo = (payload: Object): UploadTargetInfoCheckMeetingMemoAction =>
  createAction('mvj/plotApplications/UPLOAD_MEETING_MEMO')(payload);

export const receiveTargetInfoCheckMeetingMemoUploaded = (): ReceiveTargetInfoCheckMeetingMemoUploadedAction =>
  createAction('mvj/plotApplications/RECEIVE_MEETING_MEMO_UPLOADED')();

export const targetInfoCheckMeetingMemoUploadFailed = (): TargetInfoCheckMeetingMemoUploadFailedAction =>
  createAction('mvj/plotApplications/MEETING_MEMO_UPLOAD_FAILED')();

export const batchEditApplicationInfoChecks = (payload: InfoCheckBatchEditData): BatchEditPlotApplicationInfoChecksAction =>
  createAction('mvj/plotApplications/BATCH_EDIT_INFO_CHECKS')(payload);

export const receiveBatchInfoCheckEditSuccess = (): ReceivePlotApplicationInfoCheckBatchEditSuccessAction =>
  createAction('mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS')();

export const receiveBatchInfoCheckEditFailure = (payload: InfoCheckBatchEditErrors): ReceivePlotApplicationInfoCheckBatchEditFailureAction =>
  createAction('mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE')(payload);

export const fetchTargetInfoChecksForPlotSearch = (payload: number): FetchTargetInfoChecksForPlotSearchAction =>
  createAction('mvj/plotApplications/FETCH_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH')(payload);

export const receiveTargetInfoChecksForPlotSearch = (payload: Array<Object>): ReceiveTargetInfoChecksForPlotSearchAction =>
  createAction('mvj/plotApplications/RECEIVE_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH')(payload);

export const targetInfoChecksForPlotSearchNotFound = (): TargetInfoChecksForPlotSearchNotFoundAction =>
  createAction('mvj/plotApplications/TARGET_INFO_CHECKS_FOR_PLOT_SEARCH_NOT_FOUND')();
