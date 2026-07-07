/**
 * Lease create charge field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const LeaseCreateChargeFieldPaths = {
  BILLING_PERIOD_END_DATE: "billing_period_end_date",
  BILLING_PERIOD_START_DATE: "billing_period_start_date",
  DUE_DATE: "due_date",
  LEASE: "lease",
  NOTES: "notes",
};

/**
 * Lease create charge rows field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const LeaseCreateChargeRowsFieldPaths = {
  ROWS: "rows",
  AMOUNT: "rows.child.children.amount",
  INTENDED_USE: "rows.child.children.intended_use",
  RECEIVABLE_TYPE: "rows.child.children.receivable_type",
};
