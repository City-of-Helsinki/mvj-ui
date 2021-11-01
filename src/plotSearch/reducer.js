// @flow
import merge from 'lodash/merge';

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import type {Attributes, Reducer, Methods} from '$src/types';
import {FormNames} from '$src/enums';

import type {
  ReceiveIsSaveClickedAction,
  PlotSearch,
  PlotSearchList,
  ReceiveAttributesAction,
  ReceiveCollapseStatesAction,
  ReceivePlotSearchListAction,
  ReceiveSinglePlotSearchAction,
  ReceiveFormValidFlagsAction,
  ReceiveMethodsAction,
  PlanUnit,
  ReceivePlotSearchSubtypeAction,
  ReceiveFormAttributesAction,
  ReceiveFormAction,
  ReceiveTemplateFormsAction
} from '$src/plotSearch/types';
import {annotatePlanUnitDecision} from "./helpers";
import type {AddPlanUnitDecisionsAction, RemovePlanUnitDecisionsAction} from "./types";

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotSearch/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/plotSearch/HIDE_EDIT': () => false,
  'mvj/plotSearch/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_ALL']: () => true,
  ['mvj/plotSearch/RECEIVE_ALL']: () => false,
  ['mvj/plotSearch/FETCH_SINGLE']: () => true,
  ['mvj/plotSearch/RECEIVE_SINGLE']: () => false,
  ['mvj/plotSearch/CREATE']: () => true,
  ['mvj/plotSearch/EDIT']: () => true,
  ['mvj/plotSearch/NOT_FOUND']: () => false,
  ['mvj/plotSearch/DELETE']: () => true,
  ['mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES']: () => true,
  ['mvj/plotSearch/PLOT_SEARCH_SUB_TYPES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES']: () => false,
}, false);

const pendingPlanUnitFetchesReducer: Reducer<Array<number>> = handleActions({
  ['mvj/plotSearch/FETCH_PLAN_UNIT']: (state: Array<number>, {payload: value}) => {
    const id = value.value;
    if (state.includes(id)) {
      return state;
    }

    return [...state, id];
  },
  ['mvj/plotSearch/PLAN_UNIT_NOT_FOUND']: (state: Array<number>, {payload: id}) => state.filter((item) => item === id),
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT']: (state: Array<number>, {payload: result}) => state.filter((item) => !result[item])
}, []);

const pendingPlanUnitAttributeFetchesReducer: Reducer<Array<number>> = handleActions({
  ['mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES']: (state: Array<number>, {payload: value}) => {
    const id = value.value;
    if (state.includes(id)) {
      return state;
    }

    return [...state, id];
  },
  ['mvj/plotSearch/PLAN_UNIT_ATTRIBUTES_NOT_FOUND']: (state: Array<number>, {payload: id}) => state.filter((item) => item === id),
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES']: (state: Array<number>, {payload: result}) => state.filter((item) => !result[item])
}, []);

const planUnitAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return merge(state, attributes);
  },
}, null);

const planUnitReducer: Reducer<PlanUnit> = handleActions({
  ['mvj/plotSearch/RECEIVE_PLAN_UNIT']: (state: PlanUnit, {payload: planUnit}: ReceiveSinglePlotSearchAction) =>
  {
    return merge(state, planUnit);
  },
  ['mvj/plotSearch/NULL_PLAN_UNITS']: () => null,
}, {});

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_ATTRIBUTES']: () => true,
  ['mvj/plotSearch/RECEIVE_ATTRIBUTES']: () => false,
  ['mvj/plotSearch/ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_METHODS']: () => false,
}, false);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/plotSearch/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const plotSearchListReducer: Reducer<PlotSearchList> = handleActions({
  ['mvj/plotSearch/RECEIVE_ALL']: (state: PlotSearchList, {payload: list}: ReceivePlotSearchListAction) => list,
}, {});

const currentPlotSearchReducer: Reducer<PlotSearch> = handleActions({
  ['mvj/plotSearch/RECEIVE_SINGLE']: (state: PlotSearch, {payload: plotSearch}: ReceiveSinglePlotSearchAction) => plotSearch,
}, {});

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/plotSearch/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

