import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  AddPlanUnitDecisionsAction,
  BatchCreateReservationIdentifiersAction,
  ClearFormValidFlagsAction,
  CreatePlotSearchAction,
  CustomDetailedPlan,
  CustomDetailedPlanAttributesNotFoundAction,
  CustomDetailedPlanNotFoundAction,
  DeletePlotSearchAction,
  EditFormAction,
  EditPlotSearchAction,
  FetchAttributesAction,
  FetchCustomDetailedPlanAction,
  FetchCustomDetailedPlanAttributesAction,
  FetchFormAction,
  FetchPlanUnitAction,
  FetchPlanUnitAttributesAction,
  FetchPlotSearchListAction,
  FetchPlotSearchStagesAction,
  FetchPlotSearchSubtypesAction,
  FetchReservationIdentifierUnitListsAction,
  FetchSinglePlotSearchAction,
  FetchSinglePlotSearchAfterEditAction,
  FetchSinglePlotSearchAfterEditPayload,
  FetchTemplateFormsAction,
  FormNotFoundAction,
  HideEditModeAction,
  NullPlanUnitsAction,
  PlanUnit,
  PlanUnitAttributesNotFoundAction,
  PlanUnitNotFoundAction,
  PlotSearch,
  PlotSearchAttributesNotFoundAction,
  PlotSearchId,
  PlotSearchList,
  PlotSearchNotFoundAction,
  PlotSearchStagesNotFoundAction,
  PlotSearchSubtypesNotFoundAction,
  ReceiveAttributesAction,
  ReceiveCollapseStatesAction,
  ReceiveCustomDetailedPlanAttributesAction,
  ReceiveFormAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveMethodsAction,
  ReceivePlanUnitAttributesAction,
  ReceivePlotSearchListAction,
  ReceivePlotSearchStagesAction,
  ReceivePlotSearchSubtypesAction,
  ReceiveReservationIdentifierUnitListsAction,
  ReceiveSingleCustomDetailedPlanAction,
  ReceiveSinglePlanUnitAction,
  ReceiveSinglePlotSearchAction,
  ReceiveTemplateFormsAction,
  RemovePlanUnitDecisionsAction,
  ReservationIdentifiersCreatedAction,
  ReservationIdentifiersCreationFailedAction,
  ReservationIdentifierUnitListsNotFoundAction,
  CreateDirectReservationLinkAction,
  DirectReservationLinkCreatedAction,
  DirectReservationLinkCreationFailedAction,
  ResetPlanUnitDecisionsAction,
  ShowEditModeAction,
  TemplateFormsNotFoundAction,
  ClearSectionEditorCollapseStatesAction,
  SetSectionEditorCollapseStateAction,
  InitializeSectionEditorCollapseStatesAction,
  ReceivePlotSearchRelatedApplicationsAction,
  FetchPlotSearchRelatedApplicationsAction,
  PlotSearchRelatedApplicationsNotFoundAction,
} from "@/plotSearch/types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/plotSearch/FETCH_ATTRIBUTES")();
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/plotSearch/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): PlotSearchAttributesNotFoundAction =>
  createAction("mvj/plotSearch/ATTRIBUTES_NOT_FOUND")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/plotSearch/RECEIVE_ATTRIBUTES")(attributes);
export const fetchPlotSearchList = (
  search: string,
): FetchPlotSearchListAction =>
  createAction("mvj/plotSearch/FETCH_ALL")(search);
export const receivePlotSearchList = (
  list: PlotSearchList,
): ReceivePlotSearchListAction =>
  createAction("mvj/plotSearch/RECEIVE_ALL")(list);
export const fetchSinglePlotSearch = (
  id: PlotSearchId,
): FetchSinglePlotSearchAction =>
  createAction("mvj/plotSearch/FETCH_SINGLE")(id);
export const receiveSinglePlotSearch = (
  plotSearch: PlotSearch,
): ReceiveSinglePlotSearchAction =>
  createAction("mvj/plotSearch/RECEIVE_SINGLE")(plotSearch);
export const editPlotSearch = (plotSearch: PlotSearch): EditPlotSearchAction =>
  createAction("mvj/plotSearch/EDIT")(plotSearch);
export const fetchSinglePlotSearchAfterEdit = (
  payload: FetchSinglePlotSearchAfterEditPayload,
): FetchSinglePlotSearchAfterEditAction =>
  createAction("mvj/plotSearch/FETCH_SINGLE_AFTER_EDIT")(payload);
export const createPlotSearch = (
  plotSearch: PlotSearch,
): CreatePlotSearchAction => createAction("mvj/plotSearch/CREATE")(plotSearch);
export const deletePlotSearch = (id: PlotSearchId): DeletePlotSearchAction =>
  createAction("mvj/plotSearch/DELETE")(id);
export const hideEditMode = (): HideEditModeAction =>
  createAction("mvj/plotSearch/HIDE_EDIT")();
export const showEditMode = (): ShowEditModeAction =>
  createAction("mvj/plotSearch/SHOW_EDIT")();
