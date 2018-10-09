// @flow
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {isDirty} from 'redux-form';
import {getIsEditMode} from './selectors';

import {
  ConstructabilityType,
  FormNames,
  LeaseStatus,
  RecipientOptions,
  TenantContactType,
} from './enums';
import {getContactFullName, getContentContact} from '$src/contacts/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  fixedLengthNumber,
  formatDecimalNumberForDb,
  getCoordinatesOfGeometry,
  sortByStartDateDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
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

export const getContentLeaseTenant = (lease: Object) => {
  const tenant = get(lease, 'tenants[0].tenantcontact_set', []).find((x) => x.type === TenantContactType.TENANT);

  return tenant ? getContactFullName(tenant.contact) : null;
};

export const getContentLeaseOption = (lease: Lease) => {
  return {
    value: lease.id,
    label: getContentLeaseIdentifier(lease),
  };
};

export const getContentLeaseAddress = (lease: Object) => {
  const address = get(lease, 'lease_areas[0].addresses[0]');

  return address ? getFullAddress(address) : null;
};

export const getContentLeaseItem = (lease: Object) => {
  return {
    id: get(lease, 'id'),
    identifier: getContentLeaseIdentifier(lease),
    real_property_unit: get(lease, 'lease_areas[0].identifier'),
    tenant: getContentLeaseTenant(lease),
    lessor: getContactFullName(lease.lessor),
    address: getContentLeaseAddress(lease),
    state: get(lease, 'state'),
    start_date: get(lease, 'start_date'),
    end_date: get(lease, 'end_date'),
  };
};

export const getContentLeases = (content: Object) =>
  get(content, 'results', []).map((item) => getContentLeaseItem(item));

export const getContentLeaseInfo = (lease: Object) => {
  return {
    identifier: getContentLeaseIdentifier(lease),
    end_date: get(lease, 'end_date'),
    start_date: get(lease, 'start_date'),
    state: get(lease, 'state'),
  };
};

export const getContentLeaseStatus = (lease: Object) => {
  const now = moment(),
    startDate = get(lease, 'start_date'),
    endDate = get(lease, 'end_date');

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
      active: get(item, 'active'),
      end_date: get(item, 'end_date'),
      identifier: get(item, 'identifier'),
      start_date: get(item, 'start_date'),
      type: get(item, 'type'),
    };
  });

export const getContentLessor = (lessor: Object) => {
  return {
    id: get(lessor, 'id'),
    value: get(lessor, 'id'),
    label: getContactFullName(lessor),
    type: get(lessor, 'type'),
    first_name: get(lessor, 'first_name'),
    last_name: get(lessor, 'last_name'),
    name: get(lessor, 'name'),
  };
};

export const getContentUser = (user: Object) => {
  return {
    id: get(user, 'id'),
    value: get(user, 'id'),
    label: getUserFullName(user),
    first_name: get(user, 'first_name'),
    last_name: get(user, 'last_name'),
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
    lessor: getContentLessor(get(lease, 'lessor')),
    preparer: getContentUser(get(lease, 'preparer')),
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
    reference_number: get(lease, 'reference_number'),
    note: get(lease, 'note'),
    tenants: getContentTenants(lease).filter((tenant) => isTenantActive(get(tenant, 'tenant'))),
    lease_areas: getContentLeaseAreas(lease).filter((area) => !area.archived_at),
    constructability_areas: getContentConstructability(lease),
    infill_development_compensations: getContentInfillDevelopmentCompensations(lease),
  };
};

export const getContentRelatedLease = (content: Object, path: string = 'from_lease') => get(content, path, {});

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
      id: get(address, 'id'),
      address: get(address, 'address'),
      postal_code: get(address, 'postal_code'),
      city: get(address, 'city'),
    };
  });
};

export const getContentPlots = (plots: Array<Object>, inContract: boolean): Array<Object> => {
  if(!plots || !plots.length) {return [];}

  return plots.filter((plot) => plot.in_contract === inContract).map((plot) => {
    return {
      id: get(plot, 'id'),
      identifier: get(plot, 'identifier'),
      geometry: get(plot, 'geometry'),
      area: get(plot, 'area'),
      section_area: get(plot, 'section_area'),
      postal_code: get(plot, 'postal_code'),
      city: get(plot, 'city'),
      type: get(plot, 'type'),
      registration_date: get(plot, 'registration_date'),
      repeal_date: get(plot, 'repeal_date'),
      in_contract: get(plot, 'in_contract'),
    };
  });
};

