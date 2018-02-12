// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import {formatDate, formatDateDb, formatDateRange} from '../util/helpers';

export const formatSequenceNumber = (value: number) => {
  if(!value) {
    return '';
  }
  const length = value.toString().length;
  if (length < 4) {
    let prefix = '';
    for (var i = 1; i <= 4 - length; i++) {
      prefix += '0';
    }
    return prefix + value.toString();
  }
  return  value.toString();
};

export const getContentLeaseIdentifier = (item:Object) => {
  if(isEmpty(item)) {
    return null;
  }
  const unit = `${get(item, 'type')}${get(item, 'municipality')}${get(item, 'district')}-${formatSequenceNumber(get(item, 'sequence'))}`;
  return unit;
};

export const getContentLeaseDateRange = (item: Object) => {
  return formatDateRange(get(item, 'start_date'), get(item, 'end_date'));
};

export const getContentRealPropertyUnit = (item: Object) => {
  const {assets} = item;
  if(isEmpty(assets)) {
    return null;
  }
  let realPropertyUnit = '';
  for(let i = 0; i < assets.length; i++) {
    //TODO: get real property unit when it's available at the end point
    console.log(assets[i]);
  }

  return realPropertyUnit;
};

export const getContentLeaseAddress = (item:Object) => {
  const {assets} = item;
  if(isEmpty(assets)) {
    return null;
  }
  let address = '';
  for(let i = 0; i < assets.length; i++) {
    if(get(assets[i], 'address')) {
      address = get(assets[i], 'address');
      return address;
    }
  }

  return address;
};

export const getContentLeaseStatus = (item: Object, options: Array<Object>) => {
  const {status} = item;
  if(!status) {
    return null;
  }

  for(let i = 0; i < options.length; i++) {
    if(options[i].value === status) {
      return get(options[i], 'label');
    }
  }
  return status;
};

export const getContentBillingTenant = (tenant: Object) => {
  return {
    bill_share: get(tenant, 'bill_share'),
    bill_share_amount: get(tenant, 'bill_share_amount'),
    firstname: get(tenant, 'firstname'),
    lastname: get(tenant, 'lastname'),
  };
};
export const getContentBillingAbnormalDebts = (debts: Array<Object>) => {
  if(!debts || debts.length === 0) {
    return [];
  }

  return debts.map((debt) => {
    return {
      capital_amount: get(debt, 'capital_amount'),
      due_date: debt.due_date ? moment(debt.due_date) : null,
      billing_period_end_date: debt.billing_period_end_date ? moment(debt.billing_period_end_date) : null,
      billing_period_start_date: debt.billing_period_start_date ? moment(debt.billing_period_start_date) : null,
      tenant: getContentBillingTenant(get(debt, 'tenant')),
    };
  });
};

export const getContentBillingBills = (bills: Array<Object>) => {
  if(!bills || bills.length === 0) {
    return [];
  }

  return bills.map((bill) => {
    return {
      bill_number: get(bill, 'bill_number'),
      billing_period_end_date: bill.billing_period_end_date ? moment(bill.billing_period_end_date) : null,
      billing_period_start_date: bill.billing_period_start_date ? moment(bill.billing_period_start_date) : null,
      capital_amount: get(bill, 'capital_amount'),
      demand_date: bill.demand_date ? moment(bill.demand_date) : null,
      due_date: bill.due_date ? moment(bill.due_date) : null,
      info: get(bill, 'info'),
      invoiced_amount: get(bill, 'invoiced_amount'),
      invoicing_date: bill.invoicing_date ? moment(bill.invoicing_date) : null,
      invoice_method: get(bill, 'invoice_method'),
      invoice_type: get(bill, 'invoice_type'),
      payment_demand_list: get(bill, 'payment_demand_list'),
      recovery_cost: get(bill, 'recovery_cost'),
      SAP_number: get(bill, 'SAP_number'),
      sent_to_SAP_date: bill.sent_to_SAP_date ? moment(bill.sent_to_SAP_date) : null,
      status: get(bill, 'status'),
      suspension_date: bill.suspension_date ? moment(bill.suspension_date) : null,
      tenant: getContentBillingTenant(get(bill, 'tenant')),
      type: get(bill, 'type'),
      unpaid_amount: get(bill, 'unpaid_amount'),
    };
  });
};

