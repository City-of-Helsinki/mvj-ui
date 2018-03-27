// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import {
  fixedLengthNumber,
  formatDate,
  formatDateDb,
  formatDecimalNumberDb,
} from '$util/helpers';

export const getContentLeaseIdentifier = (item:Object) => {
  if(isEmpty(item)) {
    return null;
  }
  const unit = `${get(item, 'type')}${get(item, 'municipality')}${fixedLengthNumber(get(item, 'district'), 2)}-${get(item, 'identifier.sequence')}`;
  return unit;
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

export const getContentLeaseInfo = (lease: Object) => {
  return {
    identifier: getContentLeaseIdentifier(lease),
    end_date: get(lease, 'end_date'),
    start_date: get(lease, 'start_date'),
    state: get(lease, 'state'),
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
      end_date: get(item, 'end_date'),
      identifier: get(item, 'identifier'),
      start_date: get(item, 'start_date'),
      type: get(item, 'type'),
    };
  });
};

export const getContentSummary = (lease: Object) => {
  return {
    lessor: get(lease, 'lessor.id'),
    classification: get(lease, 'classification'),
    intended_use: get(lease, 'intended_use'),
    supportive_housing: get(lease, 'supportive_housing'),
    statistical_use: get(lease, 'statistical_use'),
    intended_use_note: get(lease, 'intended_use_note'),
    financing: get(lease, 'financing'),
    management: get(lease, 'management'),
    transferable: get(lease, 'transferable'),
    regulated: get(lease, 'regulated'),
    regulation: get(lease, 'regulation'),
    hitas: get(lease, 'hitas'),
    notice_period: get(lease, 'notice_period'),
    notice_note: get(lease, 'notice_note'),
  };
};

export const getContentPlots = (plots: Array<Object>, inContract: boolean) => {
  if(!plots || !plots.length) {
    return [];
  }

  return plots.filter((plot) => plot.in_contract === inContract).map((plot) => {
    return {
      id: get(plot, 'id'),
      identifier: get(plot, 'identifier'),
      area: get(plot, 'area'),
      section_area: get(plot, 'section_area'),
      address: get(plot, 'address'),
      postal_code: get(plot, 'postal_code'),
      city: get(plot, 'city'),
      type: get(plot, 'type'),
      registration_date: get(plot, 'registration_date'),
      in_contract: get(plot, 'in_contract'),
    };
  });
};

export const getContentPlanUnits = (planunits: Array<Object>, inContract: boolean) => {
  if(!planunits || !planunits.length) {
    return [];
  }

  return planunits.filter((planunit) => planunit.in_contract === inContract).map((planunit) => {
    return {
      id: get(planunit, 'id'),
      identifier: get(planunit, 'identifier'),
      area: get(planunit, 'area'),
      section_area: get(planunit, 'section_area'),
      address: get(planunit, 'address'),
      postal_code: get(planunit, 'postal_code'),
      city: get(planunit, 'city'),
      type: get(planunit, 'type'),
      in_contract: get(planunit, 'in_contract'),
      plot_division_identifier: get(planunit, 'plot_division_identifier'),
      plot_division_date_of_approval: get(planunit, 'plot_division_date_of_approval'),
      detailed_plan_identifier: get(planunit, 'detailed_plan_identifier'),
      detailed_plan_date_of_approval: get(planunit, 'detailed_plan_date_of_approval'),
      plan_unit_type: get(planunit, 'plan_unit_type.id') || get(planunit, 'plan_unit_type'),
      plan_unit_state: get(planunit, 'plan_unit_state.id') || get(planunit, 'plan_unit_state'),
    };
  });
};

export const getContentLeaseAreaItem = (area: Object) => {
  return {
    id: get(area, 'id'),
    identifier: get(area, 'identifier'),
    area: get(area, 'area'),
    section_area: get(area, 'section_area'),
    address: get(area, 'address'),
    postal_code: get(area, 'postal_code'),
    city: get(area, 'city'),
    type: get(area, 'type'),
    location: get(area, 'location'),
    plots_current: getContentPlots(get(area, 'plots'), false),
    plots_contract: getContentPlots(get(area, 'plots'), true),
    plan_units_current: getContentPlanUnits(get(area, 'plan_units'), false),
    plan_units_contract: getContentPlanUnits(get(area, 'plan_units'), true),
  };
};

