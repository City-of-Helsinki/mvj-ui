import get from "lodash/get";
import { isDirty } from "redux-form";
import isEmpty from "lodash/isEmpty";
import { FormNames, TableSortOrder } from "enums";
import { convertStrToDecimalNumber } from "util/helpers";
import { getIsEditMode } from "rentbasis/selectors";
import { removeSessionStorageItem } from "util/storage";
import type { LeafletGeoJson } from "types";
import type { RentBasis } from "./types";
import type { RootState } from "root/types";

/**
 * Get basis of rent rent rates
 * @param {Object} rentBasis
 * @returns {Object[]} 
 */
const getContentRentRates = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'rent_rates', []).map(item => {
    return {
      id: item.id,
      build_permission_type: get(item, 'build_permission_type.id') || item.build_permission_type,
      amount: item.amount,
      area_unit: item.area_unit
    };
  });
};

/**
 * Get basis of rent property identifiers
 * @param {Object} rentBasis
 * @returns {Object[]} 
 */
export const getContentPropertyIdentifiers = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'property_identifiers', []).map(item => {
    return {
      id: item.id,
      identifier: item.identifier
    };
  });
};

/**
 * Get basis of rent decisions
 * @param {Object} rentBasis
 * @returns {Object[]} 
 */
const getContentDecisions = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'decisions', []).map(item => {
    return {
      id: item.id,
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id'),
      decision_date: item.decision_date,
      section: item.section
    };
  });
};

/**
 * Get basis of rent content
 * @param {Object} rentBasis
 * @returns {Object} 
 */
export const getContentRentBasis = (content: Record<string, any>): Record<string, any> => {
  return {
    id: content.id,
    plot_type: get(content, 'plot_type.id') || content.plot_type,
    start_date: content.start_date,
    end_date: content.end_date,
    detailed_plan_identifier: content.detailed_plan_identifier,
    management: content.management,
    financing: content.financing,
    lease_rights_end_date: content.lease_rights_end_date,
    index: content.index,
    note: content.note,
    rent_rates: getContentRentRates(content),
    property_identifiers: getContentPropertyIdentifiers(content),
    decisions: getContentDecisions(content)
  };
};

/**
 * Get copy of basis of rent rent rates
 * @param {Object} rentBasis
 * @returns {Object[]}
 */
const getContentCopiedRentRates = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'rent_rates', []).map(item => {
    return {
      build_permission_type: get(item, 'build_permission_type.id') || item.build_permission_type,
      amount: item.amount,
      area_unit: item.area_unit
    };
  });
};

/**
 * Get copy of basis of rent property identifiers
 * @param {Object} rentBasis
 * @returns {Object[]}
 */
const getCopyOfPropertyIdentifiers = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'property_identifiers', []).map(item => {
    return {
      identifier: item.identifier
    };
  });
};

/**
 * Get copy of basis of rent decisions
 * @param {Object} rentBasis
 * @returns {Object[]}
 */
const getCopyOfDecisions = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'decisions', []).map(item => {
    return {
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id'),
      decision_date: item.decision_date,
      section: item.section
    };
  });
};

/**
 * Get copy of basis of rent
 * @param {Object} rentBasis
 * @returns {Object}
 */
export const getCopyOfRentBasis = (rentBasis: Record<string, any>): Record<string, any> => {
  return {
    plot_type: get(rentBasis, 'plot_type.id') || rentBasis.plot_type,
    start_date: rentBasis.start_date,
    end_date: rentBasis.end_date,
    detailed_plan_identifier: rentBasis.detailed_plan_identifier,
    management: rentBasis.management,
    financing: rentBasis.financing,
    lease_rights_end_date: rentBasis.lease_rights_end_date,
    index: rentBasis.index,
    note: rentBasis.note,
    rent_rates: getContentCopiedRentRates(rentBasis),
    property_identifiers: getCopyOfPropertyIdentifiers(rentBasis),
    decisions: getCopyOfDecisions(rentBasis)
  };
};

/**
 * Get basis of rent property identifiers payload
 * @param {Object} rentBasis
 * @returns {Object[]}
 */
const getPayloadPropertyIdentifiers = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'property_identifiers', []).map(item => {
    return {
      id: item.id,
      identifier: item.identifier
    };
  });
};

/**
 * Get basis of rent decisions payload
 * @param {Object} rentBasis
 * @returns {Object[]}
 */
const getPayloadDecisions = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'decisions', []).map(item => {
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
 * Get rent rates payload
 * @param {Object} rentBasis
 * @returns {Object[]}
 */
const getPayloadRentRates = (rentBasis: Record<string, any>): Array<Record<string, any>> => {
  return get(rentBasis, 'rent_rates', []).map(item => {
    return {
      id: item.id,
      build_permission_type: item.build_permission_type,
      amount: convertStrToDecimalNumber(item.amount),
      area_unit: item.area_unit
    };
  });
};

/**
 * Get basis of rent payload
 * @param {Object} rentBasis
 * @returns {Object}
 */
export const getPayloadRentBasis = (rentBasis: Record<string, any>): Record<string, any> => {
  return {
    id: rentBasis.id,
    plot_type: rentBasis.plot_type,
    start_date: rentBasis.start_date,
    end_date: rentBasis.end_date,
    property_identifiers: getPayloadPropertyIdentifiers(rentBasis),
    detailed_plan_identifier: rentBasis.detailed_plan_identifier,
    management: rentBasis.management,
    financing: rentBasis.financing,
    lease_rights_end_date: rentBasis.lease_rights_end_date,
    index: rentBasis.index,
    note: rentBasis.note,
    decisions: getPayloadDecisions(rentBasis),
    rent_rates: getPayloadRentRates(rentBasis)
  };
};

/**
 * Get basis of rent geojson
 * @param {Object} rentBasis
 * @returns {Object}
 */
export const getContentRentBasisGeoJson = (rentBasis: RentBasis): LeafletGeoJson => {
  const features = [];
  const geometry = rentBasis.geometry;

  if (!isEmpty(geometry)) {
    features.push({ ...geometry,
      properties: {
        id: rentBasis.id,
        detailed_plan_identifier: rentBasis.detailed_plan_identifier,
        end_date: rentBasis.end_date,
        financing: rentBasis.financing,
        index: rentBasis.index,
        lease_rights_end_date: rentBasis.lease_rights_end_date,
        management: rentBasis.management,
        plot_type: get(rentBasis, 'plot_type.id'),
        property_identifiers: rentBasis.property_identifiers,
        start_date: rentBasis.start_date
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features: features
  };
};

/**
* Map rent basis search filters for API
* @param {Object} query
* @returns {Object}
*/
export const mapRentBasisSearchFilters = (query: Record<string, any>): Record<string, any> => {
  const searchQuery = { ...query
  };

  if (searchQuery.sort_key) {
    if (searchQuery.sort_key === 'start_date') {
      searchQuery.ordering = ['start_date', 'end_date'];
    } else if (searchQuery.sort_key === 'end_date') {
      searchQuery.ordering = ['end_date', 'start_date'];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if (searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map(key => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

/**
 * Test is basis of rent form dirty
 * @param {Object} state
 * @returns {boolean}
 */
export const isRentBasisFormDirty = (state: RootState): boolean => {
  const isEditMode = getIsEditMode(state);
  return isEditMode && isDirty(FormNames.RENT_BASIS)(state);
};

/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.RENT_BASIS);
  removeSessionStorageItem('rentBasisId');
};