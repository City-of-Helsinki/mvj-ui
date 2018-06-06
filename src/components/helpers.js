// @flow
import get from 'lodash/get';
import {
  RentExplanationSubjectType,
  RentSubItemSubjectType,
  RentSubItemType,
} from './enums';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

export const getRentsTotalAmount = (rents: Array<Object>) => {
  let amount = 0;
  rents.forEach((rent) => {
    amount += getRentAmount(rent);
  });
  return amount;
};

const getRentAmount = (rent: Object) => {
  return Number(get(rent, 'amount', 0));
};

export const getRentExplanationAmount = (explanation: Object) => {
  return Number(get(explanation, 'amount', 0));
};

export const getRentSubItemAmount = (subItem: Object) => {
  return Number(get(subItem, 'amount', 0));
};

export const getRentExplanationDescription = (explanation: Object, attributes: Attributes) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const baseAmountPeriodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.base_amount_period');
  const subjectType = get(explanation, 'subject.subject_type');
  const type = get(explanation, 'subject.type');

  switch(subjectType) {
    case RentExplanationSubjectType.CONTRACT_RENT:
      return `Sopimusvuokra - ${get(explanation, 'subject.intended_use.name')} (${get(explanation, 'subject.base_amount')} € ${getLabelOfOption(baseAmountPeriodOptions, get(explanation, 'subject.base_amount_period'))})`;
    case RentExplanationSubjectType.FIXED_INITIAL_YEAR_RENT:
      return 'Kiinteä alkuvuosivuokra';
    case RentExplanationSubjectType.RENT:
      return `${getLabelOfOption(typeOptions, type)}`;
    default:
      return null;
  }
};

export const getRentSubItemDescription = (subItem: Object, attributes: Attributes) => {
  const rentAdjustementTypeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.type');
  const amountTypeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.amount_type');
  const subjectType = get(subItem, 'subject.subject_type');
  const type = get(subItem, 'subject.type');

  switch(subjectType) {
    case RentSubItemSubjectType.INDEX:
      return `Indeksitarkistus (vertailuluku ${get(subItem, 'subject.number')})`;
    case RentSubItemSubjectType.RENT_ADJUSTMENT:
      switch (type) {
        case RentSubItemType.DISCOUNT:
          return `${getLabelOfOption(rentAdjustementTypeOptions, get(subItem, 'subject.type'))} (${get(subItem, 'subject.full_amount')} ${getLabelOfOption(amountTypeOptions, get(subItem, 'subject.amount_type'))})`;
        case RentSubItemType.INCREASE:
          return `${getLabelOfOption(rentAdjustementTypeOptions, get(subItem, 'subject.type'))} (${get(subItem, 'subject.full_amount')} ${getLabelOfOption(amountTypeOptions, get(subItem, 'subject.amount_type'))})`;
        default:
          return 0;
      }
    default:
      return 0;
  }
};
