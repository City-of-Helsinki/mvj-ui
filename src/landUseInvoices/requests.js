// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Invoice, InvoiceId} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('land_use_agreement_invoice/'), {method: 'OPTIONS'}));
};

export const fetchInvoices = (params: ?Object): Generator<any, any, any> => {
  console.log(params);
  return callApi(new Request(createUrl('land_use_agreement_invoice/', params)));
};

export const createInvoice = (invoice: Invoice): Generator<any, any, any> => {
  const body = JSON.stringify(invoice);

  return callApi(new Request(createUrl(`land_use_agreement_invoice/`), {
    method: 'POST',
    body,
  }));
};

export const creditInvoice = (payload: Object): Generator<any, any, any> => {
  const {creditData, invoiceId} = payload;
  const body = JSON.stringify(creditData);

  return callApi(new Request(createUrl(`land_use_agreement_invoice_credit/?land_use_agreement_invoice=${invoiceId}`), {
    method: 'POST',
    body,
  }));
};

export const patchInvoice = (invoice: Invoice): Generator<any, any, any> => {
  const {id} = invoice;
  delete invoice.id;
  const body = JSON.stringify(invoice);

  return callApi(new Request(createUrl(`land_use_agreement_invoice/${id}/`), {
    method: 'PATCH',
    body,
  }));
};

export const deleteInvoice = (id: InvoiceId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`land_use_agreement_invoice/${id}/`), {
    method: 'DELETE',
  })); 
};

export const exportInvoiceToLaske = (id: InvoiceId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`land_use_agreement_invoice_export_to_laske/?invoice=${id}`), {
    method: 'POST',
  }));
};
