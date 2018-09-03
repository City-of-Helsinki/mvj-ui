// @flow

/**
 * Delete modal labels enumerable.
 *
 * @type {{AREA: string, COMPENSATION: string, CONDITION: string, CONTRACT: string, DECISION: string, INVOICE: string, LITIGANT: string}}
 */
export const DeleteModalLabels = {
  AREA: 'Haluatko varmasti poistaa kohteen?',
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
 * @type {{AREA: string, COMPENSATION: string, CONDITION: string, CONTRACT: string, DECISION: string, INVOICE: string, LITIGANT: string}}
 */
export const DeleteModalTitles = {
  AREA: 'Poista kohde',
  COMPENSATION: 'Poista korvaus',
  CONDITION: 'Poista ehto',
  CONTRACT: 'Poista sopimus',
  DECISION: 'Poista päätös',
  INVOICE: 'Poista lasku',
  LITIGANT: 'Poista osapuoli',
};

/**
 * Land use contract form names enumerable.
 *
 * @type {{BASIC_INFORMATION: string, COMPENSATIONS: string, CONTRACTS: string, CREATE_LAND_USE_CONTRACT: string, DECISIONS: string, INVOICES: string, LAND_USE_CONTRACT_SEARCH: string}}
 */
export const FormNames = {
  BASIC_INFORMATION: 'land-use-contract-basic-info-form',
  COMPENSATIONS: 'land-use-contract-compensations-form',
  CONTRACTS: 'land-use-contract-contracts-form',
  CREATE_LAND_USE_CONTRACT: 'create-land-use-contract-form',
  DECISIONS: 'land-use-contract-decisions-form',
  INVOICES: 'land-use-contract-invoices-form',
  LAND_USE_CONTRACT_SEARCH: 'land-use-contract-search-form',
};
