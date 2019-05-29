// @flow
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {isDirty} from 'redux-form';

import {} from '$util/date';
import {
  getSplittedDateRangesWithItems,
  sortByStartAndEndDateDesc,
} from '$util/date';
import {TableSortOrder} from '$components/enums';
import {FormNames} from '$src/enums';
import {
  CollateralTypes,
  ConstructabilityType,
  DecisionTypeKinds,
  LeaseState,
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
import {getContentPropertyIdentifiers} from '$src/rentbasis/helpers';
import {getContentUser} from '$src/users/helpers';
import {
  addEmptyOption,
  convertStrToDecimalNumber,
  fixedLengthNumber,
  formatDate,
  formatDateRange,
  isEmptyValue,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getCoordinatesOfGeometry} from '$util/map';
import {getIsEditMode} from './selectors';
import {removeSessionStorageItem} from '$util/storage';

import type {Lease} from './types';
import type {CommentList} from '$src/comments/types';
import type {LeafletFeature, LeafletGeoJson} from '$src/types';

/**
  * Test is lease empty
  * @param {Object} lease
  * @return {boolean}
  */
export const isLeaseEmpty = (lease: Lease) => {
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
export const isLeaseCreatedByUser = (lease: Lease, user: Object) => {
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
export const isUserAllowedToDeleteEmptyLease = (lease: Lease, comments: CommentList, user: Object) =>
  isLeaseEmpty(lease) && comments && !comments.length && isLeaseCreatedByUser(lease, user);

export const getContentLeaseIdentifier = (item:Object) =>
  !isEmpty(item)
    ? `${get(item, 'identifier.type.identifier')}${get(item, 'identifier.municipality.identifier')}${fixedLengthNumber(get(item, 'identifier.district.identifier'), 2)}-${get(item, 'identifier.sequence')}`
    : null;


export const getContentLeaseTenants = (lease: Object, query: Object = {}) => {
  return get(lease, 'tenants', [])
    .map((item) => get(item, 'tenantcontact_set', []).find((x) => x.type === TenantContactType.TENANT))
    .filter((tenant) => query.only_past_tenants === 'true' ? isTenantArchived(tenant) : !isTenantArchived(tenant))
    .map((tenant) => tenant ? getContactFullName(tenant.contact) : null);
};

export const getContentLeaseOption = (lease: Lease) => {
  return {
    value: lease.id ? lease.id.toString() : null,
    label: getContentLeaseIdentifier(lease),
  };
};

export const getContentLeaseAreaIdentifiers = (lease: Object) => {
  return get(lease, 'lease_areas', [])
    .filter((area) => !area.archived_at)
    .map((area) => area.identifier);
};

export const getContentLeaseAddresses = (lease: Object) => {
  const addresses = [];

  get(lease, 'lease_areas', [])
    .filter((area) => !area.archived_at)
    .forEach((area) => {
      get(area, 'addresses', [])
        .forEach((address) => {
          addresses.push(getFullAddress(address));
        });
    });

  return addresses;
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

const getContentInfillDevelopmentCompensations = (lease: Lease) =>
  get(lease, 'infill_development_compensations', []).map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

/**
  * Get global basis of rents
  * @param {Object} lease
  * @returns {Object[]}
  */
export const getContentMatchingBasisOfRents = (lease: Object) =>
  get(lease, 'matching_basis_of_rents', [])
    .map((item) => {
      return {
        id: item.id || undefined,
        property_identifiers: getContentPropertyIdentifiers(item),
      };
    });


export const getContentSummary = (lease: Object) => {
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
    constructability_areas: getContentConstructability(lease),
    conveyance_number: lease.conveyance_number,
    end_date: lease.end_date,
    financing: lease.financing,
    hitas: lease.hitas,
    infill_development_compensations: getContentInfillDevelopmentCompensations(lease),
    intended_use: lease.intended_use,
    intended_use_note: lease.intended_use_note,
    is_subject_to_vat: lease.is_subject_to_vat,
    lease_areas: getContentLeaseAreas(lease).filter((area) => !area.archived_at),
    lessor: getContentLessor(lease.lessor),
    management: lease.management,
    matching_basis_of_rents: getContentMatchingBasisOfRents(lease),
    note: lease.note,
    notice_note: lease.notice_note,
    notice_period: lease.notice_period,
    preparer: getContentUser(lease.preparer),
    real_estate_developer: lease.real_estate_developer,
    reference_number: lease.reference_number,
    regulated: lease.regulated,
    regulation: lease.regulation,
    special_project: lease.special_project,
    state: lease.state,
    start_date: lease.start_date,
    statistical_use: lease.statistical_use,
    supportive_housing: lease.supportive_housing,
    tenants: getContentTenants(lease).filter((tenant) => !isTenantArchived(tenant.tenant)),
    transferable: lease.transferable,
  };
};

/**
  * Helper function to get related lease content by path
  * @param {Object} content
  * @param {string} path
  * @returns {Object}
  */
export const getContentRelatedLease = (content: Object, path: string = 'from_lease') =>
  get(content, path, {});

/**
  * Get content related leases realted from list sorted by start and end date
  * @param {Object} lease
  * @returns {Object[]}
  */
export const getContentRelatedLeasesFrom = (lease: Object) =>
  get(lease, 'related_leases.related_from', [])
    .map((relatedLease) => {
      return {
        id: relatedLease.id,
        lease: getContentRelatedLease(relatedLease, 'from_lease'),
      };
    })
    .sort((a, b) => sortByStartAndEndDateDesc(a, b, 'lease.start_date', 'lease.end_date'));

/**
  * Get content related leases realted to list sorted by start and end date
  * @param {Object} lease
  * @returns {Object[]}
  */
export const getContentRelatedLeasesTo = (lease: Object) =>
  get(lease, 'related_leases.related_to', [])
    .map((relatedLease) => {
      return {
        id: relatedLease.id,
        lease: getContentRelatedLease(relatedLease, 'to_lease'),
      };
    })
    .sort((a, b) => sortByStartAndEndDateDesc(a, b, 'lease.start_date', 'lease.end_date'));

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

export const getContentPlots = (plots: Array<Object>, inContract: boolean): Array<Object> => {
  if(!plots || !plots.length) {return [];}

  return plots.filter((plot) => plot.in_contract === inContract).map((plot) => {
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
      in_contract: planunit.in_contract,
      plot_division_identifier: planunit.plot_division_identifier,
      plot_division_effective_date: planunit.plot_division_effective_date,
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
    addresses: getContentLeaseAreaAddresses(area),
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


export const getLeaseAreaById = (lease: Lease, id: ?number) =>
  id ? getContentLeaseAreas(lease).find((area) => area.id === id) : null;

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

export const getContentDecision = (decision: Object) => {
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

/**
 * Get all decision from lease data
 * @param lease
 * @returns {}
 */
export const getContentDecisions = (lease: Object) =>
  get(lease, 'decisions', []).map((decision) => getContentDecision(decision)).sort((a, b) => sortStringByKeyDesc(a, b, 'decision_date'));

/**
 * Get decision options from lease data
 * @param lease
 * @return {[]};
 */
export const getDecisionOptions = (lease: Lease) => {
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
 * Get decision by id from lease data
 * @param decisions
 * @param decisionId
 * @returns {{}}
 */
export const getDecisionById = (lease: Lease, id: ?number) =>
  getContentDecisions(lease).find((decision) => decision.id === id);

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

export const getContentContractCollaterals = (contract: Object) =>
  get(contract, 'collaterals', []).map((collateral) => {
    return ({
      id: collateral.id,
      type: get(collateral, 'type.id') || get(collateral, 'type'),
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

export const getContentContractItem = (contract: Object) => {
  return {
    id: contract.id,
    type: get(contract, 'type.id') || get(contract, 'type'),
    contract_number: contract.contract_number,
    signing_date: contract.signing_date,
    signing_note: contract.signing_note,
    sign_by_date: contract.sign_by_date,
    first_call_sent: contract.first_call_sent,
    second_call_sent: contract.second_call_sent,
    third_call_sent: contract.third_call_sent,
    is_readjustment_decision: contract.is_readjustment_decision,
    decision: get(contract, 'decision.id') || get(contract, 'decision'),
    ktj_link: contract.ktj_link,
    institution_identifier: contract.institution_identifier,
    contract_changes: getContentContractChanges(contract),
    collaterals: getContentContractCollaterals(contract),
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
    attachments: get(inspection, 'attachments', []),
  };
};

export const getContentInspections = (lease: Object) =>
  get(lease, 'inspections', []).map((inspection) => getContentInspectionItem(inspection));

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

export const getContentConstructabilityDescriptions = (area: Object, type: string) => {
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


export const getContentConstructability = (lease: Object) =>
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
* Get single invoice note fields
* @param {Object} invoiceNote
* @returns {Object}
*/
export const getContentInvoiceNote = (invoiceNote: Object) => ({
  id: invoiceNote.id,
  billing_period_start_date: invoiceNote.billing_period_start_date,
  billing_period_end_date: invoiceNote.billing_period_end_date,
  notes: invoiceNote.notes,
});

/**
* Get invoice notes of a lease
* @param {Object} lease
* @returns {Object[]}
*/
export const getContentInvoiceNotes = (lease: Lease) => get(lease, 'invoice_notes', []).map((note) => getContentInvoiceNote(note));

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
    });

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
export const calculateReLeaseDiscountPercent = (subventionBasePercent: ?string, subventionGraduatedPercent: ?string) => {
  return parseFloat(((1 - ((1 - Number(convertStrToDecimalNumber(subventionBasePercent) || 0)/100) * (1 - Number(convertStrToDecimalNumber(subventionGraduatedPercent) || 0)/100))) * 100).toFixed(2));
};

/**
  * Calculate rent adjustment subvention amount
  * @param {string} subventionType
  * @param {string} subventionBasePercent
  * @param {string} subventionGraduatedPercent
  * @param {Object[]} managementSubventions
  * @param {Object[]} temporarySubventions
  * @param {string} subventionGraduatedPercent
  * @return {number}
  */
export const calculateRentAdjustmentSubventionAmount = (subventionType: ?string, subventionBasePercent: ?string, subventionGraduatedPercent: ?string, managementSubventions: ?Array<Object>,  temporarySubventions: ?Array<Object>) => {
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
  * @return {Object}
  */
export const getContentManagementSubventions = (rentAdjustment: Object) =>
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
  * @return {Object}
  */
export const getContentTemporarySubventions = (rentAdjustment: Object) =>
  get(rentAdjustment, 'temporary_subventions', [])
    .map((item) => {
      return {
        id: item.id,
        description: item.description,
        subvention_percent: item.subvention_percent,
      };
    });

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
        subvention_type: get(item, 'subvention_type.id') || item.subvention_type,
        subvention_base_percent: item.subvention_base_percent,
        subvention_graduated_percent: item.subvention_graduated_percent,
        management_subventions: getContentManagementSubventions(item),
        temporary_subventions: getContentTemporarySubventions(item),
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
    });

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

/**
  * Get warnings if amount of fixed initial year rents is different than contract rents
  * @param {Object[]} rents
  * @returns {string[]}
  */
export const getRentWarnings = (rents: Array<Object>): Array<string> => {
  const warnings = [];
  rents.forEach((rent) => {
    if(rent.type !== RentTypes.INDEX && rent.type !== RentTypes.MANUAL) return;

    const fixedInitialYearRents = get(rent, 'fixed_initial_year_rents', []);
    const contractRents = get(rent, 'contract_rents', []);

    if(fixedInitialYearRents.length !== contractRents.length) {
      warnings.push(`Vuokralla ${formatDateRange(rent.start_date, rent.end_date)} on eri määrä kiinteitä alkuvuosivuokria ja sopimusvuokria`);
    }
  });

  return warnings;
};

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
        equalized_rents: getContentEqualizedRents(rent),
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

export const getContentBasisOfRents = (lease: Object) =>
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
        subvention_type: get(item, 'subvention_type.id') || item.subvention_type,
        subvention_base_percent: item.subvention_base_percent,
        subvention_graduated_percent: item.subvention_graduated_percent,
        management_subventions: getContentManagementSubventions(item),
        temporary_subventions: getContentTemporarySubventions(item),
      };
    });

export const getFullAddress = (item: Object) => {
  if(isEmpty(item)) return null;

  return `${item.address || ''}${(item.postal_code || item.city) ? ', ' : ''}${item.postal_code ? item.postal_code + ' ' : ''}${item.city || ''}`;
};

export const getInvoiceRecipientOptions = (lease: Object, addAll: boolean, addTenants: boolean) =>{
  const items = getContentTenants(lease);
  const recipients = [];

  if(addAll) {
    recipients.push({value: RecipientOptions.ALL, label: 'Kaikki'});
  }

  if(addTenants) {
    recipients.push(...items
      .filter((item) => isTenantActive(item.tenant))
      .map((item) => {
        return {
          value: get(item, 'tenant.contact.id'),
          label: getContactFullName(get(item, 'tenant.contact')),
        };
      })
      .sort((a, b) => sortStringByKeyAsc(a, b, 'label')));
  }

  return recipients;

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

export const getContentAreasGeoJson = (lease: Lease): LeafletGeoJson => {
  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);

  const features = getContentLeaseAreasFeatures(areas);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

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

export const getLeaseCoordinates = (lease: Lease) => {
  const areas = get(lease, 'lease_areas', []).filter((area) => !area.archived_at);
  let coordinates = [];
  areas.forEach((area) => {
    coordinates = [...coordinates, ...getCoordinatesOfGeometry(area.geometry)];
  });
  return coordinates;
};

export const getPayloadCreateLease = (lease: Object) => {
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

export const addSummaryFormValues = (payload: Object, summary: Object) => {
  return {
    ...payload,
    building_selling_price: convertStrToDecimalNumber(summary.building_selling_price),
    classification: summary.classification,
    conveyance_number: summary.conveyance_number,
    end_date: summary.end_date,
    financing: summary.financing,
    hitas: summary.hitas,
    intended_use: summary.intended_use,
    intended_use_note: summary.intended_use_note,
    is_subject_to_vat: summary.is_subject_to_vat,
    lessor: get(summary, 'lessor.value'),
    notice_note: summary.notice_note,
    notice_period: summary.notice_period,
    management: summary.management,
    note: summary.note,
    preparer: get(summary, 'preparer.value'),
    reference_number: summary.reference_number,
    real_estate_developer: summary.real_estate_developer,
    regulated: summary.regulated,
    regulation: summary.regulation,
    special_project: summary.special_project,
    start_date: summary.start_date,
    state: summary.state,
    statistical_use: summary.statistical_use,
    supportive_housing: summary.supportive_housing,
    transferable: summary.transferable,
  };
};

const getPayloadLeaseAreaAddresses = (area: Object) =>
  get(area, 'addresses', []).map((address) => {
    return {
      id: address.id || undefined,
      address: address.address,
      postal_code: address.postal_code,
      city: address.city,
      is_primary: address.is_primary,
    };
  });

const getPayloadPlots = (area: Object) => {
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
      type: plot.type,
      location: plot.location,
      registration_date: plot.registration_date,
      repeal_date: plot.repeal_date,
      in_contract: plot.in_contract,
    };
  });
};

const getPayloadPlanUnits = (area: Object) => {
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

export const addAreasFormValues = (payload: Object, values: Object) => {
  const areas = [...get(values, 'lease_areas_active', []), ...get(values, 'lease_areas_archived', [])];

  payload.lease_areas = areas.map((area) => {
    return {
      id: area.id || undefined,
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

/**
  * Get payload of contract collateral for API PATCH request
  *
  */
const getPayloadCollaterals = (contract: Object) => {
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

export const addContractsFormValues = (payload: Object, values: Object) => {
  payload.contracts = get(values, 'contracts', []).map((contract) => {
    return {
      id: contract.id || undefined,
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
      contract_changes: getContractChangesForDb(contract),
      collaterals: getPayloadCollaterals(contract),
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

export const getPayloadConstructabilityDescriptions = (area: Object) => {
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
      is_static: description.is_static,
      type: description.type,
      text: description.text,
      ahjo_reference_number: description.ahjo_reference_number,
    };
  });
};

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
    polluted_land_planner: values.polluted_land_planner.value,
    polluted_land_projectwise_number: values.polluted_land_projectwise_number,
    constructability_report_state: values.constructability_report_state,
    constructability_report_investigation_state: values.constructability_report_investigation_state,
    constructability_report_signing_date: values.constructability_report_signing_date,
    constructability_report_signer: values.constructability_report_signer,
    other_state: values.other_state,
    constructability_descriptions: getPayloadConstructabilityDescriptions(values),
  };
};

export const addConstructabilityFormValues = (payload: Object, values: Object) => {
  const areas = payload.lease_areas;
  const constAreas = get(values, 'lease_areas', []);

  if(areas && !!areas.length) {
    payload.lease_areas = areas.map((area) => {
      const constArea = constAreas.find(x => x.id === area.id);

      if(constArea) {
        return getPayloadConstructabilityArea(area, constArea);
      }
      return area;
    });
  } else if(constAreas && !!constAreas.length) {
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

export const getTenantContactDetailsForDb = (tenant: Object, contactType: 'tenant' | 'billing' | 'contact') => (
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

/**
  * Get content of management subventions from rent adjustment for payload
  * @param {Object} rentAdjustment
  * @return {Object}
  */
export const getPayloadManagementSubventions = (rentAdjustment: Object) =>
  get(rentAdjustment, 'management_subventions', [])
    .map((item) => {
      return {
        id: item.id,
        management: item.management,
        subvention_percent: convertStrToDecimalNumber(item.subvention_percent),
      };
    });

/**
  * Get content of temporary subventions from rent adjustment for payload
  * @param {Object} rentAdjustment
  * @return {Object}
  */
export const getPayloadTemporarySubventions = (rentAdjustment: Object) =>
  get(rentAdjustment, 'temporary_subventions', [])
    .map((item) => {
      return {
        id: item.id,
        description: item.description,
        subvention_percent: convertStrToDecimalNumber(item.subvention_percent),
      };
    });

/**
  * Get payload of rent adjustments for API PATCH request
  *
  */
export const getPayloadRentAdjustments = (rent: Object) =>
  get(rent, 'rent_adjustments', []).map((item) => {
    return {
      id: item.id || undefined,
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


export const getBasisOfRentById = (lease: Lease, id: ?number) => {
  const basisOfRents = getContentBasisOfRents(lease);

  if(isEmptyValue(id)) return null;

  return basisOfRents.find((rent) => rent.id === id);
};

export const addRentsFormValues = (payload: Object, values: Object, currentLease: Lease) => {
  payload.is_rent_info_complete = values.is_rent_info_complete ? true : false;

  const basisOfRents = [...get(values, 'basis_of_rents', []), ...get(values, 'basis_of_rents_archived', [])];

  payload.basis_of_rents = basisOfRents.map((item) => {
    const savedBasisOfRent = getBasisOfRentById(currentLease, item.id);

    if(savedBasisOfRent && savedBasisOfRent.locked_at) {
      return {
        id: item.id,
        locked_at: item.locked_at,
      };
    } else {
      return {
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
        subvention_type: item.subvention_type,
        subvention_base_percent: convertStrToDecimalNumber(item.subvention_base_percent),
        subvention_graduated_percent: convertStrToDecimalNumber(item.subvention_graduated_percent),
        management_subventions: getPayloadManagementSubventions(item),
        temporary_subventions: getPayloadTemporarySubventions(item),
      };
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
      rentData.contract_rents = getContentContractRentsForDb(rent, rent.type);
      rentData.rent_adjustments = getPayloadRentAdjustments(rent);
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

export const isRentActive = (rent: ?Object) => {
  const now = moment();
  const startDate = get(rent, 'start_date');
  const endDate = get(rent, 'end_date');

  if(startDate && moment(startDate).isAfter(now, 'day') || endDate && now.isAfter(endDate, 'day')) {
    return false;
  }

  return true;
};

export const isRentArchived = (rent: ?Object) => {
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
 * @param [string] day
 * @param [string] month
 * @returns [string]
 */
export const formatSeasonalDate = (day: ?string, month: ?string) => {
  if(!day || !month) return null;

  return `${day}.${month}.`;
};

/**
 * Format single due date as string
 * @param [Object] dates
 * @returns [string]
 */
const formatDueDate = (date: Object) => {
  return `${date.day}.${date.month}.`;
};

/**
 * Format due dates as string
 * @param [Object[]] dates
 * @returns [string]
 */
export const formatDueDates = (dates: Array<Object>) => {
  return dates.map((date) => formatDueDate(date)).join(', ');
};

export const isAnyLeaseFormDirty = (state: any) => {
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
