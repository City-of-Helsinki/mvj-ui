// @flow

import {createAction} from 'redux-actions';
import type {
  AreaSearchesByBBoxNotFoundAction,
  AreaSearchesNotFoundAction,
  AttributesNotFoundAction,
  FetchAreaSearchListAction,
  FetchAreaSearchListByBBoxAction,
  FetchAttributesAction,
  FetchSingleAreaSearchAction,
  ReceiveAreaSearchListAction,
  ReceiveAreaSearchListByBBoxAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveSingleAreaSearchAction,
  SingleAreaSearchNotFoundAction,
  ClearFormValidFlagsAction,
  HideEditModeAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ShowEditModeAction,
  FetchListAttributesAction,
  ReceiveListAttributesAction,
  ReceiveListMethodsAction,
  ListAttributesNotFoundAction,
} from '$src/areaSearch/types';
import type {Attributes, Methods} from '$src/types';
import type {
} from '$src/plotSearch/types';

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/areaSearch/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/areaSearch/SHOW_EDIT')();

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/areaSearch/RECEIVE_COLLAPSE_STATES')(status);

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/areaSearch/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/areaSearch/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/areaSearch/CLEAR_FORM_VALID_FLAGS')();

export const fetchListAttributes = (): FetchListAttributesAction =>
  createAction('mvj/areaSearch/FETCH_LIST_ATTRIBUTES')();

export const receiveListAttributes = (attributes: Attributes): ReceiveListAttributesAction =>
  createAction('mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES')(attributes);

export const receiveListMethods = (methods: Methods): ReceiveListMethodsAction =>
  createAction('mvj/areaSearch/RECEIVE_LIST_METHODS')(methods);

export const listAttributesNotFound = (): ListAttributesNotFoundAction =>
  createAction('mvj/areaSearch/LIST_ATTRIBUTES_NOT_FOUND')();

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/areaSearch/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/areaSearch/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/areaSearch/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/areaSearch/ATTRIBUTES_NOT_FOUND')();

export const fetchAreaSearchList = (payload: Object): FetchAreaSearchListAction =>
  createAction('mvj/areaSearch/FETCH_ALL')(payload);

export const fetchAreaSearchListByBBox = (payload: Object): FetchAreaSearchListByBBoxAction =>
  createAction('mvj/areaSearch/FETCH_ALL_BY_BBOX')(payload);

export const receiveAreaSearchList = (payload: Object): ReceiveAreaSearchListAction =>
  createAction('mvj/areaSearch/RECEIVE_ALL')(payload);

export const receiveAreaSearchByBBoxList = (payload: Object): ReceiveAreaSearchListByBBoxAction =>
  createAction('mvj/areaSearch/RECEIVE_ALL_BY_BBOX')(payload);

export const areaSearchesNotFound = (): AreaSearchesNotFoundAction =>
  createAction('mvj/areaSearch/NOT_FOUND')();

export const areaSearchesByBBoxNotFound = (): AreaSearchesByBBoxNotFoundAction =>
  createAction('mvj/areaSearch/NOT_FOUND_BY_BBOX')();

export const fetchSingleAreaSearch = (id: number): FetchSingleAreaSearchAction =>
  createAction('mvj/areaSearch/FETCH_SINGLE')(id);

export const receiveSingleAreaSearch = (payload: Object): ReceiveSingleAreaSearchAction =>
  createAction('mvj/areaSearch/RECEIVE_SINGLE')(payload);

export const singleAreaSearchNotFound = (): SingleAreaSearchNotFoundAction =>
  createAction('mvj/areaSearch/SINGLE_NOT_FOUND')();
