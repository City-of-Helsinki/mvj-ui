import { createAction } from "redux-actions";
import type {
  AreaSearchesByBBoxNotFoundAction,
  AreaSearchesNotFoundAction,
  AttributesNotFoundAction,
  FetchAreaSearchListAction,
  FetchAreaSearchListByBBoxAction,
  FetchAttributesAction,
  FetchSingleAreaSearchAction,
  ReceiveAreaSearchListAction,
  ReceiveAreaSearchListByBBoxAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveSingleAreaSearchAction,
  SingleAreaSearchNotFoundAction,
  ClearFormValidFlagsAction,
  HideEditModeAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ShowEditModeAction,
  FetchListAttributesAction,
  ReceiveListAttributesAction,
  ReceiveListMethodsAction,
  ListAttributesNotFoundAction,
  ReceiveAreaSearchInfoCheckBatchEditSuccessAction,
  ReceiveAreaSearchInfoCheckBatchEditFailureAction,
  BatchEditAreaSearchInfoChecksAction,
  EditAreaSearchAction,
  ReceiveAreaSearchEditedAction,
  ReceiveAreaSearchEditFailedAction,
  CreateAreaSearchSpecsAction,
  ReceiveAreaSearchSpecsCreateFailedAction,
  ReceiveAreaSearchSpecsCreatedAction,
  CreateAreaSearchApplicationAction,
  ReceiveAreaSearchApplicationCreatedAction,
  ReceiveAreaSearchApplicationCreateFailedAction,
  DeleteAreaSearchAttachmentAction,
  UploadAreaSearchAttachmentAction,
  ReceiveFileOperationFinishedAction,
  ReceiveFileOperationFailedAction,
  SetAreaSearchAttachmentsAction,
  UploadedAreaSearchAttachmentMeta,
} from "@/areaSearch/types";
import type { Attributes, Methods } from "types";
export const hideEditMode = (): HideEditModeAction =>
  createAction("mvj/areaSearch/HIDE_EDIT")();
export const showEditMode = (): ShowEditModeAction =>
  createAction("mvj/areaSearch/SHOW_EDIT")();
export const receiveCollapseStates = (
  status: Record<string, any>,
): ReceiveCollapseStatesAction =>
  createAction("mvj/areaSearch/RECEIVE_COLLAPSE_STATES")(status);
export const receiveIsSaveClicked = (
  isClicked: boolean,
): ReceiveIsSaveClickedAction =>
  createAction("mvj/areaSearch/RECEIVE_SAVE_CLICKED")(isClicked);
export const receiveFormValidFlags = (
  valid: Record<string, any>,
): ReceiveFormValidFlagsAction =>
  createAction("mvj/areaSearch/RECEIVE_FORM_VALID_FLAGS")(valid);
export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction("mvj/areaSearch/CLEAR_FORM_VALID_FLAGS")();
export const fetchListAttributes = (): FetchListAttributesAction =>
  createAction("mvj/areaSearch/FETCH_LIST_ATTRIBUTES")();
export const receiveListAttributes = (
  attributes: Attributes,
): ReceiveListAttributesAction =>
  createAction("mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES")(attributes);
export const receiveListMethods = (
  methods: Methods,
): ReceiveListMethodsAction =>
  createAction("mvj/areaSearch/RECEIVE_LIST_METHODS")(methods);
export const listAttributesNotFound = (): ListAttributesNotFoundAction =>
  createAction("mvj/areaSearch/LIST_ATTRIBUTES_NOT_FOUND")();
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/areaSearch/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/areaSearch/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/areaSearch/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction("mvj/areaSearch/ATTRIBUTES_NOT_FOUND")();
export const fetchAreaSearchList = (
  payload: Record<string, any>,
): FetchAreaSearchListAction =>
  createAction("mvj/areaSearch/FETCH_ALL")(payload);
export const fetchAreaSearchListByBBox = (
  payload: Record<string, any>,
): FetchAreaSearchListByBBoxAction =>
  createAction("mvj/areaSearch/FETCH_ALL_BY_BBOX")(payload);
export const receiveAreaSearchList = (
  payload: Record<string, any>,
): ReceiveAreaSearchListAction =>
  createAction("mvj/areaSearch/RECEIVE_ALL")(payload);
export const receiveAreaSearchByBBoxList = (
  payload: Record<string, any>,
): ReceiveAreaSearchListByBBoxAction =>
  createAction("mvj/areaSearch/RECEIVE_ALL_BY_BBOX")(payload);
