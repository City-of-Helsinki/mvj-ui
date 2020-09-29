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
} from './types';

export const fetchPlotApplicationsList = (search: string): FetchPlotApplicationsListAction =>
  createAction('mvj/plotApplications/FETCH_ALL')(search);

export const receivePlotApplicationsList = (list: PlotApplicationsList): ReceivePlotApplicationsListAction =>
  createAction('mvj/plotApplications/RECEIVE_ALL')(list);

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/plotApplications/FETCH_ATTRIBUTES')();

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/plotApplications/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/plotApplications/ATTRIBUTES_NOT_FOUND')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTRIBUTES')(attributes);
