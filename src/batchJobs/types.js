import type {Action} from '../types';

export type BatchJobsState = {
  isFetcingRuns: boolean,
  isFetchingSchedules: boolean,
}

export type FetchBatchRunsAction = Action<'mvj/batchJobs/FETCH_BATCH_RUNS', Object>;
export type ReceiveBatchRunsAction = Action<'mvj/batchJobs/RECEIVE_BATCH_RUNS', Object>;
export type NotFoundBatchRunsAction = Action<'mvj/batchJobs/NOT_FOUND_BATCH_RUNS', void>;

export type FetchBatchSchedulesAction = Action<'mvj/batchJobs/FETCH_BATCH_SCHEDULES', Object>;
export type ReceiveBatchSchedulesAction = Action<'mvj/batchJobs/RECEIVE_BATCH_SCHEDULES', Object>;
export type NotFoundBatchSchedulesAction = Action<'mvj/batchJobs/NOT_FOUND_BATCH_SCHEDULES', void>;
