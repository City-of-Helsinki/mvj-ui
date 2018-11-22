// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {dateGreaterOrEqual} from '$components/form/validations';

const getLitigantError = (litigant: Object) => {
  const endDateError =  dateGreaterOrEqual(litigant.end_date, litigant.start_date);
  return endDateError ? {end_date: endDateError} : undefined;
};

const getLitigantArrayErrors = (litigants: Array<Object>) => {
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

export const validateLitigantForm = (values: Object) => {
  const errors = {};
  const {activeLitigants, archivedLitigants} = values;

  const activeLitigantArrayErrors = getLitigantArrayErrors(activeLitigants);
  if(activeLitigantArrayErrors.length) {
    errors.activeLitigants = activeLitigantArrayErrors;
  }

  const archivedLitigantArrayErrors = getLitigantArrayErrors(archivedLitigants);
  if(archivedLitigantArrayErrors.length) {
    errors.archivedLitigants = archivedLitigantArrayErrors;
  }

  return errors;
};
