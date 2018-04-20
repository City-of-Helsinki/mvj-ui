// @flow
import get from 'lodash/get';

import {formatDecimalNumberForDb} from '$util/helpers';

export const getInvoiceSharePercentage = (invoice: Object, precision: number = 0) => {
  const numerator = get(invoice, 'share_numerator');
  const denominator = get(invoice, 'share_denominator');

  if((numerator !== 0 && !numerator || !denominator)) {
    return '';
  }
  return (Number(numerator)/Number(denominator)*100).toFixed(precision);
};

export const getEditedInvoiceForDb = (invoice: Object) => {
  return {
    id: invoice.id,
    lease: invoice.lease,
    due_date: get(invoice, 'due_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    total_amount: formatDecimalNumberForDb(get(invoice, 'total_amount')),
    notes: get(invoice, 'notes'),
  };
};

export const getNewInvoiceForDb = (invoice: Object) => {
  return {
    recipient: get(invoice, 'recipient'),
    billed_amount: formatDecimalNumberForDb(get(invoice, 'billed_amount')),
    due_date: get(invoice, 'due_date'),
    lease: invoice.lease,
    share_numerator: get(invoice, 'share_numerator'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    type: get(invoice, 'type'),
    receivable_type: get(invoice, 'receivable_type'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    share_denominator: get(invoice, 'share_denominator'),
    state: get(invoice, 'state'),
    total_amount: formatDecimalNumberForDb(get(invoice, 'total_amount')),
    notes: get(invoice, 'notes'),
  };
};
