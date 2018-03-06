// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  ReceiveTopNavigationSettingsAction,
  TopNavigationSettings,
  TopNavigationState,
} from './types';

const setSettingsReducer: Reducer<TopNavigationSettings> = handleActions({
  ['mvj/topnavigation/RECEIVE']: (state: TopNavigationState, {payload: options}: ReceiveTopNavigationSettingsAction) => {
    return options;
  },
}, {linkUrl: '', pageTitle: '', showSearch: false});

export default combineReducers({
  settings: setSettingsReducer,
});
