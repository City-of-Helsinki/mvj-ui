// @flow
import get from 'lodash/get';
import type {Selector} from '../types';
import type {RentCriteria, RentCriteriasList, RentCriteriasState} from './types';

export const getIsEditMode: Selector<boolean, void> = (state: RentCriteriasState): boolean =>
  state.rentcriteria.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: RentCriteriasState): boolean =>
  state.rentcriteria.isFetching;

export const getRentCriteria: Selector<RentCriteria, void> = (state: RentCriteriasState): RentCriteria =>
  state.rentcriteria.criteria;

export const getRentCriteriasList: Selector<RentCriteriasList, void> = (state: RentCriteriasState): RentCriteriasList =>
  state.rentcriteria.list;

export const getRentCriteriaInitialValues: Selector<RentCriteria, void> = (state: RentCriteriasState): RentCriteria =>
  state.rentcriteria.initialValues;

export const getRentCriteriaFormValues: Selector<RentCriteria, void> = (state: RentCriteriasState): RentCriteria =>
  get(state, 'form.edit-rent-criteria-form.values');
