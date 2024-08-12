import get from "lodash/get";
import { isDirty } from "redux-form";
import { FormNames, TableSortOrder } from "@/enums";
import { getContentLeaseIdentifier, getContentLeaseOption } from "@/leases/helpers";
import { getContentUser } from "@/users/helpers";
import { convertStrToDecimalNumber, getApiResponseResults } from "@/util/helpers";
import { getIsEditMode } from "@/infillDevelopment/selectors";
import { removeSessionStorageItem } from "@/util/storage";
import { getContentLeaseAreasFeatures, getContentPlanUnitFeatures, getContentLeasePlotsFeatures } from "@/leases/helpers";
import type { LeafletGeoJson } from "types";
import type { RootState } from "@/root/types";

/**
 * Get infill development compensation list results
 * @param {Object} apiResponse
 * @param {Object} query
 * @returns {Object[]}
 */
export const getContentInfillDevelopmentListResults = (content: any) => {
  return getApiResponseResults(content).map(item => {
    const leases = get(item, 'infill_development_compensation_leases', []);
    return {
      id: item.id,
      name: item.name,
      detailed_plan_identifier: item.detailed_plan_identifier,
      leaseIdentifiers: leases.map(lease => getContentLeaseIdentifier(lease.lease)),
      state: item.state
    };
  });
};

/**
 * Get infill development compensation lease attachments content
 * @param {Object} lease
 * @return {Object[]}
 */
export const getContentAttachments = (lease: Record<string, any>): Array<Record<string, any>> => {
  return get(lease, 'attachments', []).map(item => {
    return {
      id: item.id,
      file: item.file,
      filename: item.filename,
      uploaded_at: item.uploaded_at,
      uploader: item.uploader
    };
  });
};

/**
 * Get infill development compensation lease decisions content
 * @param {Object} lease
 * @return {Object[]}
 */
export const getContentDecisions = (lease: Record<string, any>): Array<Record<string, any>> => {
  return get(lease, 'decisions', []).map(item => {
    return {
      id: item.id,
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id') || item.decision_maker,
      decision_date: item.decision_date,
      section: item.section
    };
  });
};

/**
 * Get infill development compensation lease intended uses content
 * @param {Object} lease
 * @return {Object[]}
 */
export const getContentIntendedUses = (lease: Record<string, any>): Array<Record<string, any>> => {
  return get(lease, 'intended_uses', []).map(item => {
    return {
      id: item.id,
      intended_use: get(item, 'intended_use.id') || item.intended_use,
      floor_m2: item.floor_m2,
      amount_per_floor_m2: item.amount_per_floor_m2
    };
  });
};

/**
 * Get infill development compensation leases content
 * @param {Object} infillDevelopment
 * @return {Object[]}
 */
export const getContentInfillDevelopmentLeases = (infillDevelopment: Record<string, any>): Array<Record<string, any>> => {
  return get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => {
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
      attachments: getContentAttachments(lease)
    };
  });
};

/**
 * Get infill development compensation content
 * @param {Object} infillDevelopment
 * @return {Object}
 */
export const getContentInfillDevelopment = (infillDevelopment: Record<string, any>): Record<string, any> => {
  return {
    id: infillDevelopment.id,
    name: infillDevelopment.name,
    detailed_plan_identifier: infillDevelopment.detailed_plan_identifier,
    reference_number: infillDevelopment.reference_number,
    state: infillDevelopment.state,
    user: getContentUser(infillDevelopment.user),
    lease_contract_change_date: infillDevelopment.lease_contract_change_date,
    note: infillDevelopment.note,
    infill_development_compensation_leases: getContentInfillDevelopmentLeases(infillDevelopment)
  };
};

/**
 * Get copy of infill development compensation lease decisions
 * @param {Object} lease
 * @return {Object[]}
 */
export const getCopyOfDecisions = (lease: Record<string, any>): Array<Record<string, any>> => {
  return get(lease, 'decisions', []).map(item => {
    return {
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id') || item.decision_maker,
      decision_date: item.decision_date,
      section: item.section
    };
  });
};

/**
 * Get copy of infill development compensation lease intended uses
 * @param {Object} lease
 * @return {Object[]}
 */
export const getCopyOfIntendedUses = (lease: Record<string, any>): Array<Record<string, any>> => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map(item => {
    return {
      intended_use: get(item, 'intended_use.id') || item.intended_use,
      floor_m2: item.floor_m2,
      amount_per_floor_m2: item.amount_per_floor_m2
    };
  });
};

/**
 * Get copy of infill development compensation leases
 * @param {Object} infillDevelopment
 * @return {Object}
 */
export const getCopyOfInfillDevelopmentLeases = (infillDevelopment: Record<string, any>): Array<Record<string, any>> => {
  return get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => {
    return {
      lease: getContentLeaseOption(lease.lease),
      decisions: getCopyOfDecisions(lease),
      intended_uses: getCopyOfIntendedUses(lease),
      monetary_compensation_amount: lease.monetary_compensation_amount,
      compensation_investment_amount: lease.compensation_investment_amount,
      increase_in_value: lease.increase_in_value,
      part_of_the_increase_in_value: lease.part_of_the_increase_in_value,
      discount_in_rent: lease.discount_in_rent,
      year: lease.year,
      sent_to_sap_date: lease.sent_to_sap_date,
      paid_date: lease.paid_date,
      note: lease.note
    };
  });
};

