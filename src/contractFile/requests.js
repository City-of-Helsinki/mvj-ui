// @flow

import callApi from '../api/callApi';
import createUrlWithoutVersionSuffix from '../api/createUrlWithoutVersionSuffix';

import type {ContractId} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrlWithoutVersionSuffix(`contract_file/1/`), {method: 'OPTIONS'}));
};

export const fetchContractFiles = (id: ContractId): Generator<any, any, any> => {
  return callApi(new Request(createUrlWithoutVersionSuffix(`contract_file/${id}/`)));
};
