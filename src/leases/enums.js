// @flow
import {getDayMonth} from '../util/date';
/**
 * Area location enumerable.
 *
 * @type {{SURFACE: string, UNDERGROUND: string}}
 */
export const AreaLocation = {
  SURFACE: 'surface',
  UNDERGROUND: 'underground',
};

/**
 * Contract rent period enumerable.
 *
 * @type {{}}
 */
export const ContractRentPeriods = {
  PER_MONTH: 'per_month',
  PER_YEAR: 'per_year',
};

/**
 * Lease relation type enumerable.
 *
 * @type {{}}
 */
export const RelationTypes = {
  TRANSFER: 'transfer',
};

/**
 * Send email type enumerable.
 *
 * @type {{}}
 */
export const SendEmailTypes = {
  CONSTRUCTABILITY: 'constructability',
};

/**
 * Delete modal labels enumerable.
 *
 * @type {{}}
 */
export const DeleteModalLabels = {
  ADDRESS: 'Haluatko varmasti poistaa osoitteen?',
  BASIS_OF_RENT: 'Haluatko varmasti poistaa vuokralaskurin?',
  COLLATERAL: 'Haluatko varmasti poistaa vakuuden?',
  COLLECTION_COURT_DECISION: 'Haluatko varmasti poistaa käräjäoikeuden päätöksen?',
  COLLECTION_LETTER: 'Haluatko varmasti poistaa perintäkirjeen?',
  COLLECTION_NOTE: 'Haluatko varmasti poistaa huomautuksen?',
  CONDITION: 'Haluatko varmasti poistaa ehdon?',
  CONSTRUCTABILITY: 'Haluatko varmasti poistaa huomautuksen?',
  CONTRACT: 'Haluatko varmasti poistaa sopimuksen?',
  CONTRACT_CHANGE: 'Haluatko varmasti poistaa sopimuksen muutoksen?',
  CONTRACT_RENT: 'Haluatko varmasti poistaa sopimusvuokran?',
  DEBT_COLLECTION_NOTE: 'Haluatko varmasti poistaa huomautuksen?',
  DECISION: 'Haluatko varmasti poistaa päätöksen?',
  FIXED_INITIAL_YEAR_RENT: 'Haluatko varmasti poistaa kiinteän alkuvuosivuokran?',
  INSPECTION: 'Haluatko varmasti poistaa tarkastuksen?',
  INVOICE_PAYMENT: 'Haluatko varmasti poistaa maksun?',
  INVOICE_ROW: 'Haluatko varmasti poistaa laskurivin?',
  LEASE_AREA: 'Haluatko varmasti poistaa kohteen?',
  OTHER_TENANT: 'Haluatko varmasti poistaa laskunsaajan/yhteyshenkilön?',
  PLAN_UNIT: 'Haluatko varmasti poistaa kaavayksikön?',
  PLOT: 'Haluatko varmasti poistaa kiinteistön/määräalan?',
  RELATED_LEASE: 'Haluatko varmasti poistaa vuokratunnusten välisen liitoksen?',
  RENT: 'Haluatko varmasti poistaa vuokran?',
  RENT_ADJUSTMENT: 'Haluatko varmasti poistaa alennuksen/korotuksen?',
  TENANT: 'Haluatko varmasti poistaa vuokralaisen?',
};

/**
 * Delete modal titles enumerable.
 *
 * @type {{}}
 */
export const DeleteModalTitles = {
  ADDRESS: 'Poista osoite',
  BASIS_OF_RENT: 'Poista vuokralaskuri',
  COLLATERAL: 'Poista vakuus',
  COLLECTION_COURT_DECISION: 'Poista kärkäoikeuden päätös',
  COLLECTION_LETTER: 'Poista perintäkirje',
  COLLECTION_NOTE: 'Poista huomautus',
  CONDITION: 'Poista ehto',
  CONSTRUCTABILITY: 'Poista huomautus',
  CONTRACT: 'Poista sopimus',
  CONTRACT_CHANGE: 'Poista sopimuksen muutos',
  CONTRACT_RENT: 'Poista sopimusvuokra',
  DEBT_COLLECTION_NOTE: 'Poista huomautus',
  DECISION: 'Poista päätös',
  FIXED_INITIAL_YEAR_RENT: 'Poista kiinteä alkuvuosivuokra',
  INSPECTION: 'Poista tarkastus',
  INVOICE_PAYMENT: 'Poista maksu',
  INVOICE_ROW: 'Poista laskurivi',
  LEASE_AREA: 'Poista kohde',
  OTHER_TENANT: 'Poista laskunsaaja/yhteyshenkilö',
  PLAN_UNIT: 'Poista kaavayksikkö',
  PLOT: 'Poista kiinteistö/määräala',
  RELATED_LEASE: 'Poista liitos',
  RENT: 'Poista vuokra',
  RENT_ADJUSTMENT: 'Poista alennus/korotus',
  TENANT: 'Poista vuokralainen',
};


/**
 * Delete lease texts enumerable.
 *
 * @type {{}}
 */
export const DeleteLeaseTexts = {
  BUTTON: 'Poista',
  LABEL: 'Haluatko varmasti poistaa vuokrauksen?',
  TITLE: 'Poista vuokraus',
};

/**
 * Archive basis of rent texts enumerable.
 *
 * @type {{}}
 */
export const ArchiveBasisOfRentsText = {
  BUTTON: 'Arkistoi',
  LABEL: 'Haluatko varmasti arkistoida vuokralaskurin?',
  TITLE: 'Arkistoi vuokralaskuri',
};

/**
 * Archive basis of rent texts enumerable.
 *
 * @type {{}}
 */
export const UnarchiveBasisOfRentsText = {
  BUTTON: 'Siirrä arkistosta',
  LABEL: 'Haluatko varmasti siirtää vuokralaskurin pois arkistosta?',
  TITLE: 'Siirrä arkistosta',
};
/**
 * LeaseState enumerable.
 *
 * @type {{}}
 */