export const getContentBilling = (lease: Object) => {
  const billing = get(lease, 'billing');
  if(!billing) {
    return {};
  }

  return {
    abnormal_debts: getContentBillingAbnormalDebts(get(billing, 'abnormal_debts')),
    billing_started: get(billing, 'billing_started'),
    bills: getContentBillingBills(get(billing, 'bills')),
  };
};

export const getContentHistory = (lease: Object) => {
  const historyItems = get(lease, 'history', []);
  if(!historyItems || historyItems.length === 0) {
    return [];
  }

  return historyItems.map((item) => {
    return {
      active: get(item, 'active'),
      end_date: item.end_date ? moment(item.end_date) : null,
      identifier: get(item, 'identifier'),
      start_date: item.start_date ? moment(item.start_date) : null,
      type: get(item, 'type'),
    };
  });
};

export const getContentSummary = (lease: Object) => {
  return {
    financing_method: get(lease, 'financing_method'),
    hitas: get(lease, 'hitas'),
    lease_statistical_use: get(lease, 'lease_statistical_use'),
    lease_use: get(lease, 'lease_use'),
    lease_use_description: get(lease, 'lease_use_description'),
    lessor: get(lease, 'lessor'),
    management_method: get(lease, 'management_method'),
    notice_period: get(lease, 'notice_period'),
    notice_period_description: get(lease, 'notice_period_description'),
    publicity: get(lease, 'publicity'),
    regulatory: get(lease, 'regulatory'),
    regulatory_method: get(lease, 'regulatory_method'),
    special_apartments: get(lease, 'special_apartments'),
    transfer_right: get(lease, 'transfer_right'),
  };
};
export const getContentFixedInitialYearRentItems = (items: Array<Object>) => {
  if(!items || items.length === 0) {
    return [];
  }

  return items.map((item) => {
    return {
      end_date: item.end_date ? moment(item.end_date) : null,
      rent: get(item, 'rent'),
      start_date: item.start_date ? moment(item.start_date) : null,
    };
  });
};

export const getContentContractModification = (modifications: Array<Object>) => {
  if(!modifications || modifications.length === 0) {
    return [];
  }

  return modifications.map((modification) => {
    return ({
      first_call_sent: modification.first_call_sent ? moment(modification.first_call_sent) : null,
      modification_description: get(modification, 'modification_description'),
      modification_signing_date: modification.modification_signing_date ? moment(modification.modification_signing_date) : null,
      second_call_sent: modification.second_call_sent ? moment(modification.second_call_sent) : null,
      third_call_sent: modification.third_call_sent ? moment(modification.third_call_sent) : null,
      to_be_signed_by: modification.to_be_signed_by ? moment(modification.to_be_signed_by) : null,
    });
  });
};

export const getContentContractPledgeBooks = (pledgeBooks: Array<Object>) => {
  if(!pledgeBooks || pledgeBooks.length === 0) {
    return [];
  }

  return pledgeBooks.map((book) => {
    return ({
      pledge_book_comment: get(book, 'pledge_book_comment'),
      pledge_book_number: get(book, 'pledge_book_number'),
      pledge_book_date: book.pledge_book_date ? moment(book.pledge_book_date) : null,
    });
  });
};

