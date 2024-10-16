import get from "lodash/get";
import { convertStrToDecimalNumber } from "@/util/helpers";

/**
 * Get lease create charge rows payload data for API
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getPayloadLeaseCreateChargeRows = (invoice: Record<string, any>): Array<Record<string, any>> => {
  return get(invoice, 'rows', []).map(row => ({
    receivable_type: row.receivable_type,
    amount: convertStrToDecimalNumber(row.amount)
  }));
};

/**
 * Get lease create charge endpoint payload for API
 * @param {Object} invoice
 * @returns {Object}
 */
export const getPayloadLeaseCreateCharge = (invoice: Record<string, any>): Record<string, any> => {
  return {
    lease: invoice.lease,
    type: invoice.type,
    due_date: invoice.due_date,
    billing_period_end_date: invoice.billing_period_end_date,
    billing_period_start_date: invoice.billing_period_start_date,
    notes: invoice.notes,
    rows: getPayloadLeaseCreateChargeRows(invoice)
  };
};

/**
 * Get fieldAttributes with filtered choices from reveivable types
 * @param {Object} fieldAttributes
 * @param {Object} receivableTypes
 * @returns {Object}
 */
export const receivableTypesFromAttributes = (fieldAttributes: Record<string, any>, receivableTypes: Record<string, any>): Record<string, any> => {
  const newChoices = fieldAttributes.choices
    .filter(choice => receivableTypes.find(type => type.is_active && type.id === choice.value))
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
  const newFieldAttributes = { ...fieldAttributes,
    choices: newChoices
  };
  return newFieldAttributes;
};

/**
 * Get receivable type from rows data
 * @param {Array<Object>} rows
 * @returns {Number}
 */
export const receivableTypeFromRows = (rows: Array<Record<string, any>>): Number | null | undefined => {
  return rows ? rows[0].receivable_type : null;
};