import { createAction } from "redux-actions";
import type {
  ApplicationRelatedFormNotFoundAction,
  ApplicationRelatedPlotSearchNotFoundAction,
  ApplicationsNotFoundAction,
  BatchEditPlotApplicationModelsAction,
  ClearFormValidFlagsAction,
  CreatePlotApplicationOpeningRecordAction,
  CreatePlotApplicationAction,
  DeleteTargetInfoCheckMeetingMemoAction,
  EditPlotApplicationAction,
  FetchApplicationRelatedFormAction,
  FetchApplicationRelatedPlotSearchAction,
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
  PlotApplication,
  PlotApplicationsList,
  PlotSearchSubtypesNotFoundAction,
  ReceiveApplicationRelatedFormAction,
  ReceiveApplicationRelatedPlotSearchAction,
  ReceiveCollapseStatesAction,
  ReceiveFileOperationFinishedAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
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
  SinglePlotApplicationNotAllowedAction,
  SinglePlotApplicationNotFoundAction,
  SetCurrentEditorTargetsAction,
  ShowEditModeAction,
  TargetInfoCheckMeetingMemoDeleteFailedAction,
  TargetInfoCheckMeetingMemoUploadFailedAction,
  TargetInfoChecksForPlotSearchNotFoundAction,
  UploadTargetInfoCheckMeetingMemoAction,
} from "@/plotApplications/types";
export const fetchPlotApplicationsList = (
  search: string,
): FetchPlotApplicationsListAction =>
  createAction("mvj/plotApplications/FETCH_ALL")(search);
export const receivePlotApplicationsList = (
  list: PlotApplicationsList,
): ReceivePlotApplicationsListAction =>
  createAction("mvj/plotApplications/RECEIVE_ALL")(list);
export const fetchSinglePlotApplication = (
  id: number,
): FetchSinglePlotApplicationAction =>
  createAction("mvj/plotApplications/FETCH_SINGLE")(id);
export const receiveSinglePlotApplication = (
  plotApplication: PlotApplication,
): ReceiveSinglePlotApplicationAction =>
  createAction("mvj/plotApplications/RECEIVE_SINGLE")(plotApplication);
export const singlePlotApplicationNotFound =
  (): SinglePlotApplicationNotFoundAction =>
    createAction("mvj/plotApplications/SINGLE_NOT_FOUND")();
export const singlePlotApplicationNotAllowed =
  (): SinglePlotApplicationNotAllowedAction =>
    createAction("mvj/plotApplications/SINGLE_NOT_ALLOWED")();
export const fetchPlotApplicationsByBBox = (
  params: Record<string, any>,
): FetchPlotApplicationsByBBoxAction =>
  createAction("mvj/plotApplications/FETCH_BY_BBOX")(params);
export const receivePlotApplicationsByBBox = (
  leases: PlotApplicationsList,
): ReceivePlotApplicationsByBBoxAction =>
  createAction("mvj/plotApplications/RECEIVE_BY_BBOX")(leases);
export const notFoundByBBox = (): NotFoundByBBoxAction =>
  createAction("mvj/plotApplications/NOT_FOUND_BY_BBOX")();
export const applicationsNotFound = (): ApplicationsNotFoundAction =>
  createAction("mvj/plotApplications/APPLICATIONS_NOT_FOUND")();
export const hideEditMode = (): HideEditModeAction =>
  createAction("mvj/plotApplications/HIDE_EDIT")();
export const showEditMode = (): ShowEditModeAction =>
  createAction("mvj/plotApplications/SHOW_EDIT")();
export const receiveIsSaveClicked = (
  isClicked: boolean,
): ReceiveIsSaveClickedAction =>
  createAction("mvj/plotApplications/RECEIVE_SAVE_CLICKED")(isClicked);
export const receiveCollapseStates = (
  status: Record<string, any>,
): ReceiveCollapseStatesAction =>
  createAction("mvj/plotApplications/RECEIVE_COLLAPSE_STATES")(status);
export const receiveFormValidFlags = (
  valid: Record<string, any>,
): ReceiveFormValidFlagsAction =>
  createAction("mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS")(valid);
export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction("mvj/plotApplications/CLEAR_FORM_VALID_FLAGS")();
export const createPlotApplication = (
  plotApplication: PlotApplication,
): CreatePlotApplicationAction =>
  createAction("mvj/plotApplications/CREATE")(plotApplication);
export const editPlotApplication = (
  plotApplication: PlotApplication,
): EditPlotApplicationAction =>
  createAction("mvj/plotApplications/EDIT")(plotApplication);
export const fetchPlotSearchSubtypes = (
  payload: Record<string, any>,
): FetchPlotSearchSubtypesAction =>
  createAction("mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES")(payload);
export const plotSearchSubtypesNotFound =
  (): PlotSearchSubtypesNotFoundAction =>
    createAction("mvj/plotApplications/PLOT_SEARCH_SUB_TYPES_NOT_FOUND")();
export const receivePlotSearchSubtypes = (
  subTypes: Record<string, any>,
): ReceivePlotSearchSubtypesAction =>
  createAction("mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES")(subTypes);
