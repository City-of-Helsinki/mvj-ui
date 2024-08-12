import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { dateGreaterOrEqual } from "@/components/form/validations";
import { required } from "@/components/form/validations";

/** 
 * Get litigant errors
 * @param {Object} litigant
 * @return {Object} 
 */
const getLitigantError = (litigant: Record<string, any>): Record<string, any> | null | undefined => {
  const endDateError = dateGreaterOrEqual(litigant.end_date, litigant.start_date);
  return endDateError ? {
    end_date: endDateError
  } : undefined;
};

/** 
 * Get litigants errors
 * @param {Object[]} litigants
 * @return {Object} 
 */
const getLitigantsErrors = (litigants: Array<Record<string, any>>): Array<Record<string, any>> => {
  const errorArray = [];
  litigants.forEach((litigant, litigantIndex) => {
    const litigantErrors: any = {};
    const litigantError = getLitigantError(get(litigant, 'litigant', {}));

    if (litigantError) {
      litigantErrors.litigant = litigantError;
    }

    const litigantContacts = get(litigant, 'landuseagreementlitigantcontact_set', []);
    const litigantContactArrayErrors = [];
    litigantContacts.forEach((contact, contactIndex) => {
      const error = getLitigantError(contact);

      if (error) {
        litigantContactArrayErrors[contactIndex] = error;
      }
    });

    if (litigantContactArrayErrors.length) {
      litigantErrors.landuseagreementlitigantcontact_set = litigantContactArrayErrors;
    }

    if (!isEmpty(litigantErrors)) {
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
export const validateLitigantForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const {
    activeLitigants,
    archivedLitigants
  } = values;
  const activeLitigantArrayErrors = getLitigantsErrors(activeLitigants);

  if (activeLitigantArrayErrors.length) {
    errors.activeLitigants = activeLitigantArrayErrors;
  }

  const archivedLitigantArrayErrors = getLitigantsErrors(archivedLitigants);

  if (archivedLitigantArrayErrors.length) {
    errors.archivedLitigants = archivedLitigantArrayErrors;
  }

  return errors;
};

/**
 * Validate land use invoice form
 * @param {Object} values
 * @returns {Object}
 */
export const validateLandUseInvoiceForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const recipient = required(values.recipient);
  errors.recipient = recipient;
  return errors;
};