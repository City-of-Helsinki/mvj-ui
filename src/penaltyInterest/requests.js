// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {InvoiceId} from '$src/invoices/types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`invoice_calculate_penalty_interest/`), {method: 'OPTIONS'}));
};

export const fetchPenaltyInterestByInvoice = (invoice: InvoiceId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`invoice_calculate_penalty_interest/?invoice=${invoice}`)));
};
