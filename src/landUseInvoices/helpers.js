// @flow
import isPast from 'date-fns/isPast';
import forEach from 'lodash/forEach';
import get from 'lodash/get';

import {CreditInvoiceOptions} from '$src/leases/enums';
import {InvoiceState, InvoiceType, ReceivableTypes} from './enums';
import {convertStrToDecimalNumber, getLabelOfOption, sortStringAsc} from '$util/helpers';

/**
 * Get payments of single invoice to show on UI
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getContentInvoicePayments = (invoice: Object): Array<Object> => {
  return get(invoice, 'payments', []).map((payment) => ({
    id: payment.id,
    paid_amount: payment.paid_amount,
    paid_date: payment.paid_date,
  }));
};

/**
 * Get rows of single invoice to show on UI
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getContentIncoiceRows = (invoice: Object): Array<Object> => {
  const rows = get(invoice, 'rows', []);

  return rows.map((row) => ({
    id: row.id,
    tenant: get(row, 'tenant.id'),
    tenantFull: row.tenant,
    description: row.description,
    amount: row.amount,
    receivable_type: get(row, 'receivable_type.id') || row.receivable_type,
    billing_period_end_date: row.billing_period_end_date,
    billing_period_start_date: row.billing_period_start_date,
  }));
};

/**
 * Get receivable types of single invoice to show on UI
 * @param {Object[]} rows
 * @returns {Array<Object>}
 */
export const getContentInvoiceReceivableTypes = (rows: Array<Object>): Array<Object> => {
  const receivableTypes = [];

  rows.forEach((row) => {
    const receivableType = row.receivable_type;
    if(receivableType && receivableTypes.indexOf(receivableType) < 0) {
      receivableTypes.push(receivableType);
    }
  });

  return receivableTypes;
};

/**
 * Get total share percentage of single invoice to show on UI
 * @param {Object} invoice
 * @returns {number}
 */
const getContentInvoiceTotalSharePercentage = (invoice: Object): ?number => {
  if(invoice.total_amount === null ||
    Number(invoice.total_amount) === 0 ||
    invoice.billed_amount === null ||
    Number(invoice.billed_amount) === 0) return null;

  return Number(invoice.billed_amount) / Number(invoice.total_amount);
};

/**
 * Get credit or interest invoice content to show on UI
 * @param {Object} invoice - Credit or interest invoice
 * @returns {Object}
 */
const getContentCreditOrInterestInvoice = (invoice: Object): Object => ({
  id: invoice.id,
  number: invoice.number,
  due_date: invoice.due_date,
  total_amount: invoice.total_amount,
});

/**
 * Get credit invoices of single invoice to show on UI
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getContentCreditInvoices = (invoice: Object): Array<Object> =>
  get(invoice, 'credit_invoices', []).map((item) => getContentCreditOrInterestInvoice(item));

/**
 * Get interest invoices of single invoice to show on UI
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getContentInterestInvoices = (invoice: Object): Array<Object> =>
  get(invoice, 'interest_invoices', []).map((item) => getContentCreditOrInterestInvoice(item));

/**
 * Get single invoice content to show on UI
 * @param {Object} invoice
 * @returns {Object}
 */
export const getContentIncoive = (invoice: Object): Object => {
  const rows = getContentIncoiceRows(invoice);
  
  return {
    id: invoice.id,
    number: invoice.number,
    recipient: get(invoice, 'recipient.id'),
    recipientFull: invoice.recipient,
    rows: rows,
    sent_to_sap_at: invoice.sent_to_sap_at,
    sap_id: invoice.sap_id,
    due_date: invoice.due_date,
    adjusted_due_date: invoice.adjusted_due_date,
    invoicing_date: invoice.invoicing_date,
    state: invoice.state,
    billing_period_end_date: invoice.billing_period_end_date,
    billing_period_start_date: invoice.billing_period_start_date,
    postpone_date: invoice.postpone_date,
    total_amount: invoice.total_amount,
    billed_amount: invoice.billed_amount,
    payments: getContentInvoicePayments(invoice),
    outstanding_amount: invoice.outstanding_amount,
    payment_notification_date: invoice.payment_notification_date,
    collection_charge: invoice.collection_charge,
    payment_notification_catalog_date: invoice.payment_notification_catalog_date,
    delivery_method: invoice.delivery_method,
    type: invoice.type,
    notes: invoice.notes,
    generated: invoice.generated,
    description: invoice.description,
    totalShare: getContentInvoiceTotalSharePercentage(invoice),
    receivableTypes: getContentInvoiceReceivableTypes(rows),
    credit_invoices: getContentCreditInvoices(invoice),
    credited_invoice: invoice.credited_invoice,
    interest_invoices: getContentInterestInvoices(invoice),
    interest_invoice_for: invoice.interest_invoice_for,
    invoiceset: invoice.invoiceset,
  };
};

