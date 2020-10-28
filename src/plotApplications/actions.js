// @flow
import {createAction} from 'redux-actions';
import type {Attributes, Methods} from '../types';

import type {
  FetchPlotApplicationsListAction,
  ReceivePlotApplicationsListAction,
  PlotApplicationsList,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  ReceiveAttributesAction,
  FetchAttributesAction,
  PlotApplication,
  FetchSinglePlotApplicationAction,
  ReceiveSinglePlotApplicationAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ClearFormValidFlagsAction,
} from './types';

export const fetchPlotApplicationsList = (search: string): FetchPlotApplicationsListAction =>
  createAction('mvj/plotApplications/FETCH_ALL')(search);

export const receivePlotApplicationsList = (list: PlotApplicationsList): ReceivePlotApplicationsListAction =>
  createAction('mvj/plotApplications/RECEIVE_ALL')(list);

export const fetchSinglePlotApplication = (id: number): FetchSinglePlotApplicationAction =>
  createAction('mvj/plotApplications/FETCH_SINGLE')(id);

export const receiveSinglePlotApplication = (plotApplication: PlotApplication): ReceiveSinglePlotApplicationAction =>
  createAction('mvj/plotApplications/RECEIVE_SINGLE')(plotApplication);

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/plotApplications/FETCH_ATTRIBUTES')();

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/plotApplications/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/plotApplications/ATTRIBUTES_NOT_FOUND')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTRIBUTES')(attributes);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/plotApplications/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/plotApplications/SHOW_EDIT')();

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/plotApplications/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/plotApplications/RECEIVE_COLLAPSE_STATES')(status);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/plotApplications/CLEAR_FORM_VALID_FLAGS')();
