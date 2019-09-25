// @flow
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isPast from 'date-fns/isPast';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import {isDirty} from 'redux-form';

import {
  getSplittedDateRangesWithItems,
  sortByStartAndEndDateDesc,
} from '$util/date';
import {FormNames, TableSortOrder} from '$src/enums';
import {
  CollateralTypes,
  ConstructabilityType,
  DecisionTypeKinds,
  LeaseState,
  LeaseTenantRentSharesFieldPaths,
  LeaseStatus,
  RecipientOptions,
  RelationTypes,
  RentAdjustmentAmountTypes,
  RentCycles,
  RentDueDateTypes,
  RentTypes,
  SubventionTypes,
  TenantContactType,
} from './enums';
import {LeaseAreaAttachmentTypes} from '$src/leaseAreaAttachment/enums';
import {getContactFullName, getContentContact} from '$src/contacts/helpers';
import {getContentLessor} from '$src/lessor/helpers';
import {getContentPropertyIdentifiers} from '$src/rentbasis/helpers';
import {getContentUser} from '$src/users/helpers';
import {
  addEmptyOption,
  convertStrToDecimalNumber,
  fixedLengthNumber,
  formatDate,
  formatDateRange,
  getApiResponseResults,
  getFieldOptions,
  getLabelOfOption,
  isDecimalNumberStr,
  isEmptyValue,
  isActive,
  isArchived,
  sortStringAsc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getCoordinatesOfGeometry} from '$util/map';
import {getIsEditMode} from './selectors';
import {removeSessionStorageItem} from '$util/storage';

import type {Lease} from './types';
import type {CommentList} from '$src/comments/types';
import type {Attributes, LeafletFeature, LeafletGeoJson} from '$src/types';
import type {RootState} from '$src/root/types';

/**
 * Test is lease empty
 * @param {Object} lease
 * @return {boolean}
 */
export const isLeaseEmpty = (lease: Lease): boolean => {
  let empty = true;
  const skipFields = [
    'id',
    'type',
    'municipality',
    'district',
    'identifier',
    'state',
    'preparer',
    'note',
    'created_at',
    'modified_at',
  ];

  forEach(Object.keys(lease), (key) => {
    if(skipFields.indexOf(key) === -1) {
      if(isArray(lease[key])) {
        if(lease[key].length) {
          empty = false;
          return false;
        }
      } else {
        if(key === 'related_leases') {
          if(lease[key].related_to && lease[key].related_to.length || lease[key].related_from && lease[key].related_from.length) {
            empty = false;
            return false;
          }
        } else if(typeof lease[key] === 'boolean' && lease[key] || typeof lease[key] !== 'boolean' && !isEmptyValue(lease[key])) {
          empty = false;
          return false;
        }
      }
    }
  });

  return empty;
};

/**
 * Test is lease created by user
 * @param {Object} lease
 * @param {Object} user
 * @return {boolean}
 */
export const isLeaseCreatedByUser = (lease: Lease, user: Object): boolean => {
  const preparerUsername = get(lease, 'preparer.username');
  const userEmail = get(user, 'profile.email');

  return !!preparerUsername && !!userEmail && preparerUsername === userEmail;
};

/**
 * Test is user allowed to delete lease
 * @param {Object} lease
 * @param {Object[]} comments
 * @param {Object} user
 * @return {boolean}
 */
export const isUserAllowedToDeleteEmptyLease = (lease: Lease, comments: CommentList, user: Object): boolean =>
  isLeaseEmpty(lease) && comments && !comments.length && isLeaseCreatedByUser(lease, user);

/**
 * Get content option to be used on dropdowns
 * @param {Object} lease
 * @returns {Object}
 */
export const getContentLeaseOption = (lease: Lease): Object => ({
  value: lease.id ? lease.id.toString() : null,
  label: getContentLeaseIdentifier(lease),
});

/**
 * Get full address of an item as string
 * @param {Object} item
 * @returns {string}
 */
export const getFullAddress = (item: Object): ?string => {
  if(isEmpty(item)) return null;

  return `${item.address || ''}${(item.postal_code || item.city) ? ', ' : ''}${item.postal_code ? item.postal_code + ' ' : ''}${item.city || ''}`;
};

/**
 * Get content lease identifiers
 * @param {Object} lease
 * @returns {string}
 */
export const getContentLeaseIdentifier = (lease: Object): ?string =>
  !isEmpty(lease)
    ? `${get(lease, 'identifier.type.identifier')}${get(lease, 'identifier.municipality.identifier')}${fixedLengthNumber(get(lease, 'identifier.district.identifier'), 2)}-${get(lease, 'identifier.sequence')}`
    : null;

/**
 * Get content lease list area identifiers
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseListTenants = (lease: Object, query: Object = {}): Array<Object> => 
  get(lease, 'tenants', [])
    .map((item) => get(item, 'tenantcontact_set', []).find((x) => x.type === TenantContactType.TENANT))
    .filter((tenant) => query.only_past_tenants === 'true' ? isArchived(tenant) : !isArchived(tenant))
    .map((tenant) => tenant ? getContactFullName(tenant.contact) : null)
    .filter((name) => name)
    .sort(sortStringAsc);

/**
 * Get content lease list area identifiers
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseListAreaIdentifiers = (lease: Object): Array<Object> => 
  get(lease, 'lease_areas', [])
    .filter((area) => !area.archived_at)
    .map((area) => area.identifier)
    .sort(sortStringAsc);

/**
 * Get content lease list lease addresses
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseListLeaseAddresses = (lease: Object): Array<Object> => {
  const addresses = [];

  get(lease, 'lease_areas', [])
    .filter((area) => !area.archived_at)
    .forEach((area) => {
      get(area, 'addresses', [])
        .forEach((address) => {
          addresses.push(getFullAddress(address));
        });
    });

  const sortedAddresses = addresses
    .filter((address, index, self) =>  self.indexOf(address) == index)
    .sort(sortStringAsc);
  
  return sortedAddresses;
};

/**
 * Get content lease list lease
 * @param {Object} lease
 * @param {Object} query
 * @returns {Object}
 */
export const getContentLeaseListLease = (lease: Object, query: Object = {}): Object => {
  return {
    id: lease.id,
    identifier: getContentLeaseIdentifier(lease),
    lease_area_identifiers: getContentLeaseListAreaIdentifiers(lease),
    tenants: getContentLeaseListTenants(lease, query),
    lessor: getContactFullName(lease.lessor),
    addresses: getContentLeaseListLeaseAddresses(lease),
    state: lease.state,
    start_date: lease.start_date,
    end_date: lease.end_date,
  };
};

/**
 * Get lease list results
 * @param {Object} apiResponse
 * @param {Object} query
 * @returns {Object[]}
 */
export const getContentLeaseListResults = (apiResponse: Object, query: Object): Array<Object> =>
  getApiResponseResults(apiResponse).map((item) => getContentLeaseListLease(item, query));

/**
 * Get content lease status
 * @param {Object} lease
 * @returns {string}
 */
const getContentLeaseStatus = (lease: Object): string => {
  const startDate = lease.start_date,
    endDate = lease.end_date;

  if(endDate && isPast(new Date(endDate))) {
    return LeaseStatus.FINISHED;
  }

  if((!endDate && !startDate)) {
    return LeaseStatus.PREPARATION;
  }

  return LeaseStatus.IN_EFFECT;
};

/**
 * Get lease info section content
 * @param {Object} lease
 * @returns {Object}
 */
export const getContentLeaseInfo = (lease: Object): Object => {
  return {
    identifier: getContentLeaseIdentifier(lease),
    end_date: lease.end_date,
    start_date: lease.start_date,
    state: lease.state,
    status: getContentLeaseStatus(lease),
  };
};

/**
 * Get lease infill development compensations content
 * @param {Object} lease
 * @returns {Object[]}
 */
const getContentLeaseInfillDevelopmentCompensations = (lease: Lease): Array<Object> =>
  get(lease, 'infill_development_compensations', []).map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

