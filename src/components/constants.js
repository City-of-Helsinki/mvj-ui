// @flow
import {RentCalculatorTypes} from './enums';

/**
 * Rent calculator type options
 * @readonly
 * @const {Object[]}
 */
export const RentCalculatorTypeOptions = [
  {value: RentCalculatorTypes.YEAR, label: 'Vuosi'},
  {value: RentCalculatorTypes.RANGE, label: 'Aikaväli'},
  {value: RentCalculatorTypes.BILLING_PERIOD, label: 'Laskutuskausi'},
];
