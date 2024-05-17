import type { Action, ApiResponse, Attributes, Methods, User } from "src/types";
import type { UploadedFileMeta } from "src/application/types";
export type AreaSearchState = {
  attributes: Attributes;
  methods: Methods;
  isFetchingAttributes: boolean;
  listAttributes: Attributes;
  listMethods: Methods;
  isFetchingListAttributes: boolean;
  areaSearchList: ApiResponse;
  areaSearchListByBBox: ApiResponse;
  isFetchingAreaSearchList: boolean;
  isFetchingAreaSearchListByBBox: boolean;
  currentAreaSearch: Record<string, any>;
  isFetchingCurrentAreaSearch: boolean;
  isEditMode: boolean;
  isSaveClicked: boolean;
  collapseStates: Record<string, any>;
  isFormValidById: Record<string, any>;
  isBatchEditingAreaSearchInfoChecks: boolean;
  isEditingAreaSearch: boolean;
  lastAreaSearchEditError: any;
  isSubmittingAreaSearchSpecs: boolean;
  isSubmittingAreaSearchApplication: boolean;
  isPerformingFileOperation: boolean;
};
export type AreaSearch = {
  id: number;
  address?: string;
  answer: Record<string, any>;
  // TODO: specify
  applicants: Array<string>;
  area_search_attachments: Array<UploadedAreaSearchAttachmentMeta>;
  area_search_status: Record<string, any>;
  // TODO: specify
  description_area?: string;
  description_intended_use?: string;
  district: string;
  end_date?: string;
  form: Record<string, any>;
  // TODO: specify
  geometry: Record<string, any>;
  // TODO: specify
  identifier: string;
  intended_use: number;
  lessor: string;
  plot: Array<string>;
  preparer?: User;
  received_date?: string;
  service_unit?: number;
  start_date: string;
  state: string;
};
export type AreaSearchId = number;
export type UploadedAreaSearchAttachmentMeta = {
  id: number;
  attachment: string;
  name: string;
  field: number;
  created_at: string;
  user?: User;
};
export type FetchListAttributesAction = Action<"mvj/areaSearch/FETCH_LIST_ATTRIBUTES", void>;
export type ReceiveListAttributesAction = Action<"mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES", Attributes>;
export type ReceiveListMethodsAction = Action<"mvj/areaSearch/RECEIVE_LIST_METHODS", Methods>;
export type ListAttributesNotFoundAction = Action<"mvj/areaSearch/LIST_ATTRIBUTES_NOT_FOUND", void>;
export type FetchAttributesAction = Action<"mvj/areaSearch/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/areaSearch/RECEIVE_ATTRIBUTES", Attributes>;
export type ReceiveMethodsAction = Action<"mvj/areaSearch/RECEIVE_METHODS", Methods>;
export type AttributesNotFoundAction = Action<"mvj/areaSearch/ATTRIBUTES_NOT_FOUND", void>;
export type FetchAreaSearchListAction = Action<"mvj/areaSearch/FETCH_ALL", Record<string, any>>;
export type FetchAreaSearchListByBBoxAction = Action<"mvj/areaSearch/FETCH_ALL_BY_BBOX", Record<string, any>>;
export type ReceiveAreaSearchListAction = Action<"mvj/areaSearch/RECEIVE_ALL", Record<string, any>>;
export type ReceiveAreaSearchListByBBoxAction = Action<"mvj/areaSearch/RECEIVE_ALL_BY_BBOX", Record<string, any>>;
export type AreaSearchesNotFoundAction = Action<"mvj/areaSearch/NOT_FOUND", void>;
export type AreaSearchesByBBoxNotFoundAction = Action<"mvj/areaSearch/NOT_FOUND_BY_BBOX", void>;
export type FetchSingleAreaSearchAction = Action<"mvj/areaSearch/FETCH_SINGLE", number>;
export type ReceiveSingleAreaSearchAction = Action<"mvj/areaSearch/RECEIVE_SINGLE", Record<string, any>>;
export type SingleAreaSearchNotFoundAction = Action<"mvj/areaSearch/SINGLE_NOT_FOUND", void>;
export type ReceiveIsSaveClickedAction = Action<"mvj/areaSearch/RECEIVE_SAVE_CLICKED", boolean>;
export type ReceiveFormValidFlagsAction = Action<"mvj/areaSearch/RECEIVE_FORM_VALID_FLAGS", Record<string, any>>;
export type ClearFormValidFlagsAction = Action<"mvj/areaSearch/CLEAR_FORM_VALID_FLAGS", void>;
export type HideEditModeAction = Action<"mvj/areaSearch/HIDE_EDIT", void>;
export type ShowEditModeAction = Action<"mvj/areaSearch/SHOW_EDIT", void>;
export type ReceiveCollapseStatesAction = Action<"mvj/areaSearch/RECEIVE_COLLAPSE_STATES", Record<string, any>>;
export type InfoCheckBatchEditData = {
  areaSearch: Record<string, any>;
  applicant: Array<{
    id: number;
    kind: Record<string, any>;
    data: Record<string, any>;
  }>;
};
export type BatchEditAreaSearchInfoChecksAction = Action<"mvj/areaSearch/BATCH_EDIT_INFO_CHECKS", InfoCheckBatchEditData>;
export type ReceiveAreaSearchInfoCheckBatchEditSuccessAction = Action<"mvj/areaSearch/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS", void>;
export type ReceiveAreaSearchInfoCheckBatchEditFailureAction = Action<"mvj/areaSearch/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE", Record<string, any>>;
export type EditAreaSearchAction = Action<"mvj/areaSearch/EDIT", Record<string, any>>;
export type ReceiveAreaSearchEditedAction = Action<"mvj/areaSearch/RECEIVE_EDITED", void>;
export type ReceiveAreaSearchEditFailedAction = Action<"mvj/areaSearch/RECEIVE_EDIT_FAILED", Record<string, any>>;
export type SetAreaSearchAttachmentsAction = Action<"mvj/areaSearch/SET_ATTACHMENTS", Array<UploadedAreaSearchAttachmentMeta>>;
export type CreateAreaSearchSpecsAction = Action<"mvj/areaSearch/CREATE_SPECS", Record<string, any>>;
export type ReceiveAreaSearchSpecsCreatedAction = Action<"mvj/areaSearch/RECEIVE_SPECS_CREATED", Record<string, any>>;
export type ReceiveAreaSearchSpecsCreateFailedAction = Action<"mvj/areaSearch/RECEIVE_SPECS_CREATE_FAILED", void>;
export type CreateAreaSearchApplicationAction = Action<"mvj/areaSearch/CREATE_APPLICATION", Record<string, any>>;
export type ReceiveAreaSearchApplicationCreatedAction = Action<"mvj/areaSearch/RECEIVE_APPLICATION_CREATED", Record<string, any>>;
export type ReceiveAreaSearchApplicationCreateFailedAction = Action<"mvj/areaSearch/RECEIVE_APPLICATION_CREATE_FAILED", void>;
export type DeleteAreaSearchAttachmentAction = Action<"mvj/areaSearch/DELETE_ATTACHMENT", {
  id: number;
  callback?: () => void;
}>;
export type UploadAreaSearchAttachmentAction = Action<"mvj/areaSearch/UPLOAD_ATTACHMENT", {
  fileData: File;
  callback?: (fileData: UploadedAreaSearchAttachmentMeta) => void;
  areaSearch?: number;
}>;
export type ReceiveFileOperationFinishedAction = Action<"mvj/areaSearch/RECEIVE_FILE_OPERATION_FINISHED", void>;
export type ReceiveFileOperationFailedAction = Action<"mvj/areaSearch/RECEIVE_FILE_OPERATION_FAILED", any>;