export const getContentLeaseAreas = (lease: Object) => {
  const leaseAreas = get(lease, 'lease_areas', []);
  if(!leaseAreas || !leaseAreas.length) {
    return [];
  }

  return leaseAreas.map((area) => {
    return getContentLeaseAreaItem(area);
  });
};

export const getContentUser = (userData: Object) => {
  return {
    id: get(userData, 'id'),
    first_name: get(userData, 'first_name'),
    last_name: get(userData, 'last_name'),
  };
};

export const getContentComments = (content: Array<Object>) => {
  if(!content || !content.length) {
    return [];
  }

  return content.map((comment) => {
    return {
      id: get(comment, 'id'),
      created_at: get(comment, 'created_at'),
      modified_at: get(comment, 'modified_at'),
      is_archived: get(comment, 'is_archived'),
      text: get(comment, 'text'),
      topic: get(comment, 'topic.id'),
      user: getContentUser(get(comment, 'user')),
      lease: get(comment, 'lease'),
    };
  });
};

export const getContentDecisionConditions = (decision: Object) => {
  const conditions = get(decision, 'conditions', []);
  if(!conditions.length) {
    return [];
  }

  return conditions.map((condition) => {
    return {
      id: get(condition, 'id'),
      type: get(condition, 'type.id') || get(condition, 'type'),
      supervision_date: get(condition, 'supervision_date'),
      supervised_date: get(condition, 'supervised_date'),
      description: get(condition, 'description'),
    };
  });
};

export const getContentDecisionItem = (decision: Object) => {
  return {
    id: get(decision, 'id'),
    reference_number: get(decision, 'reference_number'),
    decision_maker: get(decision, 'decision_maker.id') || get(decision, 'decision_maker'),
    decision_date: get(decision, 'decision_date'),
    section: get(decision, 'section'),
    type: get(decision, 'type.id') || get(decision, 'type'),
    description: get(decision, 'description'),
    conditions: getContentDecisionConditions(decision),
  };
};

export const getContentDecisions = (lease: Object) => {
  const decisions = get(lease, 'decisions', []);
  if(!decisions.length) {
    return [];
  }

  return decisions.map((decision) =>
    getContentDecisionItem(decision)
  );
};

export const getContentContractChanges = (contract: Object) => {
  const changes = get(contract, 'contract_changes', []);
  if(!changes.length) {
    return [];
  }

  return changes.map((change) => {
    return ({
      id: get(change, 'id'),
      signing_date: get(change, 'signing_date'),
      sign_by_date: get(change, 'sign_by_date'),
      first_call_sent: get(change, 'first_call_sent'),
      second_call_sent: get(change, 'second_call_sent'),
      third_call_sent: get(change, 'third_call_sent'),
      description: get(change, 'description'),
      decision: get(change, 'decision.id') || get(change, 'decision'),
    });
  });
};

export const getContentContractMortageDocuments = (contract: Object) => {
  const documents = get(contract, 'mortgage_documents', []);
  if(!documents.length) {
    return [];
  }

  return documents.map((document) => {
    return ({
      id: get(document, 'id'),
      number: get(document, 'number'),
      date: get(document, 'date'),
      note: get(document, 'note'),
    });
  });
};

export const getContentContractItem = (contract: Object) => {
  return {
    id: get(contract, 'id'),
    type: get(contract, 'type.id') || get(contract, 'type'),
    contract_number: get(contract, 'contract_number'),
    signing_date: get(contract, 'signing_date'),
    signing_note: get(contract, 'signing_note'),
    is_readjustment_decision: get(contract, 'is_readjustment_decision'),
    decision: get(contract, 'decision.id') || get(contract, 'decision'),
    ktj_link: get(contract, 'ktj_link'),
    collateral_number: get(contract, 'collateral_number'),
    collateral_start_date: get(contract, 'collateral_start_date'),
    collateral_end_date: get(contract, 'collateral_end_date'),
    collateral_note: get(contract, 'collateral_note'),
    institution_identifier: get(contract, 'institution_identifier'),
    contract_changes: getContentContractChanges(contract),
    mortgage_documents: getContentContractMortageDocuments(contract),
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
    id: get(inspection, 'id'),
    inspector: get(inspection, 'inspector'),
    supervision_date: get(inspection, 'supervision_date'),
    supervised_date: get(inspection, 'supervised_date'),
    description: get(inspection, 'description'),
  };
};

