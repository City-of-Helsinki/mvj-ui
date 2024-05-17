import merge from "lodash/merge";
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Action, CombinedReducer } from "redux";
import { FormNames } from "src/enums";
import { annotatePlanUnitDecision } from "src/plotSearch/helpers";
import type { AddPlanUnitDecisionsAction, CustomDetailedPlan, PlanUnit, PlotSearch, PlotSearchList, PlotSearchState, ReceiveAttributesAction, ReceiveCollapseStatesAction, ReceiveFormAction, ReceiveFormValidFlagsAction, ReceiveIsSaveClickedAction, ReceiveMethodsAction, ReceivePlotSearchListAction, ReceivePlotSearchStagesAction, ReceivePlotSearchSubtypesAction, ReceiveSingleCustomDetailedPlanAction, ReceiveSinglePlotSearchAction, ReceiveTemplateFormsAction, RemovePlanUnitDecisionsAction } from "src/plotSearch/types";
import type { Attributes, Methods, Reducer } from "src/types";
const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotSearch/RECEIVE_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return attributes;
  }
}, null);
const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/plotSearch/HIDE_EDIT': () => false,
  'mvj/plotSearch/SHOW_EDIT': () => true
}, false);
const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_ALL']: () => true,
  ['mvj/plotSearch/RECEIVE_ALL']: () => false,
  ['mvj/plotSearch/FETCH_SINGLE']: () => true,
  ['mvj/plotSearch/RECEIVE_SINGLE']: () => false,
  ['mvj/plotSearch/CREATE']: () => true,
  ['mvj/plotSearch/EDIT']: () => true,
  ['mvj/plotSearch/NOT_FOUND']: () => false,
  ['mvj/plotSearch/DELETE']: () => true
}, false);
const isFetchingSubtypesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES']: () => true,
  ['mvj/plotSearch/PLOT_SEARCH_SUB_TYPES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES']: () => false
}, false);
const pendingPlanUnitFetchesReducer: Reducer<Array<number>> = handleActions({
  ['mvj/plotSearch/FETCH_PLAN_UNIT']: (state: Array<number>, {
    payload: value
  }) => {
    const id = value.value;

    if (state.includes(id)) {
      return state;
    }

    return [...state, id];
  },
  ['mvj/plotSearch/PLAN_UNIT_NOT_FOUND']: (state: Array<number>, {
    payload: id
  }) => state.filter(item => item === id),
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT']: (state: Array<number>, {
    payload: result
  }) => state.filter(item => !result[item])
}, []);
const isFetchingPlanUnitAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES']: () => true,
  ['mvj/plotSearch/PLAN_UNIT_ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES']: () => false
}, false);
const planUnitAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return merge(state, attributes);
  }
}, null);
const planUnitReducer: Reducer<PlanUnit> = handleActions({
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT']: (state: PlanUnit, {
    payload: planUnit
  }: ReceiveSinglePlotSearchAction) => {
    return merge(state, planUnit);
  },
  ['mvj/plotSearch/NULL_PLAN_UNITS']: () => ({})
}, {});
const customDetailedPlanAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return merge(state, attributes);
  }
}, null);
const customDetailedPlanReducer: Reducer<CustomDetailedPlan> = handleActions({
  ['mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN']: (state: CustomDetailedPlan, {
    payload: customDetailedPlan
  }: ReceiveSingleCustomDetailedPlanAction) => {
    return merge(state, customDetailedPlan);
  },
  ['mvj/plotSearch/NULL_CUSTOM_DETAILED_PLANS']: () => null
}, {});
const pendingCustomDetailedPlanFetchesReducer: Reducer<Array<number>> = handleActions({
  ['mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN']: (state: Array<number>, {
    payload: value
  }) => {
    const id = value.value;

    if (state.includes(id)) {
      return state;
    }

    return [...state, id];
  },
  ['mvj/plotSearch/CUSTOM_DETAILED_PLAN_NOT_FOUND']: (state: Array<number>, {
    payload: id
  }) => state.filter(item => item === id),
  ['mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN']: (state: Array<number>, {
    payload: result
  }) => state.filter(item => !result[item])
}, []);
const isFetchingCustomDetailedPlanAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN_ATTRIBUTES']: () => true,
  ['mvj/plotSearch/CUSTOM_DETAILED_PLAN_ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_CUSTOM_DETAILED_PLAN_ATTRIBUTES']: () => false
}, false);
const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_ATTRIBUTES']: () => true,
  ['mvj/plotSearch/RECEIVE_ATTRIBUTES']: () => false,
  ['mvj/plotSearch/ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_METHODS']: () => false
}, false);
const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/plotSearch/RECEIVE_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveMethodsAction) => {
    return methods;
  }
}, null);
const plotSearchListReducer: Reducer<PlotSearchList> = handleActions({
  ['mvj/plotSearch/RECEIVE_ALL']: (state: PlotSearchList, {
    payload: list
  }: ReceivePlotSearchListAction) => list
}, {});
const currentPlotSearchReducer: Reducer<PlotSearch> = handleActions({
  ['mvj/plotSearch/RECEIVE_SINGLE']: (state: PlotSearch, {
    payload: plotSearch
  }: ReceiveSinglePlotSearchAction) => plotSearch
}, {});
const collapseStatesReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/plotSearch/RECEIVE_COLLAPSE_STATES']: (state: Record<string, any>, {
    payload: states
  }: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  }
}, {});
const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/RECEIVE_SAVE_CLICKED']: (state: boolean, {
    payload: isClicked
  }: ReceiveIsSaveClickedAction) => {
    return isClicked;
  }
}, false);
const isFormValidByIdReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/plotSearch/RECEIVE_FORM_VALID_FLAGS']: (state: Record<string, any>, {
    payload: valid
  }: ReceiveFormValidFlagsAction) => {
    return { ...state,
      ...valid
    };
  },
  ['mvj/plotSearch/CLEAR_FORM_VALID_FLAGS']: () => {
    return {
      [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: true,
      [FormNames.PLOT_SEARCH_APPLICATION]: true
    };
  }
}, {
  [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: true,
  [FormNames.PLOT_SEARCH_APPLICATION]: true
});
const subTypesReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES']: (state: Record<string, any>, {
    payload: subTypes
  }: ReceivePlotSearchSubtypesAction) => {
    return subTypes;
  }
}, null);
const isFetchingTemplateFormsReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_TEMPLATE_FORMS']: () => true,
  ['mvj/plotSearch/TEMPLATE_FORMS_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_TEMPLATE_FORMS']: () => false
}, false);
const isFetchingFormReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_FORM']: () => true,
  ['mvj/plotSearch/FORM_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_FORM']: () => false
}, false);
const templateFormsReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/plotSearch/RECEIVE_TEMPLATE_FORMS']: (state: Record<string, any>, {
    payload: forms
  }: ReceiveTemplateFormsAction) => {
    return forms;
  }
}, []);
const formReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/plotSearch/RECEIVE_FORM']: (state: Record<string, any>, {
    payload: form
  }: ReceiveFormAction) => {
    return form;
  }
}, null);
const decisionCandidateReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/plotSearch/ADD_PLAN_UNIT_DECISIONS']: (state: Record<string, any>, {
    payload: planUnit
  }: AddPlanUnitDecisionsAction) => {
    if (!planUnit.decisions) {
      return state;
    }

    return { ...state,
      [planUnit.id]: planUnit.decisions?.map(decision => annotatePlanUnitDecision(decision, planUnit)) || []
    };
  },
  ['mvj/plotSearch/REMOVE_PLAN_UNIT_DECISIONS']: (state: Record<string, any>, {
    payload: planUnitId
  }: RemovePlanUnitDecisionsAction) => {
    if (!state[planUnitId]) {
      return state;
    }

    const newState = { ...state
    };
    delete newState[planUnitId];
    return newState;
  },
  ['mvj/plotSearch/RESET_PLAN_UNIT_DECISIONS']: () => {
    return {};
  }
}, {});
const stagesReducer: Reducer<Array<Record<string, any>>> = handleActions({
  ['mvj/plotSearch/FETCH_PLOT_SEARCH_STAGES']: () => [],
  ['mvj/plotSearch/PLOT_SEARCH_STAGES_NOT_FOUND']: () => [],
  ['mvj/plotSearch/RECEIVE_PLOT_SEARCH_STAGES']: (state, {
    payload: stages
  }: ReceivePlotSearchStagesAction) => stages
}, []);
const isFetchingStagesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_PLOT_SEARCH_STAGES']: () => true,
  ['mvj/plotSearch/PLOT_SEARCH_STAGES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_PLOT_SEARCH_STAGES']: () => false
}, false);
const isBatchCreatingReservationIdentifiersReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/BATCH_CREATE_RESERVATION_IDENTIFIERS']: () => true,
  ['mvj/plotSearch/RESERVATION_IDENTIFIERS_CREATED']: () => false,
  ['mvj/plotSearch/RESERVATION_IDENTIFIERS_CREATION_FAILED']: () => false
}, false);
const lastBatchReservationCreationErrorReducer: Reducer<any> = handleActions({
  ['mvj/plotSearch/BATCH_CREATE_RESERVATION_IDENTIFIERS']: () => null,
  ['mvj/plotSearch/RESERVATION_IDENTIFIERS_CREATION_FAILED']: (state, {
    payload: errors
  }) => errors
}, null);
const isFetchingReservationIdentifierUnitListsReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_RESERVATION_IDENTIFIER_UNIT_LISTS']: () => true,
  ['mvj/plotSearch/RECEIVE_RESERVATION_IDENTIFIER_UNIT_LISTS']: () => false,
  ['mvj/plotSearch/RESERVATION_IDENTIFIER_UNIT_LISTS_NOT_FOUND']: () => false
}, false);
const reservationIdentifierUnitListsReducer: Reducer<Record<string, any> | null> = handleActions({
  ['mvj/plotSearch/FETCH_RESERVATION_IDENTIFIER_UNIT_LISTS']: () => null,
  ['mvj/plotSearch/RECEIVE_RESERVATION_IDENTIFIER_UNIT_LISTS']: (state, {
    payload
  }) => payload,
  ['mvj/plotSearch/RESERVATION_IDENTIFIER_UNIT_LISTS_NOT_FOUND']: () => null
}, null);
const isCreatingDirectReservationLinkReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/CREATE_DIRECT_RESERVATION_LINK']: () => true,
  ['mvj/plotSearch/DIRECT_RESERVATION_LINK_CREATED']: () => false,
  ['mvj/plotSearch/DIRECT_RESERVATION_LINK_CREATION_FAILED']: () => false
}, false);
const sectionEditorCollapseStatesReducer: Reducer<Record<string, boolean>> = handleActions({
  ['mvj/plotSearch/CLEAR_SECTION_EDITOR_COLLAPSE_STATES']: () => ({}),
  ['mvj/plotSearch/SET_SECTION_EDITOR_COLLAPSE_STATE']: (state: Record<string, boolean>, {
    payload
  }) => ({ ...state,
    [payload.key]: payload.state
  }),
  ['mvj/plotSearch/INITIALIZE_SECTION_EDITOR_COLLAPSE_STATES']: (state, {
    payload
  }) => ({ ...state,
    ...payload
  })
}, {});
const relatedApplicationsReducer: Reducer<Array<Record<string, any>>> = handleActions({
  ['mvj/plotSearch/FETCH_RELATED_APPLICATIONS']: () => [],
  ['mvj/plotSearch/RECEIVE_RELATED_APPLICATIONS']: (state: Array<Record<string, any>>, {
    payload
  }) => payload,
  ['mvj/plotSearch/RELATED_APPLICATIONS_NOT_FOUND']: () => []
}, []);
const isFetchingRelatedApplicationsReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_RELATED_APPLICATIONS']: () => true,
  ['mvj/plotSearch/RECEIVE_RELATED_APPLICATIONS']: () => false,
  ['mvj/plotSearch/RELATED_APPLICATIONS_NOT_FOUND']: () => false
}, false);
export default (combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  collapseStates: collapseStatesReducer,
  current: currentPlotSearchReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingSubtypes: isFetchingSubtypesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFormValidById: isFormValidByIdReducer,
  isSaveClicked: isSaveClickedReducer,
  list: plotSearchListReducer,
  methods: methodsReducer,
  customDetailedPlan: customDetailedPlanReducer,
  customDetailedPlanAttributes: customDetailedPlanAttributesReducer,
  pendingCustomDetailedPlanFetches: pendingCustomDetailedPlanFetchesReducer,
  isFetchingCustomDetailedPlanAttributes: isFetchingCustomDetailedPlanAttributesReducer,
  planUnitAttributes: planUnitAttributesReducer,
  planUnit: planUnitReducer,
  pendingPlanUnitFetches: pendingPlanUnitFetchesReducer,
  isFetchingPlanUnitAttributes: isFetchingPlanUnitAttributesReducer,
  subTypes: subTypesReducer,
  isFetchingTemplateForms: isFetchingTemplateFormsReducer,
  isFetchingForm: isFetchingFormReducer,
  templateForms: templateFormsReducer,
  form: formReducer,
  decisionCandidates: decisionCandidateReducer,
  stages: stagesReducer,
  isFetchingStages: isFetchingStagesReducer,
  isBatchCreatingReservationIdentifiers: isBatchCreatingReservationIdentifiersReducer,
  lastBatchReservationCreationError: lastBatchReservationCreationErrorReducer,
  isFetchingReservationIdentifierUnitLists: isFetchingReservationIdentifierUnitListsReducer,
  reservationIdentifierUnitLists: reservationIdentifierUnitListsReducer,
  isCreatingDirectReservationLink: isCreatingDirectReservationLinkReducer,
  sectionEditorCollapseStates: sectionEditorCollapseStatesReducer,
  relatedApplications: relatedApplicationsReducer,
  isFetchingRelatedApplications: isFetchingRelatedApplicationsReducer
}) as CombinedReducer<PlotSearchState, Action<any>>);