/**
 * Get matching basis of rents content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseMatchingBasisOfRents = (lease: Object): Array<Object> =>
  get(lease, 'matching_basis_of_rents', [])
    .map((item) => {
      return {
        id: item.id || undefined,
        property_identifiers: getContentPropertyIdentifiers(item),
      };
    });

/**
 * Get lease summary tab content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseSummary = (lease: Object): Object => {
  return {
    area_notes: get(lease, 'area_notes', []),
    // Set arrangement decision to true if there is any contract where is_readjustment_decision == true
    arrangement_decision: get(lease, 'contracts', []).find((contract) => contract.is_readjustment_decision) ? true : false,
    contract_numbers: get(lease, 'contracts', [])
      .filter((contract) => contract.contract_number)
      .map((contract) => contract.contract_number)
      .join(', '),
    building_selling_price: lease.building_selling_price,
    classification: lease.classification,
    constructability_areas: getContentConstructabilityAreas(lease),
    conveyance_number: lease.conveyance_number,
    end_date: lease.end_date,
    financing: lease.financing,
    hitas: lease.hitas,
    infill_development_compensations: getContentLeaseInfillDevelopmentCompensations(lease),
    intended_use: lease.intended_use,
    intended_use_note: lease.intended_use_note,
    is_subject_to_vat: lease.is_subject_to_vat,
    lease_areas: getContentLeaseAreas(lease).filter((area) => !area.archived_at),
    lessor: getContentLessor(lease.lessor),
    management: lease.management,
    matching_basis_of_rents: getContentLeaseMatchingBasisOfRents(lease),
    note: lease.note,
    notice_note: lease.notice_note,
    notice_period: lease.notice_period,
    preparer: getContentUser(lease.preparer),
    real_estate_developer: lease.real_estate_developer,
    reference_number: lease.reference_number,
    regulated: lease.regulated,
    regulation: lease.regulation,
    reservation_procedure: lease.reservation_procedure,
    special_project: lease.special_project,
    state: lease.state,
    start_date: lease.start_date,
    statistical_use: lease.statistical_use,
    supportive_housing: lease.supportive_housing,
    tenants: getContentTenants(lease).filter((tenant) => !isArchived(tenant.tenant)),
    transferable: lease.transferable,
  };
};

/**
  * Get related lease content by path
  * @param {Object} content
  * @param {string} path
  * @returns {Object}
  */
export const getContentRelatedLease = (content: Object, path: string = 'from_lease') =>
  get(content, path, {});

/**
 * Get content related leases from list sorted by start and end date
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentRelatedLeasesFrom = (lease: Object): Array<Object> =>
  get(lease, 'related_leases.related_from', [])
    .map((relatedLease) => {
      return {
        id: relatedLease.id,
        lease: getContentRelatedLease(relatedLease, 'from_lease'),
      };
    })
    .sort((a, b) => sortByStartAndEndDateDesc(a, b, 'lease.start_date', 'lease.end_date'));

/**
 * Get content related leases to list sorted by start and end date
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentRelatedLeasesTo = (lease: Object): Array<Object> =>
  get(lease, 'related_leases.related_to', [])
    .map((relatedLease) => {
      return {
        id: relatedLease.id,
        lease: getContentRelatedLease(relatedLease, 'to_lease'),
      };
    })
    .sort((a, b) => sortByStartAndEndDateDesc(a, b, 'lease.start_date', 'lease.end_date'));

/**
 * Get lease area addresses content
 * @param {Object} area
 * @returns {Object[]}
 */
export const getContentLeaseAreaAddresses = (area: Object): Array<Object> => {
  return get(area, 'addresses', []).map((address) => {
    return {
      id: address.id,
      address: address.address,
      postal_code: address.postal_code,
      city: address.city,
      is_primary: address.is_primary,
    };
  });
};

/**
 * Get content plots
 * @param {Object} area
 * @returns {Object[]}
 */
export const getContentPlots = (area: Object): Array<Object> => 
  get(area, 'plots', []).map((plot) => {
    return {
      id: plot.id,
      identifier: plot.identifier,
      geometry: plot.geometry,
      area: plot.area,
      section_area: plot.section_area,
      type: plot.type,
      registration_date: plot.registration_date,
      repeal_date: plot.repeal_date,
      in_contract: plot.in_contract,
    };
  });

/**
 * Get content plan units
 * @param {Object} area
 * @returns {Object[]}
 */
export const getContentPlanUnits = (area: Object): Array<Object> => 
  get(area, 'plan_units', []).map((planunit) => {
    return {
      id: planunit.id,
      identifier: planunit.identifier,
      geometry: planunit.geometry,
      area: planunit.area,
      section_area: planunit.section_area,
      in_contract: planunit.in_contract,
      plot_division_identifier: planunit.plot_division_identifier,
      plot_division_effective_date: planunit.plot_division_effective_date,
      plot_division_state: get(planunit, 'plot_division_state.id') || planunit.plot_division_state,
      detailed_plan_identifier: planunit.detailed_plan_identifier,
      detailed_plan_latest_processing_date: planunit.detailed_plan_latest_processing_date,
      detailed_plan_latest_processing_date_note: planunit.detailed_plan_latest_processing_date_note,
      plan_unit_type: get(planunit, 'plan_unit_type.id') || planunit.plan_unit_type,
      plan_unit_state: get(planunit, 'plan_unit_state.id') || planunit.plan_unit_state,
      plan_unit_intended_use: get(planunit, 'plan_unit_intended_use.id') || planunit.plan_unit_intended_use,
    };
  });

/**
 * Get single lease area content
 * @param {Object} area
 * @returns {Object}
 */
export const getContentLeaseArea = (area: Object): Object => {
  const plots: any = getContentPlots(area);
  const planUnits: any = getContentPlanUnits(area);

  return {
    id: area.id,
    identifier: area.identifier,
    geometry: area.geometry,
    area: area.area,
    section_area: area.section_area,
    addresses: getContentLeaseAreaAddresses(area),
    postal_code: area.postal_code,
    city: area.city,
    type: area.type,
    location: area.location,
    plots_current: plots.filter((plot) => !plot.in_contract),
    plots_contract: plots.filter((plot) => plot.in_contract),
    plan_units_current: planUnits.filter((plot) => !plot.in_contract),
    plan_units_contract: planUnits.filter((plot) => plot.in_contract),
    archived_at: area.archived_at,
    archived_note: area.archived_note,
    archived_decision: get(area, 'archived_decision.id') || get(area, 'archived_decision'),
  };
};

/**
 * Get lease areas content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseAreas = (lease: Object): Array<Object> =>
  get(lease, 'lease_areas', []).map((area) => getContentLeaseArea(area));

/**
 * Get lease area by id
 * @param {Object} lease
 * @param {number} id
 * @returns {Object}
 */
export const getLeaseAreaById = (lease: Lease, id: ?number): ?Object =>
  id 
    ? getContentLeaseAreas(lease).find((area) => area.id === id) 
    : null;

/**
 * Get lease decision conditions content
 * @param {Object} decisions
 * @returns {Object[]}
 */
export const getContentDecisionConditions = (decision: Object): Array<Object> =>
  get(decision, 'conditions', []).map((condition) => {
    return {
      id: condition.id,
      type: get(condition, 'type.id') || condition.type,
      supervision_date: condition.supervision_date,
      supervised_date: condition.supervised_date,
      description: condition.description,
    };
  });

/**
 * Get lease decision content
 * @param {Object} decision
 * @returns {Object}
 */
export const getContentDecision = (decision: Object): Object => {
  return {
    id: decision.id,
    reference_number: decision.reference_number,
    decision_maker: get(decision, 'decision_maker.id') || decision.decision_maker,
    decision_date: decision.decision_date,
    section: decision.section,
    type: get(decision, 'type.id') || decision.type,
    description: decision.description,
    conditions: getContentDecisionConditions(decision),
  };
};

/**
 * Get lease decisions content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentDecisions = (lease: Object): Array<Object> =>
  get(lease, 'decisions', []).map((decision) => getContentDecision(decision)).sort((a, b) => sortStringByKeyDesc(a, b, 'decision_date'));

/**
 * Get decision options from lease data
 * @param {Object} lease
 * @return {Object[]};
 */
export const getDecisionOptions = (lease: Lease): Array<Object> => {
  const decisions = getContentDecisions(lease);
  const decisionOptions = decisions.map((item) => {
    return {
      value: item.id,
      label: (!item.reference_number && !item.decision_date && !item.section)
        ? item.id
        : `${item.reference_number ? item.reference_number + ', ' : ''}${item.section ? item.section + ' §, ' : ''}${formatDate(item.decision_date) || ''}`,
    };
  });

  return addEmptyOption(decisionOptions);
};

/**
 * Get decision by id
 * @param {Object} lease
 * @param {number} id
 * @returns {Object}
 */
export const getDecisionById = (lease: Lease, id: ?number): ?Object =>
  getContentDecisions(lease).find((decision) => decision.id === id);

/**
 * Get contract changes content
 * @param {Object} contract
 * @returns {Object[]}
 */
export const getContentContractChanges = (contract: Object): Array<Object> =>
  get(contract, 'contract_changes', []).map((change) => {
    return ({
      id: change.id,
      signing_date: change.signing_date,
      sign_by_date: change.sign_by_date,
      first_call_sent: change.first_call_sent,
      second_call_sent: change.second_call_sent,
      third_call_sent: change.third_call_sent,
      description: change.description,
      decision: get(change, 'decision.id') || change.decision,
    });
  });

