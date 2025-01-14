import type { Action, Attributes } from "types";
import type { PlotSearch } from "@/plotSearch/types";
import type { ApplicationFormSection } from "@/application/types";
export type PlotApplicationsState = {
  isFetching: boolean;
  list: PlotApplicationsList;
  current: PlotApplication;
  isFetchingByBBox: boolean;
  listByBBox: PlotApplicationsList;
  isEditMode: boolean;
  isSaving: boolean;
  collapseStates: Record<string, any>;
  isFormValidById: Record<string, any>;
  subTypes: Array<Record<string, any>> | null | undefined;
  isFetchingSubTypes: boolean;
  isPerformingFileOperation: boolean;
  currentEditorTargets: Array<Record<string, any>>;
  isSaveClicked: boolean;
  isFetchingForm: boolean;
  form: Record<string, any> | null | undefined;
  isFetchingPlotSearch: boolean;
  plotSearch: PlotSearch | null | undefined;
  infoCheckBatchEditErrors: InfoCheckBatchEditErrors;
  targetInfoChecksForCurrentPlotSearch: Array<Record<string, any>>;
  isFetchingTargetInfoChecksForCurrentPlotSearch: boolean;
  isSingleAllowed: boolean;
  isFetchingTargetInfoCheckAttributes?: boolean;
  targetInfoCheckAttributes?: any;
};
export type PlotApplicationsList = any;
export type PlotApplication = Record<string, any>;
export type ApplicationFormState = {
  formId: number | null;
  targets: Array<number>;
  formEntries: Record<string, ApplicationFormSection> | null;
};
export type FetchPlotApplicationsListAction = Action<string, string>;
export type ReceivePlotApplicationsListAction = Action<
  string,
  PlotApplicationsList
>;
export type ApplicationsNotFoundAction = Action<string, void>;
export type FetchPlotApplicationsByBBoxAction = Action<
  string,
  Record<string, any>
>;
export type ReceivePlotApplicationsByBBoxAction = Action<
  string,
  PlotApplicationsList
>;
export type NotFoundByBBoxAction = Action<string, void>;
export type FetchSinglePlotApplicationAction = Action<string, number>;
export type ReceiveSinglePlotApplicationAction = Action<
  string,
  PlotApplication
>;
export type SinglePlotApplicationNotFoundAction = Action<string, void>;
export type SinglePlotApplicationNotAllowedAction = Action<string, void>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type ReceiveFormValidFlagsAction = Action<string, Record<string, any>>;
export type ClearFormValidFlagsAction = Action<string, void>;
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
export type CreatePlotApplicationAction = Action<string, PlotApplication>;
export type EditPlotApplicationAction = Action<string, PlotApplication>;
export type ReceivePlotApplicationSavedAction = Action<string, number>;
export type ReceivePlotApplicationSaveFailedAction = Action<string, void>;
export type FetchPlotSearchSubtypesAction = Action<string, void>;
export type ReceivePlotSearchSubtypesAction = Action<
  string,
  Record<string, any>
>;
export type PlotSearchSubtypesNotFoundAction = Action<string, void>;
export type FetchApplicationRelatedFormAction = Action<string, void>;
export type ReceiveApplicationRelatedFormAction = Action<
  string,
  Record<string, any>
>;
export type ApplicationRelatedFormNotFoundAction = Action<string, void>;
export type FetchApplicationRelatedPlotSearchAction = Action<string, void>;
export type ReceiveApplicationRelatedPlotSearchAction = Action<
  string,
  Record<string, any>
>;
export type ApplicationRelatedPlotSearchNotFoundAction = Action<string, void>;
export type InitializeFormEntriesForApplicationAction = Action<string, number>;
export type ReceiveFileOperationFinishedAction = Action<string, void>;
export type SetCurrentEditorTargetsAction = Action<
  string,
  Array<Record<string, any>>
>;
export type FetchTargetInfoCheckAttributesAction = Action<string, void>;
export type ReceiveTargetInfoCheckAttributesAction = Action<string, Attributes>;
export type TargetInfoCheckAttributesNotFoundAction = Action<string, void>;
export type DeleteTargetInfoCheckMeetingMemoAction = Action<
  string,
  Record<string, any>
>;
export type UploadTargetInfoCheckMeetingMemoAction = Action<
  string,
  {
    fileData: Record<string, any>;
    targetInfoCheck: number;
    callback?: (arg0: Record<string, any>) => void;
  }
>;
export type ReceiveTargetInfoCheckMeetingMemoUploadedAction = Action<
  string,
  void
>;
export type TargetInfoCheckMeetingMemoUploadFailedAction = Action<string, void>;
export type TargetInfoCheckMeetingMemoDeleteFailedAction = Action<string, void>;
export type InfoCheckBatchEditData = {
  target: Array<{
    id: number;
    targetForm: string;
    data: Record<string, any>;
  }>;
  applicant: Array<{
    id: number;
    kind: Record<string, any>;
    data: Record<string, any>;
  }>;
  opening_record: null | Record<string, any>;
};
export type InfoCheckBatchEditErrorsItem = {
  id: number;
  kind?: Record<string, any>;
  error: Record<string, any> | Array<Record<string, any>> | Error | string;
};
export type InfoCheckBatchEditErrors = {
  target: Array<InfoCheckBatchEditErrorsItem>;
  applicant: Array<InfoCheckBatchEditErrorsItem>;
  openingRecord: Error | string | null;
};
export type BatchEditPlotApplicationModelsAction = Action<
  string,
  InfoCheckBatchEditData
>;
export type ReceivePlotApplicationInfoCheckBatchEditSuccessAction = Action<
  string,
  void
>;
export type ReceivePlotApplicationInfoCheckBatchEditFailureAction = Action<
  string,
  InfoCheckBatchEditErrors
>;
export type FetchTargetInfoChecksForPlotSearchAction = Action<string, number>;
export type ReceiveTargetInfoChecksForPlotSearchAction = Action<
  string,
  Array<Record<string, any>>
>;
export type TargetInfoChecksForPlotSearchNotFoundAction = Action<string, void>;
export type CreatePlotApplicationOpeningRecordAction = Action<string, number>;