/**
 * Get copy of infill development compensation
 * @param {Object} infillDevelopment
 * @return {Object}
 */
export const getCopyOfInfillDevelopment = (infillDevelopment: Record<string, any>) => {
  return {
    name: infillDevelopment.name,
    detailed_plan_identifier: infillDevelopment.detailed_plan_identifier,
    reference_number: infillDevelopment.reference_number,
    state: infillDevelopment.state,
    user: getContentUser(infillDevelopment.user),
    lease_contract_change_date: infillDevelopment.lease_contract_change_date,
    note: infillDevelopment.note,
    infill_development_compensation_leases: getCopyOfInfillDevelopmentLeases(infillDevelopment)
  };
};

/**
 * Get infill development compensation lease decisions payload
 * @param {Object} lease
 * @return {Object[]}
 */
export const getPayloadDecisions = (lease: Record<string, any>): Array<Record<string, any>> => {
  return get(lease, 'decisions', []).map(item => {
    return {
      id: item.id,
      reference_number: item.reference_number,
      decision_maker: item.decision_maker,
      decision_date: item.decision_date,
      section: item.section
    };
  });
};

/**
 * Get infill development compensation lease intended uses payload
 * @param {Object} lease
 * @return {Object[]}
 */
export const getPayloadIntendedUses = (lease: Record<string, any>): Array<Record<string, any>> => {
  const intendedUses = get(lease, 'intended_uses', []);
  return intendedUses.map(item => {
    return {
      id: item.id,
      intended_use: item.intended_use,
      floor_m2: convertStrToDecimalNumber(item.floor_m2),
      amount_per_floor_m2: convertStrToDecimalNumber(item.amount_per_floor_m2)
    };
  });
};

/**
 * Get infill development compensation leases payload
 * @param {Object} infillDevelopment
 * @return {Object[]}
 */
export const getPayloadInfillDevelopmentLeases = (infillDevelopment: Record<string, any>): Array<Record<string, any>> => {
  return get(infillDevelopment, 'infill_development_compensation_leases', []).map(lease => {
    return {
      id: lease.id,
      lease: get(lease, 'lease.value'),
      decisions: getPayloadDecisions(lease),
      intended_uses: getPayloadIntendedUses(lease),
      monetary_compensation_amount: convertStrToDecimalNumber(lease.monetary_compensation_amount),
      compensation_investment_amount: convertStrToDecimalNumber(lease.compensation_investment_amount),
      increase_in_value: convertStrToDecimalNumber(lease.increase_in_value),
      part_of_the_increase_in_value: convertStrToDecimalNumber(lease.part_of_the_increase_in_value),
      discount_in_rent: convertStrToDecimalNumber(lease.discount_in_rent),
      year: lease.year,
      sent_to_sap_date: lease.sent_to_sap_date,
      paid_date: lease.paid_date,
      note: lease.note
    };
  });
};

/**
 * Get infill development compensation payload
 * @param {Object} infillDevelopment
 * @return {Object}
 */
export const getPayloadInfillDevelopment = (infillDevelopment: Record<string, any>): Record<string, any> => {
  return {
    id: infillDevelopment.id,
    name: infillDevelopment.name,
    detailed_plan_identifier: infillDevelopment.detailed_plan_identifier,
    reference_number: infillDevelopment.reference_number,
    state: infillDevelopment.state,
    user: getContentUser(infillDevelopment.user),
    lease_contract_change_date: infillDevelopment.lease_contract_change_date,
    note: infillDevelopment.note,
    infill_development_compensation_leases: getPayloadInfillDevelopmentLeases(infillDevelopment)
  };
};

/**
 * Get infill development compensation lease geojson
 * @param {Object} lease
 * @returns {Object}
 */
export const getContentInfillDevelopmentLeaseGeoJson = (lease: Record<string, any>): LeafletGeoJson => {
  const features = [];
  const areas = get(lease, 'lease_areas', []).filter(area => !area.archived_at);
  const areasFeatures = getContentLeaseAreasFeatures(areas);
  features.push(...areasFeatures);
  const plots = [];
  areas.forEach(area => {
    plots.push(...get(area, 'plots', []));
  });
  const plotFeatures = getContentLeasePlotsFeatures(plots);
  features.push(...plotFeatures);
  const planUnits = [];
  areas.forEach(area => {
    planUnits.push(...get(area, 'plan_units', []));
  });
  const planUnitFeatures = getContentPlanUnitFeatures(planUnits);
  features.push(...planUnitFeatures);
  return {
    type: 'FeatureCollection',
    features: features
  };
};

/**
 * Map infill development search filters for API
 * @param {Object} query
 * @returns {Object}
 */
export const mapInfillDevelopmentSearchFilters = (query: Record<string, any>): Record<string, any> => {
  const searchQuery = { ...query
  };

  if (searchQuery.sort_key) {
    searchQuery.ordering = [searchQuery.sort_key];

    if (searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map(key => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

/**
 * Test is infill development compensation form dirty
 * @param {Object} state
 * @returns {boolean}
 */
export const isInfillDevelopmentFormDirty = (state: RootState): boolean => {
  const isEditMode = getIsEditMode(state);
  return isEditMode && isDirty(FormNames.INFILL_DEVELOPMENT)(state);
};

/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
  removeSessionStorageItem('infillDevelopmentId');
};