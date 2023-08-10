// @flow
import type {Action, ApiResponse, Attributes, Methods} from '$src/types';
import type {UploadedFileMeta} from '$src/application/types';

export type AreaSearchState = {
  attributes: Attributes,
  methods: Methods,
  isFetchingAttributes: boolean,
  listAttributes: Attributes,
  listMethods: Methods,
  isFetchingListAttributes: boolean,
  areaSearchList: ApiResponse,
  areaSearchListByBBox: ApiResponse,
  isFetchingAreaSearchList: boolean,
  isFetchingAreaSearchListByBBox: boolean,
  currentAreaSearch: Object,
  isFetchingCurrentAreaSearch: boolean,
  isEditMode: boolean,
  isSaveClicked: boolean,
  collapseStates: Object,
  isFormValidById: Object,
  isBatchEditingAreaSearchInfoChecks: boolean,
  isEditingAreaSearch: boolean,
  lastAreaSearchEditError: any,
  isSubmittingAreaSearchSpecs: boolean,
  isSubmittingAreaSearchApplication: boolean,
  isPerformingFileOperation: boolean,
};

export type AreaSearch = Object;

export type FetchListAttributesAction = Action<'mvj/areaSearch/FETCH_LIST_ATTRIBUTES', void>;
export type ReceiveListAttributesAction = Action<'mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES', Attributes>;
export type ReceiveListMethodsAction = Action<'mvj/areaSearch/RECEIVE_LIST_METHODS', Methods>;
export type ListAttributesNotFoundAction = Action<'mvj/areaSearch/LIST_ATTRIBUTES_NOT_FOUND', void>;

export type FetchAttributesAction = Action<'mvj/areaSearch/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/areaSearch/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/areaSearch/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/areaSearch/ATTRIBUTES_NOT_FOUND', void>;

export type FetchAreaSearchListAction = Action<'mvj/areaSearch/FETCH_ALL', Object>;
export type FetchAreaSearchListByBBoxAction = Action<'mvj/areaSearch/FETCH_ALL_BY_BBOX', Object>;
export type ReceiveAreaSearchListAction = Action<'mvj/areaSearch/RECEIVE_ALL', Object>;
export type ReceiveAreaSearchListByBBoxAction = Action<'mvj/areaSearch/RECEIVE_ALL_BY_BBOX', Object>;
export type AreaSearchesNotFoundAction = Action<'mvj/areaSearch/NOT_FOUND', void>;
export type AreaSearchesByBBoxNotFoundAction = Action<'mvj/areaSearch/NOT_FOUND_BY_BBOX', void>;

export type FetchSingleAreaSearchAction = Action<'mvj/areaSearch/FETCH_SINGLE', number>;
export type ReceiveSingleAreaSearchAction = Action<'mvj/areaSearch/RECEIVE_SINGLE', Object>;
export type SingleAreaSearchNotFoundAction = Action<'mvj/areaSearch/SINGLE_NOT_FOUND', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/areaSearch/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/areaSearch/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/areaSearch/CLEAR_FORM_VALID_FLAGS', void>;
export type HideEditModeAction = Action<'mvj/areaSearch/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/areaSearch/SHOW_EDIT', void>;
export type ReceiveCollapseStatesAction = Action<'mvj/areaSearch/RECEIVE_COLLAPSE_STATES', Object>;

export type InfoCheckBatchEditData = {
  areaSearch: Object,
  applicant: Array<{
    id: number,
    kind: Object,
    data: Object,
  }>,
};

export type BatchEditAreaSearchInfoChecksAction = Action<'mvj/areaSearch/BATCH_EDIT_INFO_CHECKS', InfoCheckBatchEditData>;
export type ReceiveAreaSearchInfoCheckBatchEditSuccessAction = Action<'mvj/areaSearch/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS', void>;
export type ReceiveAreaSearchInfoCheckBatchEditFailureAction = Action<'mvj/areaSearch/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE', Object>;

export type EditAreaSearchAction = Action<'mvj/areaSearch/EDIT', Object>;
export type ReceiveAreaSearchEditedAction = Action<'mvj/areaSearch/RECEIVE_EDITED', void>;
export type ReceiveAreaSearchEditFailedAction = Action<'mvj/areaSearch/RECEIVE_EDIT_FAILED', Object>;

export type CreateAreaSearchSpecsAction = Action<'mvj/areaSearch/CREATE_SPECS', Object>;
export type ReceiveAreaSearchSpecsCreatedAction = Action<'mvj/areaSearch/RECEIVE_SPECS_CREATED', Object>;
export type ReceiveAreaSearchSpecsCreateFailedAction = Action<'mvj/areaSearch/RECEIVE_SPECS_CREATE_FAILED', void>;

export type CreateAreaSearchApplicationAction = Action<'mvj/areaSearch/CREATE_APPLICATION', Object>;
export type ReceiveAreaSearchApplicationCreatedAction = Action<'mvj/areaSearch/RECEIVE_APPLICATION_CREATED', Object>;
export type ReceiveAreaSearchApplicationCreateFailedAction = Action<'mvj/areaSearch/RECEIVE_APPLICATION_CREATE_FAILED', void>;

export type DeleteAreaSearchAttachmentAction = Action<'mvj/areaSearch/DELETE_ATTACHMENT', {
  id: number,
  callback?: () => void,
}>;
export type UploadAreaSearchAttachmentAction = Action<'mvj/areaSearch/UPLOAD_ATTACHMENT', {
  fileData: Object,
  callback?: (fileData: UploadedFileMeta) => void,
  areaSearch?: number,
}>;
export type ReceiveFileOperationFinishedAction = Action<'mvj/areaSearch/RECEIVE_FILE_OPERATION_FINISHED', void>;
export type ReceiveFileOperationFailedAction = Action<'mvj/areaSearch/RECEIVE_FILE_OPERATION_FAILED', any>;
