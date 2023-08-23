// @flow
import type {Action, Attributes, Methods} from '$src/types';


export type PlotSearchState = {
  attributes: Attributes,
  current: PlotSearch,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: PlotSearchList,
  collapseStates: Object,
  isSaveClicked: boolean,
  isFormValidById: Object,
  methods: Object,
  planUnitAttributes: Attributes,
  planUnit: Object,
  customDetailedPlanAttributes: Attributes,
  customDetailedPlan: CustomDetailedPlan,
  pendingCustomDetailedPlanFetches: Array<number>,
  isFetchingCustomDetailedPlanAttributes: boolean,
  pendingPlanUnitFetches: Array<number>,
  isFetchingPlanUnitAttributes: boolean,
  isFetchingSubtypes: boolean,
  subTypes: Object,
  isFetchingForm: boolean,
  isFetchingTemplateForms: boolean,
  form: Object,
  templateForms: Object,
  isFetchingStages: boolean,
  stages: Array<Object>,
  decisionCandidates: Object,
  isBatchCreatingReservationIdentifiers: boolean,
  lastBatchReservationCreationError: any,
  isFetchingReservationIdentifierUnitLists: boolean,
  reservationIdentifierUnitLists: null | Object,
  isCreatingDirectReservationLink: boolean,
};

export type CustomDetailedPlan = Object;
export type PlotSearchId = number;
export type PlotSearch = Object;
export type PlanUnit = Object;
export type PlotSearchList = Object;

export type FetchSinglePlotSearchAfterEditPayload = {
  id: any,
  callbackFunctions?: Array<Object | Function>,
}

export type FetchAttributesAction = Action<'mvj/plotSearch/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/plotSearch/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/plotSearch/RECEIVE_METHODS', Methods>;
export type PlotSearchAttributesNotFoundAction = Action<'mvj/plotSearch/ATTRIBUTES_NOT_FOUND', void>;

export type CreatePlotSearchAction = Action<'mvj/plotSearch/CREATE', PlotSearch>;
export type EditPlotSearchAction = Action<'mvj/plotSearch/EDIT', PlotSearch>;
export type PlotSearchNotFoundAction = Action<'mvj/plotSearch/NOT_FOUND', void>;
export type FetchSinglePlotSearchAfterEditAction = Action<'mvj/plotSearch/FETCH_SINGLE_AFTER_EDIT', FetchSinglePlotSearchAfterEditPayload>;
export type DeletePlotSearchAction = Action<'mvj/plotSearch/DELETE', PlotSearchId>;

export type ReceiveIsSaveClickedAction = Action<'mvj/plotSearch/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/plotSearch/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/plotSearch/CLEAR_FORM_VALID_FLAGS', void>;

export type FetchPlotSearchListAction = Action<'mvj/plotSearch/FETCH_ALL', string>;
export type ReceivePlotSearchListAction = Action<'mvj/plotSearch/RECEIVE_ALL', PlotSearchList>;
export type FetchSinglePlotSearchAction = Action<'mvj/plotSearch/FETCH_SINGLE', PlotSearchId>;
export type ReceiveSinglePlotSearchAction = Action<'mvj/plotSearch/RECEIVE_SINGLE', PlotSearch>;

export type HideEditModeAction = Action<'mvj/plotSearch/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/plotSearch/SHOW_EDIT', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/plotSearch/RECEIVE_COLLAPSE_STATES', Object>;

export type FetchPlanUnitAction = Action<'mvj/plotSearch/FETCH_PLAN_UNIT', Object>;
export type ReceiveSinglePlanUnitAction = Action<'mvj/plotSearch/RECEIVE_PLAN_UNIT', PlanUnit>;
export type FetchPlanUnitAttributesAction = Action<'mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES', Object>;
export type PlanUnitAttributesNotFoundAction = Action<'mvj/plotSearch/PLAN_UNIT_ATTRIBUTES_NOT_FOUND', void>;
export type PlanUnitNotFoundAction = Action<'mvj/plotSearch/PLAN_UNIT_NOT_FOUND', void>;
export type ReceivePlanUnitAttributesAction = Action<'mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES', Attributes>;

