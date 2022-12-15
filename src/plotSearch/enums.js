/**
 * PlotSearch field paths enumerable.
 *
 * @type {{}}
 */
export const PlotSearchFieldPaths = {
  BASIC_INFO: 'basic_info',
  name: 'name',
  PREPARERS: 'preparers',
  APPLICATIONS: 'applications',
  TYPE: 'type',
  SUBTYPE: 'subtype',
  START_DATE: 'start_date',
  BEGIN_AT: 'begin_at',
  CLOCK: 'clock',
  END_DATE: 'end_date',
  END_AT: 'end_at',
  APPLICATIONS_UPDATED_DATE: 'Applications_updated_date',
  DECISION: 'decision',
  DECISION_TO_LIST: 'decision_to_list',
  STAGE: 'stage',
  SEARCH_CLASS: 'search_class',
};

/**
 * PlotSearch field titles enumerable.
 *
 * @type {{}}
 */
export const PlotSearchFieldTitles = {
  BASIC_INFO: 'Perustiedot',
  NAME: 'Haun nimi',
  PREPARERS: 'Valmistelijat',
  APPLICATIONS: 'Hakemukset',
  TYPE: 'Haun tyyppi',
  SUBTYPE: 'Haun alatyyppi',
  SEARCH_CLASS: 'Haun luokittelu',
  START_DATE: 'Alkupvm',
  CLOCK: 'Klo',
  END_DATE: 'Loppupvm',
  APPLICATIONS_UPDATED_DATE: 'Hakemukset päivitetty',
  DECISION: 'Päätös',
  DECISION_TO_LIST: 'Päätös hakutuloslistaan',
  STAGE: 'Haun vaihe',
  INFO_LINK_DESCRIPTION: 'Lisätietolinkin kuvaus',
  INFO_LINK_URL: 'Lisätietolinkki',
  INFO_LINK_LANGUAGE: 'Kieli',
  USAGE_DISTRIBUTION: 'Käyttöjakauma',
  USAGE_DISTRIBUTION_BUILD_PERMISSION: 'Rakennusoikeus',
  USAGE_DISTRIBUTION_NOTE: 'Huomautus',
  LEASE_IDENTIFIER: 'Vuokraustunnus',
  CUSTOM_DETAILED_PLAN_INTENDED_USE: 'Kaavayksikön käyttötarkoitus',
  AREA: 'Kokonaisalue',
  ADDRESS: 'Osoite',
  DETAILED_PLAN: 'Asemakaava',
  DETAILED_PLAN_LATEST_PROCESSING_DATE: 'Asemakaavan viimeisin käsittelypvm',
  DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE: 'Asemakaavan viimeisin käsittelypvm. selite',
  STATE: 'Kaavayksikön olotila',
  CUSTOM_DETAILED_PLAN_TYPE: 'Kaavayksikön laji',
  RENT_BUILD_PERMISSION: 'Kokonaisrakennusoikeus',
  PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT: 'Arvioitu rakentamisen valmius',
  TARGET_IDENTIFIER: 'Kohteen tunnus',
  TARGET_TYPE: 'Kohteen tyyppi',
  LEASE_HITAS: 'Hitas',
  SECTION_AREA: 'Leikkausala',
  PLOT_DIVISION_STATE: 'Tonttijaon olotila',
  PLOT_DIVISION_INDENTIFIER: 'Tonttijaon tunnus',
  PLOT_DIVISION_EFFECTIVE_DATE: 'Tonttijaon voimaantulopvm',
  PLOT_DIVISION_DATE_OF_APPROVAL: 'Tonttijaon hyväksymispvm',
  PLAN_UNIT_TYPE: 'Kaavayksikön laji',
  PLAN_UNIT_STATE: 'Kaavayksikön olotila',
  IN_CONTRACT: 'Sopimushetkellä',
  PLAN_UNIT_INTENDED_USE: 'Kaavayksikön käyttötarkoitus',
  
};

/**
 * PlotSearch application field paths enumerable.
 *
 * @type {{}}
 */
export const ApplicationFieldPaths = {
  APPLICATION: 'formData',
  NAME: 'name',
};

/**
 * PlotSearch field titles enumerable.
 *
 * @type {{}}
 */
export const ApplicationFieldTitles = {
  APPLICATION: 'HAKEMUSLOMAKE',
  APPLICATION_TEMPLATE: 'Lomakepohja',
  APPLICATION_NAME: 'Lomakkeen otsikko',
};

export const PlotSearchTargetType = {
  SEARCHABLE: 'searchable',
  PROCEDURAL: 'procedural_reservation',
  DIRECT: 'direct_reservation',
};

export const PlotSearchStageTypes = {
  IN_PREPARATION: 'in_preparation',
  IN_ACTION: 'in_action',
  PROCESSING: 'processing',
  DECISION: 'decision',
  SETTLED: 'settled',
};

export const TargetIdentifierTypes = {
  PLAN_UNIT: 'plan_unit',
  CUSTOM_DETAILED_PLAN: 'custom_detailed_plan',
};
