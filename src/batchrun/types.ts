import type { Action, ApiResponse, Attributes, Methods } from "types";
export type BatchRunState = {
  isFetchingJobRunAttributes: boolean;
  isFetchingJobRuns: boolean;
  isFetchingJobRunLogEntryAttributes: boolean;
  isFetchingJobRunLogEntriesByRun: any;
  isFetchingScheduledJobAttributes: boolean;
  isFetchingScheduledJobs: boolean;
  jobRunAttributes: Attributes;
  jobRunMethods: Methods;
  jobRuns: JobRuns;
  jobRunLogEntryAttributes: Attributes;
  jobRunLogEntryMethods: Methods;
  jobRunLogEntriesByRun: Record<string, any>;
  scheduledJobAttributes: Attributes;
  scheduledJobMethods: Methods;
  scheduledJobs: ScheduledJobs;
};
export type JobRuns = ApiResponse;
export type ScheduledJobs = ApiResponse;
export type FetchJobRunAttributesAction = Action<string, void>;
export type ReceiveJobRunAttributesAction = Action<string, Attributes>;
export type ReceiveJobRunMethodsAction = Action<string, Methods>;
export type NotFoundJobRunAttributesAction = Action<string, void>;
export type FetchJobRunLogEntryAttributesAction = Action<string, void>;
export type ReceiveJobRunLogEntryAttributesAction = Action<string, Attributes>;
export type ReceiveJobRunLogEntryMethodsAction = Action<string, Methods>;
export type NotFoundJobRunLogEntryAttributesAction = Action<string, void>;
export type FetchScheduledJobAttributesAction = Action<string, void>;
export type ReceiveScheduledJobAttributesAction = Action<string, Attributes>;
export type ReceiveScheduledJobMethodsAction = Action<string, Methods>;
export type NotFoundScheduledJobAttributesAction = Action<string, void>;
export type FetchJobRunsAction = Action<string, Record<string, any>>;
export type ReceiveJobRunsAction = Action<string, Record<string, any>>;
export type NotFoundJobRunsAction = Action<string, void>;
export type FetchJobRunLogEntriesByRunAction = Action<string, number>;
export type ReceiveJobRunLogEntriesByRunAction = Action<
  string,
  Record<string, any>
>;
export type NotFoundJobRunLogEntriesByRunAction = Action<string, number>;
export type FetchScheduledJobsAction = Action<string, Record<string, any>>;
export type ReceiveScheduledJobsAction = Action<string, Record<string, any>>;
export type NotFoundScheduledJobsAction = Action<string, void>;
