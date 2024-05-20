import { dateGreaterOrEqual } from "src/components/form/validations";

/** 
 * Validate basis of rent form
 * @param {Object} values
 * @returns {Object}
 */
export const validateRentBasisForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const endDateError = dateGreaterOrEqual(values.end_date, values.start_date);

  if (endDateError) {
    errors.end_date = endDateError;
  }

  return errors;
};