export const LeaseState = {
  LEASE: 'lease',
  RESERVATION: 'reservation',
  RESERVE: 'reserve',
  FREE: 'free',
  PERMISSION: 'permission',
  APPLICATION: 'application',
  TRANSFERRED: 'transferred',
};

/**
 * Classification enumerable.
 *
 * @type {{}}
 */
export const Classification = {
  PUBLIC: 'public',
  CONFIDENTIAL: 'confidential',
  OFFICIAL: 'official',
};

/**
 * CreditInvoiceOptions enumerable.
 *
 * @type {{FULL: string, RECEIVABLE_TYPE: string, RECEIVABLE_TYPE_AMOUNT: string,}}
 */
export const CreditInvoiceOptionsEnum = {
  FULL: 'full',
  RECEIVABLE_TYPE: 'receivable_type',
  RECEIVABLE_TYPE_AMOUNT: 'receivable_type_amount',
};

/**
 * Constructability status enumerable.
 *
 * @type {{UNVERIFIED: string, REQUIRES_MEASURES: string, COMPLETE: string, ENQUIRY_SENT: string}}
 */
export const ConstructabilityStatus = {
  UNVERIFIED: 'unverified',
  REQUIRES_MEASURES: 'requires_measures',
  COMPLETE: 'complete',
  ENQUIRY_SENT: 'enquiry_sent',
};

/**
 * Constructability type enumerable.
 *
 * @type {{PRECONSTRUCTION: string, DEMOLITION: string, POLLLUTED_LAND: string, REPORT: string, OTHER: string}}
 */
export const ConstructabilityType = {
  PRECONSTRUCTION: 'preconstruction',
  DEMOLITION: 'demolition',
  POLLUTED_LAND: 'polluted_land',
  REPORT: 'report',
  OTHER: 'other',
};

/**
 * Decision type enumerable.
 *
 * @type {{}}
 */
export const DecisionTypes = {
  LAND_LEASE_DEMOLITION: 63,
};

/**
 * Lease status enumerable.
 *
 * @type {{PREPARATION: string, IN_EFFECT: string, FINISHED: string}}
 */
export const LeaseStatus = {
  PREPARATION: 'Valmisteilla',
  IN_EFFECT: 'Voimassa',
  FINISHED: 'Päättynyt',
};

/**
 * Rent due date type enumerable.
 *
 * @type {{REAL_PROPERTY: string, UNSEPARATED_PARCEL: string,}}
 */
export const PlotType = {
  REAL_PROPERTY: 'real_property',
  UNSEPARATED_PARCEL: 'unseparated_parcel',
};

/**
 * Rent due date type enumerable.
 *
 * @type {{CUSTOM: string, FIXED: string,}}
 */
export const RentDueDateTypes = {
  CUSTOM: 'custom',
  FIXED: 'fixed',
};

/**
 * Rent type enumerable.
 *
 * @type {{INDEX: string, ONE_TIME: string, FIXED: string, FREE: string, MANUAL: string}}
 */
export const RentTypes = {
  INDEX: 'index',
  ONE_TIME: 'one_time',
  FIXED: 'fixed',
  FREE: 'free',
  MANUAL: 'manual',
};

/**
 * Rent cycle enumerable.
 *
 * @type {{JANUARY_TO_DECEMBER: string, APRIL_TO_MARCH: string}}
 */
export const RentCycles = {
  JANUARY_TO_DECEMBER: 'january_to_december',
  APRIL_TO_MARCH: 'april_to_march',
};

/**
 * Credit invoiceset options
 * @type {[*]}
 */
const FirstDayOfEveryMonth = [
  getDayMonth(1, 1),
  getDayMonth(1, 2),
  getDayMonth(1, 3),
  getDayMonth(1, 4),
  getDayMonth(1, 5),
  getDayMonth(1, 6),
  getDayMonth(1, 7),
  getDayMonth(1, 8),
  getDayMonth(1, 9),
  getDayMonth(1, 10),
  getDayMonth(1, 11),
  getDayMonth(1, 12),
];

/**
 * Due dates position enumerable.
 *
 * @type {{}}
 */
export const DueDatesPosition = {
  START_OF_MONTH: 'start_of_month',
  MIDDLE_OF_MONTH: 'middle_of_month',
};

/**
 * Fixed due dates enumerable.
 *
 * @type {{}}
 */
export const FixedDueDates = {
  [DueDatesPosition.START_OF_MONTH]: {
    '1': [getDayMonth(2, 1)],
    '2': [getDayMonth(2, 1), getDayMonth(1, 7)],
    '4': [getDayMonth(2, 1), getDayMonth(1, 4), getDayMonth(1, 7), getDayMonth(1, 10)],
    '12': FirstDayOfEveryMonth,
  },
  [DueDatesPosition.MIDDLE_OF_MONTH]: {
    '1': [getDayMonth(30, 6)],
    '2': [getDayMonth(15, 3), getDayMonth(30, 9)],
    '4': [getDayMonth(1, 3), getDayMonth(15, 4), getDayMonth(15, 7), getDayMonth(15, 10)],
    '12': FirstDayOfEveryMonth,
  },
};

/**
 * Index type enumerable.
 *
 * @type {{INDEX: string, ONE_TIME: string, FIXED: string, FREE: string, MANUAL: string}}
 */
export const IndexTypes = {
  INDEX_50620: 'type_1',
  INDEX_4661: 'type_2',
  INDEX_418_10: 'type_3',
  INDEX_418_20: 'type_4',
  INDEX_392: 'type_5',
  INDEX_100_ROUNDING: 'type_6',
  INDEX_100: 'type_7',
};

/**
 * Recipient options enumerable.
 *
 * @type {{ALL: string}}
 */
export const RecipientOptions = {
  ALL: 'all',
};

/**
 * Contact type enumerable.
 *
 * @type {{TENANT: string, BILLING: string, CONTACT: string}}
 */
