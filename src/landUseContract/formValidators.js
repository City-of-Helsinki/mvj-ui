// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {dateGreaterOrEqual} from '$components/form/validations';
import {required} from '$components/form/validations';
/** 
 * Get litigant errors
 * @param {Object} litigant
 * @return {Object} 
 */
const getLitigantError = (litigant: Object): ?Object => {
  const endDateError =  dateGreaterOrEqual(litigant.end_date, litigant.start_date);
  
  return endDateError ? {end_date: endDateError} : undefined;
};

/** 
 * Get litigants errors
 * @param {Object[]} litigants
 * @return {Object} 
 */
const getLitigantsErrors = (litigants: Array<Object>): Array<Object> => {
  const errorArray = [];

  litigants.forEach((litigant, litigantIndex) => {
    const litigantErrors = {};

    const litigantError = getLitigantError(get(litigant, 'litigant', {}));
    if(litigantError) {
      litigantErrors.litigant = litigantError;
    }

    const litigantContacts = get(litigant, 'litigantcontact_set', []);
    const litigantContactArrayErrors = [];

    litigantContacts.forEach((contact, contactIndex) => {
      const error = getLitigantError(contact);
      if(error) {
        litigantContactArrayErrors[contactIndex] = error;
      }
    });

    if(litigantContactArrayErrors.length) {
      litigantErrors.litigantcontact_set = litigantContactArrayErrors;
    }

    if(!isEmpty(litigantErrors)) {
      errorArray[litigantIndex] = litigantErrors;
    }
  });

  return errorArray;
};

/** 
 * Validate litigants form
 * @param {Object} values
 * @return {Object} 
 */
export const validateLitigantForm = (values: Object): Object => {
  const errors = {};
  const {activeLitigants, archivedLitigants} = values;

  const activeLitigantArrayErrors = getLitigantsErrors(activeLitigants);
  if(activeLitigantArrayErrors.length) {
    errors.activeLitigants = activeLitigantArrayErrors;
  }

  const archivedLitigantArrayErrors = getLitigantsErrors(archivedLitigants);
  if(archivedLitigantArrayErrors.length) {
    errors.archivedLitigants = archivedLitigantArrayErrors;
  }

  return errors;
};

/**
 * Validate land use invoice form
 * @param {Object} values
 * @returns {Object}
 */
export const validateLandUseInvoiceForm = (values: Object): Object => {
  const errors = {};
  const recipient = required(values.recipient);
  errors.recipient = recipient;
  return errors;
};
