import { CreditInvoiceOptions } from "src/leases/enums";
import { convertStrToDecimalNumber } from "src/util/helpers";

/**
 * Get credit invoice set payload for API
 * @param {Object} invoiceSet
 * @returns {Object}
 */
export const getCreditInvoiceSetPayload = (invoiceSet: Record<string, any>): Record<string, any> => {
  if (!invoiceSet) return undefined;
  const payload: any = {};

  if (invoiceSet.type === CreditInvoiceOptions.RECEIVABLE_TYPE_AMOUNT && invoiceSet.amount) {
    payload.amount = convertStrToDecimalNumber(invoiceSet.amount);
  }

  if (invoiceSet.type !== CreditInvoiceOptions.FULL && invoiceSet.receivable_type) {
    payload.receivable_type = invoiceSet.receivable_type;
  }

  payload.notes = invoiceSet.notes || '';
  return payload;
};