export const getContentContractItem = (contract: Object) => {
  return {
    active: get(contract, 'active'),
    administration_number: get(contract, 'administration_number'),
    contract_number: get(contract, 'contract_number'),
    contract_type: get(contract, 'contract_type'),
    ktj_document: get(contract, 'ktj_document'),
    lease_deposit_comment: get(contract, 'lease_deposit_comment'),
    lease_deposit_ending_date: contract.lease_deposit_ending_date ? moment(contract.lease_deposit_ending_date) : null,
    lease_deposit_number: get(contract, 'lease_deposit_number'),
    lease_deposit_starting_date: contract.lease_deposit_starting_date ? moment(contract.lease_deposit_starting_date) : null,
    modifications: getContentContractModification(get(contract, 'modifications', [])),
    pledge_books: getContentContractPledgeBooks(get(contract, 'pledge_books', [])),
    setup_decision: get(contract, 'setup_decision'),
    signing_date: contract.signing_date ? moment(contract.signing_date) : null,
    signing_date_comment: get(contract, 'signing_date_comment'),
  };
};

export const getContentContracts = (lease: Object) => {
  const contracts = get(lease, 'contracts', []);
  if(!contracts || contracts.length === 0) {
    return [];
  }

  return contracts.map((contract) =>
    getContentContractItem(contract)
  );
};

export const getContentInspectionItem = (inspection: Object) => {
  return {
    inspection_description: get(inspection, 'inspection_description'),
    inspector: get(inspection, 'inspector'),
    supervision_date: inspection.supervision_date ? moment(inspection.supervision_date) : null,
    supervised_date: inspection.supervised_date ? moment(inspection.supervised_date) : null,
  };
};

export const getContentInspections = (lease: Object) => {
  const inspections = get(lease, 'inspections', []);
  if(!inspections || inspections.length === 0) {
    return [];
  }

  return inspections.map((inspection) =>
    getContentInspectionItem(inspection)
  );
};

export const getContentLeaseAreaConstructionEligibilityComments = (comments: Array<Object>) => {
  if(!comments || comments.length === 0) {
    return [];
  }

  return comments.map((comment) => {
    return {
      AHJO_number: get(comment, 'AHJO_number'),
      comment: get(comment, 'comment'),
      comment_author: get(comment, 'comment_author'),
      comment_date: comment.comment_date ? moment(comment.comment_date) : null,
    };
  });
};

export const getContentLeaseAreaConstructionEligibilityInvestigationItem = (item: Object) => {
  return {
    comments: getContentLeaseAreaConstructionEligibilityComments(get(item, 'comments', [])),
    geotechnical_number: get(item, 'geotechnical_number'),
    report: get(item, 'report'),
    report_author: get(item, 'report_author'),
    research_state: get(item, 'research_state'),
    signing_date: item.signing_date ? moment(item.signing_date) : null,
  };
};

export const getContentLeaseAreaConstructionEligibilityPIMAItem = (item: Object) => {
  return {
    comments: getContentLeaseAreaConstructionEligibilityComments(get(item, 'comments', [])),
    contamination_author: get(item, 'contamination_author'),
    matti_report: get(item, 'matti_report'),
    projectwise_number: get(item, 'projectwise_number'),
    rent_conditions: get(item, 'rent_conditions'),
    rent_condition_date: item.rent_condition_date ? moment(item.rent_condition_date) : null,
    research_state: get(item, 'research_state'),
  };
};

export const getContentLeaseAreaConstructionEligibilityItem = (item: Object) => {
  return {
    comments: getContentLeaseAreaConstructionEligibilityComments(get(item, 'comments', [])),
    research_state: get(item, 'research_state'),
  };
};

export const getContentLeaseAreaConstructionEligibility = (item: Object) => {
  if(!item) {
    return {};
  }

  return {
    construction_investigation: getContentLeaseAreaConstructionEligibilityInvestigationItem(get(item, 'construction_investigation')),
    contamination: getContentLeaseAreaConstructionEligibilityPIMAItem(get(item, 'contamination')),
    demolition: getContentLeaseAreaConstructionEligibilityItem(get(item, 'demolition')),
    other: getContentLeaseAreaConstructionEligibilityItem(get(item, 'other')),
    preconstruction: getContentLeaseAreaConstructionEligibilityItem(get(item, 'preconstruction')),
  };
};

