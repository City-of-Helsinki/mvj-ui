import format from "date-fns/format";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { store } from "@/index";
import { RentAdjustmentAmountTypes, RentCycles, RentDueDateTypes, RentTypes } from "./enums";
import { getRentWarnings, getTenantRentShareWarnings, getTenantShareWarnings } from "@/leases/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { dateGreaterOrEqual } from "@/components/form/validations";
import { isInvoiceBillingPeriodRequired } from "@/invoices/helpers";
import { required } from "@/components/form/validations";

/**
 * Validate summary form
 * @param {Object} values
 * @returns {Object}
 */
export const validateSummaryForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const endDateError = dateGreaterOrEqual(values.end_date, values.start_date);

  if (endDateError) {
    errors.end_date = endDateError;
  }

  return errors;
};

/**
 * Get error of single tenants
 * @param {Object} tenant
 * @returns {Object}
 */
const getTenantError = (tenant: Record<string, any>): Record<string, any> | null | undefined => {
  const endDateError = dateGreaterOrEqual(tenant.end_date, tenant.start_date);
  return endDateError ? {
    end_date: endDateError
  } : undefined;
};

/**
 * Get tenants errors
 * @param {Object[]} tenants
 * @returns {Object[]}
 */
const getTenantsErrors = (tenants: Array<Record<string, any>>): Array<Record<string, any>> => {
  const errorArray = [];
  tenants.forEach((tenant, tenantIndex) => {
    const tenantErrors: any = {};
    const tenantError = getTenantError(get(tenant, 'tenant', {}));

    if (tenantError) {
      tenantErrors.tenant = tenantError;
    }

    const contactPersons = get(tenant, 'contact_persons', []);
    const contactPersonErrors = [];
    contactPersons.forEach((contactPerson, contactPersonIndex) => {
      const error = getTenantError(contactPerson);

      if (error) {
        contactPersonErrors[contactPersonIndex] = error;
      }
    });

    if (contactPersonErrors.length) {
      tenantErrors.contact_persons = contactPersonErrors;
    }

    const billingPersons = get(tenant, 'billing_persons', []);
    const billingPersonErrors = [];
    billingPersons.forEach((billingPerson, billingPersonIndex) => {
      const error = getTenantError(billingPerson);

      if (error) {
        billingPersonErrors[billingPersonIndex] = error;
      }
    });

    if (billingPersonErrors.length) {
      tenantErrors.billing_persons = billingPersonErrors;
    }

    if (!isEmpty(tenantErrors)) {
      errorArray[tenantIndex] = tenantErrors;
    }
  });
  return errorArray;
};

/**
 * Validate tenants form
 * @param {Object} values
 * @returns {Object}
 */
export const validateTenantForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const {
    tenants,
    tenantsArchived
  } = values;
  const tenantArrayErrors = getTenantsErrors(tenants);

  if (tenantArrayErrors.length) {
    errors.tenants = tenantArrayErrors;
  }

  const tenantArchivedArrayErrors = getTenantsErrors(tenantsArchived);

  if (tenantArchivedArrayErrors.length) {
    errors.tenantsArchived = tenantArchivedArrayErrors;
  }

  return errors;
};

/**
 * Get warning of tenants form
 * @param {Object} values
 * @returns {Object}
 */
export const warnTenantForm = (values: Record<string, any>): Record<string, any> => {
  const warnings: any = {};
  const leaseAttributes = getLeaseAttributes(store.getState());
  const {
    tenants
  } = values;
  const tenantWarnings = getTenantShareWarnings(tenants);
  tenantWarnings.push(...getTenantRentShareWarnings(tenants, leaseAttributes));

  if (tenantWarnings.length) {
    warnings.tenantWarnings = tenantWarnings;
  }

  return warnings;
};

/**
 * Get errors of fixed initial year rents
 * @param {Object} rent
 * @param {Object[]} fixedInitialYearRents
 * @returns {Object[]}
 */
const getFixedInitialYearRentsErrors = (rent: Record<string, any>, fixedInitialYearRents: Array<Record<string, any>>): Array<Record<string, any>> => {
  const errorArray = [];
  fixedInitialYearRents.forEach((item, index) => {
    let endDateError = dateGreaterOrEqual(item.end_date, item.start_date);

    if (!endDateError && (rent.type === RentTypes.INDEX || rent.type === RentTypes.INDEX2022 || rent.type === RentTypes.MANUAL)) {
      switch (rent.cycle) {
        case RentCycles.JANUARY_TO_DECEMBER:
          endDateError = item.end_date ? format(new Date(item.end_date), 'dd.MM') !== '31.12' ? 'Loppupvm tulee olla 31.12.' : null : null;
          break;

        case RentCycles.APRIL_TO_MARCH:
          endDateError = item.end_date ? format(new Date(item.end_date), 'dd.MM') !== '31.03' ? 'Loppupvm tulee olla 31.3.' : null : null;
          break;
      }
    }

    if (endDateError) {
      errorArray[index] = {
        end_date: endDateError
      };
    }
  });
  return errorArray;
};

/**
 * Get errors of contract rents
 * @param {Object[]} rents
 * @returns {Object[]}
 */
const getContractRentsErrors = (rents: Array<Record<string, any>>): Array<Record<string, any>> => {
  const errorArray = [];
  rents.forEach((rent, rentIndex) => {
    const endDateError = dateGreaterOrEqual(rent.end_date, rent.start_date);

    if (endDateError) {
      errorArray[rentIndex] = {
        end_date: endDateError
      };
    }
  });
  return errorArray;
};

/**
 * Get errors of rent adjustments
 * @param {Object[]} rentAdjustments
 * @returns {Object[]}
 */
