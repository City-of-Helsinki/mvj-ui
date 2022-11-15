//@flow
import type {Action, ApiResponse, Attributes, Methods} from '$src/types';

export type BatchRunState = {
  isFetchingJobRunAttributes: boolean,
  isFetcingJobRuns: boolean,
  isFetchingJobRunLogEntryAttributes: boolean,
  isFetchingJobRunLogEntriesByRun: boolean,
  isFetchingScheduledJobAttributes: boolean,
  isFetchingScheduledJobs: boolean,
  jobRunAttributes: Attributes,
  jobRunMethods: Methods,
  jobRuns: JobRuns,
  jobRunLogEntryAttributes: Attributes,
  jobRunLogEntryMethods: Methods,
  jobRunLogEntriesByRun: Object,
  scheduledJobAttributes: Attributes,
  scheduledJobMethods: Methods,
  scheduledJobs: ScheduledJobs,
}

export type JobRuns = ApiResponse;
export type ScheduledJobs = ApiResponse;

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

export type FetchJobRunsAction = Action<'mvj/batchrun/FETCH_JOB_RUNS', Object>;
export type ReceiveJobRunsAction = Action<'mvj/batchrun/RECEIVE_JOB_RUNS', Object>;
export type NotFoundJobRunsAction = Action<'mvj/batchrun/NOT_FOUND_JOB_RUNS', void>;

export type FetchJobRunLogEntriesByRunAction = Action<'mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRIES_BY_ID', number>;
export type ReceiveJobRunLogEntriesByRunAction = Action<'mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRIES_BY_ID', Object>;
export type NotFoundJobRunLogEntriesByRunAction = Action<'mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRIES_BY_ID', number>;

export type FetchScheduledJobsAction = Action<'mvj/batchrun/FETCH_SCHEDULED_JOBS', Object>;
export type ReceiveScheduledJobsAction = Action<'mvj/batchrun/RECEIVE_SCHEDULED_JOBS', Object>;
export type NotFoundScheduledJobsAction = Action<'mvj/batchrun/NOT_FOUND_SCHEDULED_JOBS', void>;
