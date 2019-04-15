// @flow
import {TableSortOrder} from '$components/enums';
import {CreditInvoiceOptionsEnum, RentDueDateTypes} from './enums';
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
 * One time rent due date type options
 * @type {[*]}
 */
export const oneTimeRentDueDateTypeOptions = [
  {value: '', label: ''},
  {value: RentDueDateTypes.CUSTOM, label: 'Erikseen määritelty'},
];

/**
 * Lease state options for lease list table filter
 * @type {[*]}
 */
export const leaseStateFilterOptions = [
  {value: 'lease', label: 'Vuokraus'},
  {value: 'short_term_lease', label: 'Lyhytaikainen vuokraus'},
  {value: 'long_term_lease', label: 'Pitkäaikainen vuokraus'},
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

/**
 * Lease list page default values
 */
export const DEFAULT_LEASE_STATES = ['lease'];
export const DEFAULT_ONLY_ACTIVE_LEASES = true;
export const DEFAULT_SORT_KEY = 'identifier';
export const DEFAULT_SORT_ORDER = TableSortOrder.ASCENDING;