export const getContentPlanUnits = (planunits: Array<Object>, inContract: boolean): Array<Object> => {
  if(!planunits || !planunits.length) {return [];}

  return planunits.filter((planunit) => planunit.in_contract === inContract).map((planunit) => {
    return {
      id: get(planunit, 'id'),
      identifier: get(planunit, 'identifier'),
      geometry: get(planunit, 'geometry'),
      area: get(planunit, 'area'),
      section_area: get(planunit, 'section_area'),
      postal_code: get(planunit, 'postal_code'),
      city: get(planunit, 'city'),
      in_contract: get(planunit, 'in_contract'),
      plot_division_identifier: get(planunit, 'plot_division_identifier'),
      plot_division_date_of_approval: get(planunit, 'plot_division_date_of_approval'),
      plot_division_state: get(planunit, 'plot_division_state.id') || get(planunit, 'plot_division_state'),
      detailed_plan_identifier: get(planunit, 'detailed_plan_identifier'),
      detailed_plan_latest_processing_date: get(planunit, 'detailed_plan_latest_processing_date'),
      detailed_plan_latest_processing_date_note: get(planunit, 'detailed_plan_latest_processing_date_note'),
      plan_unit_type: get(planunit, 'plan_unit_type.id') || get(planunit, 'plan_unit_type'),
      plan_unit_state: get(planunit, 'plan_unit_state.id') || get(planunit, 'plan_unit_state'),
      plan_unit_intended_use: get(planunit, 'plan_unit_intended_use.id') || get(planunit, 'plan_unit_intended_use'),
    };
  });
};

export const getContentLeaseAreaItem = (area: Object) => {
  return {
    id: get(area, 'id'),
    identifier: get(area, 'identifier'),
    geometry: get(area, 'geometry'),
    area: get(area, 'area'),
    section_area: get(area, 'section_area'),
    addresses: getContentAddresses(get(area, 'addresses')),
    postal_code: get(area, 'postal_code'),
    city: get(area, 'city'),
    type: get(area, 'type'),
    location: get(area, 'location'),
    plots_current: getContentPlots(get(area, 'plots'), false),
    plots_contract: getContentPlots(get(area, 'plots'), true),
    plan_units_current: getContentPlanUnits(get(area, 'plan_units'), false),
    plan_units_contract: getContentPlanUnits(get(area, 'plan_units'), true),
    archived_at: get(area, 'archived_at'),
    archived_note: get(area, 'archived_note'),
    archived_decision: get(area, 'archived_decision.id') || get(area, 'archived_decision'),
  };
};

export const getContentLeaseAreas = (lease: Object) =>
  get(lease, 'lease_areas', []).map((area) => getContentLeaseAreaItem(area));

