// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {RentAdjustmentAmountTypes, RentDueDateTypes, RentTypes} from './enums';
import {dateGreaterOrEqual} from '$components/form/validations';

export const validateSummaryForm = (values: Object) => {
  const errors = {};
  const endDateError =  dateGreaterOrEqual(values.end_date, values.start_date);

  if (endDateError) {
    errors.end_date = endDateError;
  }

  return errors;
};

const getTenantError = (tenant: Object) => {
  const endDateError =  dateGreaterOrEqual(tenant.end_date, tenant.start_date);
  return endDateError ? {end_date: endDateError} : undefined;
};

const getTenantArrayErrors = (tenants: Array<Object>) => {
  const errorArray = [];

  tenants.forEach((tenant, tenantIndex) => {
    const tenantErrors = {};

    const tenantError = getTenantError(get(tenant, 'tenant', {}));
    if(tenantError) {
      tenantErrors.tenant = tenantError;
    }

    const contactPersons = get(tenant, 'contact_persons', []);
    const contactPersonErrors = [];

    contactPersons.forEach((contactPerson, contactPersonIndex) => {
      const error = getTenantError(contactPerson);
      if(error) {
        contactPersonErrors[contactPersonIndex] = error;
      }
    });

    if(contactPersonErrors.length) {
      tenantErrors.contact_persons = contactPersonErrors;
    }

    const billingPersons = get(tenant, 'billing_persons', []);
    const billingPersonErrors = [];

    billingPersons.forEach((billingPerson, billingPersonIndex) => {
      const error = getTenantError(billingPerson);
      if(error) {
        billingPersonErrors[billingPersonIndex] = error;
      }
    });

    if(billingPersonErrors.length) {
      tenantErrors.billing_persons = billingPersonErrors;
    }

    if(!isEmpty(tenantErrors)) {
      errorArray[tenantIndex] = tenantErrors;
    }
  });

  return errorArray;
};

export const validateTenantForm = (values: Object) => {
  const errors = {};
  const {tenants, tenantsArchived} = values;

  const tenantArrayErrors = getTenantArrayErrors(tenants);
  if(tenantArrayErrors.length) {
    errors.tenants = tenantArrayErrors;
  }

  const tenantArchivedArrayErrors = getTenantArrayErrors(tenantsArchived);
  if(tenantArchivedArrayErrors.length) {
    errors.tenantsArchived = tenantArchivedArrayErrors;
  }

  return errors;
};

const getFixedInitialYearRentArrayErrors = (rents: Array<Object>) => {
  const errorArray = [];

  rents.forEach((rent, rentIndex) => {
    const endDateError = dateGreaterOrEqual(rent.end_date, rent.start_date);

    if(endDateError) {
      errorArray[rentIndex] = {end_date: endDateError};
    }
  });

  return errorArray;
};

const getContractRentArrayErrors = (rents: Array<Object>) => {
  const errorArray = [];

  rents.forEach((rent, rentIndex) => {
    const endDateError = dateGreaterOrEqual(rent.end_date, rent.start_date);

    if(endDateError) {
      errorArray[rentIndex] = {end_date: endDateError};
    }
  });

  return errorArray;
};

const getRentAdjustmentArrayErrors = (rentAdjustments: Array<Object>) => {
  const errorArray = [];

  rentAdjustments.forEach((adjustment, adjustmentIndex) => {
    if(adjustment.amount_type !== RentAdjustmentAmountTypes.AMOUNT_TOTAL) {
      const endDateError = dateGreaterOrEqual(adjustment.end_date, adjustment.start_date);

      if(endDateError) {
        errorArray[adjustmentIndex] = {end_date: endDateError};
      }
    }
  });

  return errorArray;
};

