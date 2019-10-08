// @flow

/**
 * Create lease statistics report field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const LeaseStatisticReportPaths = {
  START_DATE: 'start_date',
  END_DATE: 'end_date',
  LEASE_STATE: 'lease_state',
  ONLY_ACTIVE_LEASES: 'only_active_leases',
};

/**
 * Create lease statistics report field titles enumerable.
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