export const getContentLeaseAreaPlotItems = (plots: Array<Object>) => {
  if(!plots || plots.length === 0) {
    return [];
  }

  return plots.map((plot) => {
    return {
      abolishment_date: plot.abolishment_date ? moment(plot.abolishment_date) : null,
      address: get(plot, 'address'),
      coordinates: get(plot, 'coordinates', []),
      district: get(plot, 'district'),
      explanation: get(plot, 'explanation'),
      full_area: get(plot, 'full_area'),
      group_number: get(plot, 'group_number'),
      intersection_area: get(plot, 'intersection_area'),
      municipality: get(plot, 'municipality'),
      plot_id: get(plot, 'plot_id'),
      registration_date: plot.registration_date ? moment(plot.registration_date) : null,
      town: get(plot, 'town'),
      unit_number: get(plot, 'unit_number'),
      unseparate_parcel_number: get(plot, 'unseparate_parcel_number'),
      zip_code: get(plot, 'zip_code'),
    };
  });
};

export const getContentLeaseAreaPlanPlotItems = (planPlots: Array<Object>) => {
  if(!planPlots || planPlots.length === 0) {
    return [];
  }

  return planPlots.map((planPlot) => {
    return {
      address: get(planPlot, 'address'),
      district: get(planPlot, 'district'),
      explanation: get(planPlot, 'explanation'),
      full_area: get(planPlot, 'full_area'),
      group_number: get(planPlot, 'group_number'),
      intersection_area: get(planPlot, 'intersection_area'),
      municipality: get(planPlot, 'municipality'),
      plan: get(planPlot, 'plan'),
      plan_approval_date: planPlot.plan_approval_date ? moment(planPlot.plan_approval_date) : null,
      planplot_condition: get(planPlot, 'planplot_condition'),
      plan_plot_in_contract_id: get(planPlot, 'plan_plot_in_contract_id'),
      planplot_type: get(planPlot, 'planplot_type'),
      plot_division_id: get(planPlot, 'plot_division_id'),
      plot_division_approval_date: planPlot.plot_division_approval_date ? moment(planPlot.plot_division_approval_date) : null,
      state: get(planPlot, 'state'),
      town: get(planPlot, 'town'),
      unit_number: get(planPlot, 'unit_number'),
      use: get(planPlot, 'use'),
      zip_code: get(planPlot, 'zip_code'),
    };
  });
};

export const getContentLeaseAreaItem = (area: Object) => {
  return {
    address: get(area, 'address'),
    district: get(area, 'district'),
    explanation: get(area, 'explanation'),
    full_area: get(area, 'full_area'),
    group_number: get(area, 'group_number'),
    intersection_area: get(area, 'intersection_area'),
    lease_area_id: get(area, 'lease_area_id'),
    municipality: get(area, 'municipality'),
    planplot_condition: get(area, 'planplot_condition'),
    planplot_type: get(area, 'planplot_type'),
    position: get(area, 'position'),
    town: get(area, 'town'),
    unit_number: get(area, 'unit_number'),
    zip_code: get(area, 'zip_code'),
    construction_eligibility: getContentLeaseAreaConstructionEligibility(get(area, 'construction_eligibility')),
    plan_plots_at_present: getContentLeaseAreaPlanPlotItems(get(area, 'plan_plots_at_present', [])),
    plan_plots_in_contract: getContentLeaseAreaPlanPlotItems(get(area, 'plan_plots_in_contract', [])),
    plots_at_present: getContentLeaseAreaPlotItems((get(area, 'plots_at_present', []))),
    plots_in_contract: getContentLeaseAreaPlotItems((get(area, 'plots_in_contract', []))),
  };
};

export const getContentLeaseAreas = (lease: Object) => {
  const leaseAreas = get(lease, 'lease_areas', []);
  if(!leaseAreas || leaseAreas.length === 0) {
    return [];
  }

  return leaseAreas.map((area) => {
    return getContentLeaseAreaItem(area);
  });
};

