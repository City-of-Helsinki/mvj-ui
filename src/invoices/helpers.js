// @flow
import moment from 'moment';
import get from 'lodash/get';

import {CreditInvoiceOptionsEnum} from '$src/leases/enums';
import {InvoiceState, InvoiceType} from './enums';
import {convertStrToDecimalNumber, getLabelOfOption, sortStringAsc} from '$util/helpers';

/**
 * Get payments of single invoice to show on UI
 * @param invoice
 * @returns {object}
 */
const getContentInvoicePayments = (invoice: Object) => {
  const payments = get(invoice, 'payments', []);

  return payments.map((payment) => ({
    id: payment.id,
    paid_amount: payment.paid_amount,
    paid_date: payment.paid_date,
  }));
};

/**
 * Get rows of single invoice to show on UI
 * @param invoice
 * @returns {object}
 */
const getContentIncoiceRows = (invoice: Object) => {
  const rows = get(invoice, 'rows', []);

  return rows.map((row) => ({
    id: row.id,
    tenant: get(row, 'tenant.id'),
    tenantFull: row.tenant,
    description: row.description,
    amount: row.amount,
    receivable_type: get(row, 'receivable_type.id') || get(row, 'receivable_type'),
  }));
};

/**
 * Get receivable types of single invoice to show on UI
 * @param rows
 * @returns {object}
 */
export const getContentInvoiceReceivableTypes = (rows: Array<Object>) => {
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
 * @param invoice
 * @returns {object}
 */
const getContentInvoiceTotalSharePercentage = (invoice: Object) => {
  if(invoice.total_amount === null ||
    Number(invoice.total_amount) === 0 ||
    invoice.billed_amount === null ||
    Number(invoice.billed_amount) === 0) return null;

  return Number(invoice.billed_amount) / Number(invoice.total_amount);
};

/**
 * Get credit invoices of single invoice to show on UI
 * @param invoice
 * @returns {object}
 */
const getContentCreditInvoices = (invoice: Object) =>
  get(invoice, 'credit_invoices', []).map((item) => ({
    id: item.id,
    number: item.number,
    due_date: item.due_date,
    total_amount: item.total_amount,
  }));

/**
 * Get single invoice content to show on UI
 * @param invoice
 * @returns {object}
 */
export const getContentIncoive = (invoice: Object) => {
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
    invoiceset: invoice.invoiceset,
  };
};

/**
 * Get invoices content to show on UI
 * @param invoices
 * @returns {object}
 */
export const getContentInvoices = (invoices: Array<Object>): Array<Object> => {
  return invoices && invoices.length ? invoices.map((invoice) => getContentIncoive(invoice)) : [];
};

/**
 * Get overdue invoices content to show on UI
 * @param invoices
 * @returns {object}
 */
export const getContentOverdueInvoices = (invoices: Array<Object>): Array<Object> => {
  return invoices && invoices.length ? invoices
    .filter((invoice) => invoice.state === InvoiceState.OPEN && invoice.due_date && moment(invoice.due_date).isBefore(new Date(), 'day'))
    .map((invoice) => getContentIncoive(invoice)) : [];
};

/**
 * Get payments for invoice payload for API
 * @param invoice
 * @returns {object}
 */
const getPayloadInvoicePayments = (invoice: Object) => {
  const payments = get(invoice, 'payments', []);

  return payments.map((payment) => ({
    id: invoice.id,
    paid_amount: convertStrToDecimalNumber(payment.paid_amount),
    paid_date: payment.paid_date,
  }));
};

/**
 * Get rows for invoice payload for API
 * @param invoice
 * @returns {object}
 */
const getPayloadInvoiceRows = (invoice: Object) => {
  return get(invoice, 'rows', []).map((row) => {
    return {
      tenant: row.tenant,
      receivable_type: row.receivable_type,
      amount: convertStrToDecimalNumber(row.amount),
    };
  });
};

/**
 * Get edit invoice payload for API
 * @param invoice
 * @returns {object}
 */
export const getPayloadEditInvoice = (invoice: Object) => {
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
    notes: invoice.notes,
    payments: invoice.type !== InvoiceType.CREDIT_NOTE
      ? getPayloadInvoicePayments(invoice)
      : undefined,
    rows: getPayloadInvoiceRows(invoice),
  };
};

/**
 * Get create invoice payload for API
 * @param invoice
 * @returns {object}
 */
export const getPayloadCreateInvoice = (invoice: Object) => {
  return {
    lease: invoice.lease,
    recipient: invoice.recipient,
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
 * @param invoice
 * @returns {object}
 */
export const getPayloadCreditInvoice = (invoice: Object) => {
  if(!invoice) return undefined;

  const payload = {};
  if(invoice.type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT && invoice.amount) {
    payload.amount = convertStrToDecimalNumber(invoice.amount);
  }

  if(invoice.type !== CreditInvoiceOptionsEnum.FULL && invoice.receivable_type) {
    payload.receivable_type = invoice.receivable_type;
  }

  payload.notes = invoice.notes || '';

  return payload;
};

/**
 * Get receivable type string from receivable type values
 * @param receivableTypeOptions
 * @param receivableTypes
 * @returns {string}
 */
export const formatReceivableTypesString = (receivableTypeOptions: Array<Object>, receivableTypes: Array<Object>) => {
  return receivableTypes.map((receivableType) => getLabelOfOption(receivableTypeOptions, receivableType))
    .sort(sortStringAsc)
    .join(', ');
};
