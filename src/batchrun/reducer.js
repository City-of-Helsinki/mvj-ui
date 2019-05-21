// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  ReceiveScheduledJobAttributesAction,
  ReceiveScheduledJobMethodsAction,
  ReceiveJobRunAttributesAction,
  ReceiveJobRunMethodsAction,
  ReceiveJobRunLogEntryAttributesAction,
  ReceiveJobRunLogEntryMethodsAction,
} from '$src/batchrun/types';

const isFetchingRunsReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_BATCH_RUNS': () => true,
  'mvj/batchrun/RECEIVE_BATCH_RUNS': () => false,
  'mvj/batchrun/NOT_FOUND_BATCH_RUNS': () => false,
}, false);

const isFetchingSchedulesReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_BATCH_SCHEDULES': () => true,
  'mvj/batchrun/RECEIVE_BATCH_SCHEDULES': () => false,
  'mvj/batchrun/NOT_FOUND_BATCH_SCHEDULES': () => false,
}, false);

const isFetchingJobRunAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_JOB_RUN_ATTRIBUTES': () => true,
  'mvj/batchrun/RECEIVE_JOB_RUN_METHODS': () => false,
  'mvj/batchrun/NOT_FOUND_JOB_RUN_ATTRIBUTES': () => false,
}, false);

const jobRunAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveJobRunAttributesAction) => {
    return attributes;
  },
}, null);

const jobRunMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_METHODS']: (state: Methods, {payload: methods}: ReceiveJobRunMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingJobRunLogEntryAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRY_ATTRIBUTES': () => true,
  'mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS': () => false,
  'mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRY_ATTRIBUTES': () => false,
}, false);

const jobRunLogEntryAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveJobRunLogEntryAttributesAction) => {
    return attributes;
  },
}, null);

const jobRunLogEntryMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS']: (state: Methods, {payload: methods}: ReceiveJobRunLogEntryMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingScheduledJobAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_SCHEDULED_JOB_ATTRIBUTES': () => true,
  'mvj/batchrun/RECEIVE_SCHEDULED_JOB_METHODS': () => false,
  'mvj/batchrun/NOT_FOUND_SCHEDULED_JOB_ATTRIBUTES': () => false,
}, false);

const scheduledJobAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/batchrun/RECEIVE_SCHEDULED_JOB_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveScheduledJobAttributesAction) => {
    return attributes;
  },
}, null);

const scheduledJobMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/batchrun/RECEIVE_SCHEDULED_JOB_METHODS']: (state: Methods, {payload: methods}: ReceiveScheduledJobMethodsAction) => {
    return methods;
  },
}, null);

export default combineReducers<Object, any>({
  isFetchingJobRunAttributes: isFetchingJobRunAttributesReducer,
  isFetchingJobRunLogEntryAttributes: isFetchingJobRunLogEntryAttributesReducer,
  isFetchingRuns: isFetchingRunsReducer,
  isFetchingScheduledJobAttributes: isFetchingScheduledJobAttributesReducer,
  isFetchingSchedules: isFetchingSchedulesReducer,
  jobRunAttributes: jobRunAttributesReducer,
  jobRunMethods: jobRunMethodsReducer,
  jobRunLogEntryAttributes: jobRunLogEntryAttributesReducer,
  jobRunLogEntryMethods: jobRunLogEntryMethodsReducer,
  scheduledJobAttributes: scheduledJobAttributesReducer,
  scheduledJobMethods: scheduledJobMethodsReducer,
});
