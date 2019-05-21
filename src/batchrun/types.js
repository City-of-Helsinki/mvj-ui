import type {Action, Attributes, Methods} from '$src/types';

export type BatchRunState = {
  isFetchingJobAttributes: boolean,
  isFetchingJobRunAttributes: boolean,
  isFetchingJobRunLogEntryAttributes: boolean,
  isFetcingRuns: boolean,
  isFetchingSchedules: boolean,
  jobAttributes: Attributes,
  jobMethods: Methods,
  jobRunAttributes: Attributes,
  jobRunMethods: Methods,
  jobRunLogEntryAttributes: Attributes,
  jobRunLogEntryMethods: Methods,
}

export type FetchJobAttributesAction = Action<'mvj/batchrun/FETCH_JOB_ATTRIBUTES', void>;
export type ReceiveJobAttributesAction = Action<'mvj/batchrun/RECEIVE_JOB_ATTRIBUTES', Attributes>;
export type ReceiveJobMethodsAction = Action<'mvj/batchrun/RECEIVE_JOB_METHODS', Methods>;
export type NotFoundJobAttributesAction = Action<'mvj/batchrun/NOT_FOUND_JOB_ATTRIBUTES', void>;

export type FetchJobRunAttributesAction = Action<'mvj/batchrun/FETCH_JOB_RUN_ATTRIBUTES', void>;
export type ReceiveJobRunAttributesAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_ATTRIBUTES', Attributes>;
export type ReceiveJobRunMethodsAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_METHODS', Methods>;
export type NotFoundJobRunAttributesAction = Action<'mvj/batchrun/NOT_FOUND_JOB_RUN_ATTRIBUTES', void>;

export type FetchJobRunLogEntryAttributesAction = Action<'mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRY_ATTRIBUTES', void>;
export type ReceiveJobRunLogEntryAttributesAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_ATTRIBUTES', Attributes>;
export type ReceiveJobRunLogEntryMethodsAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS', Methods>;
export type NotFoundJobRunLogEntryAttributesAction = Action<'mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRY_ATTRIBUTES', void>;

export type FetchBatchRunsAction = Action<'mvj/batchrun/FETCH_BATCH_RUNS', Object>;
export type ReceiveBatchRunsAction = Action<'mvj/batchrun/RECEIVE_BATCH_RUNS', Object>;
export type NotFoundBatchRunsAction = Action<'mvj/batchrun/NOT_FOUND_BATCH_RUNS', void>;

export type FetchBatchSchedulesAction = Action<'mvj/batchrun/FETCH_BATCH_SCHEDULES', Object>;
export type ReceiveBatchSchedulesAction = Action<'mvj/batchrun/RECEIVE_BATCH_SCHEDULES', Object>;
export type NotFoundBatchSchedulesAction = Action<'mvj/batchrun/NOT_FOUND_BATCH_SCHEDULES', void>;