export const TenantContactType = {
  TENANT: 'tenant',
  BILLING: 'billing',
  CONTACT: 'contact',
};

/**
 * Lease form names enumerable.
 *
 * @type {{ARCHIVE_AREA: string, CONSTRUCTABILITY: string, CONTRACTS: string, CREATE_COLLECTION_LETTER: string, CREATE_LEASE: string, DEBT_COLLECTION: string, DECISIONS: string, INSPECTION: string, INVOICE_EDIT: string, INVOICE_NEW: string, LEASE_AREAS: string, REFUND: string, RENTS: string, SEARCH: string, SUMMARY: string, TENANTS: string}}
 */
export const FormNames = {
  ARCHIVE_AREA: 'archive-area-form',
  CONSTRUCTABILITY: 'constructability-form',
  CONTRACTS: 'contracts-form',
  CREATE_COLLECTION_LETTER: 'create-collection-letter-form',
  CREATE_LEASE: 'create-lease-form',
  DEBT_COLLECTION: 'debt-collection-form',
  DECISIONS: 'decisions-form',
  INSPECTIONS: 'inspections-form',
  INVOICE_CREDIT: 'credit-invoice-form',
  INVOICE_EDIT: 'edit-invoice-form',
  INVOICE_NEW: 'new-invoice-form',
  LEASE_AREAS: 'lease-areas-form',
  REFUND: 'refund-form',
  RENTS: 'rents-form',
  SEARCH: 'lease-search-form',
  SUMMARY: 'summary-form',
  TENANTS: 'tenants-form',
};


