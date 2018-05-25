// @flow
import get from 'lodash/get';
import {
  RentExplanationSubjectType,
  RentExplanationType,
  RentSubItemSubjectType,
  RentSubItemType,
} from './enums';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

export const getRentAmount = (rent: Object) => {
  const explanations = get(rent, 'explanation.items');
  let amount = 0;
  explanations.forEach((explanation) => {
    amount += getRentExplanationAmount(explanation);
  });
  return amount;
};

export const getRentExplanationAmount = (explanation: Object) => {
  const subjectType = get(explanation, 'subject.subject_type');
  const type = get(explanation, 'subject.type');

  switch(subjectType) {
    case RentExplanationSubjectType.CONTRACT_RENT:
      return Number(get(explanation, 'amount'));
    case RentExplanationSubjectType.FIXED_INITIAL_YEAR_RENT:
      return Number(get(explanation, 'amount'));
    case RentExplanationSubjectType.RENT:
      switch (type) {
        case RentExplanationType.FIXED:
          return Number(get(explanation, 'amount'));
        case RentExplanationType.FREE:
          return Number(get(explanation, 'amount'));
        case RentExplanationType.INDEX:
          return Number(get(explanation, 'amount'));
        case RentExplanationType.ONE_TIME:
          return Number(get(explanation, 'subject.amount'));
        default:
          return 0;
      }
    default:
      return 0;
  }
};

export const getRentSubItemAmount = (subItem: Object) => {
  const subjectType = get(subItem, 'subject.subject_type');
  const type = get(subItem, 'subject.type');

  switch(subjectType) {
    case RentSubItemSubjectType.INDEX:
      return Number(get(subItem, 'amount'));
    case RentSubItemSubjectType.RENT_ADJUSTMENT:
      switch (type) {
        case RentSubItemType.DISCOUNT:
          return Number(get(subItem, 'amount'));
        case RentSubItemType.INCREASE:
          return Number(get(subItem, 'amount'));
        default:
          return 0;
      }
    default:
      return 0;
  }
};

export const getRentExplanationDescription = (explanation: Object, attributes: Attributes) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const baseAmountPeriodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.base_amount_period');
  const indexTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.index_type');
  const subjectType = get(explanation, 'subject.subject_type');
  const type = get(explanation, 'subject.type');

  switch(subjectType) {
    case RentExplanationSubjectType.CONTRACT_RENT:
      return `Sopimusvuokra - ${get(explanation, 'subject.intended_use.name')} (${get(explanation, 'subject.base_amount')} € ${getLabelOfOption(baseAmountPeriodOptions, get(explanation, 'subject.base_amount_period'))})`;
    case RentExplanationSubjectType.FIXED_INITIAL_YEAR_RENT:
      return 'Kiinteä alkuvuosivuokra';
    case RentExplanationSubjectType.RENT:
      switch (type) {
        case RentExplanationType.FIXED:
          return `${getLabelOfOption(typeOptions, type)}`;
        case RentExplanationType.FREE:
          return `${getLabelOfOption(typeOptions, type)}`;
        case RentExplanationType.INDEX:
          return `${getLabelOfOption(typeOptions, type)} - ${getLabelOfOption(indexTypeOptions, get(explanation, 'subject.index_type'))}`;
        case RentExplanationType.ONE_TIME:
          return `${getLabelOfOption(typeOptions, type)}`;
        default:
          return null;
      }
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
      return `Indeksitarkistus (vertailuluku ${get(subItem, 'subject.year')})`;
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
