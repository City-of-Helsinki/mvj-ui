// @flow
import get from 'lodash/get';
import {isDirty} from 'redux-form';

import {FormNames} from '$src/infillDevelopment/enums';
import {getContentLeaseIdentifier, getContentLeaseOption, getContentUser} from '$src/leases/helpers';
import {formatDecimalNumberForDb} from '$util/helpers';
import {getIsEditMode} from '$src/infillDevelopment/selectors';
import {removeSessionStorageItem} from '$util/storage';
import {getContentLeaseAreasFeatures, getContentPlanUnitFeatures, getContentLeasePlotsFeatures} from '$src/leases/helpers';

export const getContentAttachments = (lease: Object) => {
  const items = get(lease, 'attachments', []);
  return items.map((item) => {
    return {
      id: get(item, 'id'),
      file: get(item, 'file'),
      filename: get(item, 'filename'),
      uploaded_at: get(item, 'uploaded_at'),
      uploader: get(item, 'uploader'),
    };
  });
};

export const getContentDecisions = (lease: Object) => {
  const items = get(lease, 'decisions', []);
  return items.map((item) => {
    return {
      id: get(item, 'id'),
      reference_number: get(item, 'reference_number'),
      decision_maker: get(item, 'decision_maker.id') || get(item, 'decision_maker'),
      decision_date: get(item, 'decision_date'),
      section: get(item, 'section'),
    };
  });
};

export const getContentDecisionsCopy = (lease: Object) => {
  const items = get(lease, 'decisions', []);
  return items.map((item) => {
    return {
      reference_number: get(item, 'reference_number'),
      decision_maker: get(item, 'decision_maker.id') || get(item, 'decision_maker'),
      decision_date: get(item, 'decision_date'),
      section: get(item, 'section'),
    };
  });
};

export const getContentDecisionsForDb = (lease: Object) => {
  const items = get(lease, 'decisions', []);
  return items.map((item) => {
    return {
      id: get(item, 'id'),
      reference_number: get(item, 'reference_number'),
      decision_maker: get(item, 'decision_maker.id') || get(item, 'decision_maker'),
      decision_date: get(item, 'decision_date'),
      section: get(item, 'section'),
    };
  });
};

export const getContentIntendedUses = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      id: get(item, 'id'),
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: get(item, 'floor_m2'),
      amount_per_floor_m2: get(item, 'amount_per_floor_m2'),
    };
  });
};

export const getContentIntendedUsesCopy = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: get(item, 'floor_m2'),
      amount_per_floor_m2: get(item, 'amount_per_floor_m2'),
    };
  });
};

export const getContentIntendedUsesForDb = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      id: get(item, 'id'),
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: formatDecimalNumberForDb(get(item, 'floor_m2')),
      amount_per_floor_m2: formatDecimalNumberForDb(get(item, 'amount_per_floor_m2')),
    };
  });
};

export const getContentLeaseItem = (lease: Object) => {
  return {
    id: get(lease, 'id'),
    lease: getContentLeaseOption(get(lease, 'lease')),
    decisions: getContentDecisions(lease),
    intended_uses: getContentIntendedUses(lease),
    monetary_compensation_amount: get(lease, 'monetary_compensation_amount'),
    compensation_investment_amount: get(lease, 'compensation_investment_amount'),
    increase_in_value: get(lease, 'increase_in_value'),
    part_of_the_increase_in_value: get(lease, 'part_of_the_increase_in_value'),
    discount_in_rent: get(lease, 'discount_in_rent'),
    year: get(lease, 'year'),
    sent_to_sap_date: get(lease, 'sent_to_sap_date'),
    paid_date: get(lease, 'paid_date'),
    note: get(lease, 'note'),
    attachments: getContentAttachments(lease),
  };
};

