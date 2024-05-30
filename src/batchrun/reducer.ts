import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "types";
import type { ReceiveJobRunAttributesAction, ReceiveJobRunMethodsAction, ReceiveJobRunsAction, JobRuns, ReceiveJobRunLogEntryAttributesAction, ReceiveJobRunLogEntryMethodsAction, FetchJobRunLogEntriesByRunAction, ReceiveJobRunLogEntriesByRunAction, NotFoundJobRunLogEntriesByRunAction, ReceiveScheduledJobAttributesAction, ReceiveScheduledJobMethodsAction, ReceiveScheduledJobsAction, ScheduledJobs } from "batchrun/types";
const isFetchingJobRunsReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_JOB_RUNS': () => true,
  'mvj/batchrun/RECEIVE_JOB_RUNS': () => false,
  'mvj/batchrun/NOT_FOUND_JOB_RUNS': () => false
}, false);
const isFetchingScheduledJobsReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_SCHEDULED_JOBS': () => true,
  'mvj/batchrun/RECEIVE_SCHEDULED_JOBS': () => false,
  'mvj/batchrun/NOT_FOUND_SCHEDULED_JOBS': () => false
}, false);
const isFetchingJobRunAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_JOB_RUN_ATTRIBUTES': () => true,
  'mvj/batchrun/RECEIVE_JOB_RUN_METHODS': () => false,
  'mvj/batchrun/NOT_FOUND_JOB_RUN_ATTRIBUTES': () => false
}, false);
const jobRunAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveJobRunAttributesAction) => {
    return attributes;
  }
}, null);
const jobRunMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveJobRunMethodsAction) => {
    return methods;
  }
}, null);
const jobRunsReducer: Reducer<any> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUNS']: (state: JobRuns, {
    payload: jobRuns
  }: ReceiveJobRunsAction) => {
    return jobRuns;
  }
}, null);
const isFetchingJobRunLogEntryAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRY_ATTRIBUTES': () => true,
  'mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS': () => false,
  'mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRY_ATTRIBUTES': () => false
}, false);
const isFetchingJobRunLogEntriesByRunReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRIES_BY_ID']: (state: Record<string, any>, {
    payload: id
  }: FetchJobRunLogEntriesByRunAction) => {
    return { ...state,
      [id]: true
    };
  },
  ['mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRIES_BY_ID']: (state: Record<string, any>, {
    payload
  }: ReceiveJobRunLogEntriesByRunAction) => {
    return { ...state,
      [payload.run]: false
    };
  },
  ['mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRIES_BY_ID']: (state: Record<string, any>, {
    payload: id
  }: NotFoundJobRunLogEntriesByRunAction) => {
    return { ...state,
      [id]: false
    };
  }
}, {});
const jobRunLogEntryAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveJobRunLogEntryAttributesAction) => {
    return attributes;
  }
}, null);
const jobRunLogEntryMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveJobRunLogEntryMethodsAction) => {
    return methods;
  }
}, null);
const jobRunLogEntriesbyRunReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRIES_BY_ID']: (state: Record<string, any>, {
    payload
  }: ReceiveJobRunLogEntriesByRunAction) => {
    return { ...state,
      [payload.run]: payload.data
    };
  }
}, {});
const isFetchingScheduledJobAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/batchrun/FETCH_SCHEDULED_JOB_ATTRIBUTES': () => true,
  'mvj/batchrun/RECEIVE_SCHEDULED_JOB_METHODS': () => false,
  'mvj/batchrun/NOT_FOUND_SCHEDULED_JOB_ATTRIBUTES': () => false
}, false);
const scheduledJobAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/batchrun/RECEIVE_SCHEDULED_JOB_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveScheduledJobAttributesAction) => {
    return attributes;
  }
}, null);
const scheduledJobMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/batchrun/RECEIVE_SCHEDULED_JOB_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveScheduledJobMethodsAction) => {
    return methods;
  }
}, null);
const scheduledJobsReducer: Reducer<any> = handleActions({
  ['mvj/batchrun/RECEIVE_SCHEDULED_JOBS']: (state: ScheduledJobs, {
    payload: scheduledJobs
  }: ReceiveScheduledJobsAction) => {
    return scheduledJobs;
  }
}, null);
export default combineReducers<Record<string, any>, any>({
  isFetchingJobRunAttributes: isFetchingJobRunAttributesReducer,
  isFetchingJobRuns: isFetchingJobRunsReducer,
  isFetchingJobRunLogEntryAttributes: isFetchingJobRunLogEntryAttributesReducer,
  isFetchingJobRunLogEntriesByRun: isFetchingJobRunLogEntriesByRunReducer,
  isFetchingScheduledJobAttributes: isFetchingScheduledJobAttributesReducer,
  isFetchingScheduledJobs: isFetchingScheduledJobsReducer,
  jobRunAttributes: jobRunAttributesReducer,
  jobRunMethods: jobRunMethodsReducer,
  jobRuns: jobRunsReducer,
  jobRunLogEntryAttributes: jobRunLogEntryAttributesReducer,
  jobRunLogEntryMethods: jobRunLogEntryMethodsReducer,
  jobRunLogEntriesByRun: jobRunLogEntriesbyRunReducer,
  scheduledJobAttributes: scheduledJobAttributesReducer,
  scheduledJobMethods: scheduledJobMethodsReducer,
  scheduledJobs: scheduledJobsReducer
});