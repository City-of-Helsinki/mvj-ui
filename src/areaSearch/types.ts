import type { Action, ApiResponse, Attributes, Methods, User } from "types";
import type { UploadedFileMeta } from "application/types";
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
  lastFileOperationError?: any;
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
  form: any;
  // TODO: specify
  geometry: any;
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
export type FetchListAttributesAction = Action<string, void>;
export type ReceiveListAttributesAction = Action<string, Attributes>;
export type ReceiveListMethodsAction = Action<string, Methods>;
export type ListAttributesNotFoundAction = Action<string, void>;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchAreaSearchListAction = Action<string, Record<string, any>>;
export type FetchAreaSearchListByBBoxAction = Action<string, Record<string, any>>;
export type ReceiveAreaSearchListAction = Action<string, Record<string, any>>;
export type ReceiveAreaSearchListByBBoxAction = Action<string, Record<string, any>>;
export type AreaSearchesNotFoundAction = Action<string, void>;
export type AreaSearchesByBBoxNotFoundAction = Action<string, void>;
export type FetchSingleAreaSearchAction = Action<string, number>;
export type ReceiveSingleAreaSearchAction = Action<string, Record<string, any>>;
export type SingleAreaSearchNotFoundAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type ReceiveFormValidFlagsAction = Action<string, Record<string, any>>;
export type ClearFormValidFlagsAction = Action<string, void>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
export type InfoCheckBatchEditData = {
  areaSearch: Record<string, any>;
  applicant: Array<{
    id: number;
    kind: Record<string, any>;
    data: Record<string, any>;
  }>;
};
export type BatchEditAreaSearchInfoChecksAction = Action<string, InfoCheckBatchEditData>;
export type ReceiveAreaSearchInfoCheckBatchEditSuccessAction = Action<string, void>;
export type ReceiveAreaSearchInfoCheckBatchEditFailureAction = Action<string, Record<string, any>>;
export type EditAreaSearchAction = Action<string, Record<string, any>>;
export type ReceiveAreaSearchEditedAction = Action<string, void>;
export type ReceiveAreaSearchEditFailedAction = Action<string, Record<string, any>>;
export type SetAreaSearchAttachmentsAction = Action<string, Array<UploadedAreaSearchAttachmentMeta>>;
export type CreateAreaSearchSpecsAction = Action<string, Record<string, any>>;
export type ReceiveAreaSearchSpecsCreatedAction = Action<string, Record<string, any>>;
export type ReceiveAreaSearchSpecsCreateFailedAction = Action<string, void>;
export type CreateAreaSearchApplicationAction = Action<string, Record<string, any>>;
export type ReceiveAreaSearchApplicationCreatedAction = Action<string, Record<string, any>>;
export type ReceiveAreaSearchApplicationCreateFailedAction = Action<string, void>;
export type DeleteAreaSearchAttachmentAction = Action<string, {
  id: number;
  callback?: () => void;
}>;
export type UploadAreaSearchAttachmentAction = Action<string, {
  fileData: File;
  callback?: (fileData: UploadedAreaSearchAttachmentMeta) => void;
  areaSearch?: number;
}>;
export type ReceiveFileOperationFinishedAction = Action<string, void>;
export type ReceiveFileOperationFailedAction = Action<string, any>;