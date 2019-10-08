// @flow
import type {Attributes, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseStatisticReport.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.leaseStatisticReport.attributes;
