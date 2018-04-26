// @flow

import type {Selector} from '../types';

import type {
  NoticePeriodList,
  NoticePeriodState,
} from './types';

export const getIsFetching: Selector<boolean, void> = (state: NoticePeriodState): boolean =>
  state.noticePeriod.isFetching;

export const getNoticePeriods: Selector<NoticePeriodList, void> = (state: NoticePeriodState): NoticePeriodList =>
  state.noticePeriod.list;