const getRentErrors = (rent: Object) => {
  const errors = {};
  const endDateError =  dateGreaterOrEqual(rent.end_date, rent.start_date);
  if(endDateError) {
    errors.end_date = endDateError;
  }

  const equalizationEndDateError =  dateGreaterOrEqual(rent.equalization_end_date, rent.equalization_start_date);
  if(equalizationEndDateError) {
    errors.equalization_end_date = equalizationEndDateError;
  }

  const fixedInitialYearRentErrors = getFixedInitialYearRentArrayErrors(get(rent, 'fixed_initial_year_rents', []));
  if(fixedInitialYearRentErrors.length) {
    errors.fixed_initial_year_rents = fixedInitialYearRentErrors;
  }

  const contractRentErrors = getContractRentArrayErrors(get(rent, 'contract_rents', []));
  if(contractRentErrors.length) {
    errors.contract_rents = contractRentErrors;
  }

  const rentAdjustmentErrors = getRentAdjustmentArrayErrors(get(rent, 'rent_adjustments', []));
  if(rentAdjustmentErrors.length) {
    errors.rent_adjustments = rentAdjustmentErrors;
  }

  if(rent.type && rent.type !== RentTypes.FREE) {
    if(rent.due_dates_type !== RentDueDateTypes.CUSTOM &&
      (rent.seasonal_start_day || rent.seasonal_start_month || rent.seasonal_end_day || rent.seasonal_end_month)) {
      errors.seasonalDates = 'Kausivuokran voi määrittää vain jos laskutusjako on erikseen määritelty';
    } else if((rent.seasonal_start_day || rent.seasonal_start_month || rent.seasonal_end_day || rent.seasonal_end_month) &&
      (!rent.seasonal_start_day || !rent.seasonal_start_month || !rent.seasonal_end_day || !rent.seasonal_end_month)) {
      errors.seasonalDates = 'Kaikki kausivuokran kentät tulee olla valittuina';
    } else if((Number(rent.seasonal_end_month) < Number(rent.seasonal_start_month)) ||
      (Number(rent.seasonal_end_month) === Number(rent.seasonal_start_month) && Number(rent.seasonal_end_day) < Number(rent.seasonal_start_day))) {
      errors.seasonalDates = 'Kausivuokran alkupvm ei voi olla ennen loppupvm:ää';
    }
  }

  return errors;
};

const getRentArrayErrors = (rents: Array<Object>) => {
  const errorArray = [];

  rents.forEach((rent, rentIndex) => {
    const rentErrors = getRentErrors(rent);

    if(!isEmpty(rentErrors)) {
      errorArray[rentIndex] = rentErrors;
    }
  });

  return errorArray;
};

export const validateRentForm = (values: Object) => {
  const errors = {};
  const {rents, rentsArchived} = values;

  const rentArrayErrors = getRentArrayErrors(rents);
  if(rentArrayErrors.length) {
    errors.rents = rentArrayErrors;
  }

  const rentArchivedArrayErrors = getRentArrayErrors(rentsArchived);
  if(rentArchivedArrayErrors.length) {
    errors.rentsArchived = rentArchivedArrayErrors;
  }

  return errors;
};

const getContractErrors = (contract: Object) => {
  const endDateError =  dateGreaterOrEqual(contract.collateral_end_date, contract.collateral_start_date);
  return endDateError ? {collateral_end_date: endDateError} : undefined;
};

export const validateContractForm = (values: Object) => {
  const errors = {};
  const contracts = get(values, 'contracts', []);
  const contractErrors = [];

  contracts.forEach((contract, contractIndex) => {
    const error = getContractErrors(contract);

    if(error) {
      contractErrors[contractIndex] = error;
    }
  });

  if(contractErrors.length) {
    errors.contracts = contractErrors;
  }

  return errors;
};

export const validateInvoiceForm = (values: Object) => {
  const errors = {};
  const endDateError =  dateGreaterOrEqual(values.billing_period_end_date, values.billing_period_start_date);

  if (endDateError) {
    errors.billing_period_end_date = endDateError;
  }

  return errors;
};
