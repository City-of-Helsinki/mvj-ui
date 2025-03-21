/**
 * Lease statistics report field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const LeaseStatisticReportPaths = {
  START_DATE: "lease",
  END_DATE: "lease",
  LEASE_STATE: "lease",
  ONLY_ACTIVE_LEASES: "lease",
};

/**
 * Lease statistics report field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const LeaseStatisticReportTitles = {
  LEASE_STATISTICS_REPORT: "Vuokrauksen tilastoraportti",
  REPORT_TYPE: "Raportti",
  START_DATE: "Alkupvm",
  END_DATE: "Loppupvm",
  START_YEAR: "Alkamis vuosi",
  END_YEAR: "Loppumis vuosi",
  LEASE_STATE: "Tyyppi",
  ONLY_ACTIVE_LEASES: "Olotila",
  INVOICE_STATE: "Laskun tila",
  LEASE_TYPE: "Laskutuslaji",
};

/**
 * Lease invoicing confirmation report titles.
 * @readonly
 * @enum {string}
 */
export const LeaseInvoicingReportTitles = {
  TYPE: "Tyyppi",
  LEASE_ID: "Vuokraustunnus",
  START_DATE: "Vuokrauksen alkupvm",
  END_DATE: "Vuokrauksen loppupvm",
  ERROR_MESSAGE: "Virheteksti",
  AREA: "Alue",
  ADDRESS: "Osoite",
  SUPERVISION_DATE: "Tarkastus pvm",
  DESCRIPTION: "Kuvaus",
  LEASE_TYPE: "Laji",
  COUNT: "Määrä",
  TENANT_NAME: "Vuokralaisen nimi",
  AREA_IDENTIFIER: "Kiinteistötunnus",
  AREA_SQUARE: "Pinta-ala",
  AREA_ADDRESS: "Osoite",
  RENT: "Vuokra",
  TOTAL_AMOUNT: "Pääoma",
  PAID_DATE: "Maksettu pvm",
  RETURNED_DATE: "Palautettu pvm",
  NOTE: "Kommentti",
  NUMBER: "Numero",
  DUE_DATE: "Eräpäivä",
  BILLED_AMOUNT: "Laskutettu määrä",
  OUTSTANDING_AMOUNT: "Maksamaton määrä",
  RECIPIENT_NAME: "Laskunsaaja",
  RECIPIENT_ADDRESS: "Laskunsaajan osoite",
  INVOICE_NUMBER: "Laskun numero",
  PAID_AMOUNT: "Maksettu määrä",
  FILLING_CODE: "Arkistotunnus",
  STATE: "Tila",
  SEND_DATE: "Lähetyspvm",
  INVOICE_COUNT: "Laskujen määrä",
  IS_ESTIMATE: "Onko arvio?",
};

/**
 * Leaseinvoicing report paths
 * @readonly
 * @enum {string}
 */
export const LeaseInvoicingReportPaths = {
  LEASE_ID: "lease_id",
  AREA: "area",
  ADDRESS: "address",
  TYPE: "type",
  SUPERVISION_DATE: "supervision_date",
  DESCRIPTION: "description",
  START_DATE: "start_date",
  END_DATE: "end_date",
  LEASE_TYPE: "lease_type",
  COUNT: "count",
  TENANT_NAME: "tenant_name",
  AREA_IDENTIFIER: "area_identifier",
  AREA_ADDRESS: "area_address",
  RENT: "rent",
  PAID_DATE: "paid_date",
  RETURNED_DATE: "returned_date",
  NOTE: "note",
  NUMBER: "number",
  DUE_DATE: "due_date",
  TOTAL_AMOUNT: "total_amount",
  BILLED_AMOUNT: "billed_amount",
  OUTSTANDING_AMOUNT: "outstanding_amount",
  PAID_AMOUNT: "paid_amount",
  RECIPIENT_NAME: "recipient_name",
  RECIPIENT_ADDRESS: "recipient_address",
  INVOICE_NUMBER: "invoice_number",
  FILLING_CODE: "filling_code",
  STATE: "state",
  SEND_DATE: "send_date",
  INVOICE_COUNT: "invoice_count",
  INVOICE_STATE: "invoice_state",
  IS_ESTIMATE: "is_estimate",
};

/**
 * Leaseinvoicing report types
 * @readonly
 * @enum {string}
 */
export const LeaseInvoicingReportTypes = {
  DECISION_CONDITIONS: "decision_conditions",
  EXTRA_CITY_RENT: "extra_city_rent",
  MONEY_COLLETERALS: "money_collaterals",
  OPEN_INVOICES: "open_invoices",
  INVOICE_PAYMENTS: "invoice_payments",
  INVOICES_IN_PERIOD: "invoices_in_period",
  LASKE_INVOICE_COUNT: "laske_invoice_count",
  LEASE_COUNT: "lease_count",
  LEASE_INVOICING_DISABLED: "lease_invoicing_disabled",
  RENT_FORECAST: "rent_forecast",
  LEASE_STATISTIC: "lease_statistic",
};

/**
 * Lease statistics report value format enumerable
 * @readonly
 * @enum {string}
 */
export const LeaseStatisticReportFormatOptions = {
  AREA: "area",
  BOLD: "bold",
  BOLD_MONEY: "bold_money",
  BOOLEAN: "boolean",
  DATE: "date",
  MONEY: "money",
  PERCENTAGE: "percentage",
};

/**
 * Lease statistics report field label enumerable
 * @readonly
 * @enum {string}
 */
export const LeaseStatisticReportFieldLabels = {
  LEASE_IDENTIFIER: "lease_identifier",
  SUBVENTION_EUROS_PER_YEAR: "subvention_euros_per_year",
};