export const getContentInspections = (lease: Object) => {
  const inspections = get(lease, 'inspections', []);
  if(!inspections.length) {
    return [];
  }

  return inspections.map((inspection) =>
    getContentInspectionItem(inspection)
  );
};

//
//
// OLD HELPER FUNCTIONS
//TODO: Remove mock data helper function when contruction eligibility tab is added to API
export const getContentLeaseAreaItemMock = (area: Object) => {
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
  };
};

//TODO: Remove mock data helper function when contruction eligibility tab is added to API
export const getContentLeaseAreasMock = (lease: Object) => {
  const leaseAreas = get(lease, 'lease_areas', []);
  if(!leaseAreas || leaseAreas.length === 0) {
    return [];
  }

  return leaseAreas.map((area) => {
    return getContentLeaseAreaItemMock(area);
  });
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
      bill_number: get(debt, 'bill_number'),
      billing_period_end_date: get(debt, 'billing_period_end_date'),
      billing_period_start_date: get(debt, 'billing_period_start_date'),
      capital_amount: get(debt, 'capital_amount'),
      demand_date: get(debt, 'demand_date'),
      due_date: get(debt, 'due_date'),
      info: get(debt, 'info'),
      invoiced_amount: get(debt, 'invoiced_amount'),
      invoicing_date: get(debt, 'invoicing_date'),
      invoice_method: get(debt, 'invoice_method'),
      invoice_type: get(debt, 'invoice_type'),
      payment_demand_list: get(debt, 'payment_demand_list'),
      recovery_cost: get(debt, 'recovery_cost'),
      SAP_number: get(debt, 'SAP_number'),
      sent_to_SAP_date: debt.sent_to_SAP_date,
      status: get(debt, 'status'),
      suspension_date: debt.suspension_date,
      tenant: getContentBillingTenant(get(debt, 'tenant')),
      type: get(debt, 'type'),
      unpaid_amount: get(debt, 'unpaid_amount'),
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
      billing_period_end_date: get(bill, 'billing_period_end_date'),
      billing_period_start_date: get(bill, 'billing_period_start_date'),
      capital_amount: get(bill, 'capital_amount'),
      demand_date: get(bill, 'demand_date'),
      due_date: get(bill, 'due_date'),
      info: get(bill, 'info'),
      invoiced_amount: get(bill, 'invoiced_amount'),
      invoicing_date: get(bill, 'invoicing_date'),
      invoice_method: get(bill, 'invoice_method'),
      invoice_type: get(bill, 'invoice_type'),
      payment_demand_list: get(bill, 'payment_demand_list'),
      recovery_cost: get(bill, 'recovery_cost'),
      SAP_number: get(bill, 'SAP_number'),
      sent_to_SAP_date: get(bill, 'sent_to_SAP_date'),
      status: get(bill, 'status'),
      suspension_date: get(bill, 'suspension_date'),
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
    invoicing_started: get(billing, 'invoicing_started'),
    bills: getContentBillingBills(get(billing, 'bills')),
  };
};

export const getContentFixedInitialYearRentItems = (items: Array<Object>) => {
  if(!items || items.length === 0) {
    return [];
  }

  return items.map((item) => {
    return {
      end_date: get(item, 'end_date'),
      rent: get(item, 'rent'),
      start_date: get(item, 'start_date'),
    };
  });
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
      comment_date: get(comment, 'comment_date'),
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
    signing_date: get(item, 'signing_date'),
  };
};

