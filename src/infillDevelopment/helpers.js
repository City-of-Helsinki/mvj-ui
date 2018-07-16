// @flow
import get from 'lodash/get';

import {FormNames} from '$src/infillDevelopment/enums';
import {getContentLeaseIdentifier, getContentLeaseOption} from '$src/leases/helpers';
import {removeSessionStorageItem} from '$util/storage';

export const getContentIntendedUses = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      intended_use: get(item, 'intended_use'),
      km2: get(item, 'km2'),
      ekm2: get(item, 'ekm2'),
    };
  });
};

export const getContentLeaseItem = (lease: Object) => {
  return {
    id: get(lease, 'id'),
    lease: getContentLeaseOption(lease),
    intended_uses: getContentIntendedUses(lease),
    cash_compensation: get(lease, 'cash_compensation'),
    replacement_investments: get(lease, 'replacement_investments'),
    total: get(lease, 'total'),
    increase_in_value: get(lease, 'increase_in_value'),
    share_in_increase_in_value: get(lease, 'share_in_increase_in_value'),
    rent_reduction: get(lease, 'rent_reduction'),
    estimated_payment_year: get(lease, 'estimated_payment_year'),
    sent_to_sap_date: get(lease, 'sent_to_sap_date'),
    payment_date: get(lease, 'payment_date'),
    note: get(lease, 'note'),
    attachments: get(lease, 'attachments', []),
  };
};

export const getContentInfillDevelopment = (infillDevelopment: Object) => {
  return {
    id: get(infillDevelopment, 'id'),
    name: get(infillDevelopment, 'name'),
    detailed_plan_identifier: get(infillDevelopment, 'detailed_plan_identifier'),
    // plan_reference_number: get(infillDevelopment, 'plan_reference_number'),
    state: get(infillDevelopment, 'state'),
    // decision_type: get(infillDevelopment, 'decision_type'),
    // state_date: get(infillDevelopment, 'state_date'),
    // responsible_person: getContentUser(get(infillDevelopment, 'responsible_person')),
    // nagotiation_state: get(infillDevelopment, 'nagotiation_state'),
    // change_of_lease_date: get(infillDevelopment, 'change_of_lease_date'),
    // note: get(infillDevelopment, 'note'),
    // leases: get(infillDevelopment, 'leases', []).map(lease => getContentLeaseItem(lease)),
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
