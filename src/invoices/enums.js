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