const getRentAdjustmentsErrors = (rentAdjustments: Array<Record<string, any>>): Array<Record<string, any>> => {
  const errorArray = [];
  rentAdjustments.forEach((adjustment, adjustmentIndex) => {
    if (adjustment.amount_type !== RentAdjustmentAmountTypes.AMOUNT_TOTAL) {
      const endDateError = dateGreaterOrEqual(adjustment.end_date, adjustment.start_date);

      if (endDateError) {
        errorArray[adjustmentIndex] = {
          end_date: endDateError
        };
      }
    }
  });
  return errorArray;
};

/**
 * Get errors of a single rent
 * @param {Object} rent
 * @returns {Object}
 */
const getRentErrors = (rent: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const endDateError = dateGreaterOrEqual(rent.end_date, rent.start_date);

  if (endDateError) {
    errors.end_date = endDateError;
  }

  const equalizationEndDateError = dateGreaterOrEqual(rent.equalization_end_date, rent.equalization_start_date);

  if (equalizationEndDateError) {
    errors.equalization_end_date = equalizationEndDateError;
  }

  const fixedInitialYearRentErrors = getFixedInitialYearRentsErrors(rent, get(rent, 'fixed_initial_year_rents', []));

  if (fixedInitialYearRentErrors.length) {
    errors.fixed_initial_year_rents = fixedInitialYearRentErrors;
  }

  const contractRentErrors = getContractRentsErrors(get(rent, 'contract_rents', []));

  if (contractRentErrors.length) {
    errors.contract_rents = contractRentErrors;
  }

  const rentAdjustmentErrors = getRentAdjustmentsErrors(get(rent, 'rent_adjustments', []));

  if (rentAdjustmentErrors.length) {
    errors.rent_adjustments = rentAdjustmentErrors;
  }

  return errors;
};

/**
 * Get errors of all rents
 * @param {Object[]} rents
 * @returns {Object[]}
 */
const getRentsErrors = (rents: Array<Record<string, any>>): Array<Record<string, any>> => {
  const errorArray = [];
  rents.forEach((rent, rentIndex) => {
    const rentErrors = getRentErrors(rent);

    if (!isEmpty(rentErrors)) {
      errorArray[rentIndex] = rentErrors;
    }
  });
  return errorArray;
};

/**
 * Validate rent form
 * @param {Object} values
 * @returns {Object}
 */
export const validateRentForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const {
    rents,
    rentsArchived
  } = values;
  const rentArrayErrors = getRentsErrors(rents);

  if (rentArrayErrors.length) {
    errors.rents = rentArrayErrors;
  }

  const rentArchivedArrayErrors = getRentsErrors(rentsArchived);

  if (rentArchivedArrayErrors.length) {
    errors.rentsArchived = rentArchivedArrayErrors;
  }

  return errors;
};

/**
 * Get warning of rent form
 * @param {Object} values
 * @returns {Object}
 */
export const warnRentForm = (values: Record<string, any>): Record<string, any> => {
  const warnings: any = {};
  const {
    rents
  } = values;
  const rentWarnings = getRentWarnings(rents);

  if (rentWarnings.length) {
    warnings.rentWarnings = rentWarnings;
  }

  return warnings;
};

/**
 * Get contract collateral errors
 * @param {Object[]} collatarals
 * @returns {Object[]}
 */
const getContractCollateralErrors = (collaterals: Array<Record<string, any>>): Array<Record<string, any>> => {
  const errorArray = [];
  collaterals.forEach((collateral, collateralIndex) => {
    const endDateError = dateGreaterOrEqual(collateral.end_date, collateral.start_date);

    if (endDateError) {
      errorArray[collateralIndex] = endDateError ? {
        end_date: endDateError
      } : undefined;
    }
  });
  return errorArray;
};

/**
 * Get contract errors
 * @param {Object} contract
 * @returns {Object}
 */
const getContractErrors = (contract: Record<string, any>): Record<string, any> | null | undefined => {
  const errors: any = {};
  const collateralErrors = getContractCollateralErrors(get(contract, 'collaterals', []));

  if (collateralErrors.length) {
    errors.collaterals = collateralErrors;
  }

  return errors;
};

/**
 * Validate contract form
 * @param {Object} values
 * @returns {Object}
 */
export const validateContractForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const contracts = get(values, 'contracts', []);
  const contractErrors = [];
  contracts.forEach((contract, contractIndex) => {
    const error = getContractErrors(contract);

    if (error) {
      contractErrors[contractIndex] = error;
    }
  });

  if (contractErrors.length) {
    errors.contracts = contractErrors;
  }

  return errors;
};

/**
 * Validate invoice form
 * @param {Object} values
 * @returns {Object}
 */
export const validateInvoiceForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const billingPeriodRequired = isInvoiceBillingPeriodRequired(values.rows);
  const startDateError = billingPeriodRequired ? required(values.billing_period_start_date) : undefined;
  const endDateError = (billingPeriodRequired ? required(values.billing_period_end_date) : undefined) || dateGreaterOrEqual(values.billing_period_end_date, values.billing_period_start_date);
  errors.billing_period_start_date = startDateError;
  errors.billing_period_end_date = endDateError;
  return errors;
};

/**
 * Validate stepped discount form
 * @param {Object} values
 * @returns {Object}
 */
export const validateSteppedDiscountForm = (values: Record<string, any>): Record<string, any> => {
  const errors: any = {};
  const endDateError = dateGreaterOrEqual(values.end_date, values.start_date);

  if (endDateError) {
    errors.end_date = endDateError;
  }

  return errors;
};
