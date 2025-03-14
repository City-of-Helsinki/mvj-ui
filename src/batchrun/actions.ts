import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
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
  FetchJobRunsAction,
  ReceiveJobRunsAction,
  NotFoundJobRunsAction,
  FetchJobRunLogEntriesByRunAction,
  ReceiveJobRunLogEntriesByRunAction,
  NotFoundJobRunLogEntriesByRunAction,
  FetchScheduledJobsAction,
  ReceiveScheduledJobsAction,
  NotFoundScheduledJobsAction,
} from "@/batchrun/types";
export const fetchJobRunAttributes = (): FetchJobRunAttributesAction =>
  createAction("mvj/batchrun/FETCH_JOB_RUN_ATTRIBUTES")();
export const receiveJobRunAttributes = (
  attributes: Attributes,
): ReceiveJobRunAttributesAction =>
  createAction("mvj/batchrun/RECEIVE_JOB_RUN_ATTRIBUTES")(attributes);
export const receiveJobRunMethods = (
  methods: Methods,
): ReceiveJobRunMethodsAction =>
  createAction("mvj/batchrun/RECEIVE_JOB_RUN_METHODS")(methods);
export const notFoundJobRunAttributes = (): NotFoundJobRunAttributesAction =>
  createAction("mvj/batchrun/NOT_FOUND_JOB_RUN_ATTRIBUTES")();
export const fetchJobRunLogEntryAttributes =
  (): FetchJobRunLogEntryAttributesAction =>
    createAction("mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRY_ATTRIBUTES")();
export const receiveJobRunLogEntryAttributes = (
  attributes: Attributes,
): ReceiveJobRunLogEntryAttributesAction =>
  createAction("mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_ATTRIBUTES")(attributes);
export const receiveJobRunLogEntryMethods = (
  methods: Methods,
): ReceiveJobRunLogEntryMethodsAction =>
  createAction("mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRY_METHODS")(methods);
export const notFoundJobRunLogEntryAttributes =
  (): NotFoundJobRunLogEntryAttributesAction =>
    createAction("mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRY_ATTRIBUTES")();
export const fetchScheduledJobAttributes =
  (): FetchScheduledJobAttributesAction =>
    createAction("mvj/batchrun/FETCH_SCHEDULED_JOB_ATTRIBUTES")();
export const receiveScheduledJobAttributes = (
  attributes: Attributes,
): ReceiveScheduledJobAttributesAction =>
  createAction("mvj/batchrun/RECEIVE_SCHEDULED_JOB_ATTRIBUTES")(attributes);
export const receiveScheduledJobMethods = (
  methods: Methods,
): ReceiveScheduledJobMethodsAction =>
  createAction("mvj/batchrun/RECEIVE_SCHEDULED_JOB_METHODS")(methods);
export const notFoundScheduledJobAttributes =
  (): NotFoundScheduledJobAttributesAction =>
    createAction("mvj/batchrun/NOT_FOUND_SCHEDULED_JOB_ATTRIBUTES")();
export const fetchJobRuns = (query: Record<string, any>): FetchJobRunsAction =>
  createAction("mvj/batchrun/FETCH_JOB_RUNS")(query);
export const receiveJobRuns = (
  runs: Record<string, any>,
): ReceiveJobRunsAction => createAction("mvj/batchrun/RECEIVE_JOB_RUNS")(runs);
export const notFoundJobRuns = (): NotFoundJobRunsAction =>
  createAction("mvj/batchrun/NOT_FOUND_JOB_RUNS")();
export const fetchJobRunLogEntriesByRun = (
  run: number,
): FetchJobRunLogEntriesByRunAction =>
  createAction("mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRIES_BY_ID")(run);
export const receiveJobRunLogEntriesByRun = (
  data: Record<string, any>,
): ReceiveJobRunLogEntriesByRunAction =>
  createAction("mvj/batchrun/RECEIVE_JOB_RUN_LOG_ENTRIES_BY_ID")(data);
export const notFoundJobRunLogEntriesByRun = (
  run: number,
): NotFoundJobRunLogEntriesByRunAction =>
  createAction("mvj/batchrun/NOT_FOUND_JOB_RUN_LOG_ENTRIES_BY_ID")(run);
export const fetchScheduledJobs = (
  query: Record<string, any>,
): FetchScheduledJobsAction =>
  createAction("mvj/batchrun/FETCH_SCHEDULED_JOBS")(query);
export const receiveScheduledJobs = (
  schedules: Record<string, any>,
): ReceiveScheduledJobsAction =>
  createAction("mvj/batchrun/RECEIVE_SCHEDULED_JOBS")(schedules);
export const notFoundScheduledJobs = (): NotFoundScheduledJobsAction =>
  createAction("mvj/batchrun/NOT_FOUND_SCHEDULED_JOBS")();