export const getContentRentBasicInfo = (basicInfoData: Object) => {
  return {
    adjustment_start_date: basicInfoData.adjustment_start_date ? moment(basicInfoData.adjustment_start_date) : null,
    adjustment_end_date: basicInfoData.adjustment_end_date ? moment(basicInfoData.adjustment_end_date) : null,
    basic_index: get(basicInfoData, 'basic_index'),
    basic_index_rounding: get(basicInfoData, 'basic_index_rounding'),
    bill_amount: get(basicInfoData, 'bill_amount'),
    billing_type: get(basicInfoData, 'billing_type'),
    comment: get(basicInfoData, 'comment', ''),
    due_dates: get(basicInfoData, 'due_dates', []),
    fidex_initial_year_rents: getContentFixedInitialYearRentItems(get(basicInfoData, 'fidex_initial_year_rents', [])),
    index_type: get(basicInfoData, 'index_type'),
    rental_period: get(basicInfoData, 'rental_period'),
    type: get(basicInfoData, 'type'),
    y_value: get(basicInfoData, 'y_value'),
    y_value_start: get(basicInfoData, 'y_value_start'),
    x_value: get(basicInfoData, 'x_value'),
  };
};

export const getContentRentDiscount = (discountData: Array<Object>) => {
  if(!discountData || discountData.length === 0) {
    return [];
  }

  return discountData.map((discount) => {
    return (
    {
      amount: get(discount, 'amount', ''),
      amount_left: get(discount, 'amount_left', ''),
      amount_type: get(discount, 'amount_type', ''),
      comment: get(discount, 'comment', ''),
      end_date: discount.end_date ? moment(discount.end_date) : null,
      purpose: get(discount, 'purpose', ''),
      rule: get(discount, 'rule', ''),
      start_date: discount.start_date ? moment(discount.start_date) : null,
      type: get(discount, 'type', ''),
    });
  });
};

export const getContentRentCriteria = (criteriaData: Array<Object>) => {
  if(!criteriaData || criteriaData.length === 0) {
    return [];
  }

  return criteriaData.map((criteria) => {
    return (
    {
      agreed: get(criteria, 'agreed', false),
      purpose: get(criteria, 'purpose'),
      km2: get(criteria, 'km2'),
      index: get(criteria, 'index'),
      ekm2ind100: get(criteria, 'ekm2ind100'),
      ekm2ind: get(criteria, 'ekm2ind'),
      percentage: get(criteria, 'percentage'),
      basic_rent: get(criteria, 'basic_rent'),
      start_rent: get(criteria, 'start_rent'),
    });
  });
};

export const getContentRentChargedRents = (chargedRentsData: Array<Object>) => {
  if(!chargedRentsData || chargedRentsData.length === 0) {
    return [];
  }

  return chargedRentsData.map((rent) => {
    return (
    {
      calendar_year_rent: get(rent, 'calendar_year_rent'),
      difference: get(rent, 'difference'),
      end_date: rent.end_date ? moment(rent.end_date) : null,
      rent: get(rent, 'rent'),
      start_date: rent.start_date ? moment(rent.start_date) : null,
    });
  });
};

export const getContentRentContractRents = (contractRentsData: Array<Object>) => {
  if(!contractRentsData || contractRentsData.length === 0) {
    return [];
  }

  return contractRentsData.map((rent) => {
    return (
    {
      basic_rent: get(rent, 'basic_rent'),
      basic_rent_type: get(rent, 'basic_rent_type'),
      contract_rent: get(rent, 'contract_rent'),
      end_date: rent.end_date ? moment(rent.end_date) : null,
      purpose: get(rent, 'purpose'),
      start_date: rent.start_date ? moment(rent.start_date) : null,
      type: get(rent, 'type'),
    });
  });
};

export const getContentRentIndexAdjustedRents = (indexAdjustedRentsData: Array<Object>) => {
  if(!indexAdjustedRentsData || indexAdjustedRentsData.length === 0) {
    return [];
  }

  return indexAdjustedRentsData.map((rent) => {
    return (
    {
      calculation_factor: get(rent, 'calculation_factor'),
      end_date: rent.end_date ? moment(rent.end_date) : null,
      purpose: get(rent, 'purpose'),
      rent: get(rent, 'rent'),
      start_date: rent.start_date ? moment(rent.start_date) : null,
    });
  });
};