export type FetchCustomDetailedPlanAction = Action<'mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN', Object>;
export type ReceiveSingleCustomDetailedPlanAction = Action<'mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN', CustomDetailedPlan>;
export type FetchCustomDetailedPlanAttributesAction = Action<'mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN_ATTRIBUTES', Object>;
export type CustomDetailedPlanAttributesNotFoundAction = Action<'mvj/plotSearch/CUSTOM_DETAILED_PLAN_ATTRIBUTES_NOT_FOUND', void>;
export type CustomDetailedPlanNotFoundAction = Action<'mvj/plotSearch/CUSTOM_DETAILED_PLAN_NOT_FOUND', void>;
export type ReceiveCustomDetailedPlanAttributesAction = Action<'mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN_ATTRIBUTES', Attributes>;

export type FetchPlotSearchSubtypesAction = Action<'mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES', void>;
export type ReceivePlotSearchSubtypesAction = Action<'mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES', Object>;
export type PlotSearchSubtypesNotFoundAction = Action<'mvj/plotSearch/PLOT_SEARCH_SUB_TYPES_NOT_FOUND', void>;

export type NullPlanUnitsAction = Action<'mvj/plotSearch/NULL_PLAN_UNITS', void>;

export type FormNotFoundAction = Action<'mvj/plotSearch/FORM_NOT_FOUND', Object>;
export type FetchFormAction = Action<'mvj/plotSearch/FETCH_FORM', void>;
export type ReceiveFormAction = Action<'mvj/plotSearch/RECEIVE_FORM', Object>;
export type EditFormAction = Action<'mvj/plotSearch/EDIT_FORM', Object>;

export type TemplateFormsNotFoundAction = Action<'mvj/plotSearch/TEMPLATE_FORMS_NOT_FOUND', Object>;
export type FetchTemplateFormsAction = Action<'mvj/plotSearch/FETCH_TEMPLATE_FORMS', void>;
export type ReceiveTemplateFormsAction = Action<'mvj/plotSearch/RECEIVE_TEMPLATE_FORMS', Object>;

export type AddPlanUnitDecisionsAction = Action<'mvj/plotSearch/ADD_PLAN_UNIT_DECISIONS', Object>;
export type RemovePlanUnitDecisionsAction = Action<'mvj/plotSearch/REMOVE_PLAN_UNIT_DECISIONS', number>;
export type ResetPlanUnitDecisionsAction = Action<'mvj/plotSearch/RESET_PLAN_UNIT_DECISIONS', void>;

export type FetchPlotSearchStagesAction = Action<'mvj/plotSearch/FETCH_PLOT_SEARCH_STAGES', Object>;
export type ReceivePlotSearchStagesAction = Action<'mvj/plotSearch/RECEIVE_PLOT_SEARCH_STAGES', Array<Object>>;
export type PlotSearchStagesNotFoundAction = Action<'mvj/plotSearch/PLOT_SEARCH_STAGES_NOT_FOUND', void>;

export type BatchCreateReservationIdentifiersAction = Action<'mvj/plotSearch/BATCH_CREATE_RESERVATION_IDENTIFIERS', Object>;
export type ReservationIdentifiersCreatedAction = Action<'mvj/plotSearch/RESERVATION_IDENTIFIERS_CREATED', void>;
export type ReservationIdentifiersCreationFailedAction = Action<'mvj/plotSearch/RESERVATION_IDENTIFIERS_CREATION_FAILED', any>;

export type FetchReservationIdentifierUnitListsAction = Action<'mvj/plotSearch/FETCH_RESERVATION_IDENTIFIER_UNIT_LISTS', void>;
export type ReceiveReservationIdentifierUnitListsAction = Action<'mvj/plotSearch/RECEIVE_RESERVATION_IDENTIFIER_UNIT_LISTS', Object>;
export type ReservationIdentifierUnitListsNotFoundAction = Action<'mvj/plotSearch/RESERVATION_IDENTIFIER_UNIT_LISTS_NOT_FOUND', void>;

export type CreateDirectReservationLinkAction = Action<'mvj/plotSearch/CREATE_DIRECT_RESERVATION_LINK', {data: Object, callBack: Function}>;
export type DirectReservationLinkCreatedAction = Action<'mvj/plotSearch/DIRECT_RESERVATION_LINK_CREATED', void>;
export type DirectReservationLinkCreationFailedAction = Action<'mvj/plotSearch/DIRECT_RESERVATION_LINK_CREATION_FAILED', any>;