export const getContentComments = (content: Array<Object>): Array<Object> => {
  if(!content || !content.length) {return [];}

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

export const getContentDecisionConditions = (decision: Object) =>
  get(decision, 'conditions', []).map((condition) => {
    return {
      id: get(condition, 'id'),
      type: get(condition, 'type.id') || get(condition, 'type'),
      supervision_date: get(condition, 'supervision_date'),
      supervised_date: get(condition, 'supervised_date'),
      description: get(condition, 'description'),
    };
  });

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

export const getContentDecisions = (lease: Object) =>
  get(lease, 'decisions', []).map((decision) => getContentDecisionItem(decision));

export const getContentContractChanges = (contract: Object) =>
  get(contract, 'contract_changes', []).map((change) => {
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

export const getContentContractMortageDocuments = (contract: Object) =>
  get(contract, 'mortgage_documents', []).map((document) => {
    return ({
      id: get(document, 'id'),
      number: get(document, 'number'),
      date: get(document, 'date'),
      note: get(document, 'note'),
    });
  });

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

export const getContentContracts = (lease: Object) =>
  get(lease, 'contracts', []).map((contract) => getContentContractItem(contract));

export const getContentInspectionItem = (inspection: Object) => {
  return {
    id: get(inspection, 'id'),
    inspector: get(inspection, 'inspector'),
    supervision_date: get(inspection, 'supervision_date'),
    supervised_date: get(inspection, 'supervised_date'),
    description: get(inspection, 'description'),
  };
};

export const getContentInspections = (lease: Object) =>
  get(lease, 'inspections', []).map((inspection) => getContentInspectionItem(inspection));

export const getContentConstructabilityDescriptions = (area: Object, type: string) => {
  return get(area, 'constructability_descriptions', [])
    .filter((description) => description.type === type)
    .map((description) => {
      return {
        id: get(description, 'id'),
        type: get(description, 'type'),
        user: getContentUser(get(description, 'user')),
        text: get(description, 'text'),
        ahjo_reference_number: get(description, 'ahjo_reference_number'),
        modified_at: get(description, 'modified_at'),
      };
    });
};

export const getContentConstructability = (lease: Object) =>
  get(lease, 'lease_areas', []).map((area) => {
    return {
      id: get(area, 'id'),
      identifier: get(area, 'identifier'),
      type: get(area, 'type'),
      location: get(area, 'location'),
      area: get(area, 'area'),
      section_area: get(area, 'section_area'),
      address: get(area, 'address'),
      postal_code: get(area, 'postal_code'),
      city: get(area, 'city'),
      preconstruction_state: get(area, 'preconstruction_state'),
      demolition_state: get(area, 'demolition_state'),
      polluted_land_state: get(area, 'polluted_land_state'),
      polluted_land_rent_condition_state: get(area, 'polluted_land_rent_condition_state'),
      polluted_land_rent_condition_date: get(area, 'polluted_land_rent_condition_date'),
      polluted_land_planner: getContentUser(get(area, 'polluted_land_planner')),
      polluted_land_projectwise_number: get(area, 'polluted_land_projectwise_number'),
      polluted_land_matti_report_number: get(area, 'polluted_land_matti_report_number'),
      constructability_report_state: get(area, 'constructability_report_state'),
      constructability_report_investigation_state: get(area, 'constructability_report_investigation_state'),
      constructability_report_signing_date: get(area, 'constructability_report_signing_date'),
      constructability_report_signer: get(area, 'constructability_report_signer'),
      constructability_report_geotechnical_number: get(area, 'constructability_report_geotechnical_number'),
      other_state: get(area, 'other_state'),
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
      id: get(tenant, 'id'),
      share_numerator: get(tenant, 'share_numerator'),
      share_denominator: get(tenant, 'share_denominator'),
      reference: get(tenant, 'reference'),
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
  get(rent, 'payable_rents', []).map((item) => {
    return {
      id: item.id || undefined,
      amount: get(item, 'amount'),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
      difference_percent: get(item, 'difference_percent'),
      calendar_year_rent: get(item, 'calendar_year_rent'),
    };
  });

export const getContentRentAdjustments = (rent: Object) =>
  get(rent, 'rent_adjustments', []).map((item) => {
    return {
      id: item.id || undefined,
      type: get(item, 'type'),
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
      full_amount: get(item, 'full_amount'),
      amount_type: get(item, 'amount_type.id') || get(item, 'amount_type'),
      amount_left: get(item, 'amount_left'),
      decision: get(item, 'decision.id') || get(item, 'decision'),
      note: get(item, 'note'),
    };
  });

export const getContentIndexAdjustedRents = (rent: Object) =>
  get(rent, 'index_adjusted_rents', []).map((item) => {
    return {
      item: item.id || undefined,
      amount: get(item, 'amount'),
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
      factor: get(item, 'factor'),
    };
  });

export const getContentContractRents = (rent: Object) =>
  get(rent, 'contract_rents', []).map((item) => {
    return {
      id: item.id || undefined,
      amount: get(item, 'amount'),
      period: get(item, 'period'),
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      base_amount: get(item, 'base_amount'),
      base_amount_period: get(item, 'base_amount_period'),
      base_year_rent: get(item, 'base_year_rent'),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
    };
  });

export const getContentFixedInitialYearRents = (rent: Object) =>
  get(rent, 'fixed_initial_year_rents', []).map((item) => {
    return {
      id: item.id || undefined,
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      amount: get(item, 'amount'),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
    };
  });

export const getContentRentDueDate = (rent: Object, path?: string = 'due_dates') =>
  get(rent, path, []).map((date) => {
    return {
      id: date.id || undefined,
      day: get(date, 'day'),
      month: get(date, 'month'),
    };
  });

export const getContentRents = (lease: Object) =>
  get(lease, 'rents', [])
    .map((rent) => {
      return {
        id: rent.id || undefined,
        type: get(rent, 'type'),
        start_date: get(rent, 'start_date'),
        end_date: get(rent, 'end_date'),
        cycle: get(rent, 'cycle'),
        index_type: get(rent, 'index_type'),
        due_dates_type: get(rent, 'due_dates_type'),
        due_dates_per_year: get(rent, 'due_dates_per_year'),
        elementary_index: get(rent, 'elementary_index'),
        index_rounding: get(rent, 'index_rounding'),
        x_value: get(rent, 'x_value'),
        y_value: get(rent, 'y_value'),
        y_value_start: get(rent, 'y_value_start'),
        equalization_start_date: get(rent, 'equalization_start_date'),
        equalization_end_date: get(rent, 'equalization_end_date'),
        amount: get(rent, 'amount'),
        note: get(rent, 'note'),
        is_active: get(rent, 'is_active'),
        due_dates: getContentRentDueDate(rent),
        fixed_initial_year_rents: getContentFixedInitialYearRents(rent),
        contract_rents: getContentContractRents(rent),
        index_adjusted_rents: getContentIndexAdjustedRents(rent),
        rent_adjustments: getContentRentAdjustments(rent),
        payable_rents: getContentPayableRents(rent).sort(sortByStartDateDesc),
        yearly_due_dates: getContentRentDueDate(rent, 'yearly_due_dates'),
      };
    })
    .sort((a, b) => sortStringByKeyDesc(a, b, 'start_date'));

export const getContentRentsFormData = (lease: Object) => {
  const rents = getContentRents(lease);

  return {
    rents: rents.filter((rent) => !isRentArchived(rent)),
    rentsArchived: rents.filter((rent) => isRentArchived(rent)),
  };
};

export const getContentBasisOfRents = (lease: Object) =>
  get(lease, 'basis_of_rents', []).map((item) => {
    return {
      id: item.id || undefined,
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: get(item, 'floor_m2'),
      index: get(item, 'index'),
      amount_per_floor_m2_index_100: get(item, 'amount_per_floor_m2_index_100'),
      amount_per_floor_m2_index: get(item, 'amount_per_floor_m2_index'),
      percent: get(item, 'percent'),
      year_rent_index_100: get(item, 'year_rent_index_100'),
      year_rent_index: get(item, 'year_rent_index'),
    };
  });

export const getFullAddress = (item: Object) => {
  if(isEmpty(item)) {return null;}

  return `${item.address || ''}${(item.postal_code || item.city) ? ', ' : ''}
    ${item.postal_code || ''} ${item.city || ''}`;
};

export const getLeasesFilteredByDocumentType = (items: Array<Object>, documentTypes: Array<string>): Array<Object> => {
  if(!documentTypes || !documentTypes.length) {return items;}

  return items.filter((item) => {
    return documentTypes.indexOf(item.state) !== -1;
  });

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
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3879',
      },
    },
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
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3879',
      },
    },
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
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3879',
      },
    },
    features: features,
  };
};