export const getContentRents = (lease: Object) => {
  return {
    rent_info_ok: get(lease, 'rents.rent_info_ok', false),
    basic_info: getContentRentBasicInfo(get(lease, 'rents.basic_info', [])),
    charged_rents: getContentRentChargedRents(get(lease, 'rents.charged_rents', [])),
    contract_rents: getContentRentContractRents(get(lease, 'rents.contract_rents', [])),
    criterias: getContentRentCriteria(get(lease, 'rents.criterias', [])),
    discounts: getContentRentDiscount(get(lease, 'rents.discounts', [])),
    index_adjusted_rents: getContentRentIndexAdjustedRents(get(lease, 'rents.index_adjusted_rents', [])),
  };
};

export const getContentRuleTerms = (rule: Object) => {
  const terms = get(rule, 'terms', []);
  if(!terms || terms.length === 0) {
    return [];
  }

  return terms.map((term) => {
    return {
      supervision_date: term.supervision_date ? moment(term.supervision_date) : null,
      supervised_date: term.supervised_date ? moment (term.supervised_date) : null,
      term_description: get(term, 'term_description'),
      term_purpose: get(term, 'term_purpose'),
    };
  });
};

export const getContentRuleItem = (rule: Object) => {
  return {
    rule_clause: get(rule, 'rule_clause'),
    rule_date: rule.rule_date ? moment(rule.rule_date) : null,
    rule_description: get(rule, 'rule_description'),
    rule_maker: get(rule, 'rule_maker'),
    rule_type: get(rule, 'rule_type'),
    terms: getContentRuleTerms(rule),
  };
};

export const getContentRules = (lease: Object) => {
  const rules = get(lease, 'rules', []);
  if(!rules || rules.length === 0) {
    return [];
  }

  return rules.map((rule) =>
    getContentRuleItem(rule)
  );
};

export const getFullAddress = (item: Object) => {
  if(!get(item, 'zip_code') && !get(item, 'town')) {
    return get(item, 'address');
  }
  return `${get(item, 'address')}, ${get(item, 'zip_code')} ${get(item, 'town')}`;
};

export const getContentLeaseTenant = (item:Object) => {
  const tenant = get(item, 'tenants[0].contact.name');
  return tenant;
};

export const getContentLeaseItem = (item:Object, statusOptions: Array<Object>) => {
  return {
    id: get(item, 'id'),
    real_property_unit: getContentRealPropertyUnit(item),
    identifier: getContentLeaseIdentifier(item),
    address: getContentLeaseAddress(item),
    status: getContentLeaseStatus(item, statusOptions),
    status_code: get(item, 'status'),
    start_date: item.start_date ? formatDate(moment(item.start_date)) : null,
    end_date: item.end_date ? formatDate(moment(item.end_date)) : null,
  };
};

export const getContentLeases = (content:Object, attributes: Object) => {
  const items = [];
  const {results} = content;
  const statusOptions = getStatusOptions(attributes);

  if(!results) {
    return [];
  }

  for(let i = 0; i < results.length; i++) {
    const item = getContentLeaseItem(results[i], statusOptions);
    items.push(item);
  }
  return items;
};

export const getContentTenantOtherPersons = (persons: Array<Object>) => {
  if(!persons || persons.length === 0) {
    return [];
  }

  return persons.map((person) => {
    return {
      customer_id: get(person, 'customer_id'),
      address: get(person, 'address'),
      comment: get(person, 'comment'),
      email: get(person, 'email'),
      end_date: person.end_date ? moment(person.end_date) : null,
      firstname: get(person, 'firstname'),
      language: get(person, 'language'),
      lastname: get(person, 'lastname'),
      phone: get(person, 'phone'),
      protection_order: get(person, 'protection_order'),
      roles: get(person, 'roles'),
      SAP_customer_id: get(person, 'SAP_customer_id'),
      social_security_number: get(person, 'social_security_number'),
      start_date: person.start_date ? moment(person.start_date) : null,
      town: get(person, 'town'),
      type: get(person, 'type'),
      zip_code: get(person, 'zip_code'),
    };
  });
};

