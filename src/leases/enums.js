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
 * @type {{ARCHIVE_AREA: string, CONSTRUCTABILITY: string, CONTRACTS: string, CREATE_LEASE: string, DEBT_COLLECTION: string, DECISIONS: string, INSPECTION: string, INVOICE_EDIT: string, INVOICE_NEW: string, LEASE_AREAS: string, LEASE_INFO: string, REFUND: string, RENTS: string, SEARCH: string, SUMMARY: string, TENANTS: string}}
 */
export const FormNames = {
  ARCHIVE_AREA: 'archive-area-form',
  CONSTRUCTABILITY: 'constructability-form',
  CONTRACTS: 'contracts-form',
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
