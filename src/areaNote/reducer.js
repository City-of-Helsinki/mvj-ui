// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import findIndex from 'lodash/findIndex';

import type {Reducer} from '../types';

import type {
  AreaNoteList,
  ReceiveAreaNoteListAction,
  ReceiveDeletedAreaNoteAction,
  ReceiveEditedAreaNoteAction,
  InitializeAction,
} from './types';

const initialValuesReducer: Reducer<Object> = handleActions({
  ['mvj/areaNote/INITIALIZE']: (state: Object, {payload: values}: InitializeAction) => {
    return values;
  },
}, {
  id: -1,
  geoJSON: {},
  isNew: true,
  note: '',
});

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/areaNote/SHOW_EDIT_MODE': () => true,
  'mvj/areaNote/HIDE_EDIT_MODE': () => false,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/areaNote/FETCH_ALL': () => true,
  'mvj/areaNote/RECEIVE_ALL': () => false,
  'mvj/areaNote/RECEIVE_DELETED': () => false,
  'mvj/areaNote/RECEIVE_EDITED': () => false,
  'mvj/areaNote/CREATE': () => true,
  'mvj/areaNote/DELETE': () => true,
  'mvj/areaNote/EDIT': () => true,
  'mvj/areaNote/NOT_FOUND': () => false,
}, false);

const areaNoteListReducer: Reducer<AreaNoteList> = handleActions({
  ['mvj/areaNote/RECEIVE_ALL']: (state: AreaNoteList, {payload: list}: ReceiveAreaNoteListAction) => {
    return list;
  },
  ['mvj/areaNote/RECEIVE_DELETED']: (state: AreaNoteList, {payload: areaNoteId}: ReceiveDeletedAreaNoteAction) => {
    const newList = [...state];
    return newList.filter((area) => area.id !== areaNoteId);
  },
  ['mvj/areaNote/RECEIVE_EDITED']: (state: AreaNoteList, {payload: areaNote}: ReceiveEditedAreaNoteAction) => {
    const newList = [...state];

    const index = findIndex(newList, (area) => area.id === areaNote.id);
    if(index === -1) {
      newList.push(areaNote);
    } else {
      newList[index] = areaNote;
    }

    return newList;
  },
}, []);

export default combineReducers({
  initialValues: initialValuesReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  list: areaNoteListReducer,
});
