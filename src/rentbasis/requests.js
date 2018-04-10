// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {RentBasisId} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('basis_of_rent/'), {method: 'OPTIONS'}));
};

export const fetchRentBasisList = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`basis_of_rent/${search || ''}`)));
};

export const fetchSingleRentBasis = (id: RentBasisId): Generator<> => {
  return callApi(new Request(createUrl(`basis_of_rent/${id}/`)));
};
//

// export const fetchSingleLease = (id: LeaseId): Generator<> => {
//   return callApi(new Request(createUrl(`lease/${id}/`)));
// };
//
// export const createLease = (lease: Lease): Generator<> => {
//   const body = JSON.stringify(lease);
//
//   return callApi(new Request(createUrl(`lease/`), {
//     method: 'POST',
//     body,
//   }));
// };
//
// export const patchLease = (lease: Lease): Generator<> => {
//   const {id} = lease;
//   const body = JSON.stringify(lease);
//
//   return callApi(new Request(createUrl(`lease/${id}/`), {
//     method: 'PATCH',
//     body,
//   }));
// };