/**
 * Get contract collaterals content
 * @param {Object} contract
 * @returns {Object[]}
 */
export const getContentContractCollaterals = (contract: Object): Array<Object> =>
  get(contract, 'collaterals', []).map((collateral) => {
    return ({
      id: collateral.id,
      type: get(collateral, 'type.id') || collateral.type,
      other_type: collateral.other_type,
      number: collateral.number,
      deed_date: collateral.deed_date,
      start_date: collateral.start_date,
      end_date: collateral.end_date,
      total_amount: collateral.total_amount,
      paid_date: collateral.paid_date,
      returned_date: collateral.returned_date,
      note: collateral.note,
    });
  });

/**
 * Get single contract content
 * @param {Object} contract
 * @returns {Object}
 */
export const getContentContract = (contract: Object): Object => {
  return {
    id: contract.id,
    type: get(contract, 'type.id') || contract.type,
    contract_number: contract.contract_number,
    signing_date: contract.signing_date,
    signing_note: contract.signing_note,
    sign_by_date: contract.sign_by_date,
    first_call_sent: contract.first_call_sent,
    second_call_sent: contract.second_call_sent,
    third_call_sent: contract.third_call_sent,
    is_readjustment_decision: contract.is_readjustment_decision,
    decision: get(contract, 'decision.id') || contract.decision,
    ktj_link: contract.ktj_link,
    institution_identifier: contract.institution_identifier,
    contract_changes: getContentContractChanges(contract),
    collaterals: getContentContractCollaterals(contract),
  };
};

/**
 * Get contracts content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentContracts = (lease: Object): Array<Object> =>
  get(lease, 'contracts', []).map((contract) => getContentContract(contract));

/**
 * Get single inspection content
 * @param {Object} contract
 * @returns {Object}
 */
export const getContentInspection = (inspection: Object) => {
  return {
    id: inspection.id,
    inspector: inspection.inspector,
    supervision_date: inspection.supervision_date,
    supervised_date: inspection.supervised_date,
    description: inspection.description,
    attachments: get(inspection, 'attachments', []),
  };
};

/**
 * Get inspections content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentInspections = (lease: Object) =>
  get(lease, 'inspections', []).map((inspection) => getContentInspection(inspection));

/**
 * Get constructability email content
 * @param {Object} lease
 * @param {Object} user
 * @param {Object} text
 * @returns {string}
 */
export const getContentConstructabilityEmail = (lease: Object, user: Object, text: ?string) => {
  let emailContent = `Vuokraustunnus: ${getContentLeaseIdentifier(lease) || '-'}\n`;
  const leaseAreas = get(lease, 'lease_areas', []);

  leaseAreas.forEach((area) => {
    const addresses = getContentLeaseAreaAddresses(area).filter((address) => address.address).map((address) => getFullAddress(address));

    emailContent += `\nVuokra-alue: ${area.identifier}`;
    if(addresses.length) {
      emailContent += `\nOsoite: ${addresses.join(' - ')}\n`;
    }
  });

  if(text) {
    emailContent += `\nViesti: ${text}\n`;
  }

  emailContent += `\nLähettäjä: ${get(user, 'profile.name')}`;

  return emailContent;
};

/**
 * Get content email logs
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentEmailLogs = (lease: Lease): Array<Object> => {
  return get(lease, 'email_logs', []).map((email) => {
    return {
      id: email.id,
      created_at: email.created_at,
      recipients: email.recipients.map((recipient) => getContentUser(recipient)),
      text: email.text,
      user: getContentUser(email.user),
    };
  });
};

/**
 * Get constructability descriptions content
 * @param {Object} area
 * @param {string} type
 * @returns {Object[]}
 */
export const getContentConstructabilityDescriptions = (area: Object, type: string): Array<Object> => {
  return get(area, 'constructability_descriptions', [])
    .filter((description) => description.type === type)
    .map((description) => {
      return {
        id: description.id,
        type: description.type,
        user: getContentUser(description.user),
        text: description.text,
        is_static: description.is_static,
        ahjo_reference_number: description.ahjo_reference_number,
        modified_at: description.modified_at,
      };
    });
};

/**
 * Get constructability areas content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentConstructabilityAreas = (lease: Object): Array<Object> =>
  get(lease, 'lease_areas', []).map((area) => {
    return {
      id: area.id,
      identifier: area.identifier,
      type: area.type,
      location: area.location,
      area: area.area,
      section_area: area.section_area,
      preconstruction_state: area.preconstruction_state,
      preconstruction_estimated_construction_readiness_moment: area.preconstruction_estimated_construction_readiness_moment,
      preconstruction_inspection_moment: area.preconstruction_inspection_moment,
      demolition_state: area.demolition_state,
      polluted_land_state: area.polluted_land_state,
      polluted_land_rent_condition_state: area.polluted_land_rent_condition_state,
      polluted_land_rent_condition_date: area.polluted_land_rent_condition_date,
      polluted_land_planner: getContentUser(area.polluted_land_planner),
      polluted_land_projectwise_number: area.polluted_land_projectwise_number,
      polluted_land_matti_reports: get(area, 'attachments', []).filter((file) => file.type === LeaseAreaAttachmentTypes.MATTI_REPORT),
      constructability_report_state: area.constructability_report_state,
      constructability_report_investigation_state: area.constructability_report_investigation_state,
      constructability_report_signing_date: area.constructability_report_signing_date,
      constructability_report_signer: area.constructability_report_signer,
      constructability_report_geotechnical_attachments: get(area, 'attachments', []).filter((file) => file.type === LeaseAreaAttachmentTypes.GEOTECHNICAL),
      other_state: area.other_state,
      descriptionsPreconstruction: getContentConstructabilityDescriptions(area, ConstructabilityType.PRECONSTRUCTION),
      descriptionsDemolition: getContentConstructabilityDescriptions(area, ConstructabilityType.DEMOLITION),
      descriptionsPollutedLand: getContentConstructabilityDescriptions(area, ConstructabilityType.POLLUTED_LAND),
      descriptionsReport: getContentConstructabilityDescriptions(area, ConstructabilityType.REPORT),
      descriptionsOther: getContentConstructabilityDescriptions(area, ConstructabilityType.OTHER),
    };
  });

/**
 * Get single invoice note content
 * @param {Object} invoiceNote
 * @returns {Object}
 */
export const getContentInvoiceNote = (invoiceNote: Object): Object => ({
  id: invoiceNote.id,
  billing_period_start_date: invoiceNote.billing_period_start_date,
  billing_period_end_date: invoiceNote.billing_period_end_date,
  notes: invoiceNote.notes,
});

/**
 * Get invoice notes content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentInvoiceNotes = (lease: Lease): Array<Object> => 
  get(lease, 'invoice_notes', []).map((note) => getContentInvoiceNote(note));

/**
 * Get content rent shares of a tenant
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getContentTenantRentShares = (tenant: Object) => {
  const rentShares = get(tenant, 'rent_shares', []);

  return rentShares.map((rentShare) => ({
    id: rentShare.id,
    intended_use: get(rentShare, 'intended_use.id') || rentShare.intended_use,
    share_numerator: rentShare.share_numerator,
    share_denominator: rentShare.share_denominator,
  }));
};

/**
 * Get details of tenantcontact_set contact
 * @param {Object} contact
 * @returns {Object}
 */
export const getContentContactDetails = (contact: Object): Object => {
  return {
    id: contact.id,
    type: contact.type,
    contact: getContentContact(contact.contact),
    start_date: contact.start_date,
    end_date: contact.end_date,
  };
};

/**
 * Get tenant content
 * @param {Object} tenant
 * @returns {Object}
 */
export const getContentTenant = (tenant: Object): Object => {
  const contact = get(tenant, 'tenantcontact_set', []).find(x => x.type === TenantContactType.TENANT);

  return contact ? getContentContactDetails(contact) : {};
};

