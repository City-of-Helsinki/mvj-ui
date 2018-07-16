// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {InfillDevelopmentId} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/`), {method: 'OPTIONS'}));
};

export const fetchInfillDevelopments = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/${search || ''}`)));
};

export const fetchSingleInfillDevelopment = (id: InfillDevelopmentId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/${id}/`)));
};
