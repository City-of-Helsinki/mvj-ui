// @flow
/**
 * Invoice state enumerable.
 *
 * @type {{OPEN: string, PAID: string, REFUNDED: string,}}
 */
export const InvoiceState = {
  OPEN: 'open',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

/**
 * Invoice type enumerable.
 *
 * @type {{CHARGE: string, CREDIT_NOTE: string,}}
 */
export const InvoiceType = {
  CHARGE: 'charge',
  CREDIT_NOTE: 'credit_note',
};

/**
 * Invoice field paths enumerable.
 *
 * @type {{}}
 */
export const InvoiceFieldPaths = {
  ADJUSTED_DUE_DATE: 'adjusted_due_date',
  BILLED_AMOUNT: 'billed_amount',
  BILLING_PERIOD: 'billing_period',
  BILLING_PERIOD_END_DATE: 'billing_period_end_date',
  BILLING_PERIOD_START_DATE: 'billing_period_start_date',
  COLLECTION_CHARGE: 'collection_charge',
  CREDIT_INVOICES: 'credit_invoices',
  CREDITED_INVOICE: 'credited_invoice',
  DELIVERY_METHOD: 'delivery_method',
  DUE_DATE: 'due_date',
  INVOICING_DATE: 'invoicing_date',
  INVOICESET: 'invoiceset',
  NOTES: 'notes',
  NUMBER: 'number',
  OUTSTANDING_AMOUNT: 'outstanding_amount',
  PAYMENT_NOTIFICATION_DATE: 'payment_notification_date',
  PAYMENT_NOTIFICATION_CATALOG_DATE: 'payment_notification_catalog_date',
  POSTPONE_DATE: 'postpone_date',
  RECIPIENT: 'recipient',
  SAP_ID: 'sap_id',
  SENT_TO_SAP_AT: 'sent_to_sap_at',
  SHARE: 'share',
  STATE: 'state',
  TYPE: 'type',
  TOTAL_AMOUNT: 'total_amount',
};

/**
 * Invoice field paths enumerable.
 *
 * @type {{}}
 */
export const InvoiceFieldTitles = {
  ADJUSTED_DUE_DATE: 'Muutettu eräpäivä',
  BILLED_AMOUNT: 'Laskutettu määrä',
  BILLING_PERIOD: 'Laskutuskausi',
  BILLING_PERIOD_END_DATE: 'Laskutuskausi loppupvm',
  BILLING_PERIOD_START_DATE: 'Laskutuskausi alkupvm',
  COLLECTION_CHARGE: 'Perintäkulu',
  CREDIT_INVOICES: 'Hyvityslaskut',
  CREDITED_INVOICE: 'Hyvitetty lasku',
  DELIVERY_METHOD: 'E vai paperilasku',
  DUE_DATE: 'Eräpäivä',
  INVOICING_DATE: 'Laskutuspvm',
  INVOICESET: 'Laskuryhmät',
  NOTES: 'Tiedote',
  NUMBER: 'Laskunumero',
  OUTSTANDING_AMOUNT: 'Maksamaton määrä',
  PAYMENT_NOTIFICATION_DATE: 'Maksukehotuspvm',
  PAYMENT_NOTIFICATION_CATALOG_DATE: 'Maksukehotus luettelo',
  POSTPONE_DATE: 'Lykkäyspvm',
  RECIPIENT: 'Laskunsaaja',
  SAP_ID: 'SAP numero',
  SENT_TO_SAP_AT: 'Lähetetty SAP:iin',
  SHARE: 'Laskun osuus',
  STATE: 'Laskun tila',
  TYPE: 'Laskun tyyppi',
  TOTAL_AMOUNT: 'Laskun pääoma',
};

/**
 * Invoice credit invoices field paths enumerable.
 *
 * @type {{}}
 */
export const InvoiceCreditInvoicesFieldPaths = {
  CREDIT_INVOICES: 'credit_invoices',
  DUE_DATE: 'credit_invoices.child.children.due_date',
  NUMBER: 'credit_invoices.child.children.number',
  TOTAL_AMOUNT: 'credit_invoices.child.children.total_amount',
};

/**
 * Invoice credit invoices field paths enumerable.
 *
 * @type {{}}
 */
export const InvoiceCreditInvoicesFieldTitles = {
  CREDIT_INVOICES: 'Hyvityslaskut',
  DUE_DATE: 'Eräpäivä',
  NUMBER: 'Laskunumero',
  TOTAL_AMOUNT: 'Summa',
};

/**
 * Invoice payments field paths enumerable.
 *
 * @type {{}}
 */
export const InvoicePaymentsFieldPaths = {
  PAYMENTS: 'payments',
  PAID_AMOUNT: 'payments.child.children.paid_amount',
  PAID_DATE: 'payments.child.children.paid_date',
};

/**
 * Invoice payments field paths enumerable.
 *
 * @type {{}}
 */
export const InvoicePaymentsFieldTitles = {
  PAYMENTS: 'Maksut',
  PAID_AMOUNT: 'Maksettu määrä (alviton)',
  PAID_DATE: 'Maksettu pvm',
};

/**
 * Invoice rows field paths enumerable.
 *
 * @type {{}}
 */
export const InvoiceRowsFieldPaths = {
  ROWS: 'rows',
  AMOUNT: 'rows.child.children.amount',
  BILLING_PERIOD_END_DATE: 'rows.child.children.billing_period_end_date',
  BILLING_PERIOD_START_DATE: 'rows.child.children.billing_period_start_date',
  DESCRIPTION: 'rows.child.children.description',
  RECEIVABLE_TYPE: 'rows.child.children.receivable_type',
  TENANT: 'rows.child.children.tenant',
};

/**
 * Invoice rows field paths enumerable.
 *
 * @type {{}}
 */
export const InvoiceRowsFieldTitles = {
  ROWS: 'Erittely',
  AMOUNT: 'Määrä (alviton)',
  BILLING_PERIOD_END_DATE: 'Lakutuskauden loppupvm',
  BILLING_PERIOD_START_DATE: 'Laskutuskauden alkupvm',
  DESCRIPTION: 'Selite',
  RECEIVABLE_TYPE: 'Saamislaji',
  TENANT: 'Vuokralainen',
};
