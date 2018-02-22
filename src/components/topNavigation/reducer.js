// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../../types';
import type {
  SetTopNavigationSettingsAction,
  TopNavigationSettings,
  TopNavigationState,
} from './types';

const setSettingsReducer: Reducer<TopNavigationSettings> = handleActions({
  ['mvj/topnavigation/SET_SETTINGS']: (state: TopNavigationState, {payload: options}: SetTopNavigationSettingsAction) => {
    return options;
  },
}, {pageTitle: '', showSearch: false});

export default combineReducers({
  settings: setSettingsReducer,
});
