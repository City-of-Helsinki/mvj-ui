// @flow
import get from 'lodash/get';

import {FormNames} from './enums';
import {removeSessionStorageItem} from '$util/storage';

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

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.RENT_BASIS);
  removeSessionStorageItem('rentBasisId');
};
