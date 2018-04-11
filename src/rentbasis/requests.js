// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {RentBasis, RentBasisId} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('basis_of_rent/'), {method: 'OPTIONS'}));
};

export const fetchRentBasisList = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`basis_of_rent/${search || ''}`)));
};

export const fetchSingleRentBasis = (id: RentBasisId): Generator<> => {
  return callApi(new Request(createUrl(`basis_of_rent/${id}/`)));
};

export const editRentBasis = (rentBasis: RentBasis): Generator<> => {
  const {id} = rentBasis;
  const body = JSON.stringify(rentBasis);

  return callApi(new Request(createUrl(`basis_of_rent/${id}/`), {
    method: 'PUT',
    body,
  }));
};
