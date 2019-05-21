// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingJobRunAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.batchrun.isFetchingJobRunAttributes;

export const getJobRunAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.jobRunAttributes;

export const getJobRunMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.batchrun.jobRunMethods;

export const getIsFetchingJobRunLogEntryAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.batchrun.isFetchingJobRunLogEntryAttributes;

export const getJobRunLogEntryAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.jobRunLogEntryAttributes;

export const getJobRunLogEntryMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.batchrun.jobRunLogEntryMethods;

export const getIsFetchingScheduledJobAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.batchrun.isFetchingScheduledJobAttributes;

export const getScheduledJobAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.scheduledJobAttributes;

export const getScheduledJobMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.batchrun.scheduledJobMethods;

export const getIsFetchingRuns: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.isFetchingRuns;

export const getIsFetchingSchedules: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.isFetchingSchedules;
