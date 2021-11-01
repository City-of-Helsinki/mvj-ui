import {
  CreditInvoiceOptions as CreditInvoiceOptionsEnum, 
} from './enums';

/**
 * Credit invoice options
 * @const {[*]}
 */
export const CreditInvoiceOptions = [
  {value: CreditInvoiceOptionsEnum.FULL, label: 'Koko lasku'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE, label: 'Koko saamislaji'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT, label: 'Summa saamislajista'},
];

/**
 * Credit invoiceset options
 * @const {[*]}
 */
export const CreditInvoiceSetOptions = [
  {value: CreditInvoiceOptionsEnum.FULL, label: 'Koko laskuryhmä'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE, label: 'Koko saamislaji'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT, label: 'Summa saamislajista'},
];
