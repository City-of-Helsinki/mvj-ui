import type {Action, Attributes, Methods} from '$src/types';

export type BatchRunState = {
  isFetchingJobRunAttributes: boolean,
  isFetchingJobRunLogEntryAttributes: boolean,
  isFetcingRuns: boolean,
  isFetchingSchedules: boolean,
  isFetchingScheduledJobAttributes: boolean,
  jobRunAttributes: Attributes,
  jobRunMethods: Methods,
  jobRunLogEntryAttributes: Attributes,
  jobRunLogEntryMethods: Methods,
  scheduledJobAttributes: Attributes,
  scheduledJobMethods: Methods,
}

export type FetchJobRunAttributesAction = Action<'mvj/batchrun/FETCH_JOB_RUN_ATTRIBUTES', void>;
export type ReceiveJobRunAttributesAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_ATTRIBUTES', Attributes>;
export type ReceiveJobRunMethodsAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_METHODS', Methods>;
export type NotFoundJobRunAttributesAction = Action<'mvj/batchrun/NOT_FOUND_JOB_RUN_ATTRIBUTES', void>;

export type FetchJobRunLogEntryAttributesAction = Action<'mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRY_ATTRIBUTES', void>;
export type ReceiveJobRunLogEntryAttributesAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_ATTRIBUTES', Attributes>;
export type ReceiveJobRunLogEntryMethodsAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS', Methods>;
export type NotFoundJobRunLogEntryAttributesAction = Action<'mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRY_ATTRIBUTES', void>;

export type FetchScheduledJobAttributesAction = Action<'mvj/batchrun/FETCH_SCHEDULED_JOB_ATTRIBUTES', void>;
export type ReceiveScheduledJobAttributesAction = Action<'mvj/batchrun/RECEIVE_SCHEDULED_JOB_ATTRIBUTES', Attributes>;
export type ReceiveScheduledJobMethodsAction = Action<'mvj/batchrun/RECEIVE_SCHEDULED_JOB_METHODS', Methods>;
export type NotFoundScheduledJobAttributesAction = Action<'mvj/batchrun/NOT_FOUND_SCHEDULED_JOB_ATTRIBUTES', void>;

export type FetchBatchRunsAction = Action<'mvj/batchrun/FETCH_BATCH_RUNS', Object>;
export type ReceiveBatchRunsAction = Action<'mvj/batchrun/RECEIVE_BATCH_RUNS', Object>;
export type NotFoundBatchRunsAction = Action<'mvj/batchrun/NOT_FOUND_BATCH_RUNS', void>;

export type FetchBatchSchedulesAction = Action<'mvj/batchrun/FETCH_BATCH_SCHEDULES', Object>;
export type ReceiveBatchSchedulesAction = Action<'mvj/batchrun/RECEIVE_BATCH_SCHEDULES', Object>;
export type NotFoundBatchSchedulesAction = Action<'mvj/batchrun/NOT_FOUND_BATCH_SCHEDULES', void>;