export const receiveCollapseStates = (
  status: Record<string, any>,
): ReceiveCollapseStatesAction =>
  createAction("mvj/plotSearch/RECEIVE_COLLAPSE_STATES")(status);
export const receiveIsSaveClicked = (
  isClicked: boolean,
): ReceiveIsSaveClickedAction =>
  createAction("mvj/plotSearch/RECEIVE_SAVE_CLICKED")(isClicked);
export const receiveFormValidFlags = (
  valid: Record<string, any>,
): ReceiveFormValidFlagsAction =>
  createAction("mvj/plotSearch/RECEIVE_FORM_VALID_FLAGS")(valid);
export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction("mvj/plotSearch/CLEAR_FORM_VALID_FLAGS")();
export const notFound = (): PlotSearchNotFoundAction =>
  createAction("mvj/plotSearch/NOT_FOUND")();
export const planUnitNotFound = (): PlanUnitNotFoundAction =>
  createAction("mvj/plotSearch/PLAN_UNIT_NOT_FOUND")();
export const fetchPlanUnit = (
  payload: Record<string, any>,
): FetchPlanUnitAction =>
  createAction("mvj/plotSearch/FETCH_PLAN_UNIT")(payload);
export const receiveSinglePlanUnit = (
  planUnit: PlanUnit,
): ReceiveSinglePlanUnitAction =>
  createAction("mvj/plotSearch/RECEIVE_PLAN_UNIT")(planUnit);
export const fetchPlanUnitAttributes = (
  payload?: Record<string, any>,
): FetchPlanUnitAttributesAction =>
  createAction("mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES")(payload);
export const planUnitAttributesNotFound =
  (): PlanUnitAttributesNotFoundAction =>
    createAction("mvj/plotSearch/PLAN_UNIT_ATTRIBUTES_NOT_FOUND")();
export const receivePlanUnitAttributes = (
  attributes: Attributes,
): ReceivePlanUnitAttributesAction =>
  createAction("mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES")(attributes);
export const customDetailedPlanNotFound =
  (): CustomDetailedPlanNotFoundAction =>
    createAction("mvj/plotSearch/CUSTOM_DETAILED_PLAN_NOT_FOUND")();
export const fetchCustomDetailedPlan = (
  payload: Record<string, any>,
): FetchCustomDetailedPlanAction =>
  createAction("mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN")(payload);
export const receiveSingleCustomDetailedPlan = (
  customDetailedPlan: CustomDetailedPlan,
): ReceiveSingleCustomDetailedPlanAction =>
  createAction("mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN")(
    customDetailedPlan,
  );
export const fetchCustomDetailedPlanAttributes = (
  payload: Record<string, any>,
): FetchCustomDetailedPlanAttributesAction =>
  createAction("mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN_ATTRIBUTES")(payload);
export const customDetailedPlanAttributesNotFound =
  (): CustomDetailedPlanAttributesNotFoundAction =>
    createAction("mvj/plotSearch/CUSTOM_DETAILED_PLAN_ATTRIBUTES_NOT_FOUND")();
export const receiveCustomDetailedPlanAttributes = (
  attributes: Attributes,
): ReceiveCustomDetailedPlanAttributesAction =>
  createAction("mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN_ATTRIBUTES")(
    attributes,
  );
export const fetchPlotSearchSubtypes = (
  payload?: Record<string, any>,
): FetchPlotSearchSubtypesAction =>
  createAction("mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES")(payload);
export const plotSearchSubtypesNotFound =
  (): PlotSearchSubtypesNotFoundAction =>
    createAction("mvj/plotSearch/PLOT_SEARCH_SUB_TYPES_NOT_FOUND")();
export const receivePlotSearchSubtype = (
  subTypes: Record<string, any>,
): ReceivePlotSearchSubtypesAction =>
  createAction("mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES")(subTypes);
export const nullPlanUnits = (): NullPlanUnitsAction =>
  createAction("mvj/plotSearch/NULL_PLAN_UNITS")();
export const templateFormsNotFound = (
  payload?: Record<string, any>,
): TemplateFormsNotFoundAction =>
  createAction("mvj/plotSearch/TEMPLATE_FORMS_NOT_FOUND")(payload);
export const fetchTemplateForms = (): FetchTemplateFormsAction =>
  createAction("mvj/plotSearch/FETCH_TEMPLATE_FORMS")();
export const receiveTemplateForms = (
  payload: Record<string, any>,
): ReceiveTemplateFormsAction =>
  createAction("mvj/plotSearch/RECEIVE_TEMPLATE_FORMS")(payload);
export const formNotFound = (
  payload?: Record<string, any>,
): FormNotFoundAction => createAction("mvj/plotSearch/FORM_NOT_FOUND")(payload);
export const editForm = (payload: Record<string, any>): EditFormAction =>
  createAction("mvj/plotSearch/EDIT_FORM")(payload);
export const fetchForm = (payload?: Record<string, any>): FetchFormAction =>
  createAction("mvj/plotSearch/FETCH_FORM")(payload);
