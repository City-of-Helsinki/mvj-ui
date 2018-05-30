// @flow
import type {Selector} from '../types';
import type {
  InfillDevelopment,
  InfillDevelopmentList,
  InfillDevelopmentState,
} from './types';

export const getIsFetching: Selector<boolean, void> = (state: InfillDevelopmentState): boolean =>
  state.infillDevelopment.isFetching;

export const getInfillDevelopments: Selector<InfillDevelopmentList, void> = (state: InfillDevelopmentState): InfillDevelopmentList =>
  state.infillDevelopment.list;

export const getCurrentInfillDevelopment: Selector<InfillDevelopment, void> = (state: InfillDevelopmentState): InfillDevelopment =>
  state.infillDevelopment.current;