export const areaSearchesNotFound = (): AreaSearchesNotFoundAction =>
  createAction("mvj/areaSearch/NOT_FOUND")();
export const areaSearchesByBBoxNotFound =
  (): AreaSearchesByBBoxNotFoundAction =>
    createAction("mvj/areaSearch/NOT_FOUND_BY_BBOX")();
export const fetchSingleAreaSearch = (
  id: number,
): FetchSingleAreaSearchAction =>
  createAction("mvj/areaSearch/FETCH_SINGLE")(id);
export const receiveSingleAreaSearch = (
  payload: Record<string, any>,
): ReceiveSingleAreaSearchAction =>
  createAction("mvj/areaSearch/RECEIVE_SINGLE")(payload);
export const singleAreaSearchNotFound = (): SingleAreaSearchNotFoundAction =>
  createAction("mvj/areaSearch/SINGLE_NOT_FOUND")();
export const batchEditAreaSearchInfoChecks = (
  payload: Record<string, any>,
): BatchEditAreaSearchInfoChecksAction =>
  createAction("mvj/areaSearch/BATCH_EDIT_INFO_CHECKS")(payload);
export const receiveAreaSearchInfoChecksBatchEditSuccess =
  (): ReceiveAreaSearchInfoCheckBatchEditSuccessAction =>
    createAction("mvj/areaSearch/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS")();
export const receiveAreaSearchInfoChecksBatchEditFailure = (
  payload: Record<string, any>,
): ReceiveAreaSearchInfoCheckBatchEditFailureAction =>
  createAction("mvj/areaSearch/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE")(payload);
export const editAreaSearch = (
  payload: Record<string, any>,
): EditAreaSearchAction => createAction("mvj/areaSearch/EDIT")(payload);
export const receiveAreaSearchEdited = (): ReceiveAreaSearchEditedAction =>
  createAction("mvj/areaSearch/RECEIVE_EDITED")();
export const receiveAreaSearchEditFailed = (
  payload: Record<string, any>,
): ReceiveAreaSearchEditFailedAction =>
  createAction("mvj/areaSearch/RECEIVE_EDIT_FAILED")(payload);
export const createAreaSearchSpecs = (
  payload: Record<string, any>,
): CreateAreaSearchSpecsAction =>
  createAction("mvj/areaSearch/CREATE_SPECS")(payload);
export const receiveAreaSearchSpecsCreated = (
  payload: Record<string, any>,
): ReceiveAreaSearchSpecsCreatedAction =>
  createAction("mvj/areaSearch/RECEIVE_SPECS_CREATED")(payload);
export const receiveAreaSearchSpecsCreateFailed =
  (): ReceiveAreaSearchSpecsCreateFailedAction =>
    createAction("mvj/areaSearch/RECEIVE_SPECS_CREATE_FAILED")();
export const createAreaSearchApplication = (
  payload: Record<string, any>,
): CreateAreaSearchApplicationAction =>
  createAction("mvj/areaSearch/CREATE_APPLICATION")(payload);
export const receiveAreaSearchApplicationCreated =
  (): ReceiveAreaSearchApplicationCreatedAction =>
    createAction("mvj/areaSearch/RECEIVE_APPLICATION_CREATED")();
export const receiveAreaSearchApplicationCreateFailed =
  (): ReceiveAreaSearchApplicationCreateFailedAction =>
    createAction("mvj/areaSearch/RECEIVE_APPLICATION_CREATE_FAILED")();
export const deleteUploadedAttachment = (
  payload: Record<string, any>,
): DeleteAreaSearchAttachmentAction =>
  createAction("mvj/areaSearch/DELETE_ATTACHMENT")(payload);
export const uploadAttachment = (
  payload: Record<string, any>,
): UploadAreaSearchAttachmentAction =>
  createAction("mvj/areaSearch/UPLOAD_ATTACHMENT")(payload);
export const receiveFileOperationFinished =
  (): ReceiveFileOperationFinishedAction =>
    createAction("mvj/areaSearch/RECEIVE_FILE_OPERATION_FINISHED")();
export const receiveFileOperationFailed = (
  error: any,
): ReceiveFileOperationFailedAction =>
  createAction("mvj/areaSearch/RECEIVE_FILE_OPERATION_FAILED")(error);
export const setAreaSearchAttachments = (
  attachments: Array<UploadedAreaSearchAttachmentMeta>,
): SetAreaSearchAttachmentsAction =>
  createAction("mvj/areaSearch/SET_ATTACHMENTS")(attachments);