/**
 * Get tenant billing persons
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getContentTenantBillingPersons = (tenant: Object): Array<Object> =>
  get(tenant, 'tenantcontact_set', [])
    .filter((x) => x.type === TenantContactType.BILLING)
    .map((contact) => contact ? getContentContactDetails(contact) : {})
    .sort((a, b) => sortStringByKeyDesc(a, b, 'start_date'));

/**
 * Get tenant contact persons
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getContentTenantContactPersons = (tenant: Object): Array<Object> =>
  get(tenant, 'tenantcontact_set', [])
    .filter((x) => x.type === TenantContactType.CONTACT)
    .map((contact) => contact ? getContentContactDetails(contact) : {})
    .sort((a, b) => sortStringByKeyDesc(a, b, 'start_date'));

/**
 * Get tenants content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentTenants = (lease: Object): Array<Object> =>
  get(lease, 'tenants', []).map((tenant) => {
    return {
      id: tenant.id,
      share_numerator: tenant.share_numerator,
      share_denominator: tenant.share_denominator,
      rent_shares: getContentTenantRentShares(tenant),
      reference: tenant.reference,
      tenant: getContentTenant(tenant),
      billing_persons: getContentTenantBillingPersons(tenant),
      contact_persons: getContentTenantContactPersons(tenant),
    };
  }).sort((a, b) => sortStringByKeyDesc(a, b, 'tenant.start_date'));

/**
 * Get warnings if share on date range is greater than 100%
 * @param {Object[]} tenants
 * @returns {string[]}
 */
export const getTenantShareWarnings = (tenants: Array<Object>): Array<string> => {
  const dateRanges = getSplittedDateRangesWithItems(tenants, 'tenant.start_date', 'tenant.end_date');
  const warnings = [];
  dateRanges.forEach((dateRange) => {
    const tenants = dateRange.items;

    const totalShare = tenants.reduce((sum, cur) => {
      const share = cur.share_numerator && cur.share_denominator ? Number(cur.share_numerator)/Number(cur.share_denominator) : 0;
      return sum + share;
    }, 0);

    if(totalShare > 1) {
      warnings.push(`Hallintaosuus välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on yli 100%`);
    } else if(totalShare < 1) {
      warnings.push(`Hallintaosuus välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on alle 100%`);
    }
  });

  return warnings;
};

/**
  * Get warnings if sum of rent shares per intended use per date range is not 100%
  * @param {Object[]} tenants
  * @returns {string[]}
  */
export const getTenantRentShareWarnings = (tenants: Array<Object>, leaseAttributes: Attributes): Array<string> => {
  const dateRanges = getSplittedDateRangesWithItems(tenants, 'tenant.start_date', 'tenant.end_date');
  const warnings = [];
  const intendedUseOptions = getFieldOptions(leaseAttributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE);

  dateRanges.forEach((dateRange) => {
    const tenants = dateRange.items;
    const rentShares = [];
    const sharesByIntendedUse = {};
    
    tenants.forEach((tenant) => {
      if(tenant.rent_shares && tenant.rent_shares.length) {
        rentShares.push(...tenant.rent_shares);
      }
    });

    rentShares.forEach((rentShare) => {
      if(rentShare.intended_use != null) {
        
        if(Object.prototype.hasOwnProperty.call(sharesByIntendedUse, rentShare.intended_use)) {
          sharesByIntendedUse[rentShare.intended_use].push(rentShare);
        } else {
          sharesByIntendedUse[rentShare.intended_use] = [rentShare];
        }
      }
    });

    Object.keys(sharesByIntendedUse).forEach((key) => {
      const items = sharesByIntendedUse[key];

      const totalShare = items.reduce((sum, cur) => {
        const share = cur.share_numerator && cur.share_denominator ? Number(cur.share_numerator)/Number(cur.share_denominator) : 0;
        return sum + share;
      }, 0);

      if(totalShare > 1) {
        warnings.push(`Laskutusosuus (${getLabelOfOption(intendedUseOptions, key.toString()) || '-'}) välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on yli 100%`);
      } else if(totalShare < 1) {
        warnings.push(`Laskutusosuus (${getLabelOfOption(intendedUseOptions, key.toString()) || '-'}) välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on alle 100%`);
      }
    });
  });

  return warnings;
};

/**
 * Get payable rents content
 * @param {Object} rent
 * @returns {Object[]}
 */
export const getContentPayableRents = (rent: Object): Array<Object> =>
  get(rent, 'payable_rents', [])
    .map((item) => {
      return {
        id: item.id,
        amount: item.amount,
        start_date: item.start_date,
        end_date: item.end_date,
        difference_percent: item.difference_percent,
        calendar_year_rent: item.calendar_year_rent,
      };
    });

/**
 * Get equalized rents content
 * @param {Object} rent
 * @returns {Object[]}
 */
export const getContentEqualizedRents = (rent: Object) =>
  get(rent, 'equalized_rents', [])
    .map((item) => {
      return {
        id: item.id,
        start_date: item.start_date,
        end_date: item.end_date,
        payable_amount: item.payable_amount,
        equalized_payable_amount: item.equalized_payable_amount,
        equalization_factor: item.equalization_factor,
      };
    });

/**
 * Calculate re-lease discount percent for rent adjustment subvention
 * @param {string} subventionBasePercent
 * @param {string} subventionGraduatedPercent
 * @return {number}
 */
export const calculateReLeaseDiscountPercent = (subventionBasePercent: ?string, subventionGraduatedPercent: ?string): number => {
  return ((1 - ((1 - Number(convertStrToDecimalNumber(subventionBasePercent) || 0)/100) * (1 - Number(convertStrToDecimalNumber(subventionGraduatedPercent) || 0)/100))) * 100);
};

/**
 * Get basis of rent index value
 * @param {Object} basisOfRent
 * @param {Object[]} indexOptions
 * @return {string}
 */
export const getBasisOfRentIndexValue = (basisOfRent: Object, indexOptions: Array<Object>): ?string => {
  if(!basisOfRent.index || !indexOptions.length) return null;
  const indexObj = indexOptions.find((item) => item.value === basisOfRent.index);

  if(indexObj) {
    const indexValue = indexObj.label.match(/=(.*)/)[1];
    return indexValue;
  }
  return null;
};

/**
 * Calculate basis of rent basis annual rent
 * @param {Object} basisOfRent
 * @return {number}
 */
export const calculateBasisOfRentBasicAnnualRent = (basisOfRent: Object): number => {
  if(!isDecimalNumberStr(basisOfRent.amount_per_area) || !isDecimalNumberStr(basisOfRent.area)) return 0;
  
  return Number(convertStrToDecimalNumber(basisOfRent.amount_per_area))
    * Number(convertStrToDecimalNumber(basisOfRent.area))
    * Number(isDecimalNumberStr(basisOfRent.profit_margin_percentage) ? Number(convertStrToDecimalNumber(basisOfRent.profit_margin_percentage))/100 : 0);
};

/**
 * Calculate basis of rent amount per area
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @return {number}
 */
export const calculateBasisOfRentAmountPerArea = (basisOfRent: Object, indexValue: ?string): number => {
  if(!isDecimalNumberStr(indexValue) || !isDecimalNumberStr(basisOfRent.amount_per_area)) return 0;

  return Number(convertStrToDecimalNumber(indexValue))/100
    * Number(convertStrToDecimalNumber(basisOfRent.amount_per_area));
};

/**
 * Calculate basis of rent initial year rent
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @return {number}
 */
export const calculateBasisOfRentInitialYearRent = (basisOfRent: Object, indexValue: ?string): number => {
  const amountPerArea = calculateBasisOfRentAmountPerArea(basisOfRent, indexValue);

  if(!isDecimalNumberStr(amountPerArea) || !isDecimalNumberStr(basisOfRent.area)) return 0;
  
  return Number(convertStrToDecimalNumber(amountPerArea))
    * Number(convertStrToDecimalNumber(basisOfRent.area))
    * Number(isDecimalNumberStr(basisOfRent.profit_margin_percentage) ? Number(convertStrToDecimalNumber(basisOfRent.profit_margin_percentage))/100 : 0);
};

/**
 * Calculate basis of rent discounted initial year rent
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @return {number}
 */
export const calculateBasisOfRentDiscountedInitialYearRent = (basisOfRent: Object, indexValue: ?string): number => {
  const initialYearRent = calculateBasisOfRentInitialYearRent(basisOfRent, indexValue);

  if(!isDecimalNumberStr(initialYearRent)) return 0;

  return Number(convertStrToDecimalNumber(initialYearRent))
    * Number(isDecimalNumberStr(basisOfRent.discount_percentage) ? (100 - Number(convertStrToDecimalNumber(basisOfRent.discount_percentage)))/100 : 1);
};

/**
 * Calculate basis of rent total discounted initial year rent
 * @param {Object[]} basisOfRent<
 * @param {Object[]} indexOptions
 * @return {number}
 */
export const calculateBasisOfRentTotalDiscountedInitialYearRent = (basisOfRents: Array<Object>, indexOptions: Array<Object>): ?number => {
  return basisOfRents.reduce((total, basisOfRent) => {
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    
    return  calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue) + total;
  }, 0);
};

