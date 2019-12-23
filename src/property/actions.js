// @flow
import {createAction} from 'redux-actions';

import type {Attributes} from '$src/types';
import type {
  CreatePropertyAction,
  EditPropertyAction,
  FetchAttributesAction,
  ReceiveAttributesAction,
  FetchPropertyListAction,
  ReceivePropertyListAction,
  FetchSinglePropertyAction,
  ReceiveSinglePropertyAction,
  ReceiveIsSaveClickedAction,
  Property,
  PropertyList,
  PropertyId,
  ReceiveFormValidFlagsAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveCollapseStatesAction,
  ClearFormValidFlagsAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/property/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/property/RECEIVE_ATTRIBUTES')(attributes);

export const fetchPropertyList = (search: string): FetchPropertyListAction =>
  createAction('mvj/property/FETCH_ALL')(search);

export const receivePropertyList = (list: PropertyList): ReceivePropertyListAction =>
  createAction('mvj/property/RECEIVE_ALL')(list);

export const fetchSingleProperty = (id: PropertyId): FetchSinglePropertyAction =>
  createAction('mvj/property/FETCH_SINGLE')(id);

export const receiveSingleProperty = (property: Property): ReceiveSinglePropertyAction =>
  createAction('mvj/property/RECEIVE_SINGLE')(property);

export const editProperty = (property: Property): EditPropertyAction =>
  createAction('mvj/property/EDIT')(property);

export const createProperty = (property: Property): CreatePropertyAction =>
  createAction('mvj/property/CREATE')(property);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/property/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/property/SHOW_EDIT')();

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/property/RECEIVE_COLLAPSE_STATES')(status);

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/property/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/property/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/property/CLEAR_FORM_VALID_FLAGS')();

