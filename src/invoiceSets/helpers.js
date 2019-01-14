// @flow
import {CreditInvoiceOptionsEnum} from '$src/leases/enums';
import {convertStrToDecimalNumber} from '$util/helpers';

/**
 * Get credit invoice set payload for API
 * @param invoiceSet
 * @returns {object}
 */
export const getCreditInvoiceSetPayload = (invoiceSet: Object) => {
  if(!invoiceSet) return undefined;

  const payload = {};
  if(invoiceSet.type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT && invoiceSet.amount) {
    payload.amount = convertStrToDecimalNumber(invoiceSet.amount);
  }

  if(invoiceSet.type !== CreditInvoiceOptionsEnum.FULL && invoiceSet.receivable_type) {
    payload.receivable_type = invoiceSet.receivable_type;
  }

  payload.notes = invoiceSet.notes || '';

  return payload;
};
