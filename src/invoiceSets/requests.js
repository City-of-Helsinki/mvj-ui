// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {LeaseId} from '$src/leases/types';

export const fetchInvoiceSetsByLease = (leaseId: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`invoice_set/?lease=${leaseId}`)));
};

export const creditInvoiceSet = (payload: Object): Generator<any, any, any> => {
  const {creditData, invoiceSetId} = payload;
  const body = JSON.stringify(creditData);

  return callApi(new Request(createUrl(`invoice_set/${invoiceSetId}/credit/`), {
    method: 'POST',
    body,
  }));
};
