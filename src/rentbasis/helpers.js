// @flow
import get from 'lodash/get';
import {isDirty} from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import {FormNames} from './enums';
import {getIsEditMode} from '$src/rentbasis/selectors';
import {removeSessionStorageItem} from '$util/storage';

import type {RentBasis} from './types';

const getContentRentRates = (rentBasis: Object) => {
  const items = get(rentBasis, 'rent_rates', []);

  return items.map((item) => {
    return {
      id: item.id || undefined,
      build_permission_type: get(item, 'build_permission_type.id') || get(item, 'build_permission_type'),
      amount: get(item, 'amount'),
      area_unit: get(item, 'area_unit'),
    };
  });
};

const getContentPropertyIdentifiers = (rentBasis: Object) => {
  const items = get(rentBasis, 'property_identifiers', []);

  return items.map((item) => {
    return {
      id: item.id || undefined,
      identifier: get(item, 'identifier'),
    };
  });
};

const getContentDecisions = (rentBasis: Object) => {
  const items = get(rentBasis, 'decisions', []);

  return items.map((item) => {
    return {
      id: item.id || undefined,
      reference_number: get(item, 'reference_number'),
      decision_maker: get(item, 'decision_maker.id'),
      decision_date: get(item, 'decision_date'),
      section: get(item, 'section'),
    };
  });
};


export const getContentRentBasis = (content: Object) => {
  return {
    id: content.id || undefined,
    plot_type: get(content, 'plot_type.id') || get(content, 'plot_type'),
    start_date: get(content, 'start_date'),
    end_date: get(content, 'end_date'),
    detailed_plan_identifier: get(content, 'detailed_plan_identifier'),
    management: get(content, 'management'),
    financing: get(content, 'financing'),
    lease_rights_end_date: get(content, 'lease_rights_end_date'),
    index: get(content, 'index'),
    note: get(content, 'note'),
    rent_rates: getContentRentRates(content),
    property_identifiers: getContentPropertyIdentifiers(content),
    decisions: getContentDecisions(content),
  };
};

const getContentCopiedRentRates = (rentBasis: Object) => {
  const items = get(rentBasis, 'rent_rates', []);

  return items.map((item) => {
    return {
      build_permission_type: get(item, 'build_permission_type.id') || get(item, 'build_permission_type'),
      amount: get(item, 'amount'),
      area_unit: get(item, 'area_unit'),
    };
  });
};

const getContentCopiedPropertyIdentifiers = (rentBasis: Object) => {
  const items = get(rentBasis, 'property_identifiers', []);

  return items.map((item) => {
    return {
      identifier: get(item, 'identifier'),
    };
  });
};

const getContentCopiedDecisions = (rentBasis: Object) => {
  const items = get(rentBasis, 'decisions', []);

  return items.map((item) => {
    return {
      reference_number: get(item, 'reference_number'),
      decision_maker: get(item, 'decision_maker.id'),
      decision_date: get(item, 'decision_date'),
      section: get(item, 'section'),
    };
  });
};

export const getContentCopiedRentBasis = (content: Object) => {
  return {
    plot_type: get(content, 'plot_type.id') || get(content, 'plot_type'),
    start_date: get(content, 'start_date'),
    end_date: get(content, 'end_date'),
    detailed_plan_identifier: get(content, 'detailed_plan_identifier'),
    management: get(content, 'management'),
    financing: get(content, 'financing'),
    lease_rights_end_date: get(content, 'lease_rights_end_date'),
    index: get(content, 'index'),
    note: get(content, 'note'),
    rent_rates: getContentCopiedRentRates(content),
    property_identifiers: getContentCopiedPropertyIdentifiers(content),
    decisions: getContentCopiedDecisions(content),
  };
};

// Functions to get infill development compensation lease areas GeoJSON
export const getContentRentBasisGeoJson = (rentBasis: RentBasis) => {
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

export const isRentBasisFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && isDirty(FormNames.RENT_BASIS)(state);
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.RENT_BASIS);
  removeSessionStorageItem('rentBasisId');
};