/**
 * Calculate basis of rent basis subvention amount
 * @param {number} initialYearRent
 * @param {string} subventionPercent
 * @return {number}
 */
export const calculateBasisOfRentSubventionAmount = (initialYearRent: number, subventionPercent: string | number): number => {
  if(!isDecimalNumberStr(subventionPercent)) return 0;

  return  (Number(convertStrToDecimalNumber(subventionPercent)) / 100)
    * initialYearRent;
};

/**
 * Calculate rent adjustment subvention percent
 * @param {string} subventionType
 * @param {string} subventionBasePercent
 * @param {string} subventionGraduatedPercent
 * @param {Object[]} managementSubventions
 * @param {Object[]} temporarySubventions
 * @param {string} subventionGraduatedPercent
 * @return {number}
 */
export const calculateRentAdjustmentSubventionPercent = (subventionType: ?string, subventionBasePercent: ?string, subventionGraduatedPercent: ?string, managementSubventions: ?Array<Object>,  temporarySubventions: ?Array<Object>) => {
  let discount = 0;

  if(subventionType === SubventionTypes.RE_LEASE_DISCOUNT) {
    discount += calculateReLeaseDiscountPercent(subventionBasePercent, subventionGraduatedPercent);
  }

  if(subventionType === SubventionTypes.X_DISCOUNT) {
    if(managementSubventions) {
      managementSubventions.forEach((subvention) => {
        discount += Number(convertStrToDecimalNumber(subvention.subvention_percent) || 0);
      });
    }
  }

  if(temporarySubventions) {
    temporarySubventions.forEach((subvention) => {
      discount += Number(convertStrToDecimalNumber(subvention.subvention_percent) || 0);
    });
  }

  return discount;
};

/**
 * Get content of management subventions from rent adjustment
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getContentManagementSubventions = (rentAdjustment: Object): Array<Object> =>
  get(rentAdjustment, 'management_subventions', [])
    .map((item) => {
      return {
        id: item.id,
        management: get(item, 'management.id') || item.management,
        subvention_percent: item.subvention_percent,
      };
    });

/**
 * Get content of temporary subventions from rent adjustment
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getContentTemporarySubventions = (rentAdjustment: Object): Array<Object> =>
  get(rentAdjustment, 'temporary_subventions', [])
    .map((item) => {
      return {
        id: item.id,
        description: item.description,
        subvention_percent: item.subvention_percent,
      };
    });

/**
 * Get rent adjustments content
 * @param {Object} rent
 * @return {Object[]}
 */
export const getContentRentAdjustments = (rent: Object): Array<Object> =>
  get(rent, 'rent_adjustments', [])
    .map((item) => {
      return {
        id: item.id,
        type: item.type,
        intended_use: get(item, 'intended_use.id') || item.intended_use,
        start_date: item.start_date,
        end_date: item.end_date,
        full_amount: item.full_amount,
        amount_type: get(item, 'amount_type.id') || item.amount_type,
        amount_left: item.amount_left,
        decision: get(item, 'decision.id') || item.decision,
        note: item.note,
        subvention_type: get(item, 'subvention_type.id') || item.subvention_type,
        subvention_base_percent: item.subvention_base_percent,
        subvention_graduated_percent: item.subvention_graduated_percent,
        management_subventions: getContentManagementSubventions(item),
        temporary_subventions: getContentTemporarySubventions(item),
      };
    })
    .sort(sortByStartAndEndDateDesc);

/**
 * Get index adjusted rents content
 * @param {Object} rent
 * @return {Object[]}
 */
export const getContentIndexAdjustedRents = (rent: Object): Array<Object> =>
  get(rent, 'index_adjusted_rents', []).map((item) => {
    return {
      item: item.id,
      amount: item.amount,
      intended_use: get(item, 'intended_use.id') || item.intended_use,
      start_date: item.start_date,
      end_date: item.end_date,
      factor: item.factor,
    };
  });

/**
 * Get contract rents content
 * @param {Object} rent
 * @return {Object[]}
 */
export const getContentContractRents = (rent: Object): Array<Object> =>
  get(rent, 'contract_rents', [])
    .map((item) => {
      return {
        id: item.id,
        amount: item.amount,
        period: item.period,
        intended_use: get(item, 'intended_use.id') || item.intended_use,
        base_amount: item.base_amount,
        base_amount_period: item.base_amount_period,
        base_year_rent: item.base_year_rent,
        start_date: item.start_date,
        end_date: item.end_date,
      };
    })
    .sort(sortByStartAndEndDateDesc);

/**
 * Get fixed initial year rents content
 * @param {Object} rent
 * @return {Object[]}
 */
export const getContentFixedInitialYearRents = (rent: Object): Array<Object> =>
  get(rent, 'fixed_initial_year_rents', [])
    .map((item) => {
      return {
        id: item.id,
        intended_use: get(item, 'intended_use.id') || item.intended_use,
        amount: item.amount,
        start_date: item.start_date,
        end_date: item.end_date,
      };
    })
    .sort(sortByStartAndEndDateDesc);

/**
 * Get due dates of rent
 * @param {Object} rent
 * @return {Object[]}
 */
export const getContentRentDueDate = (rent: Object, path?: string = 'due_dates'): Array<Object> =>
  get(rent, path, []).map((date) => ({
    id: date.id,
    day: date.day,
    month: date.month,
  }));

/**
 * Get rents content
 * @param {Object} lease
 * @return {Object[]}
 */
export const getContentRents = (lease: Object): Array<Object> =>
  get(lease, 'rents', [])
    .map((rent) => {
      return {
        id: rent.id,
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
        equalized_rents: getContentEqualizedRents(rent),
        yearly_due_dates: getContentRentDueDate(rent, 'yearly_due_dates'),
      };
    })
    .sort(sortByStartAndEndDateDesc);

/**
 * Get warnings if amount of fixed initial year rents is different than contract rents
 * @param {Object[]} rents
 * @returns {string[]}
 */
export const getRentWarnings = (rents: Array<Object>): Array<string> => {
  const warnings = [];

  rents.forEach((rent) => {
    if(rent.type !== RentTypes.INDEX && rent.type !== RentTypes.MANUAL) return;

    let showWarning = false;
    const fixedInitialYearRents = get(rent, 'fixed_initial_year_rents', []).filter((rent) => isActive(rent));
    const contractRents = get(rent, 'contract_rents', []).filter((rent) => isActive(rent));

    forEach(fixedInitialYearRents, (rent) => {
      if(rent.intended_use) {
        const filteredFixedInitialYearRents = fixedInitialYearRents.filter((item) => item.intended_use === rent.intended_use);
        const filteredContractRents = contractRents.filter((item) => item.intended_use === rent.intended_use);
        
        if(filteredFixedInitialYearRents.length !== filteredContractRents.length) {
          showWarning = true;
          return false;
        }
      }
    });

    if(showWarning) {
      warnings.push(`Vuokralla ${formatDateRange(rent.start_date, rent.end_date)} on eri määrä kiinteitä alkuvuosivuokria ja sopimusvuokria`);
    }
  });

  return warnings;
};

/**
 * Get lease basis of rents content
 * @param {Object} lease
 * @return {Object[]}
 */
export const getContentBasisOfRents = (lease: Object): Array<Object> =>
  get(lease, 'basis_of_rents', []).map((item) => {
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
      subvention_type: get(item, 'subvention_type.id') || item.subvention_type,
      subvention_base_percent: item.subvention_base_percent,
      subvention_graduated_percent: item.subvention_graduated_percent,
      management_subventions: getContentManagementSubventions(item),
      temporary_subventions: getContentTemporarySubventions(item),
    };
  });

/**
 * Get invoice recipient options
 * @param {Object} lease
 * @param {boolean} addAll
 * @param {boolean} addTenants
 * @return {Object[]}
 */
export const getInvoiceRecipientOptions = (lease: Object, addAll: boolean, addTenants: boolean): Array<Object> =>{
  const items = getContentTenants(lease);
  const recipients = [];

  if(addAll) {
    recipients.push({value: RecipientOptions.ALL, label: 'Kaikki'});
  }

  if(addTenants) {
    recipients.push(...items
      .filter((item) => isActive(item.tenant))
      .map((item) => {
        return {
          value: get(item, 'id'),
          label: getContactFullName(get(item, 'tenant.contact')),
        };
      })
      .sort((a, b) => sortStringByKeyAsc(a, b, 'label')));
  }

  return recipients;

};

/**
 * Get invoice tenant options
 * @param {Object} lease
 * @return {Object[]}
 */
export const getInvoiceTenantOptions = (lease: Object): Array<Object> =>{
  const items: any = getContentTenants(lease);

  return items.map((item) => {
    return {
      value: item.id,
      label: getContactFullName(get(item, 'tenant.contact')),
    };
  });
};

