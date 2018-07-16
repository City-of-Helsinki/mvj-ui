// @flow
import get from 'lodash/get';

import {FormNames} from '$src/infillDevelopment/enums';
import {getContentLeaseIdentifier, getContentLeaseOption, getContentUser} from '$src/leases/helpers';
import {removeSessionStorageItem} from '$util/storage';

export const getContentIntendedUses = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: get(item, 'floor_m2'),
      amount_per_floor_m2: get(item, 'amount_per_floor_m2'),
    };
  });
};

export const getContentInfillDevelopmentCompensationLeaseItem = (lease: Object) => {
  return {
    id: get(lease, 'id'),
    lease: getContentLeaseOption(get(lease, 'lease')),
    intended_uses: getContentIntendedUses(lease),
    monetary_compensation_amount: get(lease, 'monetary_compensation_amount'),
    compensation_investment_amount: get(lease, 'compensation_investment_amount'),
    increase_in_value: get(lease, 'increase_in_value'),
    part_of_the_increase_in_value: get(lease, 'part_of_the_increase_in_value'),
    discount_in_rent: get(lease, 'discount_in_rent'),
    year: get(lease, 'year'),
    sent_to_sap_date: get(lease, 'sent_to_sap_date'),
    paid_date: get(lease, 'paid_date'),
    // note: get(lease, 'note'),
    // attachments: get(lease, 'attachments', []),
  };
};

export const getContentInfillDevelopment = (infillDevelopment: Object) => {
  return {
    id: get(infillDevelopment, 'id'),
    name: get(infillDevelopment, 'name'),
    detailed_plan_identifier: get(infillDevelopment, 'detailed_plan_identifier'),
    reference_number: get(infillDevelopment, 'reference_number'),
    state: get(infillDevelopment, 'state'),
    user: getContentUser(get(infillDevelopment, 'user')),
    lease_contract_change_date: get(infillDevelopment, 'lease_contract_change_date'),
    note: get(infillDevelopment, 'note'),
    infill_development_compensation_leases: get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => getContentInfillDevelopmentCompensationLeaseItem(lease)),
  };
};

export const getContentInfillDevelopmentList = (content: Object) => {
  const items = get(content, 'results', []);
  return items.map((item) => {
    const leases = get(item, 'infill_development_compensation_leases', []);
    return {
      id: get(item, 'id'),
      name: get(item, 'name'),
      detailed_plan_identifier: get(item, 'detailed_plan_identifier'),
      leaseIdentifiers: leases.map((lease) => getContentLeaseIdentifier(lease.lease)),
      state: get(item, 'state'),
    };
  });
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
  removeSessionStorageItem('infillDevelopmentId');
};
