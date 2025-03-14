import type { Action, Attributes, Methods } from "types";
export type PlotSearchState = {
  attributes: Attributes;
  current: PlotSearch;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  list: PlotSearchList;
  collapseStates: Record<string, any>;
  isSaveClicked: boolean;
  isFormValidById: Record<string, any>;
  methods: Record<string, any>;
  planUnitAttributes: Attributes;
  planUnit: Record<string, any>;
  customDetailedPlanAttributes: Attributes;
  customDetailedPlan: CustomDetailedPlan;
  pendingCustomDetailedPlanFetches: Array<number>;
  isFetchingCustomDetailedPlanAttributes: boolean;
  pendingPlanUnitFetches: Array<number>;
  isFetchingPlanUnitAttributes: boolean;
  isFetchingSubtypes: boolean;
  subTypes: Record<string, any>;
  isFetchingForm: boolean;
  isFetchingTemplateForms: boolean;
  form: Record<string, any>;
  templateForms: Record<string, any>;
  isFetchingStages: boolean;
  stages: Array<Record<string, any>>;
  decisionCandidates: Record<string, any>;
  isBatchCreatingReservationIdentifiers: boolean;
  lastBatchReservationCreationError: any;
  isFetchingReservationIdentifierUnitLists: boolean;
  reservationIdentifierUnitLists: null | Record<string, any>;
  isCreatingDirectReservationLink: boolean;
  sectionEditorCollapseStates: Record<string, boolean>;
  relatedApplications: Array<Record<string, any>>;
  isFetchingRelatedApplications: boolean;
};
export type CustomDetailedPlan = Record<string, any>;
export type PlotSearchId = number;
export type PlotSearch = Record<string, any>;
export type PlanUnit = Record<string, any>;
export type PlotSearchList = any;
export type FetchSinglePlotSearchAfterEditPayload = {
  id: any;
  callbackFunctions?: Array<
    Record<string, any> | ((...args: Array<any>) => any)
  >;
};
export type ProtectedFormPathsSections = Record<
  string,
  ProtectedFormPathsSectionNode
>;
export type ProtectedFormPathsSectionNode = {
  subsections?: ProtectedFormPathsSections;
  fields?: Array<string>;
  fieldChoices?: Record<string, Array<string>>;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type PlotSearchAttributesNotFoundAction = Action<string, void>;
export type CreatePlotSearchAction = Action<string, PlotSearch>;
export type EditPlotSearchAction = Action<string, PlotSearch>;
export type PlotSearchNotFoundAction = Action<string, void>;
export type FetchSinglePlotSearchAfterEditAction = Action<
  string,
  FetchSinglePlotSearchAfterEditPayload
>;
export type DeletePlotSearchAction = Action<string, PlotSearchId>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type ReceiveFormValidFlagsAction = Action<string, Record<string, any>>;
export type ClearFormValidFlagsAction = Action<string, void>;
export type FetchPlotSearchListAction = Action<string, string>;
export type ReceivePlotSearchListAction = Action<string, PlotSearchList>;
export type FetchSinglePlotSearchAction = Action<string, PlotSearchId>;
export type ReceiveSinglePlotSearchAction = Action<string, PlotSearch>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
export type FetchPlanUnitAction = Action<string, Record<string, any>>;
export type ReceiveSinglePlanUnitAction = Action<string, PlanUnit>;
export type FetchPlanUnitAttributesAction = Action<string, Record<string, any>>;
export type PlanUnitAttributesNotFoundAction = Action<string, void>;
export type PlanUnitNotFoundAction = Action<string, void>;
export type ReceivePlanUnitAttributesAction = Action<string, Attributes>;
export type FetchCustomDetailedPlanAction = Action<string, Record<string, any>>;
export type ReceiveSingleCustomDetailedPlanAction = Action<
  string,
  CustomDetailedPlan
>;
export type FetchCustomDetailedPlanAttributesAction = Action<
  string,
  Record<string, any>
>;
export type CustomDetailedPlanAttributesNotFoundAction = Action<string, void>;
export type CustomDetailedPlanNotFoundAction = Action<string, void>;
export type ReceiveCustomDetailedPlanAttributesAction = Action<
  string,
  Attributes
>;
export type FetchPlotSearchSubtypesAction = Action<string, void>;
export type ReceivePlotSearchSubtypesAction = Action<
  string,
  Record<string, any>
>;
export type PlotSearchSubtypesNotFoundAction = Action<string, void>;
export type NullPlanUnitsAction = Action<string, void>;
export type FormNotFoundAction = Action<string, Record<string, any>>;
export type FetchFormAction = Action<string, void>;
export type ReceiveFormAction = Action<string, Record<string, any>>;
export type EditFormAction = Action<string, Record<string, any>>;
export type TemplateFormsNotFoundAction = Action<string, Record<string, any>>;
export type FetchTemplateFormsAction = Action<string, void>;
export type ReceiveTemplateFormsAction = Action<string, Record<string, any>>;
export type AddPlanUnitDecisionsAction = Action<string, Record<string, any>>;
export type RemovePlanUnitDecisionsAction = Action<string, number>;
export type ResetPlanUnitDecisionsAction = Action<string, void>;
export type FetchPlotSearchStagesAction = Action<string, Record<string, any>>;
export type ReceivePlotSearchStagesAction = Action<
  string,
  Array<Record<string, any>>
>;
export type PlotSearchStagesNotFoundAction = Action<string, void>;
export type BatchCreateReservationIdentifiersAction = Action<
  string,
  Record<string, any>
>;
export type ReservationIdentifiersCreatedAction = Action<string, void>;
export type ReservationIdentifiersCreationFailedAction = Action<string, any>;
export type FetchReservationIdentifierUnitListsAction = Action<string, void>;
export type ReceiveReservationIdentifierUnitListsAction = Action<
  string,
  Record<string, any>
>;
export type ReservationIdentifierUnitListsNotFoundAction = Action<string, void>;
export type CreateDirectReservationLinkAction = Action<
  string,
  {
    data: Record<string, any>;
    callBack: (...args: Array<any>) => any;
  }
>;
export type DirectReservationLinkCreatedAction = Action<string, void>;
export type DirectReservationLinkCreationFailedAction = Action<string, any>;
export type ClearSectionEditorCollapseStatesAction = Action<string, void>;
export type SetSectionEditorCollapseStateAction = Action<
  string,
  {
    key: string;
    state: boolean;
  }
>;
export type InitializeSectionEditorCollapseStatesAction = Action<
  string,
  Record<string, boolean>
>;
export type FetchPlotSearchRelatedApplicationsAction = Action<string, number>;
export type ReceivePlotSearchRelatedApplicationsAction = Action<
  string,
  Array<Record<string, any>>
>;
export type PlotSearchRelatedApplicationsNotFoundAction = Action<string, any>;
