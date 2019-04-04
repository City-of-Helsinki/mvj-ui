// @flow

/**
 * Delete modal labels enumerable.
 *
 * @type {{AREA: string, BILLING_PERSON: string, COMPENSATION: string, CONDITION: string, CONTRACT: string, DECISION: string, INVOICE: string, LITIGANT: string}}
 */
export const DeleteModalLabels = {
  AREA: 'Haluatko varmasti poistaa kohteen?',
  BILLING_PERSON: 'Haluatko varmasti poistaa laskunsaajan?',
  COMPENSATION: 'Haluatko varmasti poistaa korvauksen?',
  CONDITION: 'Haluatko varmasti poistaa ehdon?',
  CONTRACT: 'Haluatko varmasti poistaa sopimuksen?',
  DECISION: 'Haluatko varmasti poistaa päätöksen?',
  INVOICE: 'Haluatko varmasti poistaa laskun?',
  LITIGANT: 'Haluatko varmasti poistaa osapuolen?',
};

/**
 * Delete modal titles enumerable.
 *
 * @type {{AREA: string, BILLING_PERSON: string, COMPENSATION: string, CONDITION: string, CONTRACT: string, DECISION: string, INVOICE: string, LITIGANT: string}}
 */
export const DeleteModalTitles = {
  AREA: 'Poista kohde',
  BILLING_PERSON: 'Poista laskunsaaja',
  COMPENSATION: 'Poista korvaus',
  CONDITION: 'Poista ehto',
  CONTRACT: 'Poista sopimus',
  DECISION: 'Poista päätös',
  INVOICE: 'Poista lasku',
  LITIGANT: 'Poista osapuoli',
};

/**
 * Contact type enumerable.
 *
 * @type {{LITIGANT: string, BILLING: string}}
 */
export const LitigantContactType = {
  LITIGANT: 'litigant',
  BILLING: 'billing',
};