/**
 * Lease field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseFieldPaths = {
  ARRANGEMENT_DECISION: 'arrangement_decision',
  BUILDING_SELLING_PRICE: 'building_selling_price',
  CLASSIFICATION: 'classification',
  CONVEYANCE_NUMBER: 'conveyance_number',
  DISTRICT: 'district',
  END_DATE: 'end_date',
  FINANCING: 'financing',
  HITAS: 'hitas',
  IDENTIFIER: 'identifier',
  INFILL_DEVELOPMENT_COMPENSATIONS: 'infill_development_compensations',
  INTENDED_USE: 'intended_use',
  INTENDED_USE_NOTE: 'intended_use_note',
  IS_SUBJECT_TO_VAT: 'is_subject_to_vat',
  LESSOR: 'lessor',
  MANAGEMENT: 'management',
  MUNICIPALITY: 'municipality',
  NOTE: 'note',
  NOTICE_NOTE: 'notice_note',
  NOTICE_PERIOD: 'notice_period',
  PREPARER: 'preparer',
  REAL_ESTATE_DEVELOPER: 'real_estate_developer',
  REFERENCE_NUMBER: 'reference_number',
  REGULATED: 'regulated',
  REGULATION: 'regulation',
  RELATED_LEASES: 'related_leases',
  RELATE_TO: 'relate_to',
  SPECIAL_PROJECT: 'special_project',
  START_DATE: 'start_date',
  STATE: 'state',
  STATISTICAL_USE: 'statistical_use',
  STATUS: 'status',
  SUPPORTIVE_HOUSING: 'supportive_housing',
  TRANSFERABLE: 'transferable',
  TYPE: 'type',
};

/**
 * Lease field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseFieldTitles = {
  ARRANGEMENT_DECISION: 'Järjestelypäätös',
  BUILDING_SELLING_PRICE: 'Rakennuksen kauppahinta',
  CLASSIFICATION: 'Julkisuusluokka',
  CONVEYANCE_NUMBER: 'Luovutusnumero',
  DISTRICT: 'Kaupunginosa',
  END_DATE: 'Loppupvm',
  FINANCING: 'Rahoitusmuoto',
  HITAS: 'Hitas',
  IDENTIFIER: 'Vuokratunnus',
  INFILL_DEVELOPMENT_COMPENSATIONS: 'Täydennysrakentamiskorvaus',
  INTENDED_USE: 'Vuokrauksen käyttötarkoitus',
  INTENDED_USE_NOTE: 'Käyttötarkoituksen huomautus',
  IS_SUBJECT_TO_VAT: 'Arvonlisävelvollinen',
  LESSOR: 'Vuokranantaja',
  MANAGEMENT: 'Hallintamuoto',
  MUNICIPALITY: 'Kunta',
  NOTE: 'Huomautus',
  NOTICE_NOTE: 'Irtisanomisajan huomautus',
  NOTICE_PERIOD: 'Irtisanomisaika',
  PREPARER: 'Valmistelija',
  REAL_ESTATE_DEVELOPER: 'Rakennuttaja',
  REFERENCE_NUMBER: 'Diaarinumero',
  REGULATED: 'Sääntely',
  REGULATION: 'Sääntelymuoto',
  RELATED_LEASES: 'Liittyvät vuokraukset',
  RELATE_TO: 'Liittyy vuokraukseen',
  SPECIAL_PROJECT: 'Erityishanke',
  START_DATE: 'Alkupvm',
  STATE: 'Tyyppi',
  STATISTICAL_USE: 'Tilastollinen pääkäyttötarkoitus',
  STATUS: 'Olotila',
  SUPPORTIVE_HOUSING: 'Erityisasunnot',
  TRANSFERABLE: 'Siirto-oikeus',
  TYPE: 'Vuokrauksen laji',
};

/**
 * Lease areas field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseAreasFieldPaths = {
  LEASE_AREAS: 'lease_areas',
  ARCHIVED_AT: 'lease_areas.child.children.archived_at',
  ARCHIVED_DECISION: 'lease_areas.child.children.archived_decision',
  ARCHIVED_NOTE: 'lease_areas.child.children.archived_note',
  AREA: 'lease_areas.child.children.area',
  CONSTRUCTABILITY_REPORT_GEOTECHNICAL_NUMBER: 'lease_areas.child.children.constructability_report_geotechnical_number',
  CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE: 'lease_areas.child.children.constructability_report_investigation_state',
  CONSTRUCTABILITY_REPORT_SIGNING_DATE: 'lease_areas.child.children.constructability_report_signing_date',
  CONSTRUCTABILITY_REPORT_SIGNER: 'lease_areas.child.children.constructability_report_signer',
  CONSTRUCTABILITY_REPORT_STATE: 'lease_areas.child.children.constructability_report_state',
  DEMOLITION_STATE: 'lease_areas.child.children.demolition_state',
  GEOMETRY: 'lease_areas.child.children.geometry',
  IDENTIFIER: 'lease_areas.child.children.identifier',
  LOCATION: 'lease_areas.child.children.location',
  OTHER_STATE: 'lease_areas.child.children.other_state',
  POLLUTED_LAND_MATTI_REPORT_NUMBER: 'lease_areas.child.children.polluted_land_matti_report_number',
  POLLUTED_LAND_PLANNER: 'lease_areas.child.children.polluted_land_planner',
  POLLUTED_LAND_PROJECTWISE_NUMBER: 'lease_areas.child.children.polluted_land_projectwise_number',
  POLLUTED_LAND_RENT_CONDITION_DATE: 'lease_areas.child.children.polluted_land_rent_condition_date',
  POLLUTED_LAND_RENT_CONDITION_STATE: 'lease_areas.child.children.polluted_land_rent_condition_state',
  POLLUTED_LAND_STATE: 'lease_areas.child.children.polluted_land_state',
  PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT: 'lease_areas.child.children.preconstruction_estimated_construction_readiness_moment',
  PRECONSTRUCTION_INSPECTION_MOMENT: 'lease_areas.child.children.preconstruction_inspection_moment',
  PRECONSTRUCTION_STATE: 'lease_areas.child.children.preconstruction_state',
  TYPE: 'lease_areas.child.children.type',
};

/**
 * Lease area field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseAreasFieldTitles = {
  LEASE_AREAS: 'Vuokrakohde',
  ARCHIVED_AT: 'Arkistoitu',
  ARCHIVED_DECISION: 'Päätös',
  ARCHIVED_NOTE: 'Huomautus',
  AREA: 'Pinta-ala',
  CONSTRUCTABILITY_REPORT_GEOTECHNICAL_NUMBER: 'Geoteknisen palvelun tiedosto',
  CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE: 'Selvitys',
  CONSTRUCTABILITY_REPORT_SIGNING_DATE: 'Allekirjoituspvm',
  CONSTRUCTABILITY_REPORT_SIGNER: 'Allekirjoittaja',
  CONSTRUCTABILITY_REPORT_STATE: 'Selvitysaste',
  DEMOLITION_STATE: 'Selvitysaste',
  GEOMETRY: 'Karttalinkki',
  IDENTIFIER: 'Kohteen tunnus',
  LOCATION: 'Sijainti',
  OTHER_STATE: 'Selvitysaste',
  POLLUTED_LAND_MATTI_REPORT_NUMBER: 'Matti-raportti',
  POLLUTED_LAND_PLANNER: 'PIMA valmistelija',
  POLLUTED_LAND_PROJECTWISE_NUMBER: 'ProjectWise numero',
  POLLUTED_LAND_RENT_CONDITION_DATE: 'Vuokraehdot pvm',
  POLLUTED_LAND_RENT_CONDITION_STATE: 'Vuokraehdot',
  POLLUTED_LAND_STATE: 'Selvitysaste',
  PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT: 'Arvioitu rakentamisvalmius (kk/v)',
  PRECONSTRUCTION_INSPECTION_MOMENT: 'Tarkistuspäivä (kk/v)',
  PRECONSTRUCTION_STATE: 'Selvitysaste',
  TYPE: 'Määritelmä',
};

/**
 * Lease area addresses field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaAddressesFieldPaths = {
  ADDRESSES: 'lease_areas.child.children.addresses',
  ADDRESS: 'lease_areas.child.children.addresses.child.children.address',
  CITY: 'lease_areas.child.children.addresses.child.children.city',
  POSTAL_CODE: 'lease_areas.child.children.addresses.child.children.postal_code',
};

/**
 * Lease area addresses field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaAddressesFieldTitles = {
  ADDRESSES: 'Osoitteet',
  ADDRESS: 'Osoite',
  CITY: 'Kaupunki',
  POSTAL_CODE: 'Postinumero',
};

/**
 * Lease area plan units field paths enumerable.
 *
 * @type {{}}
 */
export const LeasePlanUnitsFieldPaths = {
  PLAN_UNITS: 'lease_areas.child.children.plan_units',
  AREA: 'lease_areas.child.children.plan_units.child.children.area',
  DETAILED_PLAN_IDENTIFIER: 'lease_areas.child.children.plan_units.child.children.detailed_plan_identifier',
  DETAILED_PLAN_LATEST_PROCESSING_DATE: 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date',
  DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE: 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date_note',
  GEOMETRY: 'lease_areas.child.children.plan_units.child.children.geometry',
  IDENTIFIER: 'lease_areas.child.children.plan_units.child.children.identifier',
  PLAN_UNIT_INTENDED_USE: 'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use',
  PLAN_UNIT_STATE: 'lease_areas.child.children.plan_units.child.children.plan_unit_state',
  PLAN_UNIT_TYPE: 'lease_areas.child.children.plan_units.child.children.plan_unit_type',
  PLOT_DIVISION_EFFECTIVE_DATE: 'lease_areas.child.children.plan_units.child.children.plot_division_effective_date',
  PLOT_DIVISION_IDENTIFIER: 'lease_areas.child.children.plan_units.child.children.plot_division_identifier',
  PLOT_DIVISION_STATE: 'lease_areas.child.children.plan_units.child.children.plot_division_state',
  SECTION_AREA: 'lease_areas.child.children.plan_units.child.children.section_area',
};