/**
 * Get invoices content to show on UI
 * @param {Object[]} invoices
 * @returns {Object[]}
 */
export const getContentInvoices = (invoices: Array<Object>): Array<Object> => {
  return invoices 
    ? invoices.map((invoice) => getContentIncoive(invoice)) 
    : [];
};

/**
 * Get overdue invoices content to show on UI
 * @param {Object[]} invoices
 * @returns {Object[]}
 */
export const getContentOverdueInvoices = (invoices: Array<Object>): Array<Object> => {
  return invoices && invoices.length ? invoices
    .filter((invoice) => isInvoiceOverdue(invoice))
    .map((invoice) => getContentIncoive(invoice)) : [];
};

/**
 * Get payments for invoice payload for API
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getPayloadInvoicePayments = (invoice: Object): Array<Object> => {
  return get(invoice, 'payments', []).map((payment) => ({
    id: payment.id, 
    paid_amount: convertStrToDecimalNumber(payment.paid_amount),
    paid_date: payment.paid_date,
  }));
};

/**
 * Get rows for invoice payload for API
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getPayloadInvoiceRows = (invoice: Object): Array<Object> => {
  return get(invoice, 'rows', []).map((row) => {
    return {
      tenant: row.tenant,
      receivable_type: row.receivable_type,
      amount: convertStrToDecimalNumber(row.amount),
      billing_period_start_date: row.billing_period_start_date,
      billing_period_end_date: row.billing_period_end_date,
      description: row.description,
    };
  });
};

/**
 * Get edit invoice payload for API
 * @param {Object} invoice
 * @returns {Object}
 */
export const getPayloadEditInvoice = (invoice: Object): Object => {
  return {
    id: invoice.id,
    due_date: invoice.type !== InvoiceType.CREDIT_NOTE
      ? invoice.due_date
      : undefined,
    billing_period_start_date: invoice.type !== InvoiceType.CREDIT_NOTE
      ? invoice.billing_period_start_date
      : undefined,
    billing_period_end_date: invoice.type !== InvoiceType.CREDIT_NOTE
      ? invoice.billing_period_end_date
      : undefined,
    postpone_date: invoice.type !== InvoiceType.CREDIT_NOTE
      ? invoice.postpone_date
      : undefined,
    notes: invoice.notes,
    payments: invoice.type !== InvoiceType.CREDIT_NOTE
      ? getPayloadInvoicePayments(invoice)
      : undefined,
    rows: getPayloadInvoiceRows(invoice),
  };
};

/**
 * Get create invoice payload for API
 * @param {Object} invoice
 * @returns {Object}
 */
export const getPayloadCreateInvoice = (invoice: Object): Object => {
  return {
    lease: invoice.lease,
    recipient: invoice.recipient,
    tenant: invoice.tenant,
    type: invoice.type,
    due_date: invoice.due_date,
    billing_period_end_date: invoice.billing_period_end_date,
    billing_period_start_date: invoice.billing_period_start_date,
    notes: invoice.notes,
    rows: getPayloadInvoiceRows(invoice),
  };
};

/**
 * Get credit invoice payload for API
 * @param {Object} invoice
 * @returns {Object}
 */
export const getPayloadCreditInvoice = (invoice: Object): Object => {
  if(!invoice) return undefined;

  const payload = {};
  if(invoice.type === CreditInvoiceOptions.RECEIVABLE_TYPE_AMOUNT && invoice.amount) {
    payload.amount = convertStrToDecimalNumber(invoice.amount);
  }

  if(invoice.type !== CreditInvoiceOptions.FULL && invoice.receivable_type) {
    payload.receivable_type = invoice.receivable_type;
  }

  payload.notes = invoice.notes || '';

  return payload;
};

/**
  * Test is invoice billing period fields required
  * @param {Object[]} rows
  * @return {boolean}
  */
export const isInvoiceBillingPeriodRequired = (rows: Array<Object>): boolean => {
  let required = false;

  if(!rows) return required;

  forEach(rows, (row) => {
    if(row.receivable_type == ReceivableTypes.RENTAL) {
      required = true;
      return false;
    }
  });

  return required;
};

/**
  * Test is invoice overdue
  * @param {Object} invoice
  * @return {boolean}
  */
export const isInvoiceOverdue = (invoice: Object): boolean => {
  return invoice.state === InvoiceState.OPEN && invoice.due_date && isPast(new Date(invoice.due_date));
};

/**
 * Get receivable type string from receivable type values
 * @param receivableTypeOptions
 * @param receivableTypes
 * @returns {string}
 */
export const formatReceivableTypesString = (receivableTypeOptions: Array<Object>, receivableTypes: Array<Object>): string => {
  return receivableTypes.map((receivableType) => getLabelOfOption(receivableTypeOptions, receivableType) || '')
    .sort(sortStringAsc)
    .join(', ');
};