export const getLeaseCoordinates = (lease: Lease) => {
  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);
  let coordinates = [];
  areas.forEach((area) => {
    coordinates = [...coordinates, ...getCoordinatesOfGeometry(area.geometry)];

    const plots = get(area, 'plots', []);
    plots.forEach((plot) => {
      coordinates = [...coordinates, ...getCoordinatesOfGeometry(plot.geometry)];
    });

    const planUnits = get(area, 'plan_units', []);
    planUnits.forEach((planUnit) => {
      coordinates = [...coordinates, ...getCoordinatesOfGeometry(planUnit.geometry)];
    });
  });
  return coordinates;
};

// Helper functions to add content to patch payload
export const addLeaseInfoFormValues = (payload: Object, leaseInfo: Object) => {
  return {
    ...payload,
    'state': get(leaseInfo, 'state'),
    'start_date': get(leaseInfo, 'start_date'),
    'end_date': get(leaseInfo, 'end_date'),
  };
};

export const addSummaryFormValues = (payload: Object, summary: Object) => {
  payload.lessor = get(summary, 'lessor.value');
  payload.preparer = get(summary, 'preparer.value');
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
  payload.reference_number = get(summary, 'reference_number');
  payload.note = get(summary, 'note');
  return payload;
};

const getAddressesForDb = (addresses: Array<Object>) =>
  addresses.map((address) => {
    return {
      id: address.id || undefined,
      address: get(address, 'address'),
      postal_code: get(address, 'postal_code'),
      city: get(address, 'city'),
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
      identifier: get(plot, 'identifier'),
      area: formatDecimalNumberForDb(get(plot, 'area')),
      section_area: formatDecimalNumberForDb(get(plot, 'section_area')),
      postal_code: get(plot, 'postal_code'),
      city: get(plot, 'city'),
      type: get(plot, 'type'),
      location: get(plot, 'location'),
      registration_date: get(plot, 'registration_date'),
      repeal_date: get(plot, 'repeal_date'),
      in_contract: get(plot, 'in_contract'),
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
      identifier: get(planunit, 'identifier'),
      area: formatDecimalNumberForDb(get(planunit, 'area')),
      section_area: formatDecimalNumberForDb(get(planunit, 'section_area')),
      postal_code: get(planunit, 'postal_code'),
      city: get(planunit, 'city'),
      in_contract: get(planunit, 'in_contract'),
      plot_division_identifier: get(planunit, 'plot_division_identifier'),
      plot_division_date_of_approval: get(planunit, 'plot_division_date_of_approval'),
      plot_division_state: get(planunit, 'plot_division_state'),
      detailed_plan_identifier: get(planunit, 'detailed_plan_identifier'),
      detailed_plan_latest_processing_date: get(planunit, 'detailed_plan_latest_processing_date'),
      detailed_plan_latest_processing_date_note: get(planunit, 'detailed_plan_latest_processing_date_note'),
      plan_unit_type: get(planunit, 'plan_unit_type'),
      plan_unit_state: get(planunit, 'plan_unit_state'),
      plan_unit_intended_use: get(planunit, 'plan_unit_intended_use'),
    };
  });
};

