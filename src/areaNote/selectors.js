// @flow
import type {Selector} from '../types';
import type {AreaNoteList, AreaNoteState} from './types';

export const getIsFetching: Selector<boolean, void> = (state: AreaNoteState): boolean =>
  state.areaNote.isFetching;

export const getIsEditMode: Selector<boolean, void> = (state: AreaNoteState): boolean =>
  state.areaNote.isEditMode;

export const getInitialAreaNote: Selector<Object, void> = (state: AreaNoteState): Object =>
  state.areaNote.initialValues;

export const getAreaNoteList: Selector<AreaNoteList, void> = (state: AreaNoteState): AreaNoteList =>
  state.areaNote.list;
