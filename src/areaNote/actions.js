// @flow
import {createAction} from 'redux-actions';
import type {Attributes, Methods} from '$src/types';

import type {
  AreaNote,
  AreaNoteId,
  AreaNoteList,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchAreaNoteListAction,
  ReceiveAreaNoteListAction,
  CreateAreaNoteAction,
  DeleteAreaNoteAction,
  EditAreaNoteAction,
  ReceiveDeletedAreaNoteAction,
  ReceiveEditedAreaNoteAction,
  AreaNoteNotFoundAction,
  ShowEditModeAction,
  HideEditModeAction,
  InitializeAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/areaNote/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/areaNote/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/areaNote/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/areaNote/ATTRIBUTES_NOT_FOUND')();

export const fetchAreaNoteList = (params: ?Object): FetchAreaNoteListAction =>
  createAction('mvj/areaNote/FETCH_ALL')(params);

export const receiveAreaNoteList = (areaNote: AreaNoteList): ReceiveAreaNoteListAction =>
  createAction('mvj/areaNote/RECEIVE_ALL')(areaNote);

export const createAreaNote = (areaNote: AreaNote): CreateAreaNoteAction =>
  createAction('mvj/areaNote/CREATE')(areaNote);

export const deleteAreaNote = (id: number): DeleteAreaNoteAction =>
  createAction('mvj/areaNote/DELETE')(id);

export const editAreaNote = (areaNote: AreaNote): EditAreaNoteAction =>
  createAction('mvj/areaNote/EDIT')(areaNote);

export const receiveDeletedAreaNote = (id: AreaNoteId): ReceiveDeletedAreaNoteAction =>
  createAction('mvj/areaNote/RECEIVE_DELETED')(id);

export const receiveEditedAreaNote = (areaNote: AreaNote): ReceiveEditedAreaNoteAction =>
  createAction('mvj/areaNote/RECEIVE_EDITED')(areaNote);

export const notFound = (): AreaNoteNotFoundAction =>
  createAction('mvj/areaNote/NOT_FOUND')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/areaNote/SHOW_EDIT_MODE')();

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/areaNote/HIDE_EDIT_MODE')();

export const initializeAreaNote = (areaNote: Object): InitializeAction =>
  createAction('mvj/areaNote/INITIALIZE')(areaNote);
