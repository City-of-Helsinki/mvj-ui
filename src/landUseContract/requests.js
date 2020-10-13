// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {
  LandUseContract,
} from './types';

export const createLandUseContract = (landUseContract: LandUseContract): Generator<any, any, any> => {
  const body = JSON.stringify(landUseContract);

  return callApi(new Request(createUrl(`land_use_agreement/`), {
    method: 'POST',
    body,
  }));
};

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('land_use_agreement/'), {method: 'OPTIONS'}));
};

export const fetchLandUseContracts = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('land_use_agreement/', params)));
};

export const fetchSingleLandUseContract = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`land_use_agreement/${id}/`)));
};

export const editLandUseContract = (LandUseContract: LandUseContract): Generator<any, any, any> => {
  const {id} = LandUseContract;
  const body = JSON.stringify(LandUseContract);

  return callApi(new Request(createUrl(`land_use_agreement/${id}/`), {
    method: 'PATCH',
    body,
  }));
};

export const deleteLandUseContract = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`land_use_agreement/${id}/`), {method: 'DELETE'}));
};