const isFormValidByIdReducer: Reducer<Object> = handleActions({
  ['mvj/plotSearch/RECEIVE_FORM_VALID_FLAGS']: (state: Object, {payload: valid}: ReceiveFormValidFlagsAction) => {
    return {
      ...state,
      ...valid,
    };
  },
  ['mvj/plotSearch/CLEAR_FORM_VALID_FLAGS']: () => {
    return {
      [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: true,
      [FormNames.PLOT_SEARCH_APPLICATION]: true,
    };
  },
}, {
  [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: true,
  [FormNames.PLOT_SEARCH_APPLICATION]: true,
});

const subTypesReducer: Reducer<Object> = handleActions({
  ['mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES']: (state: Object, {payload: subTypes}: ReceivePlotSearchSubtypeAction) => {
    return subTypes;
  },
}, null);

const isFetchingFormAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_FORM_ATTRIBUTES']: () => true,
  ['mvj/plotSearch/FORM_ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_FORM_ATTRIBUTES']: () => false,
}, false);

const isFetchingTemplateFormsReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_TEMPLATE_FORMS']: () => true,
  ['mvj/plotSearch/TEMPLATE_FORMS_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_TEMPLATE_FORMS']: () => false,
}, false);

const isFetchingFormReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/FETCH_FORM']: () => true,
  ['mvj/plotSearch/FORM_NOT_FOUND']: () => false,
  ['mvj/plotSearch/RECEIVE_FORM']: () => false,
}, false);

const formAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotSearch/RECEIVE_FORM_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveFormAttributesAction) => {
    return attributes;
  },
}, null);

const templateFormsReducer: Reducer<Object> = handleActions({
  ['mvj/plotSearch/RECEIVE_TEMPLATE_FORMS']: (state: Object, {payload: forms}: ReceiveTemplateFormsAction) => {
    return forms;
  },
}, []);

const formReducer: Reducer<Object> = handleActions({
  ['mvj/plotSearch/RECEIVE_FORM']: (state: Object, {payload: form}: ReceiveFormAction) => {
    return form;
  },
}, null);

const decisionCandidateReducer: Reducer<Array> = handleActions({
  ['mvj/plotSearch/ADD_PLAN_UNIT_DECISIONS']: (state: Object, {payload: planUnit}: AddPlanUnitDecisionsAction) => {
    if (!planUnit.decisions) {
      return state;
    }

    return {
      ...state,
      [planUnit.id]: planUnit.decisions?.map((decision) => annotatePlanUnitDecision(decision, planUnit)) || []
    };
  },
  ['mvj/plotSearch/REMOVE_PLAN_UNIT_DECISIONS']: (state: Object, {payload: planUnitId}: RemovePlanUnitDecisionsAction) => {
    if (!state[planUnitId]) {
      return state;
    }

    const newState = {
      ...state
    };

    delete newState[planUnitId];

    return newState;
  },
  ['mvj/plotSearch/RESET_PLAN_UNIT_DECISIONS']: (state: Object) => {
    return {};
  }
}, {});

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  collapseStates: collapseStatesReducer,
  current: currentPlotSearchReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFormValidById: isFormValidByIdReducer,
  isSaveClicked: isSaveClickedReducer,
  list: plotSearchListReducer,
  methods: methodsReducer,
  planUnitAttributes: planUnitAttributesReducer,
  planUnit: planUnitReducer,
  pendingPlanUnitFetches: pendingPlanUnitFetchesReducer,
  pendingPlanUnitAttributeFetches: pendingPlanUnitAttributeFetchesReducer,
  subTypes: subTypesReducer,
  isFetchingFormAttributes: isFetchingFormAttributesReducer,
  isFetchingTemplateForms: isFetchingTemplateFormsReducer,
  isFetchingForm: isFetchingFormReducer,
  formAttributes: formAttributesReducer,
  templateForms: templateFormsReducer,
  form: formReducer,
  decisionCandidates: decisionCandidateReducer
});
