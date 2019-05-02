// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';

const isFetchingRunsReducer: Reducer<boolean> = handleActions({
  'mvj/batchJobs/FETCH_BATCH_RUNS': () => true,
  'mvj/batchJobs/RECEIVE_BATCH_RUNS': () => false,
  'mvj/batchJobs/NOT_FOUND_BATCH_RUNS': () => false,
}, false);

const isFetchingSchedulesReducer: Reducer<boolean> = handleActions({
  'mvj/batchJobs/FETCH_BATCH_SCHEDULES': () => true,
  'mvj/batchJobs/RECEIVE_BATCH_SCHEDULES': () => false,
  'mvj/batchJobs/NOT_FOUND_BATCH_SCHEDULES': () => false,
}, false);


export default combineReducers<Object, any>({
  isFetchingRuns: isFetchingRunsReducer,
  isFetchingSchedules: isFetchingSchedulesReducer,
});
