import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchJobRunAttributesAction,
  ReceiveJobRunAttributesAction,
  ReceiveJobRunMethodsAction,
  NotFoundJobRunAttributesAction,
  FetchJobRunLogEntryAttributesAction,
  ReceiveJobRunLogEntryAttributesAction,
  ReceiveJobRunLogEntryMethodsAction,
  NotFoundJobRunLogEntryAttributesAction,
  FetchScheduledJobAttributesAction,
  ReceiveScheduledJobAttributesAction,
  ReceiveScheduledJobMethodsAction,
  NotFoundScheduledJobAttributesAction,
  FetchBatchRunsAction,
  ReceiveBatchRunsAction,
  NotFoundBatchRunsAction,
  FetchBatchSchedulesAction,
  ReceiveBatchSchedulesAction,
  NotFoundBatchSchedulesAction,
} from '$src/batchrun/types';

export const fetchJobRunAttributes = (): FetchJobRunAttributesAction =>
  createAction('mvj/batchrun/FETCH_JOB_RUN_ATTRIBUTES')();

export const receiveJobRunAttributes = (attributes: Attributes): ReceiveJobRunAttributesAction =>
  createAction('mvj/batchrun/RECEIVE_JOB_RUN_ATTRIBUTES')(attributes);

export const receiveJobRunMethods = (methods: Methods): ReceiveJobRunMethodsAction =>
  createAction('mvj/batchrun/RECEIVE_JOB_RUN_METHODS')(methods);

export const notFoundJobRunAttributes = (): NotFoundJobRunAttributesAction =>
  createAction('mvj/batchrun/NOT_FOUND_JOB_RUN_ATTRIBUTES')();

export const fetchJobRunLogEntryAttributes = (): FetchJobRunLogEntryAttributesAction =>
  createAction('mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRY_ATTRIBUTES')();

export const receiveJobRunLogEntryAttributes = (attributes: Attributes): ReceiveJobRunLogEntryAttributesAction =>
  createAction('mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_ATTRIBUTES')(attributes);

export const receiveJobRunLogEntryMethods = (methods: Methods): ReceiveJobRunLogEntryMethodsAction =>
  createAction('mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS')(methods);

export const notFoundJobRunLogEntryAttributes = (): NotFoundJobRunLogEntryAttributesAction =>
  createAction('mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRY_ATTRIBUTES')();

export const fetchScheduledJobAttributes = (): FetchScheduledJobAttributesAction =>
  createAction('mvj/batchrun/FETCH_SCHEDULED_JOB_ATTRIBUTES')();

export const receiveScheduledJobAttributes = (attributes: Attributes): ReceiveScheduledJobAttributesAction =>
  createAction('mvj/batchrun/RECEIVE_SCHEDULED_JOB_ATTRIBUTES')(attributes);

export const receiveScheduledJobMethods = (methods: Methods): ReceiveScheduledJobMethodsAction =>
  createAction('mvj/batchrun/RECEIVE_SCHEDULED_JOB_METHODS')(methods);

export const notFoundScheduledJobAttributes = (): NotFoundScheduledJobAttributesAction =>
  createAction('mvj/batchrun/NOT_FOUND_SCHEDULED_JOB_ATTRIBUTES')();

export const fetchBatchRuns = (query: Object): FetchBatchRunsAction =>
  createAction('mvj/batchrun/FETCH_BATCH_RUNS')(query);

export const receiveBatchRuns = (runs: Object): ReceiveBatchRunsAction =>
  createAction('mvj/batchrun/RECEIVE_BATCH_RUNS')(runs);

export const notFoundBatchRuns = (): NotFoundBatchRunsAction =>
  createAction('mvj/batchrun/NOT_FOUND_BATCH_RUNS')();

export const fetchBatchSchedules = (query: Object): FetchBatchSchedulesAction =>
  createAction('mvj/batchrun/FETCH_BATCH_SCHEDULES')(query);

export const receiveBatchSchedules = (schedules: Object): ReceiveBatchSchedulesAction =>
  createAction('mvj/batchrun/RECEIVE_BATCH_SCHEDULES')(schedules);

export const notFoundBatchSchedules = (): NotFoundBatchSchedulesAction =>
  createAction('mvj/batchrun/NOT_FOUND_BATCH_SCHEDULES')();