export const receiveForm = (payload: Record<string, any>): ReceiveFormAction =>
  createAction("mvj/plotSearch/RECEIVE_FORM")(payload);
export const addPlanUnitDecisions = (
  planUnit: Record<string, any>,
): AddPlanUnitDecisionsAction =>
  createAction("mvj/plotSearch/ADD_PLAN_UNIT_DECISIONS")(planUnit);
export const removePlanUnitDecisions = (
  planUnitId: number,
): RemovePlanUnitDecisionsAction =>
  createAction("mvj/plotSearch/REMOVE_PLAN_UNIT_DECISIONS")(planUnitId);
export const resetPlanUnitDecisions = (): ResetPlanUnitDecisionsAction =>
  createAction("mvj/plotSearch/RESET_PLAN_UNIT_DECISIONS")();
export const fetchStages = (): FetchPlotSearchStagesAction =>
  createAction("mvj/plotSearch/FETCH_PLOT_SEARCH_STAGES")();
export const receiveStages = (
  payload: Array<Record<string, any>>,
): ReceivePlotSearchStagesAction =>
  createAction("mvj/plotSearch/RECEIVE_PLOT_SEARCH_STAGES")(payload);
export const stagesNotFound = (): PlotSearchStagesNotFoundAction =>
  createAction("mvj/plotSearch/PLOT_SEARCH_STAGES_NOT_FOUND")();
export const batchCreateReservationIdentifiers = (
  payload: Array<Record<string, any>>,
): BatchCreateReservationIdentifiersAction =>
  createAction("mvj/plotSearch/BATCH_CREATE_RESERVATION_IDENTIFIERS")(payload);
export const reservationIdentifiersCreated =
  (): ReservationIdentifiersCreatedAction =>
    createAction("mvj/plotSearch/RESERVATION_IDENTIFIERS_CREATED")();
export const reservationIdentifiersCreationFailed = (
  payload: any,
): ReservationIdentifiersCreationFailedAction =>
  createAction("mvj/plotSearch/RESERVATION_IDENTIFIERS_CREATION_FAILED")(
    payload,
  );
export const fetchReservationIdentifierUnitLists =
  (): FetchReservationIdentifierUnitListsAction =>
    createAction("mvj/plotSearch/FETCH_RESERVATION_IDENTIFIER_UNIT_LISTS")();
export const receiveReservationIdentifierUnitLists = (
  payload: Record<string, any>,
): ReceiveReservationIdentifierUnitListsAction =>
  createAction("mvj/plotSearch/RECEIVE_RESERVATION_IDENTIFIER_UNIT_LISTS")(
    payload,
  );
export const reservationIdentifierUnitListsNotFound =
  (): ReservationIdentifierUnitListsNotFoundAction =>
    createAction(
      "mvj/plotSearch/RESERVATION_IDENTIFIER_UNIT_LISTS_NOT_FOUND",
    )();
export const createDirectReservationLink = (payload: {
  data: Record<string, any>;
  callBack: (...args: Array<any>) => any;
}): CreateDirectReservationLinkAction =>
  createAction("mvj/plotSearch/CREATE_DIRECT_RESERVATION_LINK")(payload);
export const directReservationLinkCreated =
  (): DirectReservationLinkCreatedAction =>
    createAction("mvj/plotSearch/DIRECT_RESERVATION_LINK_CREATED")();
export const directReservationLinkCreationFailed = (
  payload?: any,
): DirectReservationLinkCreationFailedAction =>
  createAction("mvj/plotSearch/DIRECT_RESERVATION_LINK_CREATION_FAILED")(
    payload,
  );
export const clearSectionEditorCollapseStates =
  (): ClearSectionEditorCollapseStatesAction =>
    createAction("mvj/plotSearch/CLEAR_SECTION_EDITOR_COLLAPSE_STATES")();
export const setSectionEditorCollapseState = (
  key: string,
  isOpen: boolean,
): SetSectionEditorCollapseStateAction =>
  createAction("mvj/plotSearch/SET_SECTION_EDITOR_COLLAPSE_STATE")({
    key,
    state: isOpen,
  });
export const initializeSectionEditorCollapseStates = (
  states: Record<string, boolean>,
): InitializeSectionEditorCollapseStatesAction =>
  createAction("mvj/plotSearch/INITIALIZE_SECTION_EDITOR_COLLAPSE_STATES")(
    states,
  );
export const fetchPlotSearchRelatedApplications = (
  id: number,
): FetchPlotSearchRelatedApplicationsAction =>
  createAction("mvj/plotSearch/FETCH_RELATED_APPLICATIONS")(id);
export const receivePlotSearchRelatedApplications = (
  applications: Array<Record<string, any>>,
): ReceivePlotSearchRelatedApplicationsAction =>
  createAction("mvj/plotSearch/RECEIVE_RELATED_APPLICATIONS")(applications);
export const plotSearchRelatedApplicationsNotFound = (
  error?: any,
): PlotSearchRelatedApplicationsNotFoundAction =>
  createAction("mvj/plotSearch/RELATED_APPLICATIONS_NOT_FOUND")(error);
