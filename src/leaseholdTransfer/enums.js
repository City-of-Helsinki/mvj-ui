// @flow

/** 
 * Leasehold transfer field paths enumerable
 * @readonly
 * @enum {string}
 */
export const LeaseholdTransferPartyTypes = {
  ACQUIRER: 'acquirer',
  CONVEYOR: 'conveyor',
  LESSOR: 'lessor',
};

/**
 * Leasehold transfer field paths enumerable
 * @readonly
 * @enum {string}
 */
export const LeaseholdTransferFieldPaths = {
  ACQUIRERS: 'acquirers',
  CONVEYORS: 'conveyors',
  DECISION_DATE: 'decision_date',
  DELETED: 'deleted',
  INSTITUTION_IDENTIFIER: 'institution_identifier',
  PARTIES: 'parties',
  PROPERTIES: 'properties',
};

/*
* Leasehold transfer field titles enumerable
*/
export const LeaseholdTransferFieldTitles = {
  ACQUIRERS: 'Uusi vuokralainen',
  CONVEYORS: 'Vanha vuokralainen',
  DECISION_DATE: 'Päätöspvm',
  DELETED: 'Poistettu pvm',
  INSTITUTION_IDENTIFIER: 'Laitostunnus',
  PROPERTIES: 'Kohde',
};