export const getContentTenantItem = (tenant: Object) => {
  return {
    address: get(tenant, 'address'),
    bill_share: get(tenant, 'bill_share'),
    comment: get(tenant, 'comment'),
    customer_id: get(tenant, 'customer_id'),
    email: get(tenant, 'email'),
    end_date: tenant.end_date ? moment(tenant.end_date) : null,
    firstname: get(tenant, 'firstname'),
    language: get(tenant, 'language'),
    lastname: get(tenant, 'lastname'),
    ovt_identifier: get(tenant, 'ovt_identifier'),
    partner_code: get(tenant, 'partner_code'),
    phone: get(tenant, 'phone'),
    protection_order: get(tenant, 'protection_order'),
    reference: get(tenant, 'reference'),
    roles: get(tenant, 'roles'),
    SAP_customer_id: get(tenant, 'SAP_customer_id'),
    share: get(tenant, 'share'),
    share_divider: get(tenant, 'share_divider'),
    social_security_number: get(tenant, 'social_security_number'),
    start_date: tenant.start_date ? moment(tenant.start_date) : null,
    town: get(tenant, 'town'),
    zip_code: get(tenant, 'zip_code'),
  };
};

export const getContentTenants = (lease: Object) => {
  const tenants = get(lease, 'tenants', []);
  return tenants.map((tenant) => {
    return {
      other_persons: getContentTenantOtherPersons(get(tenant, 'other_persons', [])),
      tenant: getContentTenantItem(get(tenant, 'tenant')),
    };
  });
};

export const getLeasesFilteredByDocumentType = (items: Array<Object>, documentTypes: Array<string>) => {
  if(!documentTypes || documentTypes.length === 0) {
    return items;
  }
  return items.filter((item) => {
    return documentTypes.indexOf(item.status_code) !== -1;
  });

};

export const getDistrictOptions = (attributes: Object) => {
  const choices = get(attributes, 'district.choices', []);
  if(!choices || choices.length === 0) {
    return [];
  }

  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'value')} ${get(choice, 'display_name')}`,
    };
  }).sort(function(a, b){
    const keyA = a.value,
      keyB = b.value;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });
};

export const getMunicipalityOptions = (attributes: Object) => {
  const choices = get(attributes, 'municipality.choices', []);
  if(!choices || choices.length === 0) {
    return [];
  }

  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'value')} ${get(choice, 'display_name')}`,
    };
  }).sort(function(a, b){
    const keyA = a.value,
      keyB = b.value;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });
};

export const getStatusOptions = (attributes: Object) => {
  const choices = get(attributes, 'status.choices', []);
  if(!choices || choices.length === 0) {
    return [];
  }

  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'display_name')}`,
    };
  });
};

export const getTypeOptions = (attributes: Object) => {
  const choices = get(attributes, 'type.choices', []);
  if(!choices || choices.length === 0) {
    return [];
  }

  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'value')} ${get(choice, 'display_name')}`,
    };
  }).sort(function(a, b){
    const keyA = a.value,
      keyB = b.value;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });
};

const formatBillingNewBillTenant = (tenant: Object) => {
  return {
    bill_share: get(tenant, 'bill_share'),
    firstname: get(tenant, 'firstname'),
    lastname: get(tenant, 'lastname'),
  };
};

export const formatBillingNewBill = (bill: Object) => {
  return {
    billing_period_end_date: formatDateDb(get(bill, 'billing_period_end_date')),
    billing_period_start_date: formatDateDb(get(bill, 'billing_period_start_date')),
    capital_amount: get(bill, 'capital_amount'),
    due_date: formatDateDb(get(bill, 'due_date')),
    info: get(bill, 'info'),
    is_utter: get(bill, 'is_utter'),
    tenant: formatBillingNewBillTenant(get(bill, 'tenant', {})),
    type: get(bill, 'type'),
  };
};