/**
 * Lease area plan units field titles enumerable.
 *
 * @type {{}}
 */
export const LeasePlanUnitsFieldTitles = {
  PLAN_UNITS: 'Kaavayksiköt',
  AREA: 'Kokonaisala',
  DETAILED_PLAN_IDENTIFIER: 'Asemakaava',
  DETAILED_PLAN_LATEST_PROCESSING_DATE: 'Asemakaavan viimeisin käsittelypvm',
  DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE: 'Asemakaavan viimeisin käsittelypvm huomautus',
  GEOMETRY: 'Karttalinkki',
  IDENTIFIER: 'Kohteen tunnus',
  PLAN_UNIT_INTENDED_USE: 'Kaavayksikön käyttötarkoitus',
  PLAN_UNIT_STATE: 'Kaavayksikön olotila',
  PLAN_UNIT_TYPE: 'Kaavayksikön laji',
  PLOT_DIVISION_EFFECTIVE_DATE: 'Tonttijaon voimaantulopvm',
  PLOT_DIVISION_IDENTIFIER: 'Tonttijaon tunnus',
  PLOT_DIVISION_STATE: 'Tonttijaon olotila',
  SECTION_AREA: 'Leikkausala',
};

/**
 * Lease area plots field paths enumerable.
 *
 * @type {{}}
 */
export const LeasePlotsFieldPaths = {
  PLOTS: 'lease_areas.child.children.plots',
  AREA: 'lease_areas.child.children.plots.child.children.area',
  GEOMETRY: 'lease_areas.child.children.plots.child.children.geometry',
  IDENTIFIER: 'lease_areas.child.children.plots.child.children.identifier',
  KTJ_LINK: 'lease_areas.child.children.plots.child.children.ktj_link',
  REGISTRATION_DATE: 'lease_areas.child.children.plots.child.children.registration_date',
  REPEAL_DATE: 'lease_areas.child.children.plots.child.children.repeal_date',
  SECTION_AREA: 'lease_areas.child.children.plots.child.children.section_area',
  TYPE: 'lease_areas.child.children.plots.child.children.type',
};

/**
 * Lease area plots field titles enumerable.
 *
 * @type {{}}
 */
export const LeasePlotsFieldTitles = {
  PLOTS: 'Kiinteistöt / määräalat',
  AREA: 'Kokonaisala',
  GEOMETRY: 'Karttalinkki',
  IDENTIFIER: 'Kohteen tunnus',
  KTJ_LINK: 'Ktj-dokumentit',
  REGISTRATION_DATE: 'Rekisteröintipvm',
  REPEAL_DATE: 'Kumoamispvm',
  SECTION_AREA: 'Leikkausala',
  TYPE: 'Määritelmä',
};

