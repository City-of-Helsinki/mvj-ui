// @flow
import get from 'lodash/get';

const getContentRentRates = (rentBasis: Object) => {
  const items = get(rentBasis, 'rent_rates', []);

  return items.map((item) => {
    return {
      id: item.id || undefined,
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      amount: get(item, 'amount'),
      period: get(item, 'period'),
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
      identifier: get(item, 'identifier'),
    };
  });
};

export const getContentRentBasis = (content: Object) => {
  return {
    id: content.id || undefined,
    plot_type: get(content, 'plot_type'),
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
