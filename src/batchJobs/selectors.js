// @flow
import type {Attributes, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingRuns: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchJobs.isFetchingRuns;

export const getIsFetchingSchedules: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.batchJobs.isFetchingSchedules;
