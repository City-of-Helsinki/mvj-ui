// @flow
import React from 'react';

/**
 * Button color enumerable.
 *
 * @type {{SUCCESS: string: ALERT: string, NEUTRAL: string, SECONDARY: string,}}
 */
export const ButtonColors = {
  SUCCESS: 'success',
  ALERT: 'alert',
  NEUTRAL: 'neutral',
  SECONDARY: 'secondary',
};

/**
 * Component form names enumerable.
 *
 * @type {{INVOICE_SIMULATOR: string, NEW_COMMENT: string, RENT_CALCULATOR: string,}}
 */
export const FormNames = {
  INVOICE_SIMULATOR: 'invoice-simulator-form',
  NEW_COMMENT: 'new-comment-form',
  RENT_CALCULATOR: 'rent-calculator-form',
};

/**
 * Rent calculator type enumerable.
 *
 * @type {{YEAR: string, RANGE: string, BILLING_PERIOD: string,}}
 */
export const RentCalculatorTypes = {
  YEAR: 'year',
  RANGE: 'range',
  BILLING_PERIOD: 'billing_period',
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
 * @type {{INDEX: string, NEW_BASE_RENT: string, RATIO: string, RENT_ADJUSTMENT: string,}}
 */
export const RentSubItemSubjectType = {
  INDEX: 'index',
  NEW_BASE_RENT: 'new_base_rent',
  RATIO: 'ratio',
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

/**
 * Table sort order enumerable.
 *
 * @type {{ASCENDING: string, DESCENDING: string,}}
 */
export const TableSortOrder = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};

/**
 * Close comment panel text enumerable.
 *
 * @type {{BUTTON: string, LABEL: string, TITLE: string}}
 */
export const CloseCommentPanelTexts = {
  BUTTON: 'Sulje kommentointi',
  LABEL: <span>Kaikkia muutoksia ei ole tallennettu.<br /> Haluatko varmasti sulkea kommentoinnin?</span>,
  TITLE: 'Sulje kommentointi',
};

/**
 * Close comment panel text enumerable.
 *
 * @type {{BUTTON: string, LABEL: string, TITLE: string}}
 */
export const DeleteRentForPeriodTexts = {
  BUTTON: 'Poista vuokralaskelma',
  LABEL: 'Haluatko varmasti poistaa vuokralaskelman',
  TITLE: 'Poista vuokralaskelma',
};