/**
 * Lease area constructability descriptions field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseConstructabilityDescriptionsFieldPaths = {
  CONSTRUCTABILITY_DESCRIPTIONS: 'lease_areas.child.children.constructability_descriptions',
  AHJO_REFERENCE_NUMBER: 'lease_areas.child.children.constructability_descriptions.child.children.ahjo_reference_number',
  IS_STATIC: 'lease_areas.child.children.constructability_descriptions.child.children.is_static',
  TEXT: 'lease_areas.child.children.constructability_descriptions.child.children.text',
  TYPE: 'lease_areas.child.children.constructability_descriptions.child.children.type',
};

/**
 * Lease area constructability descriptions field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseConstructabilityDescriptionsFieldTitles = {
  CONSTRUCTABILITY_DESCRIPTIONS: 'Huomautukset',
  AHJO_REFERENCE_NUMBER: 'AHJO diaarinumero',
  IS_STATIC: 'Pysyvä huomautus',
  TEXT: 'Huomautus',
  TYPE: 'Tyyppi',
};

/**
 * Lease tenants field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantsFieldPaths = {
  TENANTS: 'tenants',
  REFERENCE: 'tenants.child.children.reference',
  SHARE_DENIMONATOR: 'tenants.child.children.share_denominator',
  SHARE_FRACTION: 'tenants.child.children.share_fraction',
  SHARE_NUMERATOR: 'tenants.child.children.share_numerator',
  SHARE_PERCENTAGE: 'tenants.child.children.share_percentage',
};

/**
 * Lease tenants field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantsFieldTitles = {
  TENANTS: 'Vuokralaiset',
  REFERENCE: 'Viite',
  SHARE_DENIMONATOR: 'Jakaja',
  SHARE_FRACTION: 'Osuus murtolukuna',
  SHARE_NUMERATOR: 'Jaettava',
  SHARE_PERCENTAGE: 'Laskun hallintaosuus',
};

/**
 * Lease tenants field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantContactSetFieldPaths = {
  TENANTCONTACT_SET: 'tenants.child.children.tenantcontact_set',
  CONTACT: 'tenants.child.children.tenantcontact_set.child.children.contact',
  END_DATE: 'tenants.child.children.tenantcontact_set.child.children.end_date',
  START_DATE: 'tenants.child.children.tenantcontact_set.child.children.start_date',
  TYPE: 'tenants.child.children.tenantcontact_set.child.children.type',
};

/**
 * Lease tenants field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantContactSetFieldTitles = {
  CONTACT: 'Asiakas',
  END_DATE: 'Loppupvm',
  START_DATE: 'Alkupvm',
  TYPE: 'Tyyppi',
};

/**
 * Lease rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentsFieldPaths = {
  RENTS: 'rents',
  AMOUNT: 'rents.child.children.amount',
  CYCLE: 'rents.child.children.cycle',
  DUE_DATES_PER_YEAR: 'rents.child.children.due_dates_per_year',
  DUE_DATES_TYPE: 'rents.child.children.due_dates_type',
  ELEMENTARY_INDEX: 'rents.child.children.elementary_index',
  END_DATE: 'rents.child.children.end_date',
  EQUALIZATION_END_DATE: 'rents.child.children.equalization_end_date',
  EQUALIZATION_START_DATE: 'rents.child.children.equalization_start_date',
  INDEX_ROUNDING: 'rents.child.children.index_rounding',
  INDEX_TYPE: 'rents.child.children.index_type',
  IS_RENT_INFO_COMPLETE: 'is_rent_info_complete',
  MANUAL_RATIO: 'rents.child.children.manual_ratio',
  MANUAL_RATIO_PREVIOUS: 'rents.child.children.manual_ratio_previous',
  NOTE: 'rents.child.children.note',
  SEASONAL_DATES: 'rents.child.children.seasonal_dates',
  SEASONAL_END_DAY: 'rents.child.children.seasonal_end_day',
  SEASONAL_END_MONTH: 'rents.child.children.seasonal_end_month',
  SEASONAL_START_DAY: 'rents.child.children.seasonal_start_day',
  SEASONAL_START_MONTH: 'rents.child.children.seasonal_start_month',
  START_DATE: 'rents.child.children.start_date',
  TYPE: 'rents.child.children.type',
  X_VALUE: 'rents.child.children.x_value',
  Y_VALUE: 'rents.child.children.y_value',
  YEARLY_DUE_DATES: 'rents.child.children.yearly_due_dates',
  Y_VALUE_START: 'rents.child.children.y_value_start',
};

/**
 * Lease rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentsFieldTitles = {
  RENTS: 'Vuokrat',
  AMOUNT: 'Kertakaikkinen vuokra',
  CYCLE: 'Vuokrakausi',
  DUE_DATES_PER_YEAR: 'Laskut kpl/v',
  DUE_DATES_TYPE: 'Laskutusjako',
  ELEMENTARY_INDEX: 'Perusindeksi',
  END_DATE: 'Loppupvm',
  EQUALIZATION_END_DATE: 'Tasaus loppupvm',
  EQUALIZATION_START_DATE: 'Tasaus alkupvm',
  INDEX_ROUNDING: 'Pyöristys',
  INDEX_TYPE: 'Indeksin tunnusnumero',
  IS_RENT_INFO_COMPLETE: 'Vuokratiedot kunnossa?',
  MANUAL_RATIO: 'Käsinlaskentakerroin',
  MANUAL_RATIO_PREVIOUS: 'Käsinlaskentakerroin (edellinen)',
  NOTE: 'Huomautus',
  SEASONAL_DATES: 'Kausivuokra ajalla (pv.kk)',
  SEASONAL_END_DAY: 'Kauden loppupäivä',
  SEASONAL_END_MONTH: 'Kauden loppukuukausi',
  SEASONAL_START_DAY: 'Kauden alkupäivä',
  SEASONAL_START_MONTH: 'Kauden alkukuukausi',
  START_DATE: 'Alkupvm',
  TYPE: 'Vuokralaji',
  X_VALUE: 'X-luku',
  Y_VALUE: 'Y-luku',
  Y_VALUE_START: 'Y-luku alkaen',
  YEARLY_DUE_DATES: 'Eräpäivät (pv.kk)',
};

/**
 * Lease rent due dates field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentDueDatesFieldPaths = {
  DUE_DATES: 'rents.child.children.due_dates',
  DAY: 'rents.child.children.due_dates.child.children.day',
  MONTH: 'rents.child.children.due_dates.child.children.month',
};

/**
 * Lease rent due dates field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentDueDatesFieldTitles = {
  DUE_DATES: 'Eräpäivät',
  DAY: 'Päivä',
  MONTH: 'Kuukausi',
};

/**
 * Lease rent fixed initial year rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentFixedInitialYearRentsFieldPaths = {
  FIXED_INITIAL_YEAR_RENTS: 'rents.child.children.fixed_initial_year_rents',
  AMOUNT: 'rents.child.children.fixed_initial_year_rents.child.children.amount',
  END_DATE: 'rents.child.children.fixed_initial_year_rents.child.children.end_date',
  INTENDED_USE: 'rents.child.children.fixed_initial_year_rents.child.children.intended_use',
  START_DATE: 'rents.child.children.fixed_initial_year_rents.child.children.start_date',
};

/**
 * Lease rent fixed initial year rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentFixedInitialYearRentsFieldTitles = {
  FIXED_INITIAL_YEAR_RENTS: 'Kiinteä alkuvuosivuokra',
  AMOUNT: 'Kiinteä alkuvuosivuokra',
  END_DATE: 'Loppupvm',
  INTENDED_USE: 'Käyttötarkoitus',
  START_DATE: 'Alkupvm',
};

/**
 * Lease rent contract rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentContractRentsFieldPaths = {
  CONTRACT_RENTS: 'rents.child.children.contract_rents',
  AMOUNT: 'rents.child.children.contract_rents.child.children.amount',
  PERIOD: 'rents.child.children.contract_rents.child.children.period',
  BASE_AMOUNT: 'rents.child.children.contract_rents.child.children.base_amount',
  BASE_AMOUNT_PERIOD: 'rents.child.children.contract_rents.child.children.base_amount_period',
  BASE_YEAR_RENT: 'rents.child.children.contract_rents.child.children.base_year_rent',
  END_DATE: 'rents.child.children.contract_rents.child.children.end_date',
  INTENDED_USE: 'rents.child.children.contract_rents.child.children.intended_use',
  START_DATE: 'rents.child.children.contract_rents.child.children.start_date',
};

/**
 * Lease rent contract rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentContractRentsFieldTitles = {
  CONTRACT_RENTS: 'Sopimusvuokra',
  AMOUNT: 'Perusvuosivuokra',
  PERIOD: 'Yksikkö',
  BASE_AMOUNT: 'Vuokranlaskennan perusteena oleva vuokra',
  BASE_AMOUNT_PERIOD: 'Yksikkö',
  BASE_YEAR_RENT: 'Uusi perusvuosivuokra',
  END_DATE: 'Loppupvm',
  INTENDED_USE: 'Käyttötarkoitus',
  START_DATE: 'Alkupvm',
};

/**
 * Lease rent adjustments field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentAdjustmentsFieldPaths = {
  RENT_ADJUSTMENTS: 'rents.child.children.rent_adjustments',
  AMOUNT_LEFT: 'rents.child.children.rent_adjustments.child.children.amount_left',
  AMOUNT_TYPE: 'rents.child.children.rent_adjustments.child.children.amount_type',
  DECISION: 'rents.child.children.rent_adjustments.child.children.decision',
  END_DATE: 'rents.child.children.rent_adjustments.child.children.end_date',
  FULL_AMOUNT: 'rents.child.children.rent_adjustments.child.children.full_amount',
  INTENDED_USE: 'rents.child.children.rent_adjustments.child.children.intended_use',
  NOTE: 'rents.child.children.rent_adjustments.child.children.note',
  START_DATE: 'rents.child.children.rent_adjustments.child.children.start_date',
  TYPE: 'rents.child.children.rent_adjustments.child.children.type',
};

/**
 * Lease rent adjustments field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentAdjustmentsFieldTitles = {
  RENT_ADJUSTMENTS: 'Alennukset ja korotukset',
  AMOUNT_LEFT: 'Jäljellä',
  AMOUNT_TYPE: 'Määrän tyyppi',
  DECISION: 'Päätös',
  END_DATE: 'Loppupvm',
  FULL_AMOUNT: 'Kokonaismäärä',
  INTENDED_USE: 'Käyttötarkoitus',
  NOTE: 'Huomautus',
  START_DATE: 'Alkupvm',
  TYPE: 'Tyyppi',
};

/**
 * Lease basis of rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseBasisOfRentsFieldPaths = {
  BASIS_OF_RENTS: 'basis_of_rents',
  AMOUNT_PER_AREA: 'basis_of_rents.child.children.amount_per_area',
  ARCHIVED_AT: 'basis_of_rents.child.children.archived_at',
  ARCHIVED_NOTE: 'basis_of_rents.child.children.archived_note',
  AREA: 'basis_of_rents.child.children.area',
  AREA_UNIT: 'basis_of_rents.child.children.area_unit',
  BASE_YEAR_RENT: 'basis_of_rents.child.children.base_year_rent',
  DISCOUNT_PERCENTAGE: 'basis_of_rents.child.children.discount_percentage',
  DISCOUNTED_INITIAL_YEAR_RENT: 'basis_of_rents.child.children.discounted_intial_year_rent',
  INDEX: 'basis_of_rents.child.children.index',
  INITIAL_YEAR_RENT: 'basis_of_rents.child.children.intial_year_rent',
  INTENDED_USE: 'basis_of_rents.child.children.intended_use',
  LOCKED_AT: 'basis_of_rents.child.children.locked_at',
  PLANS_INSPECTED_AT: 'basis_of_rents.child.children.plans_inspected_at',
  PROFIT_MARGIN_PERCENTAGE: 'basis_of_rents.child.children.profit_margin_percentage',
  UNIT_PRICE: 'basis_of_rents.child.children.unit_price',
};

/**
 * Lease basis of rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseBasisOfRentsFieldTitles = {
  BASIS_OF_RENTS: 'Vuokralaskuri',
  AMOUNT_PER_AREA: 'Yksikköhinta (ind 100)',
  ARCHIVED_AT: 'Arkistoitu',
  ARCHIVED_NOTE: 'Arkitoinnin huomautus',
  AREA: 'Pinta-ala',
  AREA_UNIT: 'Pinta-alan yksikkö',
  BASE_YEAR_RENT: 'Perusvuosivuokra (ind 100)',
  DISCOUNT_PERCENTAGE: 'Alennusprosentti',
  DISCOUNTED_INITIAL_YEAR_RENT: 'Alennettu alkuvuosivuokra (ind)',
  INDEX: 'Indeksi',
  INITIAL_YEAR_RENT: 'Alkuvuosivuokra (ind)',
  INTENDED_USE: 'Käyttötarkoitus',
  LOCKED_AT: 'Laskelma lukittu',
  PLANS_INSPECTED_AT: 'Piirustukset tarkastettu',
  PROFIT_MARGIN_PERCENTAGE: 'Tuottoprosentti',
  UNIT_PRICE: 'Yksikköhinta (ind)',
};

/**
 * Lease decisions field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionsFieldPaths = {
  DECISIONS: 'decisions',
  DECISION_DATE: 'decisions.child.children.decision_date',
  DECISION_MAKER: 'decisions.child.children.decision_maker',
  DESCRIPTION: 'decisions.child.children.description',
  REFERENCE_NUMBER: 'decisions.child.children.reference_number',
  SECTION: 'decisions.child.children.section',
  TYPE: 'decisions.child.children.type',
};

/**
 * Lease decisions field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionsFieldTitles = {
  DECISIONS: 'Päätökset',
  DECISION_DATE: 'Päätöspvm',
  DECISION_MAKER: 'Päättäjä',
  DESCRIPTION: 'Huomautus',
  REFERENCE_NUMBER: 'Diaarinumero',
  SECTION: 'Pykälä',
  TYPE: 'Päätöksen tyyppi',
};

/**
 * Lease decision conditions field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionConditionsFieldPaths = {
  CONDITIONS: 'decisions.child.children.conditions',
  DESCRIPTION: 'decisions.child.children.conditions.child.children.description',
  SUPERVISED_DATE: 'decisions.child.children.conditions.child.children.supervised_date',
  SUPERVISION_DATE: 'decisions.child.children.conditions.child.children.supervision_date',
  TYPE: 'decisions.child.children.conditions.child.children.type',
};

/**
 * Lease decision conditions field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionConditionsFieldTitles = {
  CONDITIONS: 'Ehdot',
  DESCRIPTION: 'Huomautus',
  SUPERVISED_DATE: 'Valvottu pvm',
  SUPERVISION_DATE: 'Valvontapvm',
  TYPE: 'Ehtotyyppi',
};

/**
 * Lease contracts field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseContractsFieldPaths = {
  CONTRACTS: 'contracts',
  CONTRACT_NUMBER: 'contracts.child.children.contract_number',
  DECISION: 'contracts.child.children.decision',
  FIRST_CALL_SENT: 'contracts.child.children.first_call_sent',
  INSTITUTION_IDENTIFIER: 'contracts.child.children.institution_identifier',
  IS_READJUSTMENT_DECISION: 'contracts.child.children.is_readjustment_decision',
  KTJ_LINK: 'contracts.child.children.ktj_link',
  SECOND_CALL_SENT: 'contracts.child.children.second_call_sent',
  SIGN_BY_DATE: 'contracts.child.children.sign_by_date',
  SIGNING_DATE: 'contracts.child.children.signing_date',
  SIGNING_NOTE: 'contracts.child.children.signing_note',
  THIRD_CALL_SENT: 'contracts.child.children.third_call_sent',
  TYPE: 'contracts.child.children.type',
};

/**
 * Lease contracts field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseContractsFieldTitles = {
  CONTRACTS: 'Sopimukset',
  CONTRACT_NUMBER: 'Sopimusnumero',
  DECISION: 'Päätös',
  FIRST_CALL_SENT: '1. kutsu lähetetty',
  INSTITUTION_IDENTIFIER: 'Laitostunnus',
  IS_READJUSTMENT_DECISION: 'Järjestelypäätös',
  KTJ_LINK: 'Ktj dokumentti',
  SECOND_CALL_SENT: '2. kutsu lähetetty',
  SIGN_BY_DATE: 'Allekirjoitettava mennessä',
  SIGNING_DATE: 'Allekirjoituspvm',
  SIGNING_NOTE: 'Allekirjoituksen huomautus',
  THIRD_CALL_SENT: '3. kutsu lähetetty',
  TYPE: 'Sopimuksen tyyppi',
};

/**
 * Lease contract mortgage documents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseContractCollateralsFieldPaths = {
  COLLATRALS: 'contracts.child.children.collaterals',
  END_DATE: 'contracts.child.children.collaterals.child.children.end_date',
  NOTE: 'contracts.child.children.collaterals.child.children.note',
  NUMBER: 'contracts.child.children.collaterals.child.children.number',
  PAID_DATE: 'contracts.child.children.collaterals.child.children.paid_date',
  RETURNED_DATE: 'contracts.child.children.collaterals.child.children.returned_date',
  START_DATE: 'contracts.child.children.collaterals.child.children.start_date',
  TOTAL_AMOUNT: 'contracts.child.children.collaterals.child.children.total_amount',
  TYPE: 'contracts.child.children.collaterals.child.children.type',
};

/**
 * Lease contract mortgage documents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseContractCollateralsFieldTitles = {
  COLLATRALS: 'Vakuudet',
  END_DATE: 'Vuokravakuuden loppupvm',
  NOTE: 'Huomautus',
  NUMBER: 'Vuokravakuusnumero',
  PAID_DATE: 'Maksettu pvm',
  RETURNED_DATE: 'Palautettu pvm',
  START_DATE: 'Vuokravakuuden alkupvm',
  TOTAL_AMOUNT: 'Vakuuden määrä',
  TYPE: 'Vakuuden laji',
};

/**
 * Lease contract changes field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseContractChangesFieldPaths = {
  CONTRACT_CHANGES: 'contracts.child.children.contract_changes',
  DESCRIPTION: 'contracts.child.children.contract_changes.child.children.description',
  DECISION: 'contracts.child.children.contract_changes.child.children.decision',
  FIRST_CALL_SENT: 'contracts.child.children.contract_changes.child.children.first_call_sent',
  SECOND_CALL_SENT: 'contracts.child.children.contract_changes.child.children.second_call_sent',
  SIGN_BY_DATE: 'contracts.child.children.contract_changes.child.children.sign_by_date',
  SIGNING_DATE: 'contracts.child.children.contract_changes.child.children.signing_date',
  THIRD_CALL_SENT: 'contracts.child.children.contract_changes.child.children.third_call_sent',
};

/**
 * Lease contract changes field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseContractChangesFieldTitles = {
  CONTRACT_CHANGES: 'Sopimuksen muutokset',
  DESCRIPTION: 'Huomautus',
  DECISION: 'Päätös',
  FIRST_CALL_SENT: '1. kutsu lähetetty',
  SECOND_CALL_SENT: '2. kutsu lähetetty',
  SIGN_BY_DATE: 'Allekirjoitettava mennessä',
  SIGNING_DATE: 'Allekirjoituspvm',
  THIRD_CALL_SENT: '3. kutsu lähetetty',
};

/**
 * Lease inspection field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseInspectionsFieldPaths = {
  INSPECTIONS: 'inspections',
  DESCRIPTION: 'inspections.child.children.description',
  INSPECTOR: 'inspections.child.children.inspector',
  SUPERVISED_DATE: 'inspections.child.children.supervised_date',
  SUPERVISION_DATE: 'inspections.child.children.supervision_date',
};

/**
 * Lease inspections field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseInspectionsFieldTitles = {
  INSPECTIONS: 'Tarkastukset ja huomautukset',
  DESCRIPTION: 'Huomautus',
  INSPECTOR: 'Tarkastaja',
  SUPERVISED_DATE: 'Valvottu pvm',
  SUPERVISION_DATE: 'Valvontapvm',
};

/**
 * Lease invoicing field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseInvoicingFieldPaths = {
  IS_INVOICING_ENABLED: 'is_invoicing_enabled',
};

/**
 * Lease invoicing field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseInvoicingFieldTitles = {
  INVOICING: 'Laskutus',
  INVOICING_DISABLED: 'Laskutus keskeytetty',
  INVOICING_ENABLED: 'Laskutus käynnissä',
};
