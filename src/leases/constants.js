// @flow
import {TableSortOrder} from '$src/enums';
import {
  CreditInvoiceOptions as CreditInvoiceOptionsEnum, 
  RentDueDateTypes,
  SteppedDiscountAmountTypes,
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

/**
 * Stepped discount amount type options
 * @const {[*]}
 */
export const SteppedDiscountAmountTypeOptions = [
  {value: SteppedDiscountAmountTypes.PERCENTAGE_PER_YEAR, label: '% per vuosi'},
  {value: SteppedDiscountAmountTypes.PERCENTAGE_PER_6_MONTHS, label: '% per 6 kk'},
  {value: SteppedDiscountAmountTypes.PERCENTAGE_PER_MONTH, label: '% per kuukausi'},
];

/**
 * One time rent due date type options
 * @const {[*]}
 */
export const oneTimeRentDueDateTypeOptions = [
  {value: '', label: ''},
  {value: RentDueDateTypes.CUSTOM, label: 'Erikseen määritelty'},
];

/**
 * Lease state options for lease list table filter
 * @const {[*]}
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
 * @const {[*]}
 */
export const rentCustomDateOptions = [
  {value: '', label: ''},
  {value: '1', label: '1'},
  {value: '2', label: '2'},
  {value: '4', label: '4'},
  {value: '12', label: '12'},
];

/**
 * Default lease states value for lease list search
 * @const {string[]}
 */
export const DEFAULT_LEASE_STATES = [];

/**
 * Default only_active_leases value for lease list search
 * @const {boolean}
 */
export const DEFAULT_ONLY_ACTIVE_LEASES = true;

/**
 * Default sort key for lease list table
 * @const {string}
 */
export const DEFAULT_SORT_KEY = 'identifier';

/**
 * Default sort order for lease list table
 * @const {string}
 */
export const DEFAULT_SORT_ORDER = TableSortOrder.ASCENDING;

/**
 * Max zoom level to fetch leases for map
 * @const {number}
 */
export const MAX_ZOOM_LEVEL_TO_FETCH_LEASES = 7;
