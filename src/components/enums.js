// @flow

/**
 * Button color enumerable.
 * @readonly
 * @enum {string}
 */
export const ButtonColors = {
  SUCCESS: 'success',
  ALERT: 'alert',
  NEUTRAL: 'neutral',
  SECONDARY: 'secondary',
  LINK: 'link',
};

/**
 * Rent calculator type enumerable.
 * @readonly
 * @enum {string}
 */
export const RentCalculatorTypes = {
  YEAR: 'year',
  RANGE: 'range',
  BILLING_PERIOD: 'billing_period',
};

/**
 * Rent calculator field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const RentCalculatorFieldPaths = {
  RENT_CALCULATOR: 'rent-calculator',
  TYPE: 'type',
};

/**
 * Rent calculator field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const RentCalculatorFieldTitles = {
  RENT_CALCULATOR: 'Vuokralaskelma',
  TYPE: 'Vuokra ajalle',
};

/**
 * Rent explanation subject type enumerable.
 * @readonly
 * @enum {string}
 */
export const RentExplanationSubjectType = {
  CONTRACT_RENT: 'contractrent',
  FIXED_INITIAL_YEAR_RENT: 'fixedinitialyearrent',
  RENT: 'rent',
};

/**
 * Rent explanation type enumerable.
 * @readonly
 * @enum {string}
 */
export const RentExplanationType = {
  FIXED: 'fixed',
  FREE: 'free',
  INDEX: 'index',
  ONE_TIME: 'one_time',
};

/**
 * Rent sub item subject type enumerable.
 * @readonly
 * @enum {string}
 */
export const RentSubItemSubjectType = {
  INDEX: 'index',
  NEW_BASE_RENT: 'new_base_rent',
  NOTICE: 'notice',
  RATIO: 'ratio',
  RENT_ADJUSTMENT: 'rentadjustment',
};

/**
 * Rent sub item type enumerable.
 * @readonly
 * @enum {string}
 */
export const RentSubItemType = {
  DISCOUNT: 'discount',
  INCREASE: 'increase',
};

/**
 * Municipalities enum for address search input
 * @readonly
 * @enum {string}
 */
export const AddressFieldMunicipalities = {
  HELSINKI: 'helsinki',
};
