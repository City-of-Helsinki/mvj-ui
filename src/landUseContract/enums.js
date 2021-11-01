// @flow

/**
 * Litigant type enumerable.
 * @readonly
 * @enum {string}
 */
export const LitigantContactType = {
  LITIGANT: 'litigant',
  BILLING: 'billing',
  TENANT: 'tenant',
};

/**
 * CreditInvoiceOptions enumerable.
 *
 * @type {{FULL: string, RECEIVABLE_TYPE: string, RECEIVABLE_TYPE_AMOUNT: string,}}
 */
export const CreditInvoiceOptions = {
  FULL: 'full',
  RECEIVABLE_TYPE: 'receivable_type',
  RECEIVABLE_TYPE_AMOUNT: 'receivable_type_amount',
};
