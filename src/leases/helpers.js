// @flow
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {isDirty} from 'redux-form';

import {
  ConstructabilityType,
  FormNames,
  LeaseState,
  LeaseStatus,
  RecipientOptions,
  RentCycles,
  RentDueDateTypes,
  RentTypes,
  TenantContactType,
} from './enums';
import {getContactFullName, getContentContact} from '$src/contacts/helpers';
import {getUserFullName} from '$src/users/helpers';
import {isEmptyValue} from '$util/helpers';
import {
  convertStrToDecimalNumber,
  fixedLengthNumber,
  sortByStartAndEndDateDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getCoordinatesOfGeometry} from '$util/map';
import {getIsEditMode} from './selectors';
import {removeSessionStorageItem} from '$util/storage';

import type {Lease} from './types';
import type {AreasFeature, AreasGeoJson} from '$src/leases/components/leaseSections/map/AreasLayer';
import type {PlanUnitsFeature, PlanUnitsGeoJson} from '$src/leases/components/leaseSections/map/PlanUnitsLayer';
import type {PlotsFeature, PlotsGeoJson} from '$src/leases/components/leaseSections/map/PlotsLayer';

export const getContentLeaseIdentifier = (item:Object) => {
  if(isEmpty(item)) {
    return null;
  }

  return `${get(item, 'identifier.type.identifier')}${get(item, 'identifier.municipality.identifier')}${fixedLengthNumber(get(item, 'identifier.district.identifier'), 2)}-${get(item, 'identifier.sequence')}`;
};

export const getContentLeaseTenants = (lease: Object, query: Object = {}) => {
  return get(lease, 'tenants', [])
    .map((item) => get(item, 'tenantcontact_set', []).find((x) => x.type === TenantContactType.TENANT))
    .filter((tenant) => query.only_past_tenants === 'true' ? isTenantArchived(tenant) : !isTenantArchived(tenant))
    .map((tenant) => tenant ? getContactFullName(tenant.contact) : null);
};

export const getContentLeaseOption = (lease: Lease) => {
  return {
    value: lease.id,
    label: getContentLeaseIdentifier(lease),
  };
};

export const getContentLeaseAreaIdentifiers = (lease: Object) => {
  return get(lease, 'lease_areas', [])
    .filter((area) => !area.archived_at)
    .map((area) => area.identifier);
};

export const getContentLeaseAddresses = (lease: Object) => {
  return get(lease, 'lease_areas')
    .filter((area) => !area.archived_at)
    .map((area) => [
      ...get(area, 'addresses', [])
        .map((address) => getFullAddress(address)),
    ]);
};

export const getContentLeaseItem = (lease: Object, query: Object = {}) => {
  return {
    id: lease.id,
    identifier: getContentLeaseIdentifier(lease),
    lease_area_identifiers: getContentLeaseAreaIdentifiers(lease),
    tenants: getContentLeaseTenants(lease, query),
    lessor: getContactFullName(lease.lessor),
    addresses: getContentLeaseAddresses(lease),
    state: lease.state,
    start_date: lease.start_date,
    end_date: lease.end_date,
  };
};

export const getContentLeases = (content: Object, query: Object) =>
  get(content, 'results', []).map((item) => getContentLeaseItem(item, query));

export const getContentLeaseInfo = (lease: Object) => {
  return {
    identifier: getContentLeaseIdentifier(lease),
    end_date: lease.end_date,
    start_date: lease.start_date,
    state: lease.state,
  };
};

export const getContentLeaseStatus = (lease: Object) => {
  const now = moment(),
    startDate = lease.start_date,
    endDate = lease.end_date;

  if(endDate && now.isAfter(endDate, 'day')) {
    return LeaseStatus.FINISHED;
  }
  if((!endDate && !startDate) || moment(startDate).isAfter(now, 'day')) {
    return LeaseStatus.PREPARATION;
  }

  return LeaseStatus.IN_EFFECT;
};

export const getContentHistory = (lease: Object) =>
  get(lease, 'history', []).map((item) => {
    return {
      active: item.active,
      end_date: item.end_date,
      identifier: item.identifier,
      start_date: item.start_date,
      type: item.type,
    };
  });

export const getContentLessor = (lessor: ?Object) => {
  if(!lessor) return {};

  return {
    id: lessor.id,
    value: lessor.id,
    label: getContactFullName(lessor),
    type: lessor.type,
    first_name: lessor.first_name,
    last_name: lessor.last_name,
    name: lessor.name,
  };
};

