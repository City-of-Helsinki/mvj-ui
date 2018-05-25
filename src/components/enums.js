// @flow
/**
 * Component form names enumerable.
 *
 * @type {{RENT_CALCULATOR: string,}}
 */
export const FormNames = {
  RENT_CALCULATOR: 'rent-calculator-form',
};

/**
 * Rent explanation subject type enumerable.
 *
 * @type {{CONTRACT_RENT: string, FIXED_INITIAL_YEAR_RENT: string, RENT: string,}}
 */
export const RentExplanationSubjectType = {
  CONTRACT_RENT: 'contractrent',
  FIXED_INITIAL_YEAR_RENT: 'fixedinitialyearrent',
  RENT: 'rent',
};

/**
 * Rent explanation  type enumerable.
 *
 * @type {{FIXED: string, FREE: string, INDEX: string, ONE_TIME: string,}}
 */
export const RentExplanationType = {
  FIXED: 'fixed',
  FREE: 'free',
  INDEX: 'index',
  ONE_TIME: 'one_time',
};

/**
 * Rent sub item subject type enumerable.
 *
 * @type {{RENT_ADJUSTMENT: string,}}
 */
export const RentSubItemSubjectType = {
  INDEX: 'index',
  RENT_ADJUSTMENT: 'rentadjustment',
};

/**
 * Rent sub item type enumerable.
 *
 * @type {{DISCOUNT: string, INCREASE: string,}}
 */
export const RentSubItemType = {
  DISCOUNT: 'discount',
  INCREASE: 'increase',
};
