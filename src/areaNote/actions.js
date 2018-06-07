// @flow
import {createAction} from 'redux-actions';

import type {
  AreaNote,
  AreaNoteId,
  AreaNoteList,
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

export const fetchAreaNoteList = (search: string): FetchAreaNoteListAction =>
  createAction('mvj/areaNote/FETCH_ALL')(search);

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
