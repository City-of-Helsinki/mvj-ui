// @flow
import {CreditInvoiceOptionsEnum} from './enums';
/**
 * Credit invoice options
 * @type {[*]}
 */
export const CreditInvoiceOptions = [
  {value: CreditInvoiceOptionsEnum.FULL, label: 'Koko lasku'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE, label: 'Koko saamislaji'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT, label: 'Summa saamislajista'},
];

/**
 * Credit invoiceset options
 * @type {[*]}
 */
export const CreditInvoiceSetOptions = [
  {value: CreditInvoiceOptionsEnum.FULL, label: 'Koko laskuryhmä'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE, label: 'Koko saamislaji'},
  {value: CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT, label: 'Summa saamislajista'},
];

/**
 * Lease state options for lease list table filter
 * @type {[*]}
 */
export const leaseStateFilterOptions = [
  {value: 'lease', label: 'Vuokraus'},
  {value: 'reservation', label: 'Varaus'},
  {value: 'reserve', label: 'Varanto ja vapaa'},
  {value: 'permission', label: 'Lupa'},
  {value: 'application', label: 'Hakemus'},
];

/**
 * Rent custom date options
 * @type {[*]}
 */
export const rentCustomDateOptions = [
  {value: '', label: ''},
  {value: '1', label: '1'},
  {value: '2', label: '2'},
  {value: '4', label: '4'},
  {value: '12', label: '12'},
];
