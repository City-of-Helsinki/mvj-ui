import {createAction} from 'redux-actions';

import type {
  FetchBatchRunsAction,
  ReceiveBatchRunsAction,
  NotFoundBatchRunsAction,
  FetchBatchSchedulesAction,
  ReceiveBatchSchedulesAction,
  NotFoundBatchSchedulesAction,
} from '$src/batchJobs/types';

export const fetchBatchRuns = (query: Object): FetchBatchRunsAction =>
  createAction('mvj/batchJobs/FETCH_BATCH_RUNS')(query);

export const receiveBatchRuns = (runs: Object): ReceiveBatchRunsAction =>
  createAction('mvj/batchJobs/RECEIVE_BATCH_RUNS')(runs);

export const notFoundBatchRuns = (): NotFoundBatchRunsAction =>
  createAction('mvj/batchJobs/NOT_FOUND_BATCH_RUNS')();

export const fetchBatchSchedules = (query: Object): FetchBatchSchedulesAction =>
  createAction('mvj/batchJobs/FETCH_BATCH_SCHEDULES')(query);

export const receiveBatchSchedules = (schedules: Object): ReceiveBatchSchedulesAction =>
  createAction('mvj/batchJobs/RECEIVE_BATCH_SCHEDULES')(schedules);

export const notFoundBatchSchedules = (): NotFoundBatchSchedulesAction =>
  createAction('mvj/batchJobs/NOT_FOUND_BATCH_SCHEDULES')();
