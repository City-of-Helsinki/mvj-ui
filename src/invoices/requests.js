// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Invoice} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('invoice/'), {method: 'OPTIONS'}));
};

export const fetchInvoices = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`invoice/${search || ''}`)));
};

export const patchInvoice = (invoice: Invoice): Generator<> => {
  const {id} = invoice;
  const body = JSON.stringify(invoice);

  return callApi(new Request(createUrl(`invoice/${id}/`), {
    method: 'PATCH',
    body,
  }));
};
