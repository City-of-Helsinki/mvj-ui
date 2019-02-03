// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Invoice} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('invoice/'), {method: 'OPTIONS'}));
};

export const fetchInvoices = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`invoice/${search || ''}`)));
};

export const createInvoice = (invoice: Invoice): Generator<any, any, any> => {
  const body = JSON.stringify(invoice);

  return callApi(new Request(createUrl(`invoice/`), {
    method: 'POST',
    body,
  }));
};

export const creditInvoice = (payload: Object): Generator<any, any, any> => {
  const {creditData, invoiceId} = payload;
  const body = JSON.stringify(creditData);

  return callApi(new Request(createUrl(`invoice_credit/?invoice=${invoiceId}`), {
    method: 'POST',
    body,
  }));
};

export const patchInvoice = (invoice: Invoice): Generator<any, any, any> => {
  const {id} = invoice;
  delete invoice.id;
  const body = JSON.stringify(invoice);

  return callApi(new Request(createUrl(`invoice/${id}/`), {
    method: 'PATCH',
    body,
  }));
};
