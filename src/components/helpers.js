// @flow
import get from 'lodash/get';
import {
  RentExplanationSubjectType,
  RentSubItemSubjectType,
  RentSubItemType,
} from './enums';
import {TenantContactType} from '$src/leases/enums';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

import type {Attributes} from '$src/leases/types';
import type {BillingPeriod, BillingPeriodInvoice, PreviewInvoices} from '$src/previewInvoices/types';

export const getRentsTotalAmount = (rents: Array<Object>) => {
  let amount = 0;
  rents.forEach((rent) => {
    amount += getRentAmount(rent);
  });
  return amount;
};

const getRentAmount = (rent: Object) => {
  const amount = get(rent, 'amount');
  return amount !== null ? Number(amount) : null;
};

export const getRentExplanationAmount = (explanation: Object) => {
  const amount = get(explanation, 'amount');
  return amount !== null ? Number(amount) : null;
};

export const getRentSubItemAmount = (subItem: Object) => {
  const amount = get(subItem, 'amount');
  return amount !== null ? Number(amount) : null;
};

export const getRentExplanationDescription = (explanation: Object, attributes: Attributes) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const periodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.period');
  const baseAmountPeriodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.base_amount_period');
  const subjectType = get(explanation, 'subject.subject_type');
  const type = get(explanation, 'subject.type');

  switch(subjectType) {
    case RentExplanationSubjectType.CONTRACT_RENT:
      if(get(explanation, 'subject.base_amount') !== null) {
        return `Sopimusvuokra - ${get(explanation, 'subject.intended_use.name')} (${get(explanation, 'subject.base_amount')} € ${getLabelOfOption(baseAmountPeriodOptions, get(explanation, 'subject.base_amount_period'))})`;
      }
      return `Sopimusvuokra - ${get(explanation, 'subject.intended_use.name')} (${get(explanation, 'subject.amount')} € ${getLabelOfOption(periodOptions, get(explanation, 'subject.period'))})`;
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
    case RentSubItemSubjectType.RATIO:
      return get(subItem, 'subject.description') || '-' ;
    case RentSubItemSubjectType.NEW_BASE_RENT:
      return get(subItem, 'subject.description') || '-' ;
    case RentSubItemSubjectType.RENT_ADJUSTMENT:
      switch (type) {
        case RentSubItemType.DISCOUNT:
          return `${getLabelOfOption(rentAdjustementTypeOptions, get(subItem, 'subject.type'))} (${get(subItem, 'subject.full_amount')} ${getLabelOfOption(amountTypeOptions, get(subItem, 'subject.amount_type'))})`;
        case RentSubItemType.INCREASE:
          return `${getLabelOfOption(rentAdjustementTypeOptions, get(subItem, 'subject.type'))} (${get(subItem, 'subject.full_amount')} ${getLabelOfOption(amountTypeOptions, get(subItem, 'subject.amount_type'))})`;
        default:
          return '-';
      }
    default:
      return '-';
  }
};

const getContentBillingPeriodInvoiceRowTenant = (row: Object) => {
  const tenant = get(row, 'tenant.tenantcontact_set').find((tenant) => tenant.type === TenantContactType.TENANT);
  return {
    contact: tenant ? tenant.contact : null,
    shareDenominator: row.tenant.share_denominator,
    shareNumerator: row.tenant.share_numerator,
  };
};

const getContentBillingPeriodInvoiceRows = (invoice: BillingPeriodInvoice) => {
  return get(invoice, 'rows', []).map((row) => {
    return {
      amount: row.amount,
      description: row.description,
      receivableType: row.receivable_type,
      tenant: getContentBillingPeriodInvoiceRowTenant(row),
    };
  });
};

const getContentBillingPeriodInvoice = (invoice: BillingPeriodInvoice) => {
  return {
    billedAmount: invoice.billed_amount,
    dueDate: invoice.due_date,
    endDate: invoice.billing_period_end_date,
    recipient: invoice.recipient,
    rows: getContentBillingPeriodInvoiceRows(invoice),
    startDate: invoice.billing_period_start_date,
    type: invoice.type,
  };
};

const getContentBillingPeriod = (billingPeriods: BillingPeriod) => {
  return {
    endDate: get(billingPeriods, '[0].billing_period_end_date'),
    explanations: get(billingPeriods, '[0].explanations'),
    invoices: billingPeriods.map((billingPeriod) => getContentBillingPeriodInvoice(billingPeriod)),
    startDate: get(billingPeriods, '[0].billing_period_start_date'),
    totalAmount: get(billingPeriods, '[0].total_amount'),
  };
};

export const getContentPreviewInvoiceBillingPeriods = (invoices: PreviewInvoices) => {
  if(!invoices) {
    return null;
  }
  return invoices.map((invoice) => getContentBillingPeriod(invoice));
};
