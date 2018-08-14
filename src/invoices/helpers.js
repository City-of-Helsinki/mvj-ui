// @flow
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';

import {CreditInvoiceOptionsEnum} from '$src/leases/enums';
import {formatDecimalNumberForDb, getLabelOfOption, sortStringByKeyAsc} from '$util/helpers';

const getContentIncoicePayments = (invoice: Object) => {
  const payments = get(invoice, 'payments', []);
  return payments.map((payment) => {
    return {
      id: payment.id,
      paid_amount: get(payment, 'paid_amount'),
      paid_date: get(payment, 'paid_date'),
    };
  });
};

const getContentIncoiceRows = (invoice: Object) => {
  const rows = get(invoice, 'rows', []);
  return rows.map((row) => {
    return {
      id: row.id,
      tenant: get(row, 'tenant.id'),
      tenantFull: get(row, 'tenant'),
      description: get(row, 'description'),
      amount: get(row, 'amount'),
      receivable_type: get(row, 'receivable_type.id') || get(row, 'receivable_type'),
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
  const tenants = [];

  rows.forEach((row) =>{
    if(findIndex(tenants, (tenant) => get(tenant, 'id') === get(row, 'tenantFull.id')) === -1) {
      tenants.push(row.tenantFull);
    }
  });

  tenants.forEach((row) => {
    const numerator = get(row, 'share_numerator');
    const denominator = get(row, 'share_denominator');
    if(numerator && denominator) {
      totalShare +=  numerator/denominator;
    }
  });
  return totalShare;
};

export const getContentIncoiveItem = (invoice: Object) => {
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
    payments: getContentIncoicePayments(invoice),
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
    credited_invoice: get(invoice, 'credited_invoice'),
    invoiceset: get(invoice, 'invoiceset'),
  };
};

export const getContentInvoices = (invoices: Array<Object>): Array<Object> => {
  return invoices && invoices.length ? invoices.map((invoice) => getContentIncoiveItem(invoice)) : [];
};

export const getInvoiceSharePercentage = (invoice: Object, precision: number = 0) => {
  const numerator = get(invoice, 'share_numerator');
  const denominator = get(invoice, 'share_denominator');

  if((numerator !== 0 && !numerator || !denominator)) {
    return '';
  }
  return (Number(numerator)/Number(denominator)*100).toFixed(precision);
};

const formatInvoicePaymentsForDb = (invoice: Object) => {
  const payments = get(invoice, 'payments', []);
  return payments.map((payment) => {
    return {
      id: invoice.id,
      paid_amount: formatDecimalNumberForDb(get(payment, 'paid_amount')),
      paid_date: get(payment, 'paid_date'),
    };
  });
};

export const formatEditedInvoiceForDb = (invoice: Object) => {
  return {
    id: invoice.id,
    due_date: get(invoice, 'due_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    total_amount: formatDecimalNumberForDb(get(invoice, 'total_amount')),
    payments: formatInvoicePaymentsForDb(invoice),
    notes: get(invoice, 'notes', ''),
    rows: formatInvoiceRowsForDb(invoice),
  };
};

export const formatInvoiceRowsForDb = (invoice: Object) => {
  return get(invoice, 'rows', []).map((row) => {
    return {
      tenant: get(row, 'tenant'),
      receivable_type: get(row, 'receivable_type'),
      amount: formatDecimalNumberForDb(get(row, 'amount')),
    };
  });
};

export const formatNewInvoiceForDb = (invoice: Object) => {
  return {
    lease: invoice.lease,
    recipient: get(invoice, 'recipient'),
    type: get(invoice, 'type'),
    total_amount: formatDecimalNumberForDb(get(invoice, 'total_amount')),
    billed_amount: formatDecimalNumberForDb(get(invoice, 'billed_amount')),
    due_date: get(invoice, 'due_date'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    notes: get(invoice, 'notes', ''),
    rows: formatInvoiceRowsForDb(invoice),
  };
};

export const formatChargeRowsForDb = (invoice: Object) => {
  return get(invoice, 'rows', []).map((row) => {
    return {
      receivable_type: get(row, 'receivable_type'),
      amount: formatDecimalNumberForDb(get(row, 'amount')),
    };
  });
};

export const formatNewChargeForDb = (invoice: Object) => {
  return {
    type: get(invoice, 'type'),
    due_date: get(invoice, 'due_date'),
    billing_period_end_date: get(invoice, 'billing_period_end_date'),
    billing_period_start_date: get(invoice, 'billing_period_start_date'),
    notes: get(invoice, 'notes', ''),
    rows: formatChargeRowsForDb(invoice),
  };
};

export const formatCreditInvoiceForDb = (invoice: Object) => {
  if(!invoice) {return undefined;}

  const payload = {};
  if(invoice.type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT && invoice.amount) {
    payload.amount = formatDecimalNumberForDb(invoice.amount);
  }
  if(invoice.type !== CreditInvoiceOptionsEnum.FULL && invoice.receivable_type) {
    payload.receivable_type = invoice.receivable_type;
  }
  payload.notes = invoice.notes || '';

  return payload;
};

export const formatReceivableTypesString = (receivableTypeOptions: Array<Object>, receivableTypes: Array<Object>) => {
  return receivableTypes.map((receivableType) => {
    return getLabelOfOption(receivableTypeOptions, receivableType);
  }).sort(sortStringByKeyAsc).join(', ');
};
