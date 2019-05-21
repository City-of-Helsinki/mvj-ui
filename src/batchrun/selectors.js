// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingJobAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.batchrun.isFetchingJobAttributes;

export const getJobAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.jobAttributes;

export const getJobMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.batchrun.jobMethods;

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

export const getIsFetchingRuns: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.isFetchingRuns;

export const getIsFetchingSchedules: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchrun.isFetchingSchedules;
