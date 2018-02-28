// @flow

import type {Selector} from '../types';
import type {RentCriteria, RentCriteriasList, RentCriteriasState} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RentCriteriasState): boolean =>
  state.rentcriterias.isFetching;

export const getRentCriteriasList: Selector<RentCriteriasList, void> = (state: RentCriteriasState): RentCriteriasList =>
  state.rentcriterias.list;

export const getRentCriteriaInitialValues: Selector<RentCriteria, void> = (state: RentCriteriasState): RentCriteria =>
  state.rentcriterias.initialValues;
