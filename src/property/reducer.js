// @flow
import merge from 'lodash/merge';

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';

import type {
  ReceiveCollapseStatesAction,
} from '$src/property/types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/property/HIDE_EDIT': () => false,
  'mvj/property/SHOW_EDIT': () => true,
}, false);

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/property/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

export default combineReducers<Object, any>({
  isEditMode: isEditModeReducer,
  collapseStates: collapseStatesReducer,
});