/**
 * Get debt collection decisions from lease data
 * @param lease
 * @returns {Object[]}
 */
export const getContentDebtCollectionDecisions = (lease: Object) =>
  get(lease, 'decisions', []).filter((decision) => get(decision, 'type.kind') === DecisionTypeKinds.LEASE_CANCELLATION).map((decision) => getContentDecision(decision));

/**
 * Get content leases features for geojson data
 * @param {Object[]} leases
 * @returns {Object[]}
 */
export const getContentLeasesFeatures = (leases: Array<Object>): Array<LeafletFeature> => {
  return leases.map((lease) => {
    const coordinates = [];
    const areas = get(lease, 'lease_areas', []);

    areas.forEach((area) => {
      const coords = get(area, 'geometry.coordinates', []);

      if(coords.length) {
        coordinates.push(coords[0]);
      }
    });

    return {
      type: 'Feature',
      geometry: {
        coordinates: coordinates,
        type: 'MultiPolygon',
      },
      properties: {
        id: lease.id,
        feature_type: 'lease',
        identifier: getContentLeaseIdentifier(lease),
        start_date: lease.start_date,
        end_date: lease.end_date,
        state: get(lease, 'state.id') || lease.state,
      },
    };
  });
};

/**
 * Get content leases geojson data
 * @param {Object[]} leases
 * @returns {Object}
 */
export const getContentLeasesGeoJson = (leases: Array<Object>): LeafletGeoJson => {
  const features = getContentLeasesFeatures(leases);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

/**
 * Get content lease areas features for geojson data
 * @param {Object[]} areas
 * @returns {Object[]}
 */
export const getContentLeaseAreasFeatures = (areas: Array<Object>): Array<LeafletFeature>  => {
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

/**
 * Get content lease areas geojson data
 * @param {Object} lease
 * @returns {Object}
 */
export const getContentAreasGeoJson = (lease: Lease): LeafletGeoJson => {
  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);

  const features = getContentLeaseAreasFeatures(areas);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

/**
 * Get content lease plots features for geojson data
 * @param {Object[]} plots
 * @returns {Object[]}
 */
export const getContentLeasePlotsFeatures = (plots: Array<Object>): Array<LeafletFeature> => {
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

/**
 * Get content lease plots geojson data
 * @param {Object} lease
 * @param {boolean} inContract
 * @returns {Object}
 */
export const getContentPlotsGeoJson = (lease: Lease, inContract: boolean = false): LeafletGeoJson => {
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

/**
 * Get content lease plan units features for geojson data
 * @param {Object[]} plots
 * @returns {Object[]}
 */
export const getContentPlanUnitFeatures = (planUnits: Array<Object>): Array<LeafletFeature> => {
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
        plot_division_effective_date: planUnit.plot_division_effective_date,
        plot_division_state: planUnit.plot_division_state,
        plan_unit_type: planUnit.plan_unit_type,
        plan_unit_state: planUnit.plan_unit_state,
        plan_unit_intended_use: planUnit.plan_unit_intended_use,
      },
    };
  });
};

/**
 * Get content lease plan units geojson data
 * @param {Object} lease
 * @param {boolean} inContract
 * @returns {Object}
 */
