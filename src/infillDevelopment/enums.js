// @flow

/**
 * Infill development compensation field paths enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationFieldPaths = {
  BASIC_INFO: 'basic_info',
  DETAILED_PLAN_IDENTIFIER: 'detailed_plan_identifier',
  LEASE_CONTRACT_CHANGE_DATE: 'lease_contract_change_date',
  MAP: 'map',
  NAME: 'name',
  NOTE: 'note',
  REFERENCE_NUMBER: 'reference_number',
  STATE: 'state',
  USER: 'user',
};

/**
 * Infill development compensation field titles enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationFieldTitles = {
  BASIC_INFO: 'Perustiedot',
  DETAILED_PLAN_IDENTIFIER: 'Asemakaavan nro.',
  LEASE_CONTRACT_CHANGE_DATE: 'Vuokrasopimuksen muutospvm',
  MAP: 'Kartta',
  NAME: 'Hankkeen nimi',
  NOTE: 'Huomautus',
  REFERENCE_NUMBER: 'Diaarinumero',
  STATE: 'Neuvotteluvaihe',
  USER: 'Vastuuhenkilö',
};

/**
 * Infill development compensation leases field paths enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationLeasesFieldPaths = {
  INFILL_DEVELOPMENT_COMPENSATION_LEASES: 'infill_development_compensation_leases',
  COMPENSATION_INVESTMENT_AMOUNT: 'infill_development_compensation_leases.child.children.compensation_investment_amount',
  DISCOUNT_IN_RENT: 'infill_development_compensation_leases.child.children.discount_in_rent',
  INCREASE_IN_VALUE: 'infill_development_compensation_leases.child.children.increase_in_value',
  LEASE: 'infill_development_compensation_leases.child.children.lease',
  MONETARY_COMPENSATION_AMOUNT: 'infill_development_compensation_leases.child.children.monetary_compensation_amount',
  NOTE: 'infill_development_compensation_leases.child.children.note',
  PAID_DATE: 'infill_development_compensation_leases.child.children.paid_date',
  PART_OF_THE_INCREASE_IN_VALUE: 'infill_development_compensation_leases.child.children.part_of_the_increase_in_value',
  SENT_TO_SAP_DATE: 'infill_development_compensation_leases.child.children.sent_to_sap_date',
  TOTAL_COMPENSATION: 'infill_development_compensation_leases.child.children.total_compensation',
  YEAR: 'infill_development_compensation_leases.child.children.year',
};

/**
 * Infill development compensation leases field titles enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationLeasesFieldTitles = {
  INFILL_DEVELOPMENT_COMPENSATION_LEASES: 'Vuokraukset',
  COMPENSATION_INVESTMENT_AMOUNT: 'Korvausinvestoinnit',
  DISCOUNT_IN_RENT: 'Vuokranalennus',
  INCREASE_IN_VALUE: 'Arvonnousu (alv 0%)',
  LEASE: 'Vuokraustunnus',
  MONETARY_COMPENSATION_AMOUNT: 'Rahakorvaus',
  NOTE: 'Huomautus',
  PAID_DATE: 'Maksettu',
  PART_OF_THE_INCREASE_IN_VALUE: 'Osuus arvonnoususta',
  SENT_TO_SAP_DATE: 'Maksu lähetetty SAP',
  TOTAL_COMPENSATION: 'Korvaus yhteensä',
  YEAR: 'Arvioitu maksuvuosi',
};

/**
 * Infill development compensation lease decisions field paths enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationLeaseDecisionsFieldPaths = {
  DECISIONS: 'infill_development_compensation_leases.child.children.decisions',
  DECISION_DATE: 'infill_development_compensation_leases.child.children.decisions.child.children.decision_date',
  DECISION_MAKER: 'infill_development_compensation_leases.child.children.decisions.child.children.decision_maker',
  REFERENCE_NUMBER: 'infill_development_compensation_leases.child.children.decisions.child.children.reference_number',
  SECTION: 'infill_development_compensation_leases.child.children.decisions.child.children.section',
};

/**
 * Infill development compensation lease decisions field titles enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationLeaseDecisionsFieldTitles = {
  DECISIONS: 'Korvauksen päätös',
  DECISION_DATE: 'Pvm',
  DECISION_MAKER: 'Päättäjä',
  REFERENCE_NUMBER: 'Diaarinumero',
  SECTION: 'Pykälä',
};

/**
 * Infill development compensation lease intended uses field paths enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths = {
  INTENDED_USES: 'infill_development_compensation_leases.child.children.intended_uses',
  AMOUNT_PER_FLOOR_M2: 'infill_development_compensation_leases.child.children.intended_uses.child.children.amount_per_floor_m2',
  FLOOR_M2: 'infill_development_compensation_leases.child.children.intended_uses.child.children.floor_m2',
  INTENDED_USE: 'infill_development_compensation_leases.child.children.intended_uses.child.children.intended_use',
};

/**
 * Infill development compensation lease intended uses field titles enumerable.
 *
 * @type {{}}
 */
export const InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles = {
  INTENDED_USES: 'Käyttötarkoitus',
  AMOUNT_PER_FLOOR_M2: '€ / k-m²',
  FLOOR_M2: 'k-m²',
  INTENDED_USE: 'Käyttötarkoitus',
};
