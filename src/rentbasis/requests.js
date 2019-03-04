// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {RentBasis, RentBasisId} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('basis_of_rent/'), {method: 'OPTIONS'}));
};

export const fetchRentBasisList = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`basis_of_rent/`, params)));
};

export const fetchSingleRentBasis = (id: RentBasisId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`basis_of_rent/${id}/`)));
};

export const createRentBasis = (rentBasis: RentBasis): Generator<any, any, any> => {
  const body = JSON.stringify(rentBasis);

  return callApi(new Request(createUrl(`basis_of_rent/`), {
    method: 'POST',
    body,
  }));
};

export const editRentBasis = (rentBasis: RentBasis): Generator<any, any, any> => {
  const {id} = rentBasis;
  const body = JSON.stringify(rentBasis);

  return callApi(new Request(createUrl(`basis_of_rent/${id}/`), {
    method: 'PUT',
    body,
  }));
};
