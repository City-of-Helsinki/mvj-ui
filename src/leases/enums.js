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
 * Rent type enumerable.
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
 * @type {{CONSTRUCTABILITY: string, CONTRACTS: string, DECISIONS: string, INSPECTION: string, INVOICE_EDIT: string, INVOICE_NEW: string, LEASE_AREAS: string, LEASE_INFO: string, RENTS: string, SUMMARY: string, TENANTS: string}}
 */
export const FormNames = {
  CONSTRUCTABILITY: 'constructability-form',
  CONTRACTS: 'contracts-form',
  DECISIONS: 'decisions-form',
  INSPECTIONS: 'inspections-form',
  INVOICE_EDIT: 'edit-invoice-form',
  INVOICE_NEW: 'new-invoice-form',
  LEASE_AREAS: 'lease-areas-form',
  LEASE_INFO: 'lease-info-form',
  RENTS: 'rents-form',
  SUMMARY: 'summary-form',
  TENANTS: 'tenants-form',
};
