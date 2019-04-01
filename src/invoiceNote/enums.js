// @flow

/**
 * Invoice note paths enumerable.
 *
 * @type {{}}
 */
export const InvoiceNoteFieldPaths = {
  ID: 'id',
  CREATED_AT: 'created_at',
  MODIFIED_AT: 'modified_at',
  BILLING_PERIOD_START_DATE: 'billing_period_start_date',
  BILLING_PERIOD_END_DATE: 'billing_period_end_date',
  NOTES: 'notes',
  LEASE: 'lease',
};

/**
 * Invoice note titles enumerable.
 *
 * @type {{}}
 */
export const InvoiceNoteFieldTitles = {
  ID: 'Id',
  CREATED_AT: 'Luotu',
  MODIFIED_AT: 'Muokattu',
  BILLING_PERIOD_START_DATE: 'Laskutuksen alkupvm',
  BILLING_PERIOD_END_DATE: 'Laskutuksen loppupvm',
  NOTES: 'Tiedote',
  LEASE: 'Vuokratunnus',
};