export const addAreasFormValues = (payload: Object, values: Object) => {
  const areas = [...get(values, 'lease_areas_active', []), ...get(values, 'lease_areas_archived', [])];

  payload.lease_areas = areas.map((area) => {
    return {
      id: area.id || undefined,
      identifier: get(area, 'identifier'),
      area: formatDecimalNumberForDb(get(area, 'area')),
      section_area: formatDecimalNumberForDb(get(area, 'area')),
      addresses: getAddressesForDb(get(area, 'addresses', [])),
      postal_code: get(area, 'postal_code'),
      city: get(area, 'city'),
      type: get(area, 'type'),
      location: get(area, 'location'),
      plots: getPlotsForDb(area),
      plan_units: getPlanUnitsForDb(area),
      archived_at: get(area, 'archived_at'),
      archived_note: get(area, 'archived_note'),
      archived_decision: get(area, 'archived_decision'),
    };
  });

  return payload;
};

const getDecisionConditionsForDb = (decision: Object) => {
  return get(decision, 'conditions', []).map((condition) => {
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
  payload.decisions = get(values, 'decisions', []).map((decision) => {
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

  return payload;
};

const getContractMortgageDocumentsForDb = (contract: Object) => {
  return get(contract, 'mortgage_documents', []).map((doc) => {
    return {
      id: doc.id || undefined,
      number: get(doc, 'number'),
      date: get(doc, 'date'),
      note: get(doc, 'note'),
    };
  });
};

const getContractChangesForDb = (contract: Object) => {
  return get(contract, 'contract_changes', []).map((change) => {
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
  payload.contracts = get(values, 'contracts', []).map((contract) => {
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

  return payload;
};

export const addInspectionsFormValues = (payload: Object, values: Object) => {
  payload.inspections = get(values, 'inspections', []).map((inspection) => {
    return {
      id: inspection.id || undefined,
      inspector: get(inspection, 'inspector'),
      supervision_date: get(inspection, 'supervision_date'),
      supervised_date: get(inspection, 'supervised_date'),
      description: get(inspection, 'description'),
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
      type: get(description, 'type'),
      text: get(description, 'text'),
      ahjo_reference_number: get(description, 'ahjo_reference_number'),
    };
  });
};

export const getConstructabilityItemForDb = (area: Object, values: Object) => {
  area.preconstruction_state = get(values, 'preconstruction_state');
  area.demolition_state = get(values, 'demolition_state');
  area.polluted_land_state = get(values, 'polluted_land_state');
  area.polluted_land_rent_condition_state = get(values, 'polluted_land_rent_condition_state');
  area.polluted_land_rent_condition_date = get(values, 'polluted_land_rent_condition_date');
  area.polluted_land_planner = get(values, 'polluted_land_planner.value');
  area.polluted_land_projectwise_number = get(values, 'polluted_land_projectwise_number');
  area.polluted_land_matti_report_number = get(values, 'polluted_land_matti_report_number');
  area.constructability_report_state = get(values, 'constructability_report_state');
  area.constructability_report_investigation_state = get(values, 'constructability_report_investigation_state');
  area.constructability_report_signing_date = get(values, 'constructability_report_signing_date');
  area.constructability_report_signer = get(values, 'constructability_report_signer');
  area.constructability_report_geotechnical_number = get(values, 'constructability_report_geotechnical_number');
  area.other_state = get(values, 'other_state');
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

export const getTenantContactDetailsForDb = (tenant: Object, contactType: TenantContactType.TENANT | TenantContactType.BILLING | TenantContactType.CONTACT) => (
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
  const tenantData = get(tenant, 'tenant');
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
  const tenantsCurrent = get(values, 'tenants.tenants', []);
  const tenantsArchived = get(values, 'tenants.tenantsArchived', []);
  const tenants = [...tenantsCurrent, ...tenantsArchived];

  payload.tenants = tenants.map((tenant) => {
    return {
      id: tenant.id || undefined,
      share_numerator: get(tenant, 'share_numerator'),
      share_denominator: get(tenant, 'share_denominator'),
      reference: get(tenant, 'reference'),
      tenantcontact_set: getTenantContactSetForDb(tenant),
    };
  });

  return payload;
};

export const getContentRentAdjustmentsForDb = (rent: Object) =>
  get(rent, 'rent_adjustments', []).map((item) => {
    return {
      id: item.id || undefined,
      type: get(item, 'type'),
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
      full_amount: formatDecimalNumberForDb(get(item, 'full_amount')),
      amount_type: get(item, 'amount_type.id') || get(item, 'amount_type'),
      amount_left: formatDecimalNumberForDb(get(item, 'amount_left')),
      decision: get(item, 'decision.id') || get(item, 'decision'),
      note: get(item, 'note'),
    };
  });

export const getContentContractRentsForDb = (rent: Object) =>
  get(rent, 'contract_rents', []).map((item) => {
    return {
      id: item.id || undefined,
      amount: formatDecimalNumberForDb(get(item, 'amount')),
      period: get(item, 'period'),
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      base_amount: formatDecimalNumberForDb(get(item, 'base_amount')),
      base_amount_period: get(item, 'base_amount_period'),
      base_year_rent: formatDecimalNumberForDb(get(item, 'base_year_rent')),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
    };
  });

export const getContentFixedInitialYearRentsForDb = (rent: Object) =>
  get(rent, 'fixed_initial_year_rents', []).map((item) => {
    return {
      id: item.id || undefined,
      intended_use: get(item, 'intended_use'),
      amount: formatDecimalNumberForDb(get(item, 'amount')),
      start_date: get(item, 'start_date'),
      end_date: get(item, 'end_date'),
    };
  });

export const getContentRentDueDatesForDb = (rent: Object) =>
  get(rent, 'due_dates', []).map((date) => {
    return {
      id: date.id || undefined,
      day: get(date, 'day'),
      month: get(date, 'month'),
    };
  });

export const addRentsFormValues = (payload: Object, values: Object) => {
  payload.is_rent_info_complete = values.is_rent_info_complete ? true : false;

  const basisOfRents = get(values, 'basis_of_rents', []);
  payload.basis_of_rents = basisOfRents.map((item) => {
    return {
      id: item.id || undefined,
      intended_use: get(item, 'intended_use.id') || get(item, 'intended_use'),
      floor_m2: formatDecimalNumberForDb(get(item, 'floor_m2')),
      index: get(item, 'index'),
      amount_per_floor_m2_index_100: formatDecimalNumberForDb(get(item, 'amount_per_floor_m2_index_100')),
      amount_per_floor_m2_index: get(item, 'amount_per_floor_m2_index'),
      percent: formatDecimalNumberForDb(get(item, 'percent')),
      year_rent_index_100: get(item, 'year_rent_index_100'),
      year_rent_index: get(item, 'year_rent_index'),
    };
  });

  const rentsCurrent = get(values, 'rents.rents', []);
  const rentsArchived = get(values, 'rents.rentsArchived', []);
  const rents = [...rentsCurrent, ...rentsArchived];

  payload.rents = rents.map((rent) => {
    return {
      id: rent.id || undefined,
      type: get(rent, 'type'),
      start_date: get(rent, 'start_date'),
      end_date: get(rent, 'end_date'),
      cycle: get(rent, 'cycle'),
      index_type: get(rent, 'index_type'),
      due_dates_type: get(rent, 'due_dates_type'),
      due_dates_per_year: get(rent, 'due_dates_per_year'),
      elementary_index: get(rent, 'elementary_index'),
      index_rounding: get(rent, 'index_rounding'),
      x_value: get(rent, 'x_value'),
      y_value: get(rent, 'y_value'),
      y_value_start: get(rent, 'y_value_start'),
      equalization_start_date: get(rent, 'equalization_start_date'),
      equalization_end_date: get(rent, 'equalization_end_date'),
      amount: formatDecimalNumberForDb(get(rent, 'amount')),
      note: get(rent, 'note'),
      is_active: get(rent, 'is_active'),
      due_dates: getContentRentDueDatesForDb(rent),
      fixed_initial_year_rents: getContentFixedInitialYearRentsForDb(rent),
      contract_rents: getContentContractRentsForDb(rent),
      rent_adjustments: getContentRentAdjustmentsForDb(rent),
    };
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
  const startDate = get(contract, 'collateral_start_date');
  const endDate = get(contract, 'collateral_end_date');

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

export const isRentArchived = (rent: Object) => {
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

export const isAnyLeaseFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && (
    isDirty(FormNames.CONSTRUCTABILITY)(state) ||
    isDirty(FormNames.CONTRACTS)(state) ||
    isDirty(FormNames.DECISIONS)(state) ||
    isDirty(FormNames.INSPECTIONS)(state) ||
    isDirty(FormNames.LEASE_AREAS)(state) ||
    isDirty(FormNames.LEASE_INFO)(state) ||
    isDirty(FormNames.RESTS)(state) ||
    isDirty(FormNames.SUMMARY)(state) ||
    isDirty(FormNames.TENANTS)(state));
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.CONSTRUCTABILITY);
  removeSessionStorageItem(FormNames.CONTRACTS);
  removeSessionStorageItem(FormNames.DECISIONS);
  removeSessionStorageItem(FormNames.INSPECTIONS);
  removeSessionStorageItem(FormNames.LEASE_AREAS);
  removeSessionStorageItem(FormNames.LEASE_INFO);
  removeSessionStorageItem(FormNames.RENTS);
  removeSessionStorageItem(FormNames.SUMMARY);
  removeSessionStorageItem(FormNames.TENANTS);
  removeSessionStorageItem('leaseId');
};
