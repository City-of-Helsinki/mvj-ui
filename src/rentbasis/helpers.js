// @flow
import get from 'lodash/get';
import {isDirty} from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import {FormNames} from './enums';
import {TableSortOrder} from '$components/enums';
import {convertStrToDecimalNumber} from '$util/helpers';
import {getIsEditMode} from '$src/rentbasis/selectors';
import {removeSessionStorageItem} from '$util/storage';

import type {LeafletGeoJson} from '$src/types';
import type {RentBasis} from './types';

const getContentRentRates = (rentBasis: Object) => {
  const items = get(rentBasis, 'rent_rates', []);

  return items.map((item) => {
    return {
      id: item.id || undefined,
      build_permission_type: get(item, 'build_permission_type.id') || item.build_permission_type,
      amount: item.amount,
      area_unit: item.area_unit,
    };
  });
};

const getContentPropertyIdentifiers = (rentBasis: Object) => {
  const items = get(rentBasis, 'property_identifiers', []);

  return items.map((item) => {
    return {
      id: item.id || undefined,
      identifier: item.identifier,
    };
  });
};

const getContentDecisions = (rentBasis: Object) => {
  const items = get(rentBasis, 'decisions', []);

  return items.map((item) => {
    return {
      id: item.id || undefined,
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id'),
      decision_date: item.decision_date,
      section: item.section,
    };
  });
};

export const getContentRentBasis = (content: Object) => {
  return {
    id: content.id || undefined,
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
    decisions: getContentDecisions(content),
  };
};

const getContentCopiedRentRates = (rentBasis: Object) => {
  const items = get(rentBasis, 'rent_rates', []);

  return items.map((item) => {
    return {
      build_permission_type: get(item, 'build_permission_type.id') || item.build_permission_type,
      amount: item.amount,
      area_unit: item.area_unit,
    };
  });
};

const getContentCopiedPropertyIdentifiers = (rentBasis: Object) => {
  const items = get(rentBasis, 'property_identifiers', []);

  return items.map((item) => {
    return {
      identifier: item.identifier,
    };
  });
};

const getContentCopiedDecisions = (rentBasis: Object) => {
  const items = get(rentBasis, 'decisions', []);

  return items.map((item) => {
    return {
      reference_number: item.reference_number,
      decision_maker: get(item, 'decision_maker.id'),
      decision_date: item.decision_date,
      section: item.section,
    };
  });
};

export const getContentCopiedRentBasis = (content: Object) => {
  return {
    plot_type: get(content, 'plot_type.id') || content.plot_type,
    start_date: content.start_date,
    end_date: content.end_date,
    detailed_plan_identifier: content.detailed_plan_identifier,
    management: content.management,
    financing: content.financing,
    lease_rights_end_date: content.lease_rights_end_date,
    index: content.index,
    note: content.note,
    rent_rates: getContentCopiedRentRates(content),
    property_identifiers: getContentCopiedPropertyIdentifiers(content),
    decisions: getContentCopiedDecisions(content),
  };
};

const formatPropertyIdentifiersForDb = (rentBasis: Object) => {
  return get(rentBasis, 'property_identifiers', []).map((item) => {
    return {
      id: item.id || undefined,
      identifier: item.identifier,
    };
  });
};

const formatDecisionsForDb = (rentBasis: Object) => {
  return get(rentBasis, 'decisions', []).map((item) => {
    return {
      id: item.id || undefined,
      reference_number: item.reference_number,
      decision_maker: item.decision_maker,
      decision_date: item.decision_date,
      section: item.section,
    };
  });
};

const formatRentRatesForDb = (rentBasis: Object) => {
  return get(rentBasis, 'rent_rates', []).map((item) => {
    return {
      id: item.id || undefined,
      build_permission_type: item.build_permission_type,
      amount: convertStrToDecimalNumber(item.amount),
      area_unit: item.area_unit,
    };
  });
};

export const formatRentBasisForDb = (rentBasis: Object) => {
  return {
    id: rentBasis.id || undefined,
    plot_type: rentBasis.plot_type,
    start_date: rentBasis.start_date,
    end_date: rentBasis.end_date,
    property_identifiers: formatPropertyIdentifiersForDb(rentBasis),
    detailed_plan_identifier: rentBasis.detailed_plan_identifier,
    management: rentBasis.management,
    financing: rentBasis.financing,
    lease_rights_end_date: rentBasis.lease_rights_end_date,
    index: rentBasis.index,
    note: rentBasis.note,
    decisions: formatDecisionsForDb(rentBasis),
    rent_rates: formatRentRatesForDb(rentBasis),
  };
};

// Functions to get infill development compensation lease areas GeoJSON
export const getContentRentBasisGeoJson = (rentBasis: RentBasis): LeafletGeoJson => {
  const features = [];
  const geometry = rentBasis.geometry;

  if(!isEmpty(geometry)) {
    features.push({
      ...geometry,
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
        start_date: rentBasis.start_date,
      },
    });
  }

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

/**
* Map rent basis search filters for API
* @param {Object} query
* @returns {Object}
*/
export const mapRentBasisSearchFilters = (query: Object) => {
  const searchQuery = {...query};

  if(searchQuery.sort_key) {
    if(searchQuery.sort_key === 'start_date') {
      searchQuery.ordering = [
        'start_date',
        'end_date',
      ];
    } else if(searchQuery.sort_key === 'end_date') {
      searchQuery.ordering = [
        'end_date',
        'start_date',
      ];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if(searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

export const isRentBasisFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && isDirty(FormNames.RENT_BASIS)(state);
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.RENT_BASIS);
  removeSessionStorageItem('rentBasisId');
};
