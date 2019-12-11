// @flow

/**
 * Lease statistics report field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const LeaseStatisticReportPaths = {
  START_DATE: 'lease',
  END_DATE: 'lease',
  LEASE_STATE: 'lease',
  ONLY_ACTIVE_LEASES: 'lease',
};

/**
 * Lease statistics report field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const LeaseStatisticReportTitles = {
  LEASE_STATISTICS_REPORT: 'Vuokrauksen tilastoraportti',
  START_DATE: 'Alkupvm',
  END_DATE: 'Loppupvm',
  LEASE_STATE: 'Tyyppi',
  ONLY_ACTIVE_LEASES: 'Olotila',
};

/**
 * Lease invoicing confirmation report titles.
 * @readonly
 * @enum {string}
 */
export const LeaseInvoicingReportTitles = {
  TYPE: 'Tyyppi',
  LEASE_ID: 'Vuokraustunnus',
  START_DATE: 'Vuokrauksen alkupvm',
  END_DATE: 'Vuokrauksen loppupvm',
  ERROR_MESSAGE: 'Virheteksti',
};

/**
 * Leaseinvoicing report paths
 * @readonly
 * @enum {string}
 */
export const LeaseInvoicingReportPaths = {
  TYPE: 'type.title',
  LEASE_ID: 'leaseId',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  ERROR_MESSAGE: 'errorMessage',
};