export const receivePlotApplicationSaved = (
  id: number,
): ReceivePlotApplicationSavedAction =>
  createAction("mvj/plotApplications/RECEIVE_SAVED")(id);
export const receivePlotApplicationSaveFailed =
  (): ReceivePlotApplicationSaveFailedAction =>
    createAction("mvj/plotApplications/RECEIVE_SAVE_FAILED")();
export const fetchApplicationRelatedForm = (
  payload: Record<string, any>,
): FetchApplicationRelatedFormAction =>
  createAction("mvj/plotApplications/FETCH_FORM")(payload);
export const receiveApplicationRelatedForm = (
  payload: Record<string, any>,
): ReceiveApplicationRelatedFormAction =>
  createAction("mvj/plotApplications/RECEIVE_FORM")(payload);
export const applicationRelatedFormNotFound = (
  payload?: Record<string, any>,
): ApplicationRelatedFormNotFoundAction =>
  createAction("mvj/plotApplications/FORM_NOT_FOUND")(payload);
export const fetchApplicationRelatedPlotSearch = (
  payload: Record<string, any>,
): FetchApplicationRelatedPlotSearchAction =>
  createAction("mvj/plotApplications/FETCH_PLOT_SEARCH")(payload);
export const receiveApplicationRelatedPlotSearch = (
  payload: Record<string, any>,
): ReceiveApplicationRelatedPlotSearchAction =>
  createAction("mvj/plotApplications/RECEIVE_PLOT_SEARCH")(payload);
export const applicationRelatedPlotSearchNotFound = (
  payload?: Record<string, any>,
): ApplicationRelatedPlotSearchNotFoundAction =>
  createAction("mvj/plotApplications/PLOT_SEARCH_NOT_FOUND")(payload);
export const initializeFormEntriesForApplication = (
  payload: Record<string, any>,
): InitializeFormEntriesForApplicationAction =>
  createAction("mvj/plotApplications/INITIALIZE_FORM_ENTRIES")(payload);
export const receiveFileOperationFinished =
  (): ReceiveFileOperationFinishedAction =>
    createAction("mvj/plotApplications/RECEIVE_FILE_OPERATION_FINISHED")();
export const setCurrentEditorTargets = (
  payload: Array<Record<string, any>>,
): SetCurrentEditorTargetsAction =>
  createAction("mvj/plotApplications/SET_CURRENT_EDITOR_TARGETS")(payload);
export const deleteTargetInfoCheckMeetingMemo = (
  payload: Record<string, any>,
): DeleteTargetInfoCheckMeetingMemoAction =>
  createAction("mvj/plotApplications/DELETE_MEETING_MEMO")(payload);
export const uploadTargetInfoCheckMeetingMemo = (
  payload: Record<string, any>,
): UploadTargetInfoCheckMeetingMemoAction =>
  createAction("mvj/plotApplications/UPLOAD_MEETING_MEMO")(payload);
export const receiveTargetInfoCheckMeetingMemoUploaded =
  (): ReceiveTargetInfoCheckMeetingMemoUploadedAction =>
    createAction("mvj/plotApplications/RECEIVE_MEETING_MEMO_UPLOADED")();
export const targetInfoCheckMeetingMemoUploadFailed =
  (): TargetInfoCheckMeetingMemoUploadFailedAction =>
    createAction("mvj/plotApplications/MEETING_MEMO_UPLOAD_FAILED")();
export const targetInfoCheckMeetingMemoDeleteFailed =
  (): TargetInfoCheckMeetingMemoDeleteFailedAction =>
    createAction("mvj/plotApplications/MEETING_MEMO_DELETE_FAILED")();
export const batchEditApplicationModels = (
  payload: InfoCheckBatchEditData,
): BatchEditPlotApplicationModelsAction =>
  createAction("mvj/plotApplications/BATCH_EDIT_RELATED_MODELS")(payload);
export const receiveBatchInfoCheckEditSuccess =
  (): ReceivePlotApplicationInfoCheckBatchEditSuccessAction =>
    createAction(
      "mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS",
    )();
export const receiveBatchInfoCheckEditFailure = (
  payload: InfoCheckBatchEditErrors,
): ReceivePlotApplicationInfoCheckBatchEditFailureAction =>
  createAction("mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE")(
    payload,
  );
export const fetchTargetInfoChecksForPlotSearch = (
  payload: number,
): FetchTargetInfoChecksForPlotSearchAction =>
  createAction("mvj/plotApplications/FETCH_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH")(
    payload,
  );
export const receiveTargetInfoChecksForPlotSearch = (
  payload: Array<Record<string, any>>,
): ReceiveTargetInfoChecksForPlotSearchAction =>
  createAction(
    "mvj/plotApplications/RECEIVE_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH",
  )(payload);
export const targetInfoChecksForPlotSearchNotFound =
  (): TargetInfoChecksForPlotSearchNotFoundAction =>
    createAction(
      "mvj/plotApplications/TARGET_INFO_CHECKS_FOR_PLOT_SEARCH_NOT_FOUND",
    )();
export const createPlotApplicationOpeningRecord = (
  id: number,
): CreatePlotApplicationOpeningRecordAction =>
  createAction("mvj/plotApplications/CREATE_OPENING_RECORD")(id);
