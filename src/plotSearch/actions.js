// @flow
import {createAction} from 'redux-actions';
import type {Attributes, Methods} from '$src/types';

import type {
  CreatePlotSearchAction,
  EditPlotSearchAction,
  FetchAttributesAction,
  ReceiveAttributesAction,
  FetchPlotSearchListAction,
  ReceivePlotSearchListAction,
  FetchSinglePlotSearchAction,
  ReceiveSinglePlotSearchAction,
  ReceiveIsSaveClickedAction,
  PlotSearch,
  PlotSearchList,
  PlotSearchId,
  ReceiveFormValidFlagsAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveCollapseStatesAction,
  ClearFormValidFlagsAction,
  PlotSearchNotFoundAction,
  ReceiveMethodsAction,
  PlotSearchAttributesNotFoundAction,
  FetchSinglePlotSearchAfterEditPayload,
  FetchSinglePlotSearchAfterEditAction,
  DeletePlotSearchAction,
  FetchPlanUnitAction,
  ReceiveSinglePlanUnitAction,
  FetchPlanUnitAttributesAction,
  PlanUnitAttributesNotFoundAction,
  ReceivePlanUnitAttributesAction,
  PlanUnit,
  PlanUnitNotFoundAction,
  fetchPlotSearchSubtypesAction,
  PlotSearchSubtypeNotFoundAction,
  ReceivePlotSearchSubtypeAction,
  NullPlanUnitsAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/plotSearch/FETCH_ATTRIBUTES')();

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/plotSearch/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): PlotSearchAttributesNotFoundAction =>
  createAction('mvj/plotSearch/ATTRIBUTES_NOT_FOUND')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/plotSearch/RECEIVE_ATTRIBUTES')(attributes);

export const fetchPlotSearchList = (search: string): FetchPlotSearchListAction =>
  createAction('mvj/plotSearch/FETCH_ALL')(search);

export const receivePlotSearchList = (list: PlotSearchList): ReceivePlotSearchListAction =>
  createAction('mvj/plotSearch/RECEIVE_ALL')(list);

export const fetchSinglePlotSearch = (id: PlotSearchId): FetchSinglePlotSearchAction =>
  createAction('mvj/plotSearch/FETCH_SINGLE')(id);

export const receiveSinglePlotSearch = (plotSearch: PlotSearch): ReceiveSinglePlotSearchAction =>
  createAction('mvj/plotSearch/RECEIVE_SINGLE')(plotSearch);

export const editPlotSearch = (plotSearch: PlotSearch): EditPlotSearchAction =>
  createAction('mvj/plotSearch/EDIT')(plotSearch);

export const fetchSinglePlotSearchAfterEdit = (payload: FetchSinglePlotSearchAfterEditPayload): FetchSinglePlotSearchAfterEditAction =>
  createAction('mvj/plotSearch/FETCH_SINGLE_AFTER_EDIT')(payload);

export const createPlotSearch = (plotSearch: PlotSearch): CreatePlotSearchAction =>
  createAction('mvj/plotSearch/CREATE')(plotSearch);

export const deletePlotSearch = (id: PlotSearchId): DeletePlotSearchAction =>
  createAction('mvj/plotSearch/DELETE')(id);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/plotSearch/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/plotSearch/SHOW_EDIT')();

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/plotSearch/RECEIVE_COLLAPSE_STATES')(status);

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/plotSearch/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/plotSearch/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/plotSearch/CLEAR_FORM_VALID_FLAGS')();

export const notFound = (): PlotSearchNotFoundAction =>
  createAction('mvj/plotSearch/NOT_FOUND')();

export const planUnitNotFound = (): PlanUnitNotFoundAction =>
  createAction('mvj/plotSearch/PLAN_UNIT_NOT_FOUND')();

export const fetchPlanUnit = (payload: Object): FetchPlanUnitAction =>
  createAction('mvj/plotSearch/FETCH_PLAN_UNIT')(payload);

export const receiveSinglePlanUnit = (planUnit: PlanUnit): ReceiveSinglePlanUnitAction =>
  createAction('mvj/plotSearch/RECEIVE_PLAN_UNIT')(planUnit);

export const fetchPlanUnitAttributes = (payload: Object): FetchPlanUnitAttributesAction =>
  createAction('mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES')(payload);

export const planUnitAttributesNotFound = (): PlanUnitAttributesNotFoundAction =>
  createAction('mvj/plotSearch/PLAN_UNIT_ATTRIBUTES_NOT_FOUND')();

export const receivePlanUnitAttributes = (attributes: Attributes): ReceivePlanUnitAttributesAction =>
  createAction('mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES')(attributes);

export const fetchPlotSearchSubtypes = (payload: Object): fetchPlotSearchSubtypesAction =>
  createAction('mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES')(payload);

export const PlotSearchSubtypeNotFound = (): PlotSearchSubtypeNotFoundAction =>
  createAction('mvj/plotSearch/PLOT_SEARCH_SUB_TYPES_NOT_FOUND')();

export const receivePlotSearchSubtype = (subTypes: Object): ReceivePlotSearchSubtypeAction =>
  createAction('mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES')(subTypes);

export const nullPlanUnits = (): NullPlanUnitsAction =>
  createAction('mvj/plotSearch/NULL_PLAN_UNITS')();
