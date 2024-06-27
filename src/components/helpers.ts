import get from "lodash/get";
import { RentExplanationSubjectType, RentSubItemSubjectType, RentSubItemType } from "./enums";
import { LeaseRentsFieldPaths, LeaseRentAdjustmentsFieldPaths, LeaseRentContractRentsFieldPaths, TenantContactType } from "/src/leases/enums";
import { formatNumber, getFieldOptions, getLabelOfOption } from "util/helpers";
import type { Attributes } from "types";
import type { BillingPeriod, BillingPeriodInvoice, PreviewInvoices } from "/src/previewInvoices/types";
export const getRentsTotalAmount = (rents: Array<Record<string, any>>) => {
  let amount = 0;
  rents.forEach(rent => {
    amount += getRentAmount(rent);
  });
  return amount;
};

const getRentAmount = (rent: Record<string, any>) => {
  const amount = get(rent, 'amount');
  return amount !== null ? Number(amount) : null;
};

export const getRentExplanationAmount = (explanation: Record<string, any>) => {
  const amount = get(explanation, 'amount');
  return amount !== null ? Number(amount) : null;
};
export const getRentSubItemAmount = (subItem: Record<string, any>) => {
  const amount = get(subItem, 'amount');
  return amount !== null ? Number(amount) : null;
};
export const getRentExplanationDescription = (explanation: Record<string, any>, attributes: Attributes) => {
  const typeOptions = getFieldOptions(attributes, LeaseRentsFieldPaths.TYPE);
  const periodOptions = getFieldOptions(attributes, LeaseRentContractRentsFieldPaths.PERIOD);
  const baseAmountPeriodOptions = getFieldOptions(attributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD);
  const subjectType = get(explanation, 'subject.subject_type');
  const type = get(explanation, 'subject.type');
  const amount = get(explanation, 'subject.amount');
  const description = get(explanation, 'subject.description');
  const period = get(explanation, 'subject.period');
  const baseAmount = get(explanation, 'subject.base_amount');
  const baseAmountPeriod = get(explanation, 'subject.base_amount_period');
  const intendedUseName = get(explanation, 'subject.intended_use.name');

  switch (subjectType) {
    case RentExplanationSubjectType.CONTRACT_RENT:
      if (baseAmount !== null) {
        return `Sopimusvuokra - ${intendedUseName} (${formatNumber(baseAmount)} € ${getLabelOfOption(baseAmountPeriodOptions, baseAmountPeriod) || ''})`;
      }

      return `Sopimusvuokra - ${intendedUseName} (${formatNumber(amount)} € ${getLabelOfOption(periodOptions, period) || ''})`;

    case RentExplanationSubjectType.FIXED_INITIAL_YEAR_RENT:
      return `Kiinteä alkuvuosivuokra - ${intendedUseName} (${formatNumber(amount)} € / vuosi)`;

    case RentExplanationSubjectType.RENT:
      return `Perittävä vuokra (${getLabelOfOption(typeOptions, type) || ''})`;

    default:
      return description;
  }
};
export const getRentSubItemDescription = (subItem: Record<string, any>, attributes: Attributes) => {
  const rentAdjustementTypeOptions = getFieldOptions(attributes, LeaseRentAdjustmentsFieldPaths.TYPE);
  const amountTypeOptions = getFieldOptions(attributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE);
  const description = get(subItem, 'subject.description');
  const subjectNumber = get(subItem, 'subject.number');
  const subjectType = get(subItem, 'subject.subject_type');
  const type = get(subItem, 'subject.type');
  const fullAmount = get(subItem, 'subject.full_amount');
  const amountType = get(subItem, 'subject.amount_type');

  switch (subjectType) {
    case RentSubItemSubjectType.INDEX:
      return `Indeksitarkistus (vertailuluku ${subjectNumber})`;

    case RentSubItemSubjectType.RENT_ADJUSTMENT:
      switch (type) {
        case RentSubItemType.DISCOUNT:
        case RentSubItemType.INCREASE:
          return `${getLabelOfOption(rentAdjustementTypeOptions, type) || ''} (${formatNumber(fullAmount)} ${getLabelOfOption(amountTypeOptions, amountType) || ''})`;

        default:
          return '-';
      }

    case RentSubItemSubjectType.NOTICE:
    case RentSubItemSubjectType.RATIO:
    case RentSubItemSubjectType.NEW_BASE_RENT:
    default:
      return description || '-';
  }
};

const getContentBillingPeriodInvoiceRowTenant = (row: Record<string, any>) => {
  const tenant = get(row, 'tenant.tenantcontact_set').find(tenant => tenant.type === TenantContactType.TENANT);
  return {
    contact: tenant ? tenant.contact : null,
    shareDenominator: row.tenant.share_denominator,
    shareNumerator: row.tenant.share_numerator
  };
};

const getContentBillingPeriodInvoiceRows = (invoice: BillingPeriodInvoice) => {
  return get(invoice, 'rows', []).map(row => {
    return {
      amount: row.amount,
      description: row.description,
      receivableType: row.receivable_type,
      tenant: getContentBillingPeriodInvoiceRowTenant(row)
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
    type: invoice.type
  };
};

const getContentBillingPeriod = (billingPeriod: BillingPeriod) => {
  const totalAmount = billingPeriod.reduce((sum, invoice) => sum + Number(invoice.billed_amount), 0);
  return {
    dueDate: get(billingPeriod, '[0].due_date'),
    endDate: get(billingPeriod, '[0].billing_period_end_date'),
    explanations: get(billingPeriod, '[0].explanations'),
    invoices: billingPeriod.map(invoice => getContentBillingPeriodInvoice(invoice)),
    startDate: get(billingPeriod, '[0].billing_period_start_date'),
    totalAmount: totalAmount
  };
};

export const getContentPreviewInvoiceBillingPeriods = (invoices: PreviewInvoices): Array<Record<string, any>> => {
  if (!invoices) return [];
  return invoices.map(billingPeriod => getContentBillingPeriod(billingPeriod));
};