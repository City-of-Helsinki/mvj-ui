import type { ApiResponse, Attributes, Methods, Selector } from "types";
import type { RootState } from "@/root/types";
import type { JobRuns, ScheduledJobs } from "@/batchrun/types";
export const getIsFetchingJobRunAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.batchrun.isFetchingJobRunAttributes;
export const getJobRunAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.batchrun.jobRunAttributes;
export const getJobRunMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.batchrun.jobRunMethods;
export const getIsFetchingJobRuns: Selector<boolean, void> = (
  state: RootState,
): boolean => state.batchrun.isFetchingJobRuns;
export const getJobRuns: Selector<JobRuns, void> = (
  state: RootState,
): JobRuns => state.batchrun.jobRuns;
export const getIsFetchingJobRunLogEntryAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.batchrun.isFetchingJobRunLogEntryAttributes;
export const getJobRunLogEntryAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.batchrun.jobRunLogEntryAttributes;
export const getJobRunLogEntryMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.batchrun.jobRunLogEntryMethods;
export const getIsFetchingJobRunLogEntriesByRun: Selector<boolean, number> = (
  state: RootState,
  run: number,
): boolean => state.batchrun.isFetchingJobRunLogEntriesByRun[run];
export const getJobRunLogEntriesByRun: Selector<ApiResponse, number> = <T>(
  state: RootState,
  run: number,
): ApiResponse<T> => state.batchrun.jobRunLogEntriesByRun[run];
export const getIsFetchingScheduledJobAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.batchrun.isFetchingScheduledJobAttributes;
export const getScheduledJobAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.batchrun.scheduledJobAttributes;
export const getScheduledJobMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.batchrun.scheduledJobMethods;
export const getIsFetchingScheduledJobs: Selector<boolean, void> = (
  state: RootState,
): boolean => state.batchrun.isFetchingScheduledJobs;
export const getScheduledJobs: Selector<ScheduledJobs, void> = (
  state: RootState,
): ScheduledJobs => state.batchrun.scheduledJobs;
export const getIsFetchingRuns: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.batchrun.isFetchingJobRuns;