export const getContentUser = (user: ?Object) => {
  if(!user) return {};

  return {
    id: user.id,
    value: user.id,
    label: getUserFullName(user),
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

const getContentInfillDevelopmentCompensations = (lease: Lease) =>
  get(lease, 'infill_development_compensations', []).map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

export const getContentSummary = (lease: Object) => {
  return {
    state: lease.state,
    start_date: lease.start_date,
    end_date: lease.end_date,
    lessor: getContentLessor(lease.lessor),
    preparer: getContentUser(lease.preparer),
    classification: lease.classification,
    intended_use: lease.intended_use,
    supportive_housing: lease.supportive_housing,
    statistical_use: lease.statistical_use,
    intended_use_note: lease.intended_use_note,
    financing: lease.financing,
    management: lease.management,
    transferable: lease.transferable,
    regulated: lease.regulated,
    regulation: lease.regulation,
    hitas: lease.hitas,
    notice_period: lease.notice_period,
    notice_note: lease.notice_note,
    reference_number: lease.reference_number,
    note: lease.note,
    tenants: getContentTenants(lease).filter((tenant) => isTenantActive(tenant.tenant)),
    lease_areas: getContentLeaseAreas(lease).filter((area) => !area.archived_at),
    constructability_areas: getContentConstructability(lease),
    infill_development_compensations: getContentInfillDevelopmentCompensations(lease),
    is_subject_to_vat: lease.is_subject_to_vat,
  };
};

export const getContentRelatedLease = (content: Object, path: string = 'from_lease') =>
  get(content, path, {});

const compareRelatedLeases = (a, b) => {
  const endDateA = get(a, 'lease.end_date'),
    endDateB = get(b, 'lease.end_date'),
    startDateA = get(a, 'lease.start_date'),
    startDateB = get(b, 'lease.start_date');

  if(endDateA !== endDateB) {
    if(!endDateA) {
      return -1;
    }
    if(!endDateB) {
      return 1;
    }
    if(endDateA > endDateB) {
      return -1;
    }
    if(endDateA < endDateB) {
      return 1;
    }
  }
  if(startDateA !== startDateB) {
    if(!startDateA) {
      return -1;
    }
    if(!startDateB) {
      return 1;
    }
    if(startDateA > startDateB) {
      return -1;
    }
    if(startDateA < startDateB) {
      return 1;
    }
  }
  return 0;
};

export const getContentRelatedLeasesFrom = (lease: Object) =>
  get(lease, 'related_leases.related_from', [])
    .map((relatedLease) => {
      return {
        id: relatedLease.id,
        lease: getContentRelatedLease(relatedLease, 'from_lease'),
      };
    })
    .sort(compareRelatedLeases);

export const getContentRelatedLeasesTo = (lease: Object) =>
  get(lease, 'related_leases.related_to', [])
    .map((relatedLease) => {
      return {
        id: relatedLease.id,
        lease: getContentRelatedLease(relatedLease, 'to_lease'),
      };
    })
    .sort(compareRelatedLeases);

export const getContentAddresses = (addresses: Array<Object>) => {
  if(isEmpty(addresses)) {return [];}

  return addresses.map((address) => {
    return {
      id: address.id,
      address: address.address,
      postal_code: address.postal_code,
      city: address.city,
    };
  });
};

export const getContentPlots = (plots: Array<Object>, inContract: boolean): Array<Object> => {
  if(!plots || !plots.length) {return [];}

  return plots.filter((plot) => plot.in_contract === inContract).map((plot) => {
    return {
      id: plot.id,
      identifier: plot.identifier,
      geometry: plot.geometry,
      area: plot.area,
      section_area: plot.section_area,
      postal_code: plot.postal_code,
      city: plot.city,
      type: plot.type,
      registration_date: plot.registration_date,
      repeal_date: plot.repeal_date,
      in_contract: plot.in_contract,
    };
  });
};

export const getContentPlanUnits = (planunits: Array<Object>, inContract: boolean): Array<Object> => {
  if(!planunits || !planunits.length) {return [];}

  return planunits.filter((planunit) => planunit.in_contract === inContract).map((planunit) => {
    return {
      id: planunit.id,
      identifier: planunit.identifier,
      geometry: planunit.geometry,
      area: planunit.area,
      section_area: planunit.section_area,
      postal_code: planunit.postal_code,
      city: planunit.city,
      in_contract: planunit.in_contract,
      plot_division_identifier: planunit.plot_division_identifier,
      plot_division_date_of_approval: planunit.plot_division_date_of_approval,
      plot_division_state: get(planunit, 'plot_division_state.id') || get(planunit, 'plot_division_state'),
      detailed_plan_identifier: planunit.detailed_plan_identifier,
      detailed_plan_latest_processing_date: planunit.detailed_plan_latest_processing_date,
      detailed_plan_latest_processing_date_note: planunit.detailed_plan_latest_processing_date_note,
      plan_unit_type: get(planunit, 'plan_unit_type.id') || get(planunit, 'plan_unit_type'),
      plan_unit_state: get(planunit, 'plan_unit_state.id') || get(planunit, 'plan_unit_state'),
      plan_unit_intended_use: get(planunit, 'plan_unit_intended_use.id') || get(planunit, 'plan_unit_intended_use'),
    };
  });
};

export const getContentLeaseAreaItem = (area: Object) => {
  return {
    id: area.id,
    identifier: area.identifier,
    geometry: area.geometry,
    area: area.area,
    section_area: area.section_area,
    addresses: getContentAddresses(area.addresses),
    postal_code: area.postal_code,
    city: area.city,
    type: area.type,
    location: area.location,
    plots_current: getContentPlots(get(area, 'plots', []), false),
    plots_contract: getContentPlots(get(area, 'plots', []), true),
    plan_units_current: getContentPlanUnits(get(area, 'plan_units', []), false),
    plan_units_contract: getContentPlanUnits(get(area, 'plan_units', []), true),
    archived_at: area.archived_at,
    archived_note: area.archived_note,
    archived_decision: get(area, 'archived_decision.id') || get(area, 'archived_decision'),
  };
};

export const getContentLeaseAreas = (lease: Object) =>
  get(lease, 'lease_areas', []).map((area) => getContentLeaseAreaItem(area));

export const getContentComments = (content: Array<Object>): Array<Object> => {
  if(!content || !content.length) {return [];}

  return content.map((comment) => {
    return {
      id: comment.id,
      created_at: comment.created_at,
      modified_at: comment.modified_at,
      is_archived: comment.is_archived,
      text: comment.text,
      topic: get(comment, 'topic.id') || get(comment, 'topic'),
      user: getContentUser(comment.user),
      lease: comment.lease,
    };
  });
};

export const getContentDecisionConditions = (decision: Object) =>
  get(decision, 'conditions', []).map((condition) => {
    return {
      id: condition.id,
      type: get(condition, 'type.id') || get(condition, 'type'),
      supervision_date: condition.supervision_date,
      supervised_date: condition.supervised_date,
      description: condition.description,
    };
  });

export const getContentDecisionItem = (decision: Object) => {
  return {
    id: decision.id,
    reference_number: decision.reference_number,
    decision_maker: get(decision, 'decision_maker.id') || get(decision, 'decision_maker'),
    decision_date: decision.decision_date,
    section: decision.section,
    type: get(decision, 'type.id') || get(decision, 'type'),
    description: decision.description,
    conditions: getContentDecisionConditions(decision),
  };
};

export const getContentDecisions = (lease: Object) =>
  get(lease, 'decisions', []).map((decision) => getContentDecisionItem(decision));

export const getContentContractChanges = (contract: Object) =>
  get(contract, 'contract_changes', []).map((change) => {
    return ({
      id: change.id,
      signing_date: change.signing_date,
      sign_by_date: change.sign_by_date,
      first_call_sent: change.first_call_sent,
      second_call_sent: change.second_call_sent,
      third_call_sent: change.third_call_sent,
      description: change.description,
      decision: get(change, 'decision.id') || get(change, 'decision'),
    });
  });

export const getContentContractMortageDocuments = (contract: Object) =>
  get(contract, 'mortgage_documents', []).map((doc) => {
    return ({
      id: doc.id,
      number: doc.number,
      date: doc.date,
      note: doc.note,
    });
  });

export const getContentContractItem = (contract: Object) => {
  return {
    id: contract.id,
    type: get(contract, 'type.id') || get(contract, 'type'),
    contract_number: contract.contract_number,
    signing_date: contract.signing_date,
    signing_note: contract.signing_note,
    is_readjustment_decision: contract.is_readjustment_decision,
    decision: get(contract, 'decision.id') || get(contract, 'decision'),
    ktj_link: contract.ktj_link,
    collateral_number: contract.collateral_number,
    collateral_start_date: contract.collateral_start_date,
    collateral_end_date: contract.collateral_end_date,
    collateral_note: contract.collateral_note,
    institution_identifier: contract.institution_identifier,
    contract_changes: getContentContractChanges(contract),
    mortgage_documents: getContentContractMortageDocuments(contract),
  };
};

export const getContentContracts = (lease: Object) =>
  get(lease, 'contracts', []).map((contract) => getContentContractItem(contract));

export const getContentInspectionItem = (inspection: Object) => {
  return {
    id: inspection.id,
    inspector: inspection.inspector,
    supervision_date: inspection.supervision_date,
    supervised_date: inspection.supervised_date,
    description: inspection.description,
  };
};

export const getContentInspections = (lease: Object) =>
  get(lease, 'inspections', []).map((inspection) => getContentInspectionItem(inspection));

export const getContentConstructabilityDescriptions = (area: Object, type: string) => {
  return get(area, 'constructability_descriptions', [])
    .filter((description) => description.type === type)
    .map((description) => {
      return {
        id: description.id,
        type: description.type,
        user: getContentUser(description.user),
        text: description.text,
        ahjo_reference_number: description.ahjo_reference_number,
        modified_at: description.modified_at,
      };
    });
};

export const getContentConstructability = (lease: Object) =>
  get(lease, 'lease_areas', []).map((area) => {
    return {
      id: area.id,
      identifier: area.identifier,
      type: area.type,
      location: area.location,
      area: area.area,
      section_area: area.section_area,
      address: area.address,
      postal_code: area.postal_code,
      city: area.city,
      preconstruction_state: area.preconstruction_state,
      demolition_state: area.demolition_state,
      polluted_land_state: area.polluted_land_state,
      polluted_land_rent_condition_state: area.polluted_land_rent_condition_state,
      polluted_land_rent_condition_date: area.polluted_land_rent_condition_date,
      polluted_land_planner: getContentUser(area.polluted_land_planner),
      polluted_land_projectwise_number: area.polluted_land_projectwise_number,
      polluted_land_matti_report_number: area.polluted_land_matti_report_number,
      constructability_report_state: area.constructability_report_state,
      constructability_report_investigation_state: area.constructability_report_investigation_state,
      constructability_report_signing_date: area.constructability_report_signing_date,
      constructability_report_signer: area.constructability_report_signer,
      constructability_report_geotechnical_number: area.constructability_report_geotechnical_number,
      other_state: area.other_state,
      descriptionsPreconstruction: getContentConstructabilityDescriptions(area, ConstructabilityType.PRECONSTRUCTION),
      descriptionsDemolition: getContentConstructabilityDescriptions(area, ConstructabilityType.DEMOLITION),
      descriptionsPollutedLand: getContentConstructabilityDescriptions(area, ConstructabilityType.POLLUTED_LAND),
      descriptionsReport: getContentConstructabilityDescriptions(area, ConstructabilityType.REPORT),
      descriptionsOther: getContentConstructabilityDescriptions(area, ConstructabilityType.OTHER),
    };
  });

export const getContentContactDetails = (contact: Object) => {
  return {
    id: contact.id,
    type: contact.type,
    contact: getContentContact(contact.contact),
    start_date: contact.start_date,
    end_date: contact.end_date,
  };
};

export const getContentTenantItem = (tenant: Object) => {
  const contact = get(tenant, 'tenantcontact_set', []).find(x => x.type === TenantContactType.TENANT);

  return contact ? getContentContactDetails(contact) : {};
};

export const getContentTenantBillingPersons = (tenant: Object) =>
  get(tenant, 'tenantcontact_set', [])
    .filter((x) => x.type === TenantContactType.BILLING)
    .map((contact) => contact ? getContentContactDetails(contact) : {})
    .sort((a, b) => sortStringByKeyDesc(a, b, 'start_date'));

export const getContentTenantContactPersons = (tenant: Object) =>
  get(tenant, 'tenantcontact_set', [])
    .filter((x) => x.type === TenantContactType.CONTACT)
    .map((contact) => contact ? getContentContactDetails(contact) : {})
    .sort((a, b) => sortStringByKeyDesc(a, b, 'start_date'));

export const getContentTenants = (lease: Object) =>
  get(lease, 'tenants', []).map((tenant) => {
    return {
      id: tenant.id,
      share_numerator: tenant.share_numerator,
      share_denominator: tenant.share_denominator,
      reference: tenant.reference,
      tenant: getContentTenantItem(tenant),
      billing_persons: getContentTenantBillingPersons(tenant),
      contact_persons: getContentTenantContactPersons(tenant),
    };
  }).sort((a, b) => sortStringByKeyDesc(a, b, 'tenant.start_date'));

export const getContentTenantsFormData = (lease: Object) => {
  const tenants = getContentTenants(lease);

  return {
    tenants: tenants.filter((tenant) => !isTenantArchived(tenant.tenant)),
    tenantsArchived: tenants.filter((tenant) => isTenantArchived(tenant.tenant)),
  };
};

export const getContentPayableRents = (rent: Object) =>
  get(rent, 'payable_rents', [])
    .map((item) => {
      return {
        id: item.id || undefined,
        amount: item.amount,
        start_date: item.start_date,
        end_date: item.end_date,
        difference_percent: item.difference_percent,
        calendar_year_rent: item.calendar_year_rent,
      };
    })
    .sort(sortByStartAndEndDateDesc);

export const getContentRentAdjustments = (rent: Object) =>
  get(rent, 'rent_adjustments', [])
    .map((item) => {
      return {
        id: item.id || undefined,
        type: item.type,
        intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
        start_date: item.start_date,
        end_date: item.end_date,
        full_amount: item.full_amount,
        amount_type: get(item, 'amount_type.id') || get(item, 'amount_type'),
        amount_left: item.amount_left,
        decision: get(item, 'decision.id') || get(item, 'decision'),
        note: item.note,
      };
    })
    .sort(sortByStartAndEndDateDesc);

export const getContentIndexAdjustedRents = (rent: Object) =>
  get(rent, 'index_adjusted_rents', [])
    .map((item) => {
      return {
        item: item.id || undefined,
        amount: item.amount,
        intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
        start_date: item.start_date,
        end_date: item.end_date,
        factor: item.factor,
      };
    })
    .sort(sortByStartAndEndDateDesc);

export const getContentContractRents = (rent: Object) =>
  get(rent, 'contract_rents', [])
    .map((item) => {
      return {
        id: item.id || undefined,
        amount: item.amount,
        period: item.period,
        intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
        base_amount: item.base_amount,
        base_amount_period: item.base_amount_period,
        base_year_rent: item.base_year_rent,
        start_date: item.start_date,
        end_date: item.end_date,
      };
    })
    .sort(sortByStartAndEndDateDesc);

export const getContentFixedInitialYearRents = (rent: Object) =>
  get(rent, 'fixed_initial_year_rents', [])
    .map((item) => {
      return {
        id: item.id || undefined,
        intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
        amount: item.amount,
        start_date: item.start_date,
        end_date: item.end_date,
      };
    })
    .sort(sortByStartAndEndDateDesc);

export const getContentRentDueDate = (rent: Object, path?: string = 'due_dates') =>
  get(rent, path, []).map((date) => ({
    id: date.id || undefined,
    day: date.day,
    month: date.month,
  }));


export const getContentRents = (lease: Object) =>
  get(lease, 'rents', [])
    .map((rent) => {
      return {
        id: rent.id || undefined,
        type: rent.type,
        start_date: rent.start_date,
        end_date: rent.end_date,
        cycle: rent.cycle,
        index_type: rent.index_type,
        due_dates_type: rent.due_dates_type,
        due_dates_per_year: rent.due_dates_per_year,
        manual_ratio: rent.manual_ratio,
        manual_ratio_previous: rent.manual_ratio_previous,
        elementary_index: rent.elementary_index,
        index_rounding: rent.index_rounding,
        x_value: rent.x_value,
        y_value: rent.y_value,
        y_value_start: rent.y_value_start,
        equalization_start_date: rent.equalization_start_date,
        equalization_end_date: rent.equalization_end_date,
        seasonal_start_day: rent.seasonal_start_day,
        seasonal_start_month: rent.seasonal_start_month,
        seasonal_end_day: rent.seasonal_end_day,
        seasonal_end_month: rent.seasonal_end_month,
        amount: rent.amount,
        note: rent.note,
        is_active: rent.is_active,
        due_dates: getContentRentDueDate(rent),
        fixed_initial_year_rents: getContentFixedInitialYearRents(rent),
        contract_rents: getContentContractRents(rent),
        index_adjusted_rents: getContentIndexAdjustedRents(rent),
        rent_adjustments: getContentRentAdjustments(rent),
        payable_rents: getContentPayableRents(rent),
        yearly_due_dates: getContentRentDueDate(rent, 'yearly_due_dates'),
      };
    })
    .sort(sortByStartAndEndDateDesc);

export const getContentRentsFormData = (lease: Object) => {
  const rents = getContentRents(lease);

  return {
    rents: rents.filter((rent) => !isRentArchived(rent)),
    rentsArchived: rents.filter((rent) => isRentArchived(rent)),
  };
};

export const getContentBasisOfRents = (lease: Object, archived: boolean = true) =>
  get(lease, 'basis_of_rents', [])
    .map((item) => {
      return {
        id: item.id || undefined,
        intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
        area: item.area,
        area_unit: item.area_unit,
        amount_per_area: item.amount_per_area,
        index: get(item, 'index.id') || get(item, 'index'),
        profit_margin_percentage: item.profit_margin_percentage,
        discount_percentage: item.discount_percentage,
        plans_inspected_at: item.plans_inspected_at,
        plans_inspected_by: item.plans_inspected_by,
        locked_at: item.locked_at,
        locked_by: item.locked_by,
        archived_at: item.archived_at,
      };
    })
    .filter((item) => !!item.archived_at === archived);

export const getFullAddress = (item: Object) => {
  if(isEmpty(item)) return null;

  return `${item.address || ''}${(item.postal_code || item.city) ? ', ' : ''}
    ${item.postal_code || ''} ${item.city || ''}`;
};

export const getInvoiceRecipientOptions = (lease: Object) =>{
  const items = getContentTenants(lease);

  return [{value: RecipientOptions.ALL, label: 'Kaikki'},
    ...items
      .filter((item) => isTenantActive(item.tenant))
      .map((item) => {
        return {
          value: get(item, 'tenant.contact.id'),
          label: getContactFullName(get(item, 'tenant.contact')),
        };
      })
      .sort((a, b) => sortStringByKeyAsc(a, b, 'label')),
  ];
};

export const getInvoiceTenantOptions = (lease: Object) =>{
  const items = getContentTenants(lease);

  return items.map((item) => {
    return {
      value: item.id,
      label: getContactFullName(get(item, 'tenant.contact')),
    };
  });
};

// Helper functions to get lease map content
export const getContentLeaseAreasFeatures = (areas: Array<Object>): Array<AreasFeature>  => {
  return areas.map((area) => {
    return {
      type: 'Feature',
      geometry: area.geometry,
      properties: {
        id: area.id,
        feature_type: 'area',
        area: area.area,
        identifier: area.identifier,
        location: area.location,
        type: area.type,
      },
    };
  });
};

export const getContentAreasGeoJson = (lease: Lease): AreasGeoJson => {
  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);

  const features = getContentLeaseAreasFeatures(areas);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

export const getContentLeasePlotsFeatures = (plots: Array<Object>): PlotsFeature => {
  return plots.map((plot) => {
    return {
      type: 'Feature',
      geometry: plot.geometry,
      properties: {
        id: plot.id,
        feature_type: 'plot',
        area: plot.area,
        identifier: plot.identifier,
        registration_date: plot.registration_date,
        repeal_date: plot.repeal_date,
        section_area: plot.section_area,
        type: plot.type,
      },
    };
  });
};

export const getContentPlotsGeoJson = (lease: Lease, inContract: boolean = false): PlotsGeoJson => {
  const plots = [];
  get(lease, 'lease_areas', [])
    .filter((area) => !area.archived_at)
    .forEach((area) => {
      plots.push(
        ...get(area, 'plots', [])
          .filter((plot) => plot.in_contract === inContract)
      );
    });

  const features = getContentLeasePlotsFeatures(plots);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

export const getContentPlanUnitFeatures = (planUnits: Array<Object>): PlanUnitsFeature => {
  return planUnits.map((planUnit) => {
    return {
      type: 'Feature',
      geometry: planUnit.geometry,
      properties: {
        id: planUnit.id,
        feature_type: 'plan_unit',
        identifier: planUnit.identifier,
        area: planUnit.area,
        section_area: planUnit.section_area,
        detailed_plan_identifier: planUnit.detailed_plan_identifier,
        detailed_plan_latest_processing_date: planUnit.detailed_plan_latest_processing_date,
        detailed_plan_latest_processing_date_note: planUnit.detailed_plan_latest_processing_date_note,
        plot_division_identifier: planUnit.plot_division_identifier,
        plot_division_date_of_approval: planUnit.plot_division_date_of_approval,
        plot_division_state: planUnit.plot_division_state,
        plan_unit_type: planUnit.plan_unit_type,
        plan_unit_state: planUnit.plan_unit_state,
        plan_unit_intended_use: planUnit.plan_unit_intended_use,
      },
    };
  });
};

export const getContentPlanUnitsGeoJson = (lease: Lease, inContract: boolean = false): PlanUnitsGeoJson => {
  const planUnits = [];
  get(lease, 'lease_areas', [])
    .filter((area) => !area.archived_at)
    .forEach((area) => {
      planUnits.push(
        ...get(area, 'plan_units', [])
          .filter((planUnit => planUnit.in_contract === inContract))
      );
    });

  const features = getContentPlanUnitFeatures(planUnits);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

export const getLeaseCoordinates = (lease: Lease) => {
  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);
  let coordinates = [];
  areas.forEach((area) => {
    coordinates = [...coordinates, ...getCoordinatesOfGeometry(area.geometry)];

    // const plots = get(area, 'plots', []);
    // plots.forEach((plot) => {
    //   coordinates = [...coordinates, ...getCoordinatesOfGeometry(plot.geometry)];
    // });
    //
    // const planUnits = get(area, 'plan_units', []);
    // planUnits.forEach((planUnit) => {
    //   coordinates = [...coordinates, ...getCoordinatesOfGeometry(planUnit.geometry)];
    // });
  });
  return coordinates;
};

export const addSummaryFormValues = (payload: Object, summary: Object) => {
  payload.state = summary.state;
  payload.start_date = summary.start_date;
  payload.end_date = summary.end_date;
  payload.lessor = get(summary, 'lessor.value');
  payload.preparer = get(summary, 'preparer.value');
  payload.classification = summary.classification;
  payload.intended_use = summary.intended_use;
  payload.supportive_housing = summary.supportive_housing;
  payload.statistical_use = summary.statistical_use;
  payload.intended_use_note = summary.intended_use_note;
  payload.financing = summary.financing;
  payload.management = summary.management;
  payload.transferable = summary.transferable;
  payload.regulated = summary.regulated;
  payload.regulation = summary.regulation;
  payload.hitas = summary.hitas;
  payload.notice_period = summary.notice_period;
  payload.notice_note = summary.notice_note;
  payload.reference_number = summary.reference_number;
  payload.note = summary.note;
  payload.is_subject_to_vat = summary.is_subject_to_vat;

  return payload;
};

const getAddressesForDb = (addresses: Array<Object>) =>
  addresses.map((address) => {
    return {
      id: address.id || undefined,
      address: address.address,
      postal_code: address.postal_code,
      city: address.city,
    };
  });

const getPlotsForDb = (area: Object) => {
  const currentPlots = get(area, 'plots_current', []).map((plot) => {
    return {...plot, 'in_contract': false};
  });
  const contractPlots = get(area, 'plots_contract', []).map((plot) => {
    return {...plot, 'in_contract': true};
  });
  const plots = currentPlots.concat(contractPlots);

  return plots.map((plot) => {
    return {
      id: plot.id || undefined,
      identifier: plot.identifier,
      area: convertStrToDecimalNumber(plot.area),
      section_area: convertStrToDecimalNumber(plot.section_area),
      postal_code: plot.postal_code,
      city: plot.city,
      type: plot.type,
      location: plot.location,
      registration_date: plot.registration_date,
      repeal_date: plot.repeal_date,
      in_contract: plot.in_contract,
    };
  });
};

const getPlanUnitsForDb = (area: Object) => {
  const currentPlanUnits = get(area, 'plan_units_current', []).map((planunit) => {
    return {...planunit, 'in_contract': false};
  });
  const contractPlanUnits = get(area, 'plan_units_contract', []).map((planunit) => {
    return {...planunit, 'in_contract': true};
  });

  const planUnits = currentPlanUnits.concat(contractPlanUnits);
  return planUnits.map((planunit) => {
    return {
      id: planunit.id || undefined,
      identifier: planunit.identifier,
      area: convertStrToDecimalNumber(planunit.area),
      section_area: convertStrToDecimalNumber(planunit.section_area),
      postal_code: planunit.postal_code,
      city: planunit.city,
      in_contract: planunit.in_contract,
      plot_division_identifier: planunit.plot_division_identifier,
      plot_division_date_of_approval: planunit.plot_division_date_of_approval,
      plot_division_state: planunit.plot_division_state,
      detailed_plan_identifier: planunit.detailed_plan_identifier,
      detailed_plan_latest_processing_date: planunit.detailed_plan_latest_processing_date,
      detailed_plan_latest_processing_date_note: planunit.detailed_plan_latest_processing_date_note,
      plan_unit_type: planunit.plan_unit_type,
      plan_unit_state: planunit.plan_unit_state,
      plan_unit_intended_use: planunit.plan_unit_intended_use,
    };
  });
};

export const addAreasFormValues = (payload: Object, values: Object) => {
  const areas = [...get(values, 'lease_areas_active', []), ...get(values, 'lease_areas_archived', [])];

  payload.lease_areas = areas.map((area) => {
    return {
      id: area.id || undefined,
      identifier: area.identifier,
      area: convertStrToDecimalNumber(area.area),
      section_area: convertStrToDecimalNumber(area.area),
      addresses: getAddressesForDb(get(area, 'addresses', [])),
      type: area.type,
      location: area.location,
      plots: getPlotsForDb(area),
      plan_units: getPlanUnitsForDb(area),
      archived_at: area.archived_at,
      archived_note: area.archived_note,
      archived_decision: area.archived_decision,
    };
  });

  return payload;
};

const getDecisionConditionsForDb = (decision: Object) => {
  return get(decision, 'conditions', []).map((condition) => {
    return {
      id: condition.id || undefined,
      type: condition.type,
      supervision_date: condition.supervision_date,
      supervised_date: condition.supervised_date,
      description: condition.description,
    };
  });
};

export const addDecisionsFormValues = (payload: Object, values: Object) => {
  payload.decisions = get(values, 'decisions', []).map((decision) => {
    return {
      id: decision.id || undefined,
      reference_number: decision.reference_number,
      decision_maker: decision.decision_maker,
      decision_date: decision.decision_date,
      section: decision.section,
      type: decision.type,
      description: decision.description,
      conditions: getDecisionConditionsForDb(decision),
    };
  });

  return payload;
};

const getContractMortgageDocumentsForDb = (contract: Object) => {
  return get(contract, 'mortgage_documents', []).map((doc) => {
    return {
      id: doc.id || undefined,
      number: doc.number,
      date: doc.date,
      note: doc.note,
    };
  });
};

const getContractChangesForDb = (contract: Object) => {
  return get(contract, 'contract_changes', []).map((change) => {
    return {
      id: change.id || undefined,
      signing_date: change.signing_date,
      sign_by_date: change.sign_by_date,
      first_call_sent: change.first_call_sent,
      second_call_sent: change.second_call_sent,
      third_call_sent: change.third_call_sent,
      description: change.description,
      decision: change.decision,
    };
  });
};

export const addContractsFormValues = (payload: Object, values: Object) => {
  payload.contracts = get(values, 'contracts', []).map((contract) => {
    return {
      id: contract.id || undefined,
      type: contract.type,
      contract_number: contract.contract_number,
      signing_date: contract.signing_date,
      signing_note: contract.signing_note,
      is_readjustment_decision: contract.is_readjustment_decision,
      decision: contract.decision,
      ktj_link: contract.ktj_link,
      collateral_number: contract.collateral_number,
      collateral_start_date: contract.collateral_start_date,
      collateral_end_date: contract.collateral_end_date,
      collateral_note: contract.collateral_note,
      institution_identifier: contract.institution_identifier,
      contract_changes: getContractChangesForDb(contract),
      mortgage_documents: getContractMortgageDocumentsForDb(contract),
    };
  });

  return payload;
};

export const addInspectionsFormValues = (payload: Object, values: Object) => {
  payload.inspections = get(values, 'inspections', []).map((inspection) => {
    return {
      id: inspection.id || undefined,
      inspector: inspection.inspector,
      supervision_date: inspection.supervision_date,
      supervised_date: inspection.supervised_date,
      description: inspection.description,
    };
  });

  return payload;
};

export const getConstructabilityDescriptionsForDb = (area: Object) => {
  const descriptionsPreconstruction = get(area, 'descriptionsPreconstruction', []).map((description) => {
    return {...description, 'type': ConstructabilityType.PRECONSTRUCTION};
  });
  const descriptionsDemolition = get(area, 'descriptionsDemolition', []).map((description) => {
    return {...description, 'type': ConstructabilityType.DEMOLITION};
  });
  const descriptionsPollutedLand = get(area, 'descriptionsPollutedLand', []).map((description) => {
    return {...description, 'type': ConstructabilityType.POLLUTED_LAND};
  });
  const descriptionsReport = get(area, 'descriptionsReport', []).map((description) => {
    return {...description, 'type': ConstructabilityType.REPORT};
  });
  const descriptionsOther = get(area, 'descriptionsOther', []).map((description) => {
    return {...description, 'type': ConstructabilityType.OTHER};
  });
  const descriptions = [
    ...descriptionsPreconstruction,
    ...descriptionsDemolition,
    ...descriptionsPollutedLand,
    ...descriptionsReport,
    ...descriptionsOther,
  ];

  return descriptions.map((description) => {
    return {
      id: description.id || undefined,
      type: description.type,
      text: description.text,
      ahjo_reference_number: description.ahjo_reference_number,
    };
  });
};

export const getConstructabilityItemForDb = (area: Object, values: Object) => {
  area.preconstruction_state = values.preconstruction_state;
  area.demolition_state = values.demolition_state;
  area.polluted_land_state = values.polluted_land_state;
  area.polluted_land_rent_condition_state = values.polluted_land_rent_condition_state;
  area.polluted_land_rent_condition_date = values.polluted_land_rent_condition_date;
  area.polluted_land_planner = values.polluted_land_planner.value;
  area.polluted_land_projectwise_number = values.polluted_land_projectwise_number;
  area.polluted_land_matti_report_number = values.polluted_land_matti_report_number;
  area.constructability_report_state = values.constructability_report_state;
  area.constructability_report_investigation_state = values.constructability_report_investigation_state;
  area.constructability_report_signing_date = values.constructability_report_signing_date;
  area.constructability_report_signer = values.constructability_report_signer;
  area.constructability_report_geotechnical_number = values.constructability_report_geotechnical_number;
  area.other_state = values.other_state;
  area.constructability_descriptions = getConstructabilityDescriptionsForDb(values);
  return area;
};

export const addConstructabilityFormValues = (payload: Object, values: Object) => {
  const areas = payload.lease_areas;
  const constAreas = get(values, 'lease_areas', []);
  if(areas && !!areas.length) {
    payload.lease_areas = areas.map((area) => {
      const constArea = constAreas.find(x => x.id === area.id);
      if(constArea) {
        return getConstructabilityItemForDb(area, constArea);
      }
      return area;
    });
  } else if(constAreas && !!constAreas.length) {
    payload.lease_areas = constAreas.map((area) => {
      return getConstructabilityItemForDb({
        id: area.id,
        city: area.city,
        location: area.location,
        area: area.area,
        identifier: area.identifier,
        type: area.type,
        address: area.address,
        postal_code: area.postal_code,
        section_area: area.section_area,
      }, area);
    });
  } else {
    payload.lease_areas = [];
  }
  return payload;
};

const ContactType = PropTypes.oneOf([TenantContactType.TENANT, TenantContactType.BILLING, TenantContactType.CONTACT]);

export const getTenantContactDetailsForDb = (tenant: Object, contactType: ContactType) => (
  {
    id: tenant.id || undefined,
    type: contactType,
    contact: tenant.contact,
    start_date: tenant.start_date,
    end_date: tenant.end_date,
  }
);

export const getTenantContactSetForDb = (tenant: Object) => {
  const contacts = [];
  const tenantData = tenant.tenant;
  contacts.push(getTenantContactDetailsForDb(tenantData, TenantContactType.TENANT));

  const billingPersons = get(tenant, 'billing_persons', []);
  billingPersons.forEach((billingPerson) => {
    contacts.push(getTenantContactDetailsForDb(billingPerson, TenantContactType.BILLING));
  });
  const contactPersons = get(tenant, 'contact_persons', []);
  contactPersons.forEach((contactPerson) => {
    contacts.push(getTenantContactDetailsForDb(contactPerson, TenantContactType.CONTACT));
  });

  return contacts;
};

export const addTenantsFormValues = (payload: Object, values: Object) => {
  const tenantsCurrent = get(values, 'tenants', []);
  const tenantsArchived = get(values, 'tenantsArchived', []);
  const tenants = [...tenantsCurrent, ...tenantsArchived];

  payload.tenants = tenants.map((tenant) => {
    return {
      id: tenant.id || undefined,
      share_numerator: tenant.share_numerator,
      share_denominator: tenant.share_denominator,
      reference: tenant.reference,
      tenantcontact_set: getTenantContactSetForDb(tenant),
    };
  });

  return payload;
};

export const getContentRentAdjustmentsForDb = (rent: Object) =>
  get(rent, 'rent_adjustments', []).map((item) => {
    return {
      id: item.id || undefined,
      type: item.type,
      intended_use: item.intended_use,
      start_date: item.start_date,
      end_date: item.end_date,
      full_amount: convertStrToDecimalNumber(item.full_amount),
      amount_type: item.amount_type,
      amount_left: convertStrToDecimalNumber(item.amount_left),
      decision: item.decision,
      note: item.note,
    };
  });

export const getContentContractRentsForDb = (rent: Object, rentType: string) =>
  get(rent, 'contract_rents', []).map((item) => {
    const contractRentData: any = {
      id: item.id || undefined,
      amount: convertStrToDecimalNumber(item.amount),
      period: item.period,
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      start_date: item.start_date,
      end_date: item.end_date,
    };

    // Patch these fields only if rent type is index or manual
    if(rentType === RentTypes.INDEX || rentType === RentTypes.MANUAL) {
      contractRentData.base_amount = convertStrToDecimalNumber(item.base_amount);
      contractRentData.base_amount_period = item.base_amount_period;
      contractRentData.base_year_rent = convertStrToDecimalNumber(item.base_year_rent);
    }

    return contractRentData;
  });

export const getContentFixedInitialYearRentsForDb = (rent: Object) =>
  get(rent, 'fixed_initial_year_rents', []).map((item) => {
    return {
      id: item.id || undefined,
      intended_use: item.intended_use,
      amount: convertStrToDecimalNumber(item.amount),
      start_date: item.start_date,
      end_date: item.end_date,
    };
  });

export const getContentRentDueDatesForDb = (rent: Object) => {
  const type = rent.type;
  const dueDates = get(rent, 'due_dates', []);

  if(type === RentTypes.ONE_TIME) {
    return dueDates.length
      ? [{
        id: dueDates[0].id || undefined,
        day: dueDates[0].day,
        month: dueDates[0].month,
      }]
      : [];
  }
  return dueDates.map((date) => {
    return {
      id: date.id || undefined,
      day: date.day,
      month: date.month,
    };
  });
};


export const getSavedBasisOfRent = (lease: Lease, id: ?number) => {
  const basisOfRentsActive = getContentBasisOfRents(lease, false);
  const basisOfRentsArchived = getContentBasisOfRents(lease, true);
  const basisOfRents = [...basisOfRentsActive, ...basisOfRentsArchived];

  if(basisOfRents.length && isEmptyValue(id)) return null;
  return basisOfRents.find((rent) => rent.id === id);
};

export const addRentsFormValues = (payload: Object, values: Object, currentLease: Lease) => {
  payload.is_rent_info_complete = values.is_rent_info_complete ? true : false;

  const basisOfRents = [...get(values, 'basis_of_rents', []), ...get(values, 'basis_of_rents_archived', [])];
  payload.basis_of_rents = basisOfRents.map((item) => {
    const savedBasisOfRent = getSavedBasisOfRent(currentLease, item.id);

    if(savedBasisOfRent && savedBasisOfRent.locked_at) {
      return {
        id: item.id,
        locked_at: item.locked_at,
      };
    } else {
      const basisOfRentData: any = {
        id: item.id || undefined,
        intended_use: item.intended_use,
        area: convertStrToDecimalNumber(item.area),
        area_unit: item.area_unit,
        amount_per_area: convertStrToDecimalNumber(item.amount_per_area),
        index: item.index,
        profit_margin_percentage: convertStrToDecimalNumber(item.profit_margin_percentage),
        discount_percentage: convertStrToDecimalNumber(item.discount_percentage),
        plans_inspected_at: item.plans_inspected_at,
        locked_at: item.locked_at,
        archived_at: item.archived_at,
      };

      return basisOfRentData;
    }
  });

  const rentsCurrent = get(values, 'rents', []);
  const rentsArchived = get(values, 'rentsArchived', []);
  const rents = [...rentsCurrent, ...rentsArchived];

  payload.rents = rents.map((rent) => {
    const rentData: any = {
      id: rent.id || undefined,
      type: rent.type,
      start_date: rent.start_date,
      end_date: rent.end_date,
      note: rent.note,
    };

    // Patch amount only if rent type is one time
    if(rent.type === RentTypes.ONE_TIME) {
      rentData.amount = convertStrToDecimalNumber(rent.amount);
    }

    // Patch due dates data only if rent type is not free
    if(rent.type !== RentTypes.FREE) {
      rentData.due_dates_type = rent.due_dates_type;

      if(rent.due_dates_type === RentDueDateTypes.CUSTOM) {
        rentData.due_dates = getContentRentDueDatesForDb(rent);
      } else if (rent.due_dates_type === RentDueDateTypes.FIXED) {
        rentData.due_dates_per_year = rent.due_dates_per_year;
      }
    }

    // Patch cycle, index type, fixed initial year rents and contract rents data only if rent type is index or manual
    if(rent.type === RentTypes.INDEX || rent.type === RentTypes.MANUAL) {
      rentData.cycle = rent.cycle;
      rentData.index_type = rent.index_type;
      rentData.fixed_initial_year_rents = getContentFixedInitialYearRentsForDb(rent);
      rentData.contract_rents = getContentContractRentsForDb(rent, rent.type);
    }

    if(rent.type === RentTypes.MANUAL) {
      switch (rent.cycle) {
        case RentCycles.JANUARY_TO_DECEMBER:
          rentData.manual_ratio = convertStrToDecimalNumber(rent.manual_ratio);
          break;
        case RentCycles.APRIL_TO_MARCH:
          rentData.manual_ratio = convertStrToDecimalNumber(rent.manual_ratio);
          rentData.manual_ratio_previous = convertStrToDecimalNumber(rent.manual_ratio_previous);
          break;
      }
    }

    // Patch seosonal dates and rent adjustments data only if rent type is index, fixed or manual
    if(rent.type === RentTypes.INDEX || rent.type === RentTypes.FIXED || rent.type === RentTypes.MANUAL) {
      rentData.seasonal_start_day = rent.seasonal_start_day || null;
      rentData.seasonal_start_month = rent.seasonal_start_month || null;
      rentData.seasonal_end_day = rent.seasonal_end_day || null;
      rentData.seasonal_end_month = rent.seasonal_end_month || null;
      rentData.rent_adjustments = getContentRentAdjustmentsForDb(rent);
    }

    return rentData;
  });

  return payload;
};

export const getAreasSum = (areas: Array<Object>) => {
  let areasSum = 0;

  if(areas && !!areas.length) {
    forEach(areas, (area) => {
      areasSum += area.area;
    });
  }
  return areasSum;
};

export const isContractActive = (contract: Object) => {
  const now = moment();
  const startDate = contract.collateral_start_date;
  const endDate = contract.collateral_end_date;

  if(startDate && moment(startDate).isAfter(now, 'day') || endDate && now.isAfter(endDate, 'day')) {
    return false;
  }

  return true;
};

export const isRentActive = (rent: ?Object) => {
  const now = moment();
  const startDate = get(rent, 'start_date');
  const endDate = get(rent, 'end_date');

  if(startDate && moment(startDate).isAfter(now, 'day') || endDate && now.isAfter(endDate, 'day')) {
    return false;
  }

  return true;
};

export const isRentArchived = (rent?: Object) => {
  const now = moment();
  const endDate = get(rent, 'end_date');

  if(endDate && now.isAfter(endDate, 'day')) {
    return true;
  }

  return false;
};

export const isTenantActive = (tenant: ?Object) => {
  const now = moment();
  const startDate = get(tenant, 'start_date');
  const endDate = get(tenant, 'end_date');

  if(startDate && moment(startDate).isAfter(now, 'day') || endDate && now.isAfter(endDate, 'day')) {
    return false;
  }

  return true;
};

export const isTenantArchived = (tenant: ?Object) => {
  const now = moment();
  const endDate = get(tenant, 'end_date');

  if(endDate && now.isAfter(endDate, 'day')) {
    return true;
  }

  return false;
};

export const mapLeaseSearchFilters = (query: Object) => {
  const searchQuery = {...query};

  searchQuery.lease_state = isArray(searchQuery.lease_state)
    ? searchQuery.lease_state
    : searchQuery.lease_state ? [searchQuery.lease_state] : [];

  searchQuery.lease_state.forEach((state) => {
    if(state === LeaseState.RESERVE) {
      searchQuery.lease_state.push(LeaseState.FREE);
      return false;
    }
  });

  return searchQuery;
};

export const formatSeasonalStartDate = (rent: Object) => {
  if(!rent.seasonal_start_day || !rent.seasonal_start_month) {
    return null;
  }
  return `${rent.seasonal_start_day}.${rent.seasonal_start_month}`;
};

export const formatSeasonalEndDate = (rent: Object) => {
  if(!rent.seasonal_end_day || !rent.seasonal_end_month) {
    return null;
  }
  return `${rent.seasonal_end_day}.${rent.seasonal_end_month}`;
};

const formatDueDate = (date: Object) => {
  return `${date.day}.${date.month}`;
};

export const formatDueDates = (dates: Array<Object>) => {
  return dates.map((date) => formatDueDate(date)).join(', ');
};

export const isAnyLeaseFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && (
    isDirty(FormNames.CONSTRUCTABILITY)(state) ||
    isDirty(FormNames.CONTRACTS)(state) ||
    isDirty(FormNames.DECISIONS)(state) ||
    isDirty(FormNames.INSPECTIONS)(state) ||
    isDirty(FormNames.LEASE_AREAS)(state) ||
    isDirty(FormNames.RENTS)(state) ||
    isDirty(FormNames.SUMMARY)(state) ||
    isDirty(FormNames.TENANTS)(state));
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.CONSTRUCTABILITY);
  removeSessionStorageItem(FormNames.CONTRACTS);
  removeSessionStorageItem(FormNames.DECISIONS);
  removeSessionStorageItem(FormNames.INSPECTIONS);
  removeSessionStorageItem(FormNames.LEASE_AREAS);
  removeSessionStorageItem(FormNames.RENTS);
  removeSessionStorageItem(FormNames.SUMMARY);
  removeSessionStorageItem(FormNames.TENANTS);
  removeSessionStorageItem('leaseId');
};