export const getContentLeaseAreaConstructionEligibilityPIMAItem = (item: Object) => {
  return {
    comments: getContentLeaseAreaConstructionEligibilityComments(get(item, 'comments', [])),
    contamination_author: get(item, 'contamination_author'),
    matti_report: get(item, 'matti_report'),
    projectwise_number: get(item, 'projectwise_number'),
    rent_conditions: get(item, 'rent_conditions'),
    rent_condition_date: get(item, 'rent_condition_date'),
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

export const getContentRentBasicInfo = (basicInfoData: Object) => {
  return {
    adjustment_start_date: get(basicInfoData, 'adjustment_start_date'),
    adjustment_end_date: get(basicInfoData, 'adjustment_end_date'),
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
      end_date: get(discount, 'end_date'),
      purpose: get(discount, 'purpose', ''),
      rule: get(discount, 'rule', ''),
      start_date: get(discount, 'start_date'),
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
      end_date: get(rent, 'end_date'),
      rent: get(rent, 'rent'),
      start_date: get(rent, 'start_date'),
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
      end_date: get(rent, 'end_date'),
      purpose: get(rent, 'purpose'),
      start_date: get(rent, 'start_date'),
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
      end_date: get(rent, 'end_date'),
      purpose: get(rent, 'purpose'),
      rent: get(rent, 'rent'),
      start_date: get(rent, 'start_date'),
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

export const getContentLeaseItem = (item:Object) => {
  return {
    id: get(item, 'id'),
    real_property_unit: getContentRealPropertyUnit(item),
    identifier: getContentLeaseIdentifier(item),
    lessor: get(item, 'lessor.id'),
    address: getContentLeaseAddress(item),
    state: get(item, 'state'),
    start_date: item.start_date ? formatDate(moment(item.start_date)) : null,
    end_date: item.end_date ? formatDate(moment(item.end_date)) : null,
  };
};

export const getContentLeases = (content:Object) => {
  const {results} = content;
  if(!results || !results.length) {
    return [];
  }

  return results.map((item) => {
    return getContentLeaseItem(item);
  });
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
      end_date: get(person, 'end_date'),
      firstname: get(person, 'firstname'),
      language: get(person, 'language'),
      lastname: get(person, 'lastname'),
      phone: get(person, 'phone'),
      protection_order: get(person, 'protection_order'),
      roles: get(person, 'roles'),
      SAP_customer_id: get(person, 'SAP_customer_id'),
      social_security_number: get(person, 'social_security_number'),
      start_date: get(person, 'start_date'),
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
    end_date: get(tenant, 'end_date'),
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
    start_date: get(tenant, 'start_date'),
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
  if(!documentTypes || !documentTypes.length) {
    return items;
  }
  return items.filter((item) => {
    return documentTypes.indexOf(item.state) !== -1;
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

const formatBillingBillTenant = (tenant: Object) => {
  return {
    bill_share: formatDecimalNumberDb(get(tenant, 'bill_share')),
    bill_share_amount: formatDecimalNumberDb(get(tenant, 'bill_share_amount')),
    firstname: get(tenant, 'firstname'),
    lastname: get(tenant, 'lastname'),
  };
};

export const formatBillingNewBill = (bill: Object) => {
  return {
    billing_period_end_date: formatDateDb(get(bill, 'billing_period_end_date')),
    billing_period_start_date: formatDateDb(get(bill, 'billing_period_start_date')),
    capital_amount: formatDecimalNumberDb(get(bill, 'capital_amount')),
    due_date: formatDateDb(get(bill, 'due_date')),
    info: get(bill, 'info'),
    invoiced_amount: formatDecimalNumberDb(get(bill, 'invoiced_amount')),
    invoicing_date: formatDateDb(get(bill, 'invoicing_date')),
    invoice_method: get(bill, 'invoice_method'),
    invoice_type: get(bill, 'invoice_type'),
    is_utter: get(bill, 'is_utter'),
    SAP_number: formatDecimalNumberDb(get(bill, 'SAP_number')),
    sent_to_SAP_date: formatDateDb(get(bill, 'sent_to_SAP_date')),
    status: get(bill, 'status'),
    tenant: formatBillingBillTenant(get(bill, 'tenant', {})),
    type: get(bill, 'type'),
    unpaid_amount: formatDecimalNumberDb(get(bill, 'unpaid_amount')),
  };
};

export const formatBillingBillDb = (bill: Object) => {
  return {
    bill_number: formatDecimalNumberDb(get(bill, 'bill_number')),
    billing_period_end_date: formatDateDb(get(bill, 'billing_period_end_date')),
    billing_period_start_date: formatDateDb(get(bill, 'billing_period_start_date')),
    capital_amount: formatDecimalNumberDb(get(bill, 'capital_amount')),
    demand_date: formatDateDb(get(bill, 'demand_date')),
    due_date: formatDateDb(get(bill, 'due_date')),
    info: get(bill, 'info'),
    invoiced_amount: formatDecimalNumberDb(get(bill, 'invoiced_amount')),
    invoicing_date: formatDateDb(get(bill, 'invoicing_date')),
    invoice_method: get(bill, 'invoice_method'),
    invoice_type: get(bill, 'invoice_type'),
    payment_demand_list: get(bill, 'payment_demand_list'),
    recovery_cost: formatDecimalNumberDb(get(bill, 'recovery_cost')),
    SAP_number: formatDecimalNumberDb(get(bill, 'SAP_number')),
    sent_to_SAP_date: formatDateDb(get(bill, 'sent_to_SAP_date')),
    status: get(bill, 'status'),
    suspension_date: formatDateDb(get(bill, 'suspension_date')),
    tenant: formatBillingBillTenant(get(bill, 'tenant', {})),
    type: get(bill, 'type'),
    unpaid_amount: formatDecimalNumberDb(get(bill, 'unpaid_amount')),
  };
};

export const addLeaseInfoFormValues = (payload: Object, leaseInfo: Object) => {
  payload.state = get(leaseInfo, 'state');
  payload.start_date = get(leaseInfo, 'start_date');
  payload.end_date = get(leaseInfo, 'end_date');
  return payload;
};

export const addSummaryFormValues = (payload: Object, summary: Object) => {
  payload.lessor = get(summary, 'lessor');
  payload.classification = get(summary, 'classification');
  payload.intended_use = get(summary, 'intended_use');
  payload.supportive_housing = get(summary, 'supportive_housing');
  payload.statistical_use = get(summary, 'statistical_use');
  payload.intended_use_note = get(summary, 'intended_use_note');
  payload.financing = get(summary, 'financing');
  payload.management = get(summary, 'management');
  payload.transferable = get(summary, 'transferable');
  payload.regulated = get(summary, 'regulated');
  payload.regulation = get(summary, 'regulation');
  payload.hitas = get(summary, 'hitas');
  payload.notice_period = get(summary, 'notice_period');
  payload.notice_note = get(summary, 'notice_note');
  return payload;
};

const getPlotsForDb = (area: Object) => {
  const currentPlots = get(area, 'plots_current', []).map((plot) => {
    plot.in_contract = false;
    return plot;
  });
  const contractPlots = get(area, 'plots_contract', []).map((plot) => {
    plot.in_contract = true;
    return plot;
  });
  const plots = currentPlots.concat(contractPlots);
  if(!plots.length) {
    return [];
  }
  return plots.map((plot) => {
    return {
      id: plot.id || undefined,
      identifier: get(plot, 'identifier'),
      area: formatDecimalNumberDb(get(plot, 'area')),
      section_area: formatDecimalNumberDb(get(plot, 'section_area')),
      address: get(plot, 'address'),
      postal_code: get(plot, 'postal_code'),
      city: get(plot, 'city'),
      type: get(plot, 'type'),
      location: get(plot, 'location'),
      registration_date: get(plot, 'registration_date'),
      in_contract: get(plot, 'in_contract'),
    };
  });
};

const getPlanUnitsForDb = (area: Object) => {
  const currentPlanUnits = get(area, 'plan_units_current', []).map((planunit) => {
    planunit.in_contract = false;
    return planunit;
  });
  const contractPlanUnits = get(area, 'plan_units_contract', []).map((planunit) => {
    planunit.in_contract = true;
    return planunit;
  });
  const planUnits = currentPlanUnits.concat(contractPlanUnits);
  if(!planUnits.length) {
    return [];
  }
  return planUnits.map((planunit) => {
    return {
      id: planunit.id || undefined,
      identifier: get(planunit, 'identifier'),
      area: formatDecimalNumberDb(get(planunit, 'area')),
      section_area: formatDecimalNumberDb(get(planunit, 'section_area')),
      address: get(planunit, 'address'),
      postal_code: get(planunit, 'postal_code'),
      city: get(planunit, 'city'),
      type: get(planunit, 'type'),
      in_contract: get(planunit, 'in_contract'),
      plot_division_identifier: get(planunit, 'plot_division_identifier'),
      plot_division_date_of_approval: get(planunit, 'plot_division_date_of_approval'),
      detailed_plan_identifier: get(planunit, 'detailed_plan_identifier'),
      detailed_plan_date_of_approval: get(planunit, 'detailed_plan_date_of_approval'),
      plan_unit_type: get(planunit, 'plan_unit_type'),
      plan_unit_state: get(planunit, 'plan_unit_state'),
    };
  });
};

export const addAreasFormValues = (payload: Object, values: Object) => {
  const areas = get(values, 'lease_areas', []);
  if(!areas.length) {
    payload.lease_areas = [];
  } else {
    payload.lease_areas = areas.map((area) => {
      return {
        id: area.id || undefined,
        identifier: get(area, 'identifier'),
        area: formatDecimalNumberDb(get(area, 'area')),
        section_area: formatDecimalNumberDb(get(area, 'area')),
        address: get(area, 'address'),
        postal_code: get(area, 'postal_code'),
        city: get(area, 'city'),
        type: get(area, 'type'),
        location: get(area, 'location'),
        plots: getPlotsForDb(area),
        plan_units: getPlanUnitsForDb(area),
      };
    });
  }

  return payload;
};

const getDecisionConditionsForDb = (decision: Object) => {
  const conditions = get(decision, 'conditions', []);
  if(!conditions.length) {
    return [];
  }
  return conditions.map((condition) => {
    return {
      id: condition.id || undefined,
      type: get(condition, 'type'),
      supervision_date: get(condition, 'supervision_date'),
      supervised_date: get(condition, 'supervised_date'),
      description: get(condition, 'description'),
    };
  });
};

export const addDecisionsFormValues = (payload: Object, values: Object) => {
  const decisions = get(values, 'decisions', []);
  if(!decisions.length) {
    payload.decisions = [];
  } else {
    payload.decisions = decisions.map((decision) => {
      return {
        id: decision.id || undefined,
        reference_number: get(decision, 'reference_number'),
        decision_maker: get(decision, 'decision_maker'),
        decision_date: get(decision, 'decision_date'),
        section: get(decision, 'section'),
        type: get(decision, 'type'),
        description: get(decision, 'description'),
        conditions: getDecisionConditionsForDb(decision),
      };
    });
  }

  return payload;
};

const getContractMortgageDocumentsForDb = (contract: Object) => {
  const documents = get(contract, 'mortgage_documents', []);
  if(!documents.length) {
    return [];
  }
  return documents.map((doc) => {
    return {
      id: doc.id || undefined,
      number: get(doc, 'number'),
      date: get(doc, 'date'),
      note: get(doc, 'note'),
    };
  });
};

const getContractChangesForDb = (contract: Object) => {
  const changes = get(contract, 'contract_changes', []);
  if(!changes.length) {
    return [];
  }
  return changes.map((change) => {
    return {
      id: change.id || undefined,
      signing_date: get(change, 'signing_date'),
      sign_by_date: get(change, 'sign_by_date'),
      first_call_sent: get(change, 'first_call_sent'),
      second_call_sent: get(change, 'second_call_sent'),
      third_call_sent: get(change, 'third_call_sent'),
      description: get(change, 'description'),
      decision: get(change, 'decision'),
    };
  });
};

export const addContractsFormValues = (payload: Object, values: Object) => {
  const contracts = get(values, 'contracts', []);
  if(!contracts.length) {
    payload.contracts = [];
  } else {
    payload.contracts = contracts.map((contract) => {
      return {
        id: contract.id || undefined,
        type: get(contract, 'type'),
        contract_number: get(contract, 'contract_number'),
        signing_date: get(contract, 'signing_date'),
        signing_note: get(contract, 'signing_note'),
        is_readjustment_decision: get(contract, 'is_readjustment_decision'),
        decision: get(contract, 'decision'),
        ktj_link: get(contract, 'ktj_link'),
        collateral_number: get(contract, 'collateral_number'),
        collateral_start_date: get(contract, 'collateral_start_date'),
        collateral_end_date: get(contract, 'collateral_end_date'),
        collateral_note: get(contract, 'collateral_note'),
        institution_identifier: get(contract, 'institution_identifier'),
        contract_changes: getContractChangesForDb(contract),
        mortgage_documents: getContractMortgageDocumentsForDb(contract),
      };
    });
  }

  return payload;
};

export const addInspectionsFormValues = (payload: Object, values: Object) => {
  const inspections = get(values, 'inspections', []);
  if(!inspections.length) {
    payload.inspections = [];
  } else {
    payload.inspections = inspections.map((inspection) => {
      return {
        id: inspection.id || undefined,
        inspector: get(inspection, 'inspector'),
        supervision_date: get(inspection, 'supervision_date'),
        supervised_date: get(inspection, 'supervised_date'),
        description: get(inspection, 'description'),
      };
    });
  }

  return payload;
};
