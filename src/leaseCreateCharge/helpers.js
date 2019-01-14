// @flow
import get from 'lodash/get';

import {convertStrToDecimalNumber} from '$util/helpers';

/**
 * Get lease create charge rows payload data for API
 * @param invoice
 * @returns {object}
 */
const getPayloadLeaseCreateChargeRows = (invoice: Object) => {
  return get(invoice, 'rows', []).map((row) => ({
    receivable_type: row.receivable_type,
    amount: convertStrToDecimalNumber(row.amount),
  }));
};

/**
 * Get lease create charge endpoint payload for API
 * @param invoice
 * @returns {object}
 */
export const getPayloadLeaseCreateCharge = (invoice: Object) => {
  return {
    lease: invoice.lease,
    type: invoice.type,
    due_date: invoice.due_date,
    billing_period_end_date: invoice.billing_period_end_date,
    billing_period_start_date: invoice.billing_period_start_date,
    notes: invoice.notes,
    rows: getPayloadLeaseCreateChargeRows(invoice),
  };
};
