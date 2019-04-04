// @flow

/**
 * Delete modal labels enumerable.
 *
 * @type {{DECISION: string, IDENTIFIER: string, RENT_RATE: string}}
 */
export const DeleteModalLabels = {
  DECISION: 'Haluatko varmasti poistaa päätöksen?',
  IDENTIFIER: 'Haluatko varmasti poistaa kiinteisötunnuksen?',
  RENT_RATE: 'Haluatko varmasti poistaa hinnan?',
};

/**
 * Delete modal titles enumerable.
 *
 * @type {{DECISION: string, IDENTIFIER: string, RENT_RATE: string}}
 */
export const DeleteModalTitles = {
  DECISION: 'Poista päätös',
  IDENTIFIER: 'Poista kiinteistötunnus',
  RENT_RATE: 'Poista hinta',
};

/**
 * Rent basis field paths enumerable.
 *
 * @type {{}}
 */
export const RentBasisFieldPaths = {
  ID: 'id',
  DETAILED_PLAN_IDENTIFIER: 'detailed_plan_identifier',
  END_DATE: 'end_date',
  FINANCING: 'financing',
  GEOMETRY: 'geometry',
  INDEX: 'index',
  LEASE_RIGHTS_END_DATE: 'lease_rights_end_date',
  MANAGEMENT: 'management',
  NOTE: 'note',
  PLOT_TYPE: 'plot_type',
  START_DATE: 'start_date',
};

/**
 * Rent basis field titles enumerable.
 *
 * @type {{}}
 */
export const RentBasisFieldTitles = {
  IDENTIFIER: 'Vuokrausperustetunnus',
  DETAILED_PLAN_IDENTIFIER: 'Asemakaava',
  END_DATE: 'Loppupvm',
  FINANCING: 'Rahoitusmuoto',
  GEOMETRY: 'Karttalinkki',
  INDEX: 'Indeksi',
  LEASE_RIGHTS_END_DATE: 'Vuokraoikeus päättyy',
  MANAGEMENT: 'Hallintamuoto',
  NOTE: 'Huomautus',
  PLOT_TYPE: 'Tonttityyppi',
  START_DATE: 'Alkupvm',
};

/**
 * Rent basis property identifiers field paths enumerable.
 *
 * @type {{}}
 */
export const RentBasisPropertyIdentifiersFieldPaths = {
  PROPERTY_IDENTIFIERS: 'property_identifiers',
  IDENTIFIER: 'property_identifiers.child.children.identifier',
};

/**
 * Rent basis property identifiers field titles enumerable.
 *
 * @type {{}}
 */
export const RentBasisPropertyIdentifiersFieldTitles = {
  PROPERTY_IDENTIFIERS: 'Kiinteistötunnukset',
  IDENTIFIER: 'Kiinteistötunnus',
};

/**
 * Rent basis decisions field paths enumerable.
 *
 * @type {{}}
 */
export const RentBasisDecisionsFieldPaths = {
  DECISIONS: 'decisions',
  DECISION_DATE: 'decisions.child.children.decision_date',
  DECISION_MAKER: 'decisions.child.children.decision_maker',
  REFERENCE_NUMBER: 'decisions.child.children.reference_number',
  SECTION: 'decisions.child.children.section',
};

/**
 * Rent basis decisions field titles enumerable.
 *
 * @type {{}}
 */
export const RentBasisDecisionsFieldTitles = {
  DECISIONS: 'Päätökset',
  DECISION_DATE: 'Pvm',
  DECISION_MAKER: 'Päättäjä',
  REFERENCE_NUMBER: 'Hel diaarinumero',
  SECTION: 'Pykälä',
};

/**
 * Rent basis rent rates field paths enumerable.
 *
 * @type {{}}
 */
export const RentBasisRentRatesFieldPaths = {
  RENT_RATES: 'rent_rates',
  AMOUNT: 'rent_rates.child.children.amount',
  AREA_UNIT: 'rent_rates.child.children.area_unit',
  BUILD_PERMISSION_TYPE: 'rent_rates.child.children.build_permission_type',
};

/**
 * Rent basis rent rates field titles enumerable.
 *
 * @type {{}}
 */
export const RentBasisRentRatesFieldTitles = {
  RENT_RATES: 'Hinnat',
  AMOUNT: 'Euroa',
  AREA_UNIT: 'Yksikkö',
  BUILD_PERMISSION_TYPE: 'Pääkäyttötarkoitus',
};
