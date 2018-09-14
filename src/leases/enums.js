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
 * Delete modal labels enumerable.
 *
 * @type {{ADDRESS: string, BASIS_OF_RENT: string, COLLECTION_COURT_DECISION: string, COLLECTION_LETTER: string, COLLECTION_NOTE: string, CONDITION: string, CONSTRUCTABILITY: string, CONTRACT: string, CONTRACT_CHANGE: string, CONTRACT_RENT: string, DEBT_COLLECTION_NOTE: string, DECISION: string, FIXED_INITIAL_YEAR_RENT: string, INSPECTION: string, INVOICE_PAYMENT: string, INVOICE_ROW: string, LEASE_AREA: string, MORTGAGE_DOCUMENT: string, OTHER_TENANT: string, PLAN_UNIT: string, PLOT: string, RELATED_LEASE: string, RENT: string, RENT_ADJUSTMENT: string, TENANT: string}}
 */
export const DeleteModalLabels = {
  ADDRESS: 'Haluatko varmasti poistaa osoitteen?',
  BASIS_OF_RENT: 'Haluatko varmasti poistaa vuokranperusteen?',
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
  MORTGAGE_DOCUMENT: 'Haluatko varmasti poistaa panttikirjan?',
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
 * @type {{ADDRESS: string, BASIS_OF_RENT: string, COLLECTION_COURT_DECISION: string, COLLECTION_LETTER: string, COLLECTION_NOTE: string, CONDITION: string, CONSTRUCTABILITY: string, CONTRACT: string, CONTRACT_CHANGE: string, CONTRACT_RENT: string, DEBT_COLLECTION_NOTE: string, DECISION: string, FIXED_INITIAL_YEAR_RENT: string, INSPECTION: string, INVOICE_PAYMENT: string, INVOICE_ROW: string, LEASE_AREA: string, MORTGAGE_DOCUMENT: string, OTHER_TENANT: string, PLAN_UNIT: string, PLOT: string, RELATED_LEASE: string, RENT: string, RENT_ADJUSTMENT: string, TENANT: string}}
 */
export const DeleteModalTitles = {
  ADDRESS: 'Poista osoite',
  BASIS_OF_RENT: 'Poista vuokranperuste',
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
  MORTGAGE_DOCUMENT: 'Poista panttikirja',
  OTHER_TENANT: 'Poista laskunsaaja/yhteyshenkilö',
  PLAN_UNIT: 'Poista kaavayksikkö',
  PLOT: 'Poista kiinteistö/määräala',
  RELATED_LEASE: 'Poista liitos',
  RENT: 'Poista vuokra',
  RENT_ADJUSTMENT: 'Poista alennus/korotus',
  TENANT: 'Poista vuokralainen',
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
 * @type {{UNVERIFIED: string, REQUIRES_MEASURES: string, COMPLETE: string,}}
 */
export const ConstructabilityStatus = {
  UNVERIFIED: 'unverified',
  REQUIRES_MEASURES: 'requires_measures',
  COMPLETE: 'complete',
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
 * @type {{ARCHIVE_AREA: string, CONSTRUCTABILITY: string, CONTRACTS: string, CREATE_COLLECTION_LETTER: string, CREATE_LEASE: string, DEBT_COLLECTION: string, DECISIONS: string, INSPECTION: string, INVOICE_EDIT: string, INVOICE_NEW: string, LEASE_AREAS: string, LEASE_INFO: string, REFUND: string, RENTS: string, SEARCH: string, SUMMARY: string, TENANTS: string}}
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
  LEASE_INFO: 'lease-info-form',
  REFUND: 'refund-form',
  RENTS: 'rents-form',
  SEARCH: 'lease-search-form',
  SUMMARY: 'summary-form',
  TENANTS: 'tenants-form',
};