export const getContentPlanUnitsGeoJson = (lease: Lease, inContract: boolean = false): LeafletGeoJson => {
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

/**
 * Get coordinates of lease
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getLeaseCoordinates = (lease: Lease): Array<Object> => {
  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);
  let coordinates = [];

  areas.forEach((area) => {
    coordinates.push(...getCoordinatesOfGeometry(area.geometry));
  });

  return coordinates;
};

/**
 * Get payload for lease POST request
 * @param {Object} lease
 * @returns {Object}
 */
export const getPayloadCreateLease = (lease: Object): Object => {
  const relateTo = !isEmpty(lease.relate_to)
    ? !isEmptyValue(lease.relate_to.value)
      ? lease.relate_to.value
      : undefined
    : undefined;

  return {
    state: lease.state,
    type: lease.type,
    municipality: lease.municipality,
    district: lease.district,
    reference_number: lease.reference_number,
    note: lease.note,
    relate_to: relateTo,
    relation_type: relateTo ? RelationTypes.TRANSFER : undefined,
  };
};

/**
 * Add summary form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addSummaryFormValuesToPayload = (payload: Object, formValues: Object): Object => {
  return {
    ...payload,
    building_selling_price: convertStrToDecimalNumber(formValues.building_selling_price),
    classification: formValues.classification,
    conveyance_number: formValues.conveyance_number,
    end_date: formValues.end_date,
    financing: formValues.financing,
    hitas: formValues.hitas,
    intended_use: formValues.intended_use,
    intended_use_note: formValues.intended_use_note,
    is_subject_to_vat: formValues.is_subject_to_vat,
    lessor: get(formValues, 'lessor.value'),
    notice_note: formValues.notice_note,
    notice_period: formValues.notice_period,
    management: formValues.management,
    note: formValues.note,
    preparer: get(formValues, 'preparer.value'),
    reference_number: formValues.reference_number,
    real_estate_developer: formValues.real_estate_developer,
    regulated: formValues.regulated,
    regulation: formValues.regulation,
    reservation_procedure: formValues.reservation_procedure,
    special_project: formValues.special_project,
    start_date: formValues.start_date,
    state: formValues.state,
    statistical_use: formValues.statistical_use,
    supportive_housing: formValues.supportive_housing,
    transferable: formValues.transferable,
  };
};

/**
 * Get lease area addresses payload
 * @param {Object} area
 * @returns {Object[]}
 */
const getPayloadLeaseAreaAddresses = (area: Object) =>
  get(area, 'addresses', []).map((address) => {
    return {
      id: address.id,
      address: address.address,
      postal_code: address.postal_code,
      city: address.city,
      is_primary: address.is_primary,
    };
  });

/**
 * Get lease plots payload
 * @param {Object} area
 * @returns {Object[]}
 */
const getPayloadPlots = (area: Object): Array<Object> => {
  const currentPlots = get(area, 'plots_current', []).map((plot) => {
    return {...plot, 'in_contract': false};
  });
  const contractPlots = get(area, 'plots_contract', []).map((plot) => {
    return {...plot, 'in_contract': true};
  });
  const plots = currentPlots.concat(contractPlots);

  return plots.map((plot) => {
    return {
      id: plot.id,
      identifier: plot.identifier,
      area: convertStrToDecimalNumber(plot.area),
      section_area: convertStrToDecimalNumber(plot.section_area),
      type: plot.type,
      location: plot.location,
      registration_date: plot.registration_date,
      repeal_date: plot.repeal_date,
      in_contract: plot.in_contract,
    };
  });
};

/**
 * Get lease plan units payload
 * @param {Object} area
 * @returns {Object[]}
 */
const getPayloadPlanUnits = (area: Object): Array<Object> => {
  const currentPlanUnits = get(area, 'plan_units_current', []).map((planunit) => {
    return {...planunit, 'in_contract': false};
  });
  const contractPlanUnits = get(area, 'plan_units_contract', []).map((planunit) => {
    return {...planunit, 'in_contract': true};
  });

  const planUnits = currentPlanUnits.concat(contractPlanUnits);
  return planUnits.map((planunit) => {
    return {
      id: planunit.id,
      identifier: planunit.identifier,
      area: convertStrToDecimalNumber(planunit.area),
      section_area: convertStrToDecimalNumber(planunit.section_area),
      in_contract: planunit.in_contract,
      plot_division_identifier: planunit.plot_division_identifier,
      plot_division_effective_date: planunit.plot_division_effective_date,
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

/**
 * Add areas form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addAreasFormValuesToPayload = (payload: Object, values: Object): Object => {
  const areas = [...get(values, 'lease_areas_active', []), ...get(values, 'lease_areas_archived', [])];

  payload.lease_areas = areas.map((area) => {
    return {
      id: area.id,
      identifier: area.identifier,
      area: convertStrToDecimalNumber(area.area),
      section_area: convertStrToDecimalNumber(area.area),
      addresses: getPayloadLeaseAreaAddresses(area),
      type: area.type,
      location: area.location,
      plots: getPayloadPlots(area),
      plan_units: getPayloadPlanUnits(area),
      archived_at: area.archived_at,
      archived_note: area.archived_note,
      archived_decision: area.archived_decision,
    };
  });

  return payload;
};

/**
 * Get decision conditions payload
 * @param {Object} decision
 * @returns {Object[]}
 */
const getPayloadDecisionConditions = (decision: Object) => {
  return get(decision, 'conditions', []).map((condition) => {
    return {
      id: condition.id,
      type: condition.type,
      supervision_date: condition.supervision_date,
      supervised_date: condition.supervised_date,
      description: condition.description,
    };
  });
};

/**
 * Add decisions form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addDecisionsFormValuesToPayload = (payload: Object, formValues: Object): Object => {
  payload.decisions = get(formValues, 'decisions', []).map((decision) => {
    return {
      id: decision.id,
      reference_number: decision.reference_number,
      decision_maker: decision.decision_maker,
      decision_date: decision.decision_date,
      section: decision.section,
      type: decision.type,
      description: decision.description,
      conditions: getPayloadDecisionConditions(decision),
    };
  });

  return payload;
};

/**
 * Get contract changes payload
 * @param {Object} contract
 * @returns {Object[]}
 */
const getPayloadContractChanges = (contract: Object): Array<Object> => {
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

/**
 * Get contract collaterals payload
 * @param {Object} contract
 * @returns {Object[]}
 */
const getPayloadCollaterals = (contract: Object): Array<Object> => {
  return get(contract, 'collaterals', []).map((collateral) => {
    switch(collateral.type) {
      case CollateralTypes.FINANCIAL_GUARANTEE:
        return {
          id: collateral.id,
          type: collateral.type,
          total_amount: convertStrToDecimalNumber(collateral.total_amount),
          paid_date: collateral.paid_date,
          returned_date: collateral.returned_date,
          note: collateral.note,
        };
      case CollateralTypes.MORTGAGE_DOCUMENT:
        return {
          id: collateral.id,
          type: collateral.type,
          number: collateral.number,
          deed_date: collateral.deed_date,
          start_date: collateral.start_date,
          end_date: collateral.end_date,
          total_amount: convertStrToDecimalNumber(collateral.total_amount),
          note: collateral.note,
        };
      case CollateralTypes.OTHER:
      default:
        return {
          id: collateral.id,
          type: collateral.type,
          other_type: collateral.other_type,
          number: collateral.number,
          start_date: collateral.start_date,
          end_date: collateral.end_date,
          total_amount: convertStrToDecimalNumber(collateral.total_amount),
          paid_date: collateral.paid_date,
          returned_date: collateral.returned_date,
          note: collateral.note,
        };
    }
  });
};

/**
 * Add contracts form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addContractsFormValuesToPayload = (payload: Object, formValues: Object): Object => {
  payload.contracts = get(formValues, 'contracts', []).map((contract) => {
    return {
      id: contract.id,
      type: contract.type,
      contract_number: contract.contract_number,
      signing_date: contract.signing_date,
      signing_note: contract.signing_note,
      sign_by_date: contract.sign_by_date,
      first_call_sent: contract.first_call_sent,
      second_call_sent: contract.second_call_sent,
      third_call_sent: contract.third_call_sent,
      is_readjustment_decision: contract.is_readjustment_decision,
      decision: contract.decision,
      ktj_link: contract.ktj_link,
      institution_identifier: contract.institution_identifier,
      contract_changes: getPayloadContractChanges(contract),
      collaterals: getPayloadCollaterals(contract),
    };
  });

  return payload;
};

/**
 * Add inspections form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addInspectionsFormValuesToPayload = (payload: Object, formValues: Object): Object => {
  payload.inspections = get(formValues, 'inspections', []).map((inspection) => {
    return {
      id: inspection.id,
      inspector: inspection.inspector,
      supervision_date: inspection.supervision_date,
      supervised_date: inspection.supervised_date,
      description: inspection.description,
    };
  });

  return payload;
};

/**
 * Get constructability descriptions payload
 * @param {Object} area
 * @returns {Object[]}
 */
export const getPayloadConstructabilityDescriptions = (area: Object): Array<Object> => {
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
      id: description.id,
      is_static: description.is_static,
      type: description.type,
      text: description.text,
      ahjo_reference_number: description.ahjo_reference_number,
    };
  });
};

/**
 * Get constructability area payload
 * @param {Object} area
 * @param {Object} values
 * @returns {Object[]}
 */
export const getPayloadConstructabilityArea = (area: Object, values: Object) => {
  return {
    ...area,
    preconstruction_state: values.preconstruction_state,
    preconstruction_estimated_construction_readiness_moment: values.preconstruction_estimated_construction_readiness_moment,
    preconstruction_inspection_moment: values.preconstruction_inspection_moment,
    demolition_state: values.demolition_state,
    polluted_land_state: values.polluted_land_state,
    polluted_land_rent_condition_state: values.polluted_land_rent_condition_state,
    polluted_land_rent_condition_date: values.polluted_land_rent_condition_date,
    polluted_land_planner: get(values, 'polluted_land_planner.value'),
    polluted_land_projectwise_number: values.polluted_land_projectwise_number,
    constructability_report_state: values.constructability_report_state,
    constructability_report_investigation_state: values.constructability_report_investigation_state,
    constructability_report_signing_date: values.constructability_report_signing_date,
    constructability_report_signer: values.constructability_report_signer,
    other_state: values.other_state,
    constructability_descriptions: getPayloadConstructabilityDescriptions(values),
  };
};

/**
 * Add constructability form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addConstructabilityFormValuesToPayload = (payload: Object, formValues: Object): Object => {
  const areas = payload.lease_areas;
  const constAreas = get(formValues, 'lease_areas', []);

  if(areas && !!areas.length) {
    payload.lease_areas = areas.map((area) => {
      const constArea = constAreas.find(x => x.id === area.id);

      if(constArea) {
        return getPayloadConstructabilityArea(area, constArea);
      }
      return area;
    });
  } else if(Array.isArray(constAreas)) {
    payload.lease_areas = constAreas.map((area) => {
      return getPayloadConstructabilityArea({
        id: area.id,
        location: area.location,
        area: area.area,
        identifier: area.identifier,
        type: area.type,
      }, area);
    });
  }

  return payload;
};

/**
 * Get tenant contact details payload
 * @param {Object} tenant
 * @param {string} contactType
 * @returns {Object}
 */
export const getPayloadTenantContactDetails = (tenant: Object, contactType: 'tenant' | 'billing' | 'contact'): Object => (
  {
    id: tenant.id,
    type: contactType,
    contact: tenant.contact,
    start_date: tenant.start_date,
    end_date: tenant.end_date,
  }
);

/**
 * Get payload rent shares of a tenant
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getPayloadTenantRentShares = (tenant: Object) => {
  const rentShares = get(tenant, 'rent_shares', []);

  return rentShares.map((rentShare) => ({
    id: rentShare.id,
    intended_use: rentShare.intended_use,
    share_numerator: rentShare.share_numerator,
    share_denominator: rentShare.share_denominator,
  }));
};

/**
 * Get tenant contact set payload
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getPayloadTenantContactSet = (tenant: Object): Array<Object> => {
  const contacts = [];
  const tenantData = tenant.tenant;
  contacts.push(getPayloadTenantContactDetails(tenantData, TenantContactType.TENANT));

  const billingPersons = get(tenant, 'billing_persons', []);
  billingPersons.forEach((billingPerson) => {
    contacts.push(getPayloadTenantContactDetails(billingPerson, TenantContactType.BILLING));
  });
  const contactPersons = get(tenant, 'contact_persons', []);
  contactPersons.forEach((contactPerson) => {
    contacts.push(getPayloadTenantContactDetails(contactPerson, TenantContactType.CONTACT));
  });

  return contacts;
};

/**
 * Add tenants form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addTenantsFormValuesToPayload = (payload: Object, formValues: Object): Object => {
  const tenantsCurrent = get(formValues, 'tenants', []);
  const tenantsArchived = get(formValues, 'tenantsArchived', []);
  const tenants = [...tenantsCurrent, ...tenantsArchived];

  payload.tenants = tenants.map((tenant) => {
    return {
      id: tenant.id,
      share_numerator: tenant.share_numerator,
      share_denominator: tenant.share_denominator,
      reference: tenant.reference,
      rent_shares: getPayloadTenantRentShares(tenant),
      tenantcontact_set: getPayloadTenantContactSet(tenant),
    };
  });

  return payload;
};

/**
 * Get management subventions payload
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getPayloadManagementSubventions = (rentAdjustment: Object): Array<Object> =>
  get(rentAdjustment, 'management_subventions', [])
    .map((item) => {
      return {
        id: item.id,
        management: item.management,
        subvention_percent: convertStrToDecimalNumber(item.subvention_percent),
      };
    });

/**
 * Get temporary subventions payload
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getPayloadTemporarySubventions = (rentAdjustment: Object): Array<Object> =>
  get(rentAdjustment, 'temporary_subventions', [])
    .map((item) => {
      return {
        id: item.id,
        description: item.description,
        subvention_percent: convertStrToDecimalNumber(item.subvention_percent),
      };
    });

/**
 * Get rent adjustments payload
 * @param {Object} rent
 * @returns {Object[]}
 */
export const getPayloadRentAdjustments = (rent: Object): Array<Object> =>
  get(rent, 'rent_adjustments', []).map((item) => {
    return {
      id: item.id,
      type: item.type,
      intended_use: item.intended_use,
      start_date: item.start_date,
      end_date: item.amount_type !== RentAdjustmentAmountTypes.AMOUNT_TOTAL ? item.end_date : null,
      full_amount: convertStrToDecimalNumber(item.full_amount),
      amount_type: item.amount_type,
      amount_left: convertStrToDecimalNumber(item.amount_left),
      decision: item.decision,
      note: item.note,
      subvention_type: item.subvention_type,
      subvention_base_percent: convertStrToDecimalNumber(item.subvention_base_percent),
      subvention_graduated_percent: convertStrToDecimalNumber(item.subvention_graduated_percent),
      management_subventions: getPayloadManagementSubventions(item),
      temporary_subventions: getPayloadTemporarySubventions(item),
    };
  });

/**
 * Get contract rents payload
 * @param {Object} rent
 * @param {string} rentType
 * @returns {Object[]}
 */
export const getPayloadContractRents = (rent: Object, rentType: string): Array<Object> =>
  get(rent, 'contract_rents', []).map((item) => {
    const contractRentData: any = {
      id: item.id,
      amount: convertStrToDecimalNumber(item.amount),
      period: item.period,
      intended_use: get(item, 'intended_use.id') || item.intended_use,
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

/**
 * Get fixed initial year rents payload
 * @param {Object} rent
 * @returns {Object[]}
 */
export const getPayloadFixedInitialYearRents = (rent: Object): Array<Object> =>
  get(rent, 'fixed_initial_year_rents', []).map((item) => {
    return {
      id: item.id,
      intended_use: item.intended_use,
      amount: convertStrToDecimalNumber(item.amount),
      start_date: item.start_date,
      end_date: item.end_date,
    };
  });

/**
 * Get rent due dates payload
 * @param {Object} rent
 * @returns {Object[]}
 */
export const getPayloadRentDueDates = (rent: Object): Array<Object> => {
  const type = rent.type;
  const dueDates = get(rent, 'due_dates', []);

  if(type === RentTypes.ONE_TIME) {
    return dueDates.length
      ? [{
        id: dueDates[0].id,
        day: dueDates[0].day,
        month: dueDates[0].month,
      }]
      : [];
  }
  return dueDates.map((date) => {
    return {
      id: date.id,
      day: date.day,
      month: date.month,
    };
  });
};

/**
 * Find basis of rent by id
 * @param {Object} lease
 * @param {number} id
 * @returns {Object}
 */
export const getBasisOfRentById = (lease: Lease, id: ?number): ?Object => {
  if(!id) return null;

  const basisOfRents = getContentBasisOfRents(lease);

  return basisOfRents.find((rent) => rent.id === id);
};

/**
 * Add rents form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @param {Object} currentLease
 * @returns {Object}
 */
export const addRentsFormValuesToPayload = (payload: Object, formValues: Object, currentLease: Lease): Object => {
  payload.is_rent_info_complete = formValues.is_rent_info_complete ? true : false;

  const basisOfRents = [
    ...get(formValues, 'basis_of_rents', []), 
    ...get(formValues, 'basis_of_rents_archived', []),
  ];

  payload.basis_of_rents = basisOfRents.map((item) => {
    const savedBasisOfRent = getBasisOfRentById(currentLease, item.id);

    if(savedBasisOfRent && savedBasisOfRent.locked_at) {
      return {
        id: item.id,
        locked_at: item.locked_at,
      };
    } else {
      return {
        id: item.id,
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
        subvention_type: item.subvention_type,
        subvention_base_percent: convertStrToDecimalNumber(item.subvention_base_percent),
        subvention_graduated_percent: convertStrToDecimalNumber(item.subvention_graduated_percent),
        management_subventions: getPayloadManagementSubventions(item),
        temporary_subventions: getPayloadTemporarySubventions(item),
      };
    }
  });

  const rents = [
    ...get(formValues, 'rents', []), 
    ...get(formValues, 'rentsArchived', []),
  ];

  payload.rents = rents.map((rent) => {
    const rentData: any = {
      id: rent.id,
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
        rentData.due_dates = getPayloadRentDueDates(rent);
      } else if (rent.due_dates_type === RentDueDateTypes.FIXED) {
        rentData.due_dates_per_year = rent.due_dates_per_year;
      }
    }

    // Patch cycle, index type, fixed initial year rents and contract rents data only if rent type is index or manual
    if(rent.type === RentTypes.INDEX || rent.type === RentTypes.MANUAL) {
      rentData.cycle = rent.cycle;
      rentData.index_type = rent.index_type;
      rentData.fixed_initial_year_rents = getPayloadFixedInitialYearRents(rent);
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
      rentData.contract_rents = getPayloadContractRents(rent, rent.type);
      rentData.rent_adjustments = getPayloadRentAdjustments(rent);
    }

    return rentData;
  });

  return payload;
};

/**
 * Calculate sum of areas
 * @param {Object[]} areas
 * @returns {number}
 */
export const calculateAreasSum = (areas: Array<Object>): number => {
  let areasSum = 0;

  if(areas) {
    forEach(areas, (area) => {
      areasSum += area.area;
    });
  }
  return areasSum;
};

/**
 * Map lease page search filters for API 
 * @param {Object} query
 * @returns {Object}
 */
export const mapLeaseSearchFilters = (query: Object): Object => {
  const searchQuery = {...query};

  searchQuery.lease_state = isArray(searchQuery.lease_state)
    ? searchQuery.lease_state
    : searchQuery.lease_state ? [searchQuery.lease_state] : [];

  if(searchQuery.sort_key) {
    if(searchQuery.sort_key === 'identifier') {
      searchQuery.ordering = [
        'identifier__type__identifier',
        'identifier__municipality__identifier',
        'identifier__district__identifier',
        'identifier__sequence',
      ];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if(searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  if(searchQuery.has_not_geometry === 'true') {
    searchQuery.has_geometry = false;
  }

  delete searchQuery.has_not_geometry;

  searchQuery.lease_state.forEach((state) => {
    if(state === LeaseState.RESERVE) {
      searchQuery.lease_state.push(LeaseState.FREE);
      return false;
    }
  });

  return searchQuery;
};

/**
 * Format seasonal date as string
 * @param {string} day
 * @param {string} month
 * @returns {string}
 */
export const formatSeasonalDate = (day: ?string, month: ?string): ?string => {
  if(!day || !month) return null;

  return `${day}.${month}.`;
};

/**
 * Format single due date as string
 * @param {Object} date
 * @returns {string}
 */
const formatDueDate = (date: Object): string => {
  return `${date.day}.${date.month}.`;
};

/**
 * Format due dates as string
 * @param {Object[]} dates
 * @returns {string}
 */
export const formatDueDates = (dates: Array<Object>): string => {
  return dates.map((date) => formatDueDate(date)).join(', ');
};

/**
 * Test is any lease page form dirty
 * @param {Object} state
 * @returns {boolean}
 */
export const isAnyLeaseFormDirty = (state: RootState): boolean => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && (
    isDirty(FormNames.LEASE_CONSTRUCTABILITY)(state) ||
    isDirty(FormNames.LEASE_CONTRACTS)(state) ||
    isDirty(FormNames.LEASE_DECISIONS)(state) ||
    isDirty(FormNames.LEASE_INSPECTIONS)(state) ||
    isDirty(FormNames.LEASE_AREAS)(state) ||
    isDirty(FormNames.LEASE_RENTS)(state) ||
    isDirty(FormNames.LEASE_SUMMARY)(state) ||
    isDirty(FormNames.LEASE_TENANTS)(state));
};

/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.LEASE_CONSTRUCTABILITY);
  removeSessionStorageItem(FormNames.LEASE_CONTRACTS);
  removeSessionStorageItem(FormNames.LEASE_DECISIONS);
  removeSessionStorageItem(FormNames.LEASE_INSPECTIONS);
  removeSessionStorageItem(FormNames.LEASE_AREAS);
  removeSessionStorageItem(FormNames.LEASE_RENTS);
  removeSessionStorageItem(FormNames.LEASE_SUMMARY);
  removeSessionStorageItem(FormNames.LEASE_TENANTS);
  removeSessionStorageItem('leaseId');
};