export const getContentLeaseItemCopy = (lease: Object) => {
  return {
    lease: getContentLeaseOption(get(lease, 'lease')),
    decisions: getContentDecisionsCopy(lease),
    intended_uses: getContentIntendedUsesCopy(lease),
    monetary_compensation_amount: get(lease, 'monetary_compensation_amount'),
    compensation_investment_amount: get(lease, 'compensation_investment_amount'),
    increase_in_value: get(lease, 'increase_in_value'),
    part_of_the_increase_in_value: get(lease, 'part_of_the_increase_in_value'),
    discount_in_rent: get(lease, 'discount_in_rent'),
    year: get(lease, 'year'),
    sent_to_sap_date: get(lease, 'sent_to_sap_date'),
    paid_date: get(lease, 'paid_date'),
    note: get(lease, 'note'),
  };
};

export const getContentLeaseItemForDb = (lease: Object) => {
  return {
    id: get(lease, 'id'),
    lease: get(lease, 'lease.value'),
    decisions: getContentDecisionsForDb(lease),
    intended_uses: getContentIntendedUsesForDb(lease),
    monetary_compensation_amount: formatDecimalNumberForDb(get(lease, 'monetary_compensation_amount')),
    compensation_investment_amount: formatDecimalNumberForDb(get(lease, 'compensation_investment_amount')),
    increase_in_value: formatDecimalNumberForDb(get(lease, 'increase_in_value')),
    part_of_the_increase_in_value: formatDecimalNumberForDb(get(lease, 'part_of_the_increase_in_value')),
    discount_in_rent: formatDecimalNumberForDb(get(lease, 'discount_in_rent')),
    year: get(lease, 'year'),
    sent_to_sap_date: get(lease, 'sent_to_sap_date'),
    paid_date: get(lease, 'paid_date'),
    note: get(lease, 'note'),
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
    infill_development_compensation_leases: get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => getContentLeaseItem(lease)),
  };
};

export const getContentInfillDevelopmentCopy = (infillDevelopment: Object) => {
  return {
    name: get(infillDevelopment, 'name'),
    detailed_plan_identifier: get(infillDevelopment, 'detailed_plan_identifier'),
    reference_number: get(infillDevelopment, 'reference_number'),
    state: get(infillDevelopment, 'state'),
    user: getContentUser(get(infillDevelopment, 'user')),
    lease_contract_change_date: get(infillDevelopment, 'lease_contract_change_date'),
    note: get(infillDevelopment, 'note'),
    infill_development_compensation_leases: get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => getContentLeaseItemCopy(lease)),
  };
};

export const getContentInfillDevelopmentForDb = (infillDevelopment: Object) => {
  return {
    id: get(infillDevelopment, 'id'),
    name: get(infillDevelopment, 'name'),
    detailed_plan_identifier: get(infillDevelopment, 'detailed_plan_identifier'),
    reference_number: get(infillDevelopment, 'reference_number'),
    state: get(infillDevelopment, 'state'),
    user: getContentUser(get(infillDevelopment, 'user')),
    lease_contract_change_date: get(infillDevelopment, 'lease_contract_change_date'),
    note: get(infillDevelopment, 'note'),
    infill_development_compensation_leases: get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => getContentLeaseItemForDb(lease)),
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

// Functions to get infill development compensation lease areas GeoJSON
export const getContentInfillDevelopmentLeaseGeoJson = (lease: Object) => {
  const features = [];

  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);
  const areasFeatures = getContentLeaseAreasFeatures(areas);
  features.push(...areasFeatures);

  const plots = [];
  areas.forEach((area) => {
    plots.push(...get(area, 'plots', []));
  });
  const plotFeatures = getContentLeasePlotsFeatures(plots);
  features.push(...plotFeatures);

  const planUnits = [];
  areas.forEach((area) => {
    planUnits.push(...get(area, 'plan_units', []));
  });
  const planUnitFeatures = getContentPlanUnitFeatures(planUnits);
  features.push(...planUnitFeatures);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

export const isInfillDevelopmentFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && isDirty(FormNames.INFILL_DEVELOPMENT)(state);
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
  removeSessionStorageItem('infillDevelopmentId');
};
