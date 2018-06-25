// @flow
import get from 'lodash/get';

import {formatDecimalNumberForDb, getLabelOfOption} from '$util/helpers';

const getContentIncoiceRows = (invoice: Object) => {
  const rows = get(invoice, 'rows', []);
  return rows.map((row) => {
    return {
      id: row.id,
      tenant: get(row, 'tenant.id'),
      tenantFull: get(row, 'tenant'),
      description: get(row, 'description'),
      amount: get(row, 'amount'),
      receivable_type: get(row, 'receivable_type'),
    };
  });
};

const getInvoiceReceivableTypes = (rows: Array<Object>) => {
  const receivableTypes = [];
  rows.forEach((row) => {
    const receivableType = get(row, 'receivable_type');
    if(receivableType && receivableTypes.indexOf(receivableType) < 0) {
      receivableTypes.push(receivableType);
    }
  });
  return receivableTypes;
};

const getInvoiceTotalSharePercentage = (rows: Array<Object>) => {
  let totalShare = 0;
  rows.forEach((row) => {
    const numerator = get(row, 'tenantFull.share_numerator');
    const denominator = get(row, 'tenantFull.share_denominator');
    if(numerator && denominator) {
      totalShare +=  numerator/denominator;
    }
  });
  return totalShare;
};

const getContentIncoiveItem = (invoice: Object) => {
  const rows = getContentIncoiceRows(invoice);
  return {
    id: invoice.id,
    recipient: get(invoice, 'recipient.id'),
    recipientFull: get(invoice, 'recipient'),
    rows: rows,
    sent_to_sap_at: get(invoice, 'sent_to_sap_at'),
    sap_id: get(invoice, 'sap_id'),
    due_date: get(invoice, 'due_date'),
    invoicing_date: get(invoice, 'invoicing_date'),
    state: get(invoice, 'state'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    postpone_date: get(invoice, 'postpone_date'),
    total_amount: get(invoice, 'total_amount'),
    billed_amount: get(invoice, 'billed_amount'),
    paid_amount: get(invoice, 'paid_amount'),
    paid_date: get(invoice, 'paid_date'),
    outstanding_amount: get(invoice, 'outstanding_amount'),
    payment_notification_date: get(invoice, 'payment_notification_date'),
    collection_charge: get(invoice, 'collection_charge'),
    payment_notification_catalog_date: get(invoice, 'payment_notification_catalog_date'),
    delivery_method: get(invoice, 'delivery_method'),
    type: get(invoice, 'type'),
    notes: get(invoice, 'notes'),
    generated: get(invoice, 'generated'),
    description: get(invoice, 'description'),
    totalShare: getInvoiceTotalSharePercentage(rows),
    receivableTypes: getInvoiceReceivableTypes(rows),
  };
};

export const getContentInvoices = (invoices: Array<Object>): Array<Object> => {
  return invoices.map((invoice) => getContentIncoiveItem(invoice));
};

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
    due_date: get(invoice, 'due_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    total_amount: formatDecimalNumberForDb(get(invoice, 'total_amount')),
    notes: get(invoice, 'notes'),
    rows: getInvoiceRowsForDb(invoice),
  };
};

export const getInvoiceRowsForDb = (invoice: Object) => {
  const rows = get(invoice, 'rows', []);

  return rows.map((row) => {
    return {
      tenant: get(row, 'tenant'),
      receivable_type: get(row, 'receivable_type'),
      description: get(row, 'description'),
      amount: formatDecimalNumberForDb(get(row, 'amount')),
    };
  });
};

export const getNewInvoiceForDb = (invoice: Object) => {
  return {
    lease: invoice.lease,
    recipient: get(invoice, 'recipient'),
    type: get(invoice, 'type'),
    total_amount: formatDecimalNumberForDb(get(invoice, 'total_amount')),
    billed_amount: formatDecimalNumberForDb(get(invoice, 'billed_amount')),
    due_date: get(invoice, 'due_date'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    notes: get(invoice, 'notes'),
    rows: getInvoiceRowsForDb(invoice),
  };
};

export const formatReceivableTypesString = (receivableTypeOptions: Array<Object>, receivableTypes: Array<Object>) => {
  let text = '';

  receivableTypes.forEach((receivableType, index, receivableTypes) => {
    const receivableTypeString = getLabelOfOption(receivableTypeOptions, receivableType);
    if(receivableTypeString) {
      if (Object.is(receivableTypes.length - 1, index)) {
        text += receivableTypeString;
      } else {
        text += `${receivableTypeString}, `;
      }
    }
  });
  return text;
};
