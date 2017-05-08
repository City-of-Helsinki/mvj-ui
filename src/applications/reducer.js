// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {Application, ApplicationsList, ReceiveApplicationsAction, ReceiveSingleApplicationAction} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/applications/FETCH_ALL': () => true,
  'mvj/applications/RECEIVE_ALL': () => false,
  'mvj/applications/FETCH_SINGLE': () => true,
  'mvj/applications/RECEIVE_SINGLE': () => false,
  'mvj/applications/NOT_FOUND': () => false,
  'mvj/applications/CREATE': () => true,
}, false);

const applicationsListReducer: Reducer<ApplicationsList> = handleActions({
  ['mvj/applications/RECEIVE_ALL']: (state: ApplicationsList, {payload: applications}: ReceiveApplicationsAction) => {
    return applications;
  },
}, []);

const currentApplicationReducer: Reducer<Application> = handleActions({
  ['mvj/applications/RECEIVE_SINGLE']: (state: Application, {payload: application}: ReceiveSingleApplicationAction) => {
    return application;
  },
}, {});

export default combineReducers({
  current: currentApplicationReducer,
  list: applicationsListReducer,
  isFetching: isFetchingReducer,
});
