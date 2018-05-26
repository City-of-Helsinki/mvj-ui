// @flow
import type {Selector} from '../types';
import type {Attributes, RentBasis, RentBasisList, RentBasisState} from './types';

export const getIsEditMode: Selector<boolean, void> = (state: RentBasisState): boolean =>
  state.rentBasis.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: RentBasisState): boolean =>
  state.rentBasis.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: RentBasisState): Attributes =>
  state.rentBasis.attributes;

export const getRentBasisList: Selector<RentBasisList, void> = (state: RentBasisState): RentBasisList =>
  state.rentBasis.list;

export const getRentBasis: Selector<RentBasis, void> = (state: RentBasisState): RentBasis =>
  state.rentBasis.rentbasis;

export const getRentBasisInitialValues: Selector<RentBasis, void> = (state: RentBasisState): RentBasis =>
  state.rentBasis.initialValues;

export const getIsFormValid: Selector<boolean, void> = (state: RentBasisState): boolean =>
  state.rentBasis.isFormValid;
