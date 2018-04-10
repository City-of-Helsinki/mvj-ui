// @flow
import get from 'lodash/get';
import type {Selector} from '../types';
import type {Attributes, RentBasis, RentBasisList, RentBasisState} from './types';

export const getIsEditMode: Selector<boolean, void> = (state: RentBasisState): boolean =>
  state.rentbasis.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: RentBasisState): boolean =>
  state.rentbasis.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: RentBasisState): Attributes =>
  state.rentbasis.attributes;

export const getRentBasisList: Selector<RentBasisList, void> = (state: RentBasisState): RentBasisList =>
  state.rentbasis.list;

export const getRentBasis: Selector<RentBasis, void> = (state: RentBasisState): RentBasis =>
  state.rentbasis.rentbasis;

export const getRentCriteriaInitialValues: Selector<RentBasis, void> = (state: RentBasisState): RentBasis =>
  state.rentbasis.initialValues;

export const getRentCriteriaFormValues: Selector<RentBasis, void> = (state: RentBasisState): RentBasis =>
  get(state, 'form.rent-basis-form.values');
