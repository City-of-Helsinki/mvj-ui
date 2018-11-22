// @flow
import {dateGreaterOrEqual} from '$components/form/validations';

export const validateRentBasisForm = (values: Object) => {
  const errors = {};
  const endDateError =  dateGreaterOrEqual(values.end_date, values.start_date);

  if (endDateError) {
    errors.end_date = endDateError;
  }

  return errors;
};
