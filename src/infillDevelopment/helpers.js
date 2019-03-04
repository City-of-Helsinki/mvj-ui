// @flow
import get from 'lodash/get';
import {isDirty} from 'redux-form';

import {TableSortOrder} from '$components/enums';
import {FormNames} from '$src/infillDevelopment/enums';
import {getContentLeaseIdentifier, getContentLeaseOption} from '$src/leases/helpers';
import {getContentUser} from '$src/users/helpers';
import {convertStrToDecimalNumber} from '$util/helpers';
import {getIsEditMode} from '$src/infillDevelopment/selectors';
import {removeSessionStorageItem} from '$util/storage';
import {getContentLeaseAreasFeatures, getContentPlanUnitFeatures, getContentLeasePlotsFeatures} from '$src/leases/helpers';

export const getContentAttachments = (lease: Object) => {
  const items = get(lease, 'attachments', []);
  return items.map((item) => {
    return {
      id: item.id,
      file: item.file,
      filename: item.filename,
      uploaded_at: item.uploaded_at,
      uploader: item.uploader,
    };
  });
};

export const getContentDecisions = (lease: Object) => {
  const items = get(lease, 'decisions', []);
  return items.map((item) => {
    return {
      id: item.id,
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id') || get(item, 'decision_maker'),
      decision_date: item.decision_date,
      section: item.section,
    };
  });
};

export const getContentDecisionsCopy = (lease: Object) => {
  const items = get(lease, 'decisions', []);
  return items.map((item) => {
    return {
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id') || get(item, 'decision_maker'),
      decision_date: item.decision_date,
      section: item.section,
    };
  });
};

export const getContentDecisionsForDb = (lease: Object) => {
  const items = get(lease, 'decisions', []);
  return items.map((item) => {
    return {
      id: item.id,
      reference_number: item.reference_number,
      decision_maker: item.decision_maker,
      decision_date: item.decision_date,
      section: item.section,
    };
  });
};

export const getContentIntendedUses = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      id: item.id,
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: item.floor_m2,
      amount_per_floor_m2: item.amount_per_floor_m2,
    };
  });
};

export const getContentIntendedUsesCopy = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: item.floor_m2,
      amount_per_floor_m2: item.amount_per_floor_m2,
    };
  });
};

export const getContentIntendedUsesForDb = (lease: Object) => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map((item) => {
    return {
      id: item.id,
      intended_use: item.intended_use,
      floor_m2: convertStrToDecimalNumber(item.floor_m2),
      amount_per_floor_m2: convertStrToDecimalNumber(item.amount_per_floor_m2),
    };
  });
};

export const getContentLeaseItem = (lease: Object) => {
  return {
    id: lease.id,
    lease: getContentLeaseOption(lease.lease),
    decisions: getContentDecisions(lease),
    intended_uses: getContentIntendedUses(lease),
    monetary_compensation_amount: lease.monetary_compensation_amount,
    compensation_investment_amount: lease.compensation_investment_amount,
    increase_in_value: lease.increase_in_value,
    part_of_the_increase_in_value: lease.part_of_the_increase_in_value,
    discount_in_rent: lease.discount_in_rent,
    year: lease.year,
    sent_to_sap_date: lease.sent_to_sap_date,
    paid_date: lease.paid_date,
    note: lease.note,
    attachments: getContentAttachments(lease),
  };
};

export const getContentLeaseItemCopy = (lease: Object) => {
  return {
    lease: getContentLeaseOption(lease.lease),
    decisions: getContentDecisionsCopy(lease),
    intended_uses: getContentIntendedUsesCopy(lease),
    monetary_compensation_amount: lease.monetary_compensation_amount,
    compensation_investment_amount: lease.compensation_investment_amount,
    increase_in_value: lease.increase_in_value,
    part_of_the_increase_in_value: lease.part_of_the_increase_in_value,
    discount_in_rent: lease.discount_in_rent,
    year: lease.year,
    sent_to_sap_date: lease.sent_to_sap_date,
    paid_date: lease.paid_date,
    note: lease.note,
  };
};

export const getContentLeaseItemForDb = (lease: Object) => {
  return {
    id: lease.id,
    lease: get(lease, 'lease.value'),
    decisions: getContentDecisionsForDb(lease),
    intended_uses: getContentIntendedUsesForDb(lease),
    monetary_compensation_amount: convertStrToDecimalNumber(lease.monetary_compensation_amount),
    compensation_investment_amount: convertStrToDecimalNumber(lease.compensation_investment_amount),
    increase_in_value: convertStrToDecimalNumber(lease.increase_in_value),
    part_of_the_increase_in_value: convertStrToDecimalNumber(lease.part_of_the_increase_in_value),
    discount_in_rent: convertStrToDecimalNumber(lease.discount_in_rent),
    year: lease.year,
    sent_to_sap_date: lease.sent_to_sap_date,
    paid_date: lease.paid_date,
    note: lease.note,
  };
};

export const getContentInfillDevelopment = (infillDevelopment: Object) => {
  return {
    id: infillDevelopment.id,
    name: infillDevelopment.name,
    detailed_plan_identifier: infillDevelopment.detailed_plan_identifier,
    reference_number: infillDevelopment.reference_number,
    state: infillDevelopment.state,
    user: getContentUser(infillDevelopment.user),
    lease_contract_change_date: infillDevelopment.lease_contract_change_date,
    note: infillDevelopment.note,
    infill_development_compensation_leases: get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => getContentLeaseItem(lease)),
  };
};

export const getContentInfillDevelopmentCopy = (infillDevelopment: Object) => {
  return {
    name: infillDevelopment.name,
    detailed_plan_identifier: infillDevelopment.detailed_plan_identifier,
    reference_number: infillDevelopment.reference_number,
    state: infillDevelopment.state,
    user: getContentUser(infillDevelopment.user),
    lease_contract_change_date: infillDevelopment.lease_contract_change_date,
    note: infillDevelopment.note,
    infill_development_compensation_leases: get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => getContentLeaseItemCopy(lease)),
  };
};

export const getContentInfillDevelopmentForDb = (infillDevelopment: Object) => {
  return {
    id: infillDevelopment.id,
    name: infillDevelopment.name,
    detailed_plan_identifier: infillDevelopment.detailed_plan_identifier,
    reference_number: infillDevelopment.reference_number,
    state: infillDevelopment.state,
    user: getContentUser(infillDevelopment.user),
    lease_contract_change_date: infillDevelopment.lease_contract_change_date,
    note: infillDevelopment.note,
    infill_development_compensation_leases: get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => getContentLeaseItemForDb(lease)),
  };
};

export const getContentInfillDevelopmentList = (content: Object) => {
  const items = get(content, 'results', []);
  return items.map((item) => {
    const leases = get(item, 'infill_development_compensation_leases', []);
    return {
      id: item.id,
      name: item.name,
      detailed_plan_identifier: item.detailed_plan_identifier,
      leaseIdentifiers: leases.map((lease) => getContentLeaseIdentifier(lease.lease)),
      state: item.state,
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

/**
* Map infill development search filters for API
* @param {Object} query
* @returns {Object}
*/
export const mapInfillDevelopmentSearchFilters = (query: Object) => {
  const searchQuery = {...query};

  if(searchQuery.sort_key) {
    searchQuery.ordering = [searchQuery.sort_key];

    if(searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

export const isInfillDevelopmentFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && isDirty(FormNames.INFILL_DEVELOPMENT)(state);
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
  removeSessionStorageItem('infillDevelopmentId');
};
