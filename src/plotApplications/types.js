// @flow
import type {Action, Attributes} from '$src/types';
import type {PlotSearch} from '$src/plotSearch/types';
import type {ApplicationFormSection} from '$src/application/types';

export type PlotApplicationsState = {
  isFetching: boolean,
  list: PlotApplicationsList,
  current: PlotApplication,
  isFetchingByBBox: boolean,
  listByBBox: PlotApplicationsList,
  isEditMode: boolean,
  isSaving: boolean,
  collapseStates: Object,
  isFormValidById: Object,
  subTypes: ?Array<Object>,
  isFetchingSubTypes: boolean,
  isPerformingFileOperation: boolean,
  currentEditorTargets: Array<Object>,
  isSaveClicked: boolean,
  isFetchingForm: boolean,
  form: ?Object,
  isFetchingPlotSearch: boolean,
  plotSearch: ?PlotSearch,
  infoCheckBatchEditErrors: InfoCheckBatchEditErrors,
  targetInfoChecksForCurrentPlotSearch: Array<Object>,
  isFetchingTargetInfoChecksForCurrentPlotSearch: boolean,
};

export type PlotApplicationsList = Object;
export type PlotApplication = Object;

export type ApplicationFormState = {
  formId: number | null,
  targets: Array<number>,
  formEntries: { [identifier: string]: ApplicationFormSection } | null
}

export type FetchPlotApplicationsListAction = Action<'mvj/plotApplications/FETCH_ALL', string>;
export type ReceivePlotApplicationsListAction = Action<'mvj/plotApplications/RECEIVE_ALL', PlotApplicationsList>;
export type ApplicationsNotFoundAction = Action<'mvj/plotApplications/APPLICATIONS_NOT_FOUND', void>;
export type FetchPlotApplicationsByBBoxAction = Action<'mvj/plotApplications/FETCH_BY_BBOX', Object>;
export type ReceivePlotApplicationsByBBoxAction = Action<'mvj/plotApplications/RECEIVE_BY_BBOX', PlotApplicationsList>;
export type NotFoundByBBoxAction = Action<'mvj/plotApplications/NOT_FOUND_BY_BBOX', void>;

export type FetchSinglePlotApplicationAction = Action<'mvj/plotApplications/FETCH_SINGLE', number>;
export type ReceiveSinglePlotApplicationAction = Action<'mvj/plotApplications/RECEIVE_SINGLE', PlotApplication>;

export type HideEditModeAction = Action<'mvj/plotApplications/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/plotApplications/SHOW_EDIT', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/plotApplications/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/plotApplications/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/plotApplications/RECEIVE_COLLAPSE_STATES', Object>;

export type CreatePlotApplicationAction = Action<'mvj/plotApplications/CREATE', PlotApplication>;
export type EditPlotApplicationAction = Action<'mvj/plotApplications/EDIT', PlotApplication>;
export type ReceivePlotApplicationSavedAction = Action<'mvj/plotApplications/RECEIVE_SAVED', number>;
export type ReceivePlotApplicationSaveFailedAction = Action<'mvj/plotApplications/RECEIVE_SAVE_FAILED', void>;

export type FetchPlotSearchSubtypesAction = Action<'mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES', void>;
export type ReceivePlotSearchSubtypesAction = Action<'mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES', Object>;
export type PlotSearchSubtypesNotFoundAction = Action<'mvj/plotApplications/PLOT_SEARCH_SUB_TYPES_NOT_FOUND', void>;

export type FetchApplicationRelatedFormAction = Action<'mvj/plotApplications/FETCH_FORM', void>;
export type ReceiveApplicationRelatedFormAction = Action<'mvj/plotApplications/RECEIVE_FORM', Object>;
export type ApplicationRelatedFormNotFoundAction = Action<'mvj/plotApplications/FORM_NOT_FOUND', void>;

export type FetchApplicationRelatedPlotSearchAction = Action<'mvj/plotApplications/FETCH_PLOT_SEARCH', void>;
export type ReceiveApplicationRelatedPlotSearchAction = Action<'mvj/plotApplications/RECEIVE_PLOT_SEARCH', Object>;
export type ApplicationRelatedPlotSearchNotFoundAction = Action<'mvj/plotApplications/PLOT_SEARCH_NOT_FOUND', void>;

export type InitializeFormEntriesForApplicationAction = Action<'mvj/plotApplications/INITIALIZE_FORM_ENTRIES', number>;

export type ReceiveFileOperationFinishedAction = Action<'mvj/plotApplications/RECEIVE_FILE_OPERATION_FINISHED', void>;

export type SetCurrentEditorTargetsAction = Action<'mvj/plotApplications/SET_CURRENT_EDITOR_TARGETS', Array<Object>>;

export type FetchTargetInfoCheckAttributesAction = Action<'mvj/plotApplications/FETCH_TARGET_INFO_CHECK_ATTRIBUTES', void>;
export type ReceiveTargetInfoCheckAttributesAction = Action<'mvj/plotApplications/RECEIVE_TARGET_INFO_CHECK_ATTRIBUTES', Attributes>;
export type TargetInfoCheckAttributesNotFoundAction = Action<'mvj/plotApplications/TARGET_INFO_CHECK_ATTRIBUTES_NOT_FOUND', void>;

export type DeleteTargetInfoCheckMeetingMemoAction = Action<'mvj/plotApplications/DELETE_MEETING_MEMO', Object>;
export type UploadTargetInfoCheckMeetingMemoAction = Action<'mvj/plotApplications/UPLOAD_MEETING_MEMO', {
  fileData: Object,
  targetInfoCheck: number,
  callback?: (Object) => void,
}>;
export type ReceiveTargetInfoCheckMeetingMemoUploadedAction = Action<'mvj/plotApplications/RECEIVE_MEETING_MEMO_UPLOADED', void>;
export type TargetInfoCheckMeetingMemoUploadFailedAction = Action<'mvj/plotApplications/MEETING_MEMO_UPLOAD_FAILED', void>;
export type TargetInfoCheckMeetingMemoDeleteFailedAction = Action<'mvj/plotApplications/MEETING_MEMO_DELETE_FAILED', void>;

export type InfoCheckBatchEditData = {
  target: Array<{
    id: number,
    targetForm: string,
    data: Object,
  }>,
  applicant: Array<{
    id: number,
    kind: Object,
    data: Object,
  }>,
};

export type InfoCheckBatchEditErrorsItem = {
  id: number,
  kind?: Object,
  error: Object | Array<Object> | Error | string,
};

export type InfoCheckBatchEditErrors = {
  target: Array<InfoCheckBatchEditErrorsItem>,
  applicant: Array<InfoCheckBatchEditErrorsItem>,
};

export type BatchEditPlotApplicationInfoChecksAction = Action<'mvj/plotApplications/BATCH_EDIT_INFO_CHECKS', InfoCheckBatchEditData>;
export type ReceivePlotApplicationInfoCheckBatchEditSuccessAction = Action<'mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS', void>;
export type ReceivePlotApplicationInfoCheckBatchEditFailureAction = Action<'mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE', InfoCheckBatchEditErrors>;

export type FetchTargetInfoChecksForPlotSearchAction = Action<'mvj/plotApplications/FETCH_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH', number>;
export type ReceiveTargetInfoChecksForPlotSearchAction = Action<'mvj/plotApplications/RECEIVE_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH', Array<Object>>;
export type TargetInfoChecksForPlotSearchNotFoundAction = Action<'mvj/plotApplications/TARGET_INFO_CHECKS_FOR_PLOT_SEARCH_NOT_FOUND', void>;
