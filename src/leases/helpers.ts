import forEach from "lodash/forEach";
import get from "lodash/get";
import isPast from "date-fns/isPast";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { isDirty } from "redux-form";
import {
  getSplittedDateRangesWithItems,
  sortByStartAndEndDateDesc,
} from "@/util/date";
import { FormNames, TableSortOrder } from "@/enums";
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
  oldDwellingsInHousingCompaniesPriceIndexTypeOptions,
} from "./enums";
import { CalculatorTypes } from "@/leases/enums";
import { LeaseAreaAttachmentTypes } from "@/leaseAreaAttachment/enums";
import { getContactFullName, getContentContact } from "@/contacts/helpers";
import { getContentLessor } from "@/lessor/helpers";
import { getContentPropertyIdentifiers } from "@/rentbasis/helpers";
import { getContentUser } from "@/users/helpers";
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
  isActiveOrFuture,
  isArchived,
  sortStringAsc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from "@/util/helpers";
import { getCoordinatesOfGeometry } from "@/util/map";
import { getIsEditMode } from "./selectors";
import { removeSessionStorageItem } from "@/util/storage";
import type {
  Lease,
  LeaseArea,
  LeaseAreaAddress,
  IntendedUse,
  PeriodicRentAdjustmentType,
  CreateLeaseFormValues,
} from "./types";
import type { CommentList } from "@/comments/types";
import type { Attributes, LeafletFeature, LeafletGeoJson } from "types";
import type { RootState } from "@/root/types";
import type { LeaseList, DueDate } from "@/leases/types";
import type { IndexPointFigureYearly } from "@/oldDwellingsInHousingCompaniesPriceIndex/types";

/**
 * Test is lease empty
 * @param {Object} lease
 * @return {boolean}
 */
export const isLeaseEmpty = (lease: Lease): boolean => {
  let empty = true;
  const skipFields = [
    "id",
    "type",
    "municipality",
    "district",
    "identifier",
    "state",
    "preparer",
    "note",
    "created_at",
    "modified_at",
  ];
  forEach(Object.keys(lease), (key) => {
    if (skipFields.indexOf(key) === -1) {
      if (isArray(lease[key])) {
        if (lease[key].length) {
          empty = false;
          return false;
        }
      } else {
        if (key === "related_leases") {
          if (
            (lease[key].related_to && lease[key].related_to.length) ||
            (lease[key].related_from && lease[key].related_from.length)
          ) {
            empty = false;
            return false;
          }
        } else if (
          (typeof lease[key] === "boolean" && lease[key]) ||
          (typeof lease[key] !== "boolean" && !isEmptyValue(lease[key]))
        ) {
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
export const isLeaseCreatedByUser = (
  lease: Lease,
  user: Record<string, any>,
): boolean => {
  const preparerUsername = get(lease, "preparer.username");
  const userEmail = get(user, "profile.email");
  return !!preparerUsername && !!userEmail && preparerUsername === userEmail;
};

/**
 * Test is user allowed to delete lease
 * @param {Object} lease
 * @param {Object[]} comments
 * @param {Object} user
 * @return {boolean}
 */
export const isUserAllowedToDeleteEmptyLease = (
  lease: Lease,
  comments: CommentList,
  user: Record<string, any>,
): boolean =>
  isLeaseEmpty(lease) &&
  comments &&
  !comments.length &&
  isLeaseCreatedByUser(lease, user);

/**
 * Get content option to be used on dropdowns
 * @param {Object} lease
 * @returns {Object}
 */
export const getContentLeaseOption = (lease: Lease): Record<string, any> => ({
  value: lease.id ? lease.id.toString() : null,
  label: getContentLeaseIdentifier(lease),
});

/**
 * Get full address string of an lease area address
 * @param {Object} areaAddress
 * @returns {string}
 */
export const getFullAddress = (
  areaAddress: LeaseAreaAddress,
): string | null | undefined => {
  if (isEmpty(areaAddress)) return null;
  return `${areaAddress.address || ""}${areaAddress.postal_code || areaAddress.city ? ", " : ""}${areaAddress.postal_code ? areaAddress.postal_code + " " : ""}${areaAddress.city || ""}`;
};

/**
 * Get a lease history item title text that is truncated when it is long
 * @param {?string} text
 * @param {number} MAX_TITLE_LENGTH
 * @returns {string}
 */
export const getTitleText = (
  text: string | null | undefined,
  maxLength: number,
): string => {
  if (text) {
    return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
  } else {
    return "";
  }
};

/**
 * Get content lease identifiers
 * @param {Object} lease
 * @returns {string}
 */
export const getContentLeaseIdentifier = (
  lease: Lease,
): string | null | undefined =>
  !isEmpty(lease)
    ? `${get(lease, "identifier.type.identifier")}${get(lease, "identifier.municipality.identifier")}${fixedLengthNumber(get(lease, "identifier.district.identifier"), 2)}-${get(lease, "identifier.sequence")}`
    : null;

/**
 * Get content lease list area identifiers
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseListTenants = (
  lease: Lease,
  query: Record<string, any> = {},
): Array<Record<string, any>> =>
  get(lease, "tenants", [])
    .map((item) =>
      get(item, "tenantcontact_set", []).find(
        (x) => x.type === TenantContactType.TENANT,
      ),
    )
    .filter((tenant) =>
      query.only_past_tenants === "true"
        ? isArchived(tenant)
        : !isArchived(tenant),
    )
    .map((tenant) => (tenant ? getContactFullName(tenant.contact) : null))
    .filter((name) => name)
    .sort(sortStringAsc);

/**
 * Get content lease list area identifiers
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseListAreaIdentifiers = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "lease_areas", [])
    .filter((area) => !area.archived_at)
    .map((area) => area.identifier)
    .sort(sortStringAsc);

/**
 * Get content lease list lease addresses
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseListLeaseAddresses = (
  lease: Lease,
): Array<Record<string, any>> => {
  const addresses = [];
  get(lease, "lease_areas", [])
    .filter((area) => !area.archived_at)
    .forEach((area) => {
      get(area, "addresses", []).forEach((address) => {
        addresses.push(getFullAddress(address));
      });
    });
  const sortedAddresses = addresses
    .filter((address, index, self) => self.indexOf(address) == index)
    .sort(sortStringAsc);
  return sortedAddresses;
};

/**
 * Get content lease list lease
 * @param {Object} lease
 * @param {Object} query
 * @returns {Object}
 */
export const getContentLeaseListLease = (
  lease: Lease,
  query: Record<string, any> = {},
): Record<string, any> => {
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
export const getContentLeaseListResults = (
  apiResponse: any,
  query: Record<string, any>,
): Array<Record<string, any>> =>
  getApiResponseResults(apiResponse).map((item) =>
    getContentLeaseListLease(item, query),
  );

/**
 * Get content lease status
 * @param {Object} lease
 * @returns {string}
 */
const getContentLeaseStatus = (lease: Lease): string => {
  const startDate = lease.start_date,
    endDate = lease.end_date;

  if (endDate && isPast(new Date(endDate))) {
    return LeaseStatus.FINISHED;
  }

  if (!endDate && !startDate) {
    return LeaseStatus.PREPARATION;
  }

  return LeaseStatus.IN_EFFECT;
};

/**
 * Get lease info section content
 * @param {Object} lease
 * @returns {Object}
 */
export const getContentLeaseInfo = (lease: Lease): Record<string, any> => {
  return {
    address: getContentLeaseAddress(lease),
    area_identifier: getContentLeaseAreaIdentifier(lease),
    identifier: getContentLeaseIdentifier(lease),
    end_date: lease.end_date,
    start_date: lease.start_date,
    state: lease.state,
    status: getContentLeaseStatus(lease),
  };
};

/**
 * Get content for intended use
 * @param {Object} intendedUse
 * @returns {Object}
 */
export const getContentIntendedUse = (
  intendedUse: IntendedUse,
): Record<string, any> | null => {
  if (!intendedUse) return null;
  return {
    id: intendedUse.id,
    value: intendedUse.id,
    label: intendedUse.name,
    name: intendedUse.name,
    service_unit: intendedUse.service_unit,
  };
};

/**
 * Get content lease address
 * @param {Object} lease
 * @returns {string}
 */
export const getContentLeaseAddress = (
  lease: Lease,
): string | null | undefined =>
  !isEmpty(lease)
    ? `${get(lease, "lease_areas[0].addresses[0].address")}`
    : null;

/**
 * Get content lease area identifiers
 * @param {Object} lease
 * @returns {string}
 */
export const getContentLeaseAreaIdentifier = (
  lease: Lease,
): string | null | undefined =>
  !isEmpty(lease) ? `${get(lease, "lease_areas[0].identifier")}` : null;

/**
 * Get lease infill development compensations content
 * @param {Object} lease
 * @returns {Object[]}
 */
const getContentLeaseInfillDevelopmentCompensations = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "infill_development_compensations", []).map((item) => {
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
export const getContentLeaseMatchingBasisOfRents = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "matching_basis_of_rents", []).map((item) => {
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
export const getContentLeaseSummary = (lease: Lease): Record<string, any> => {
  return {
    application_metadata: get(lease, "application_metadata", {}),
    area_notes: get(lease, "area_notes", []),
    // Set arrangement decision to true if there is any contract where is_readjustment_decision == true
    arrangement_decision: get(lease, "contracts", []).find(
      (contract) => contract.is_readjustment_decision,
    )
      ? true
      : false,
    contract_numbers: get(lease, "contracts", [])
      .filter((contract) => contract.contract_number)
      .map((contract) => contract.contract_number)
      .join(", "),
    building_selling_price: lease.building_selling_price,
    classification: lease.classification,
    constructability_areas: getContentConstructabilityAreas(lease),
    conveyance_number: lease.conveyance_number,
    end_date: lease.end_date,
    financing: lease.financing,
    hitas: lease.hitas,
    infill_development_compensations:
      getContentLeaseInfillDevelopmentCompensations(lease),
    intended_use: getContentIntendedUse(lease.intended_use),
    intended_use_note: lease.intended_use_note,
    internal_order: lease.internal_order,
    is_subject_to_vat: lease.is_subject_to_vat,
    lease_areas: getContentLeaseAreas(lease).filter(
      (area) => !area.archived_at,
    ),
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
    service_unit: lease.service_unit,
    special_project: lease.special_project,
    state: lease.state,
    start_date: lease.start_date,
    statistical_use: lease.statistical_use,
    supportive_housing: lease.supportive_housing,
    tenants: getContentTenants(lease).filter(
      (tenant) => !isArchived(tenant.tenant),
    ),
    transferable: lease.transferable,
  };
};

/**
 * Get related lease content by path
 * @param {Object} content
 * @param {string} path
 * @returns {Object}
 */
export const getContentRelatedLease = (
  content: Record<string, any>,
  path: string = "from_lease",
): Record<string, any> => get(content, path, {});

/**
 * Get content related leases from list sorted by start and end date
 * @param {Object} lease
 * @returns {Object[]}
 */

/**
 * Get content related leases from list
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentRelatedLeasesFrom = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "related_leases.related_from", []).map((leaseHistoryItem) => {
    return {
      head: lease.id,
      id: leaseHistoryItem.id,
      lease: getContentRelatedLease(leaseHistoryItem, "from_lease"),
      to_lease: leaseHistoryItem.to_lease,
    };
  });

/**
 * Sort related leases by to_lease
 * @param {Object[]} leases
 * @returns {Object[]}
 */
export const sortRelatedLeasesFrom = (leases: Array<Lease>): Array<Lease> => {
  let current;
  let leaseHistoryItemsFromSorted = [];
  leases.forEach((lease) => {
    if (lease.to_lease === lease.head) {
      leaseHistoryItemsFromSorted.push(lease);
      current = lease.lease.id;
    }
  });
  leases.forEach(() => {
    leases.forEach((lease) => {
      if (lease.to_lease === current) {
        leaseHistoryItemsFromSorted.push(lease);
        current = lease.lease.id;
        return;
      }
    });
  });
  return leaseHistoryItemsFromSorted;
};

/**
 * Get content related leases to list sorted by start and end date
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentRelatedLeasesTo = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "related_leases.related_to", [])
    .map((leaseHistoryItem) => {
      return {
        id: leaseHistoryItem.id,
        lease: getContentRelatedLease(leaseHistoryItem, "to_lease"),
      };
    })
    .sort((a, b) =>
      sortByStartAndEndDateDesc(a, b, "lease.start_date", "lease.end_date"),
    );

/**
 * Get lease area addresses content
 * @param {Object} area
 * @returns {Object[]}
 */
export const getContentLeaseAreaAddresses = (
  area: LeaseArea,
): Array<LeaseAreaAddress> => {
  return get(area, "addresses", []).map((address) => {
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
export const getContentPlots = (area: LeaseArea): Array<Record<string, any>> =>
  get(area, "plots", []).map((plot) => {
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
export const getContentPlanUnits = (
  area: LeaseArea,
): Array<Record<string, any>> =>
  get(area, "plan_units", []).map((planunit) => {
    return {
      id: planunit.id,
      identifier: planunit.identifier,
      geometry: planunit.geometry,
      area: planunit.area,
      section_area: planunit.section_area,
      in_contract: planunit.in_contract,
      plot_division_identifier: planunit.plot_division_identifier,
      plot_division_date_of_approval: planunit.plot_division_date_of_approval,
      plot_division_effective_date: planunit.plot_division_effective_date,
      plot_division_state:
        get(planunit, "plot_division_state.id") || planunit.plot_division_state,
      detailed_plan_identifier: planunit.detailed_plan_identifier,
      detailed_plan_latest_processing_date:
        planunit.detailed_plan_latest_processing_date,
      detailed_plan_latest_processing_date_note:
        planunit.detailed_plan_latest_processing_date_note,
      plan_unit_type:
        get(planunit, "plan_unit_type.id") || planunit.plan_unit_type,
      plan_unit_state:
        get(planunit, "plan_unit_state.id") || planunit.plan_unit_state,
      plan_unit_intended_use:
        get(planunit, "plan_unit_intended_use.id") ||
        planunit.plan_unit_intended_use,
      is_master: get(planunit, "is_master") || planunit.is_master,
      usage_distributions: get(planunit, "usage_distributions") || [],
    };
  });

/**
 * Get lease area custom detailed plan content
 * @param {Object} area
 * @returns {Object}
 */
export const getContentCustomDetailedPlan = (
  area: LeaseArea,
): Record<string, any> => {
  let customDetailedPlan = get(area, "custom_detailed_plan");

  if (!customDetailedPlan) {
    return null;
  }

  customDetailedPlan.state =
    get(customDetailedPlan, "state.id") || customDetailedPlan.state;
  customDetailedPlan.type =
    get(customDetailedPlan, "type.id") || customDetailedPlan.type;
  customDetailedPlan.intended_use =
    get(customDetailedPlan, "intended_use.id") ||
    customDetailedPlan.intended_use;
  return customDetailedPlan;
};

/**
 * Get single lease area content
 * @param {Object} area
 * @returns {Object}
 */
export const getContentLeaseArea = (area: LeaseArea): Record<string, any> => {
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
    plan_units_pending: planUnits.filter(
      (plot) => !plot.in_contract && plot.plan_unit_state == 2,
    ),
    plan_units_current: planUnits.filter(
      (plot) => !plot.in_contract && plot.plan_unit_state != 2,
    ),
    plan_units_contract: planUnits.filter((plot) => plot.in_contract),
    archived_at: area.archived_at,
    archived_note: area.archived_note,
    archived_decision:
      get(area, "archived_decision.id") || get(area, "archived_decision"),
    custom_detailed_plan: getContentCustomDetailedPlan(area),
  };
};

/**
 * Get lease areas content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentLeaseAreas = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "lease_areas", []).map((area) => getContentLeaseArea(area));

/**
 * Get lease area by id
 * @param {Object} lease
 * @param {number} id
 * @returns {Object}
 */
export const getLeaseAreaById = (
  lease: Lease,
  id: number | null | undefined,
): Record<string, any> | null | undefined =>
  id ? getContentLeaseAreas(lease).find((area) => area.id === id) : null;

/**
 * Get lease decision conditions content
 * @param {Object} decisions
 * @returns {Object[]}
 */
export const getContentDecisionConditions = (
  decision: Record<string, any>,
): Array<Record<string, any>> =>
  get(decision, "conditions", []).map((condition) => {
    return {
      id: condition.id,
      type: get(condition, "type.id") || condition.type,
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
export const getContentDecision = (
  decision: Record<string, any>,
): Record<string, any> => {
  return {
    id: decision.id,
    reference_number: decision.reference_number,
    decision_maker:
      get(decision, "decision_maker.id") || decision.decision_maker,
    decision_date: decision.decision_date,
    section: decision.section,
    type: get(decision, "type.id") || decision.type,
    description: decision.description,
    conditions: getContentDecisionConditions(decision),
  };
};

/**
 * Get lease decisions content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentDecisions = (lease: Lease): Array<Record<string, any>> =>
  get(lease, "decisions", [])
    .map((decision) => getContentDecision(decision))
    .sort((a, b) => sortStringByKeyDesc(a, b, "decision_date"));

/**
 * Get decision options from lease data
 * @param {Object} lease
 * @return {Object[]};
 */
export const getDecisionOptions = (
  lease: Lease,
): Array<Record<string, any>> => {
  const decisions = getContentDecisions(lease);
  const decisionOptions = decisions.map((item) => {
    return {
      value: item.id,
      label:
        !item.reference_number && !item.decision_date && !item.section
          ? item.id
          : `${item.reference_number ? item.reference_number + ", " : ""}${item.section ? item.section + " §, " : ""}${formatDate(item.decision_date) || ""}`,
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
export const getDecisionById = (
  lease: Lease,
  id: number | null | undefined,
): Record<string, any> | null | undefined =>
  getContentDecisions(lease).find((decision) => decision.id === id);

/**
 * Get contract changes content
 * @param {Object} contract
 * @returns {Object[]}
 */
export const getContentContractChanges = (
  contract: Record<string, any>,
): Array<Record<string, any>> =>
  get(contract, "contract_changes", []).map((change) => {
    return {
      id: change.id,
      signing_date: change.signing_date,
      sign_by_date: change.sign_by_date,
      first_call_sent: change.first_call_sent,
      second_call_sent: change.second_call_sent,
      third_call_sent: change.third_call_sent,
      description: change.description,
      decision: get(change, "decision.id") || change.decision,
      executor: getContentUser(change.executor),
    };
  });

/**
 * Get contract collaterals content
 * @param {Object} contract
 * @returns {Object[]}
 */
export const getContentContractCollaterals = (
  contract: Record<string, any>,
): Array<Record<string, any>> =>
  get(contract, "collaterals", []).map((collateral) => {
    return {
      id: collateral.id,
      type: get(collateral, "type.id") || collateral.type,
      other_type: collateral.other_type,
      number: collateral.number,
      deed_date: collateral.deed_date,
      start_date: collateral.start_date,
      end_date: collateral.end_date,
      total_amount: collateral.total_amount,
      paid_date: collateral.paid_date,
      returned_date: collateral.returned_date,
      note: collateral.note,
    };
  });

/**
 * Get single contract content
 * @param {Object} contract
 * @returns {Object}
 */
export const getContentContract = (
  contract: Record<string, any>,
): Record<string, any> => {
  return {
    id: contract.id,
    type: get(contract, "type.id") || contract.type,
    contract_number: contract.contract_number,
    signing_date: contract.signing_date,
    signing_note: contract.signing_note,
    sign_by_date: contract.sign_by_date,
    first_call_sent: contract.first_call_sent,
    second_call_sent: contract.second_call_sent,
    third_call_sent: contract.third_call_sent,
    is_readjustment_decision: contract.is_readjustment_decision,
    decision: get(contract, "decision.id") || contract.decision,
    ktj_link: contract.ktj_link,
    institution_identifier: contract.institution_identifier,
    contract_changes: getContentContractChanges(contract),
    collaterals: getContentContractCollaterals(contract),
    executor: getContentUser(contract.executor),
  };
};

/**
 * Get contracts content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentContracts = (lease: Lease): Array<Record<string, any>> =>
  get(lease, "contracts", []).map((contract) => getContentContract(contract));

/**
 * Get single inspection content
 * @param {Object} contract
 * @returns {Object}
 */
export const getContentInspection = (
  inspection: Record<string, any>,
): Record<string, any> => {
  return {
    id: inspection.id,
    inspector: inspection.inspector,
    supervision_date: inspection.supervision_date,
    supervised_date: inspection.supervised_date,
    description: inspection.description,
    attachments: get(inspection, "attachments", []),
  };
};

/**
 * Get inspections content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentInspections = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "inspections", []).map((inspection) =>
    getContentInspection(inspection),
  );

/**
 * Get constructability email content
 * @param {Object} lease
 * @param {Object} user
 * @param {Object} text
 * @returns {string}
 */
export const getContentConstructabilityEmail = (
  lease: Lease,
  user: Record<string, any>,
  text: string | null | undefined,
): string => {
  let emailContent = `Vuokraustunnus: ${getContentLeaseIdentifier(lease) || "-"}\n`;
  const leaseAreas = get(lease, "lease_areas", []);
  leaseAreas.forEach((area) => {
    const addresses = getContentLeaseAreaAddresses(area)
      .filter((address) => address.address)
      .map((address) => getFullAddress(address));
    emailContent += `\nVuokra-alue: ${area.identifier}`;

    if (addresses.length) {
      emailContent += `\nOsoite: ${addresses.join(" - ")}\n`;
    }
  });

  if (text) {
    emailContent += `\nViesti: ${text}\n`;
  }

  emailContent += `\nLähettäjä: ${get(user, "profile.name")}`;
  return emailContent;
};

/**
 * Get content email logs
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentEmailLogs = (
  lease: Lease,
): Array<Record<string, any>> => {
  return get(lease, "email_logs", []).map((email) => {
    return {
      id: email.id,
      created_at: email.created_at,
      recipients: email.recipients.map((recipient) =>
        getContentUser(recipient),
      ),
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
export const getContentConstructabilityDescriptions = (
  area: LeaseArea,
  type: string,
): Array<Record<string, any>> => {
  return get(area, "constructability_descriptions", [])
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
export const getContentConstructabilityAreas = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "lease_areas", []).map((area) => {
    return {
      id: area.id,
      identifier: area.identifier,
      type: area.type,
      location: area.location,
      area: area.area,
      section_area: area.section_area,
      preconstruction_state: area.preconstruction_state,
      preconstruction_estimated_construction_readiness_moment:
        area.preconstruction_estimated_construction_readiness_moment,
      preconstruction_inspection_moment: area.preconstruction_inspection_moment,
      demolition_state: area.demolition_state,
      polluted_land_state: area.polluted_land_state,
      polluted_land_rent_condition_state:
        area.polluted_land_rent_condition_state,
      polluted_land_rent_condition_date: area.polluted_land_rent_condition_date,
      polluted_land_planner: getContentUser(area.polluted_land_planner),
      polluted_land_projectwise_number: area.polluted_land_projectwise_number,
      polluted_land_matti_reports: get(area, "attachments", []).filter(
        (file) => file.type === LeaseAreaAttachmentTypes.MATTI_REPORT,
      ),
      constructability_report_state: area.constructability_report_state,
      constructability_report_investigation_state:
        area.constructability_report_investigation_state,
      constructability_report_signing_date:
        area.constructability_report_signing_date,
      constructability_report_signer: area.constructability_report_signer,
      constructability_report_geotechnical_attachments: get(
        area,
        "attachments",
        [],
      ).filter((file) => file.type === LeaseAreaAttachmentTypes.GEOTECHNICAL),
      other_state: area.other_state,
      descriptionsPreconstruction: getContentConstructabilityDescriptions(
        area,
        ConstructabilityType.PRECONSTRUCTION,
      ),
      descriptionsDemolition: getContentConstructabilityDescriptions(
        area,
        ConstructabilityType.DEMOLITION,
      ),
      descriptionsPollutedLand: getContentConstructabilityDescriptions(
        area,
        ConstructabilityType.POLLUTED_LAND,
      ),
      descriptionsReport: getContentConstructabilityDescriptions(
        area,
        ConstructabilityType.REPORT,
      ),
      descriptionsOther: getContentConstructabilityDescriptions(
        area,
        ConstructabilityType.OTHER,
      ),
    };
  });

/**
 * Get single invoice note content
 * @param {Object} invoiceNote
 * @returns {Object}
 */
export const getContentInvoiceNote = (
  invoiceNote: Record<string, any>,
): Record<string, any> => ({
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
export const getContentInvoiceNotes = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "invoice_notes", []).map((note) => getContentInvoiceNote(note));

/**
 * Get content rent shares of a tenant
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getContentTenantRentShares = (
  tenant: Record<string, any>,
): Array<Record<string, any>> => {
  const rentShares = get(tenant, "rent_shares", []);
  return rentShares.map((rentShare) => ({
    id: rentShare.id,
    intended_use: get(rentShare, "intended_use.id") || rentShare.intended_use,
    share_numerator: rentShare.share_numerator,
    share_denominator: rentShare.share_denominator,
  }));
};

/**
 * Get details of tenantcontact_set contact
 * @param {Object} contact
 * @returns {Object}
 */
export const getContentContactDetails = (
  contact: Record<string, any>,
): Record<string, any> => {
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
export const getContentTenant = (
  tenant: Record<string, any>,
): Record<string, any> => {
  const contact = get(tenant, "tenantcontact_set", []).find(
    (x) => x.type === TenantContactType.TENANT,
  );
  return contact ? getContentContactDetails(contact) : {};
};

/**
 * Get tenant billing persons
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getContentTenantBillingPersons = (
  tenant: Record<string, any>,
): Array<Record<string, any>> =>
  get(tenant, "tenantcontact_set", [])
    .filter((x) => x.type === TenantContactType.BILLING)
    .map((contact) => (contact ? getContentContactDetails(contact) : {}))
    .sort((a, b) => sortStringByKeyDesc(a, b, "start_date"));

/**
 * Get tenant contact persons
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getContentTenantContactPersons = (
  tenant: Record<string, any>,
): Array<Record<string, any>> =>
  get(tenant, "tenantcontact_set", [])
    .filter((x) => x.type === TenantContactType.CONTACT)
    .map((contact) => (contact ? getContentContactDetails(contact) : {}))
    .sort((a, b) => sortStringByKeyDesc(a, b, "start_date"));

/**
 * Get tenants content
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getContentTenants = (lease: Lease): Array<Record<string, any>> =>
  get(lease, "tenants", [])
    .map((tenant) => {
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
    })
    .sort((a, b) => sortStringByKeyDesc(a, b, "tenant.start_date"));

/**
 * Get warnings if share on date range is greater than 100%
 * @param {Object[]} tenants
 * @returns {string[]}
 */
export const getTenantShareWarnings = (
  tenants: Array<Record<string, any>>,
): Array<string> => {
  const dateRanges = getSplittedDateRangesWithItems(
    tenants,
    "tenant.start_date",
    "tenant.end_date",
  );
  const warnings = [];
  dateRanges.forEach((dateRange) => {
    const tenants = dateRange.items;
    const totalShare = tenants.reduce((sum, cur) => {
      const share =
        cur.share_numerator && cur.share_denominator
          ? Number(cur.share_numerator) / Number(cur.share_denominator)
          : 0;
      return sum + share;
    }, 0);

    if (roundToFixed(totalShare, 8) > 1) {
      warnings.push(
        `Hallintaosuus välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on yli 100%`,
      );
    } else if (roundToFixed(totalShare, 8) < 1) {
      warnings.push(
        `Hallintaosuus välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on alle 100%`,
      );
    }
  });
  return warnings;
};

/**
 * Round decimal to fixed
 * @param {number} number
 * @param {number} numberOfDecimals
 * @returns {number}
 */
export const roundToFixed = (
  number: number,
  numberOfDecimals: number,
): number => {
  return Number(number.toFixed(numberOfDecimals));
};

/**
 * Get warnings if sum of rent shares per intended use per date range is not 100%
 * @param {Object[]} tenants
 * @returns {string[]}
 */
export const getTenantRentShareWarnings = (
  tenants: Array<Record<string, any>>,
  leaseAttributes: Attributes,
): Array<string> => {
  const dateRanges = getSplittedDateRangesWithItems(
    tenants,
    "tenant.start_date",
    "tenant.end_date",
  );
  const warnings = [];
  const intendedUseOptions = getFieldOptions(
    leaseAttributes,
    LeaseTenantRentSharesFieldPaths.INTENDED_USE,
  );
  dateRanges.forEach((dateRange) => {
    const tenants = dateRange.items;
    const rentShares = [];
    const sharesByIntendedUse = {};
    tenants.forEach((tenant) => {
      if (tenant.rent_shares && tenant.rent_shares.length) {
        rentShares.push(...tenant.rent_shares);
      }
    });
    rentShares.forEach((rentShare) => {
      if (rentShare.intended_use != null) {
        if (
          Object.prototype.hasOwnProperty.call(
            sharesByIntendedUse,
            rentShare.intended_use,
          )
        ) {
          sharesByIntendedUse[rentShare.intended_use].push(rentShare);
        } else {
          sharesByIntendedUse[rentShare.intended_use] = [rentShare];
        }
      }
    });
    Object.keys(sharesByIntendedUse).forEach((key) => {
      const items = sharesByIntendedUse[key];
      const totalShare = items.reduce((sum, cur) => {
        const share =
          cur.share_numerator && cur.share_denominator
            ? Number(cur.share_numerator) / Number(cur.share_denominator)
            : 0;
        return sum + share;
      }, 0);

      if (totalShare > 1) {
        warnings.push(
          `Laskutusosuus (${getLabelOfOption(intendedUseOptions, key.toString()) || "-"}) välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on yli 100%`,
        );
      } else if (totalShare < 1) {
        warnings.push(
          `Laskutusosuus (${getLabelOfOption(intendedUseOptions, key.toString()) || "-"}) välillä ${formatDateRange(dateRange.start_date, dateRange.end_date)} on alle 100%`,
        );
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
export const getContentPayableRents = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "payable_rents", []).map((item) => {
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
export const getContentEqualizedRents = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "equalized_rents", []).map((item) => {
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
 * Check if subvention data indicates that the rent adjustment is deleted.
 * @param {Object} props
 * @return {boolean}
 */
export const isRentDeleted = (props: Record<string, any>): boolean => {
  return (
    typeof props.subventionType === "undefined" &&
    typeof props.subventionBasePercent === "undefined" &&
    typeof props.subventionGraduatedPercent === "undefined" &&
    typeof props.managementSubventions === "undefined" &&
    typeof props.temporarySubventions === "undefined"
  );
};

/**
 * Check if subvention data has changed for rent adjustments to update the full amount.
 * @param {Object} prevProps
 * @param {Object} props
 * @return {boolean}
 */
export const hasSubventionDataChanged = (
  prevProps: Record<string, any>,
  props: Record<string, any>,
): boolean => {
  if (isRentDeleted(props)) {
    return false;
  }

  return (
    props?.subventionType !== prevProps?.subventionType ||
    props?.subventionBasePercent !== prevProps?.subventionBasePercent ||
    props?.subventionGraduatedPercent !==
      prevProps?.subventionGraduatedPercent ||
    !isEqual(props?.managementSubventions, prevProps?.managementSubventions) ||
    !isEqual(props?.temporarySubventions, prevProps?.temporarySubventions)
  );
};

/**
 * Calculate re-lease discount percent for rent adjustment subvention
 * @param {string} subventionBasePercent
 * @param {string} subventionGraduatedPercent
 * @return {number}
 */
export const calculateReLeaseDiscountPercent = (
  subventionBasePercent: string | null | undefined,
  subventionGraduatedPercent: string | null | undefined,
): number => {
  return (
    (1 -
      (1 -
        Number(convertStrToDecimalNumber(subventionBasePercent) || 0) / 100) *
        (1 -
          Number(convertStrToDecimalNumber(subventionGraduatedPercent) || 0) /
            100)) *
    100
  );
};

/**
 * Get basis of rent index value
 * @param {Object} basisOfRent
 * @param {Object[]} indexOptions
 * @return {string}
 */
export const getBasisOfRentIndexValue = (
  basisOfRent: Record<string, any>,
  indexOptions: Array<Record<string, any>>,
): string | null | undefined => {
  if (!basisOfRent.index || !indexOptions.length) return null;
  const indexObj = indexOptions.find(
    (item) => item.value === basisOfRent.index,
  );

  if (indexObj) {
    const indexValue = indexObj.label.match(/=(.*)/)[1];
    return indexValue;
  }

  return null;
};

/**
 * Calculate basis of rent basis annual rent
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @return {number}
 */
export const calculateBasisOfRentBasicAnnualRent = (
  basisOfRent: Record<string, any>,
  indexValue?: string | null | undefined,
): number => {
  if (basisOfRent.type === CalculatorTypes.LEASE2022) {
    const initialYearRent = calculateBasisOfRentInitialYearRent(
      basisOfRent,
      indexValue,
    );

    if (!initialYearRent || !isDecimalNumberStr(indexValue)) {
      return 0;
    }

    return Number(
      initialYearRent / (convertStrToDecimalNumber(indexValue) / 100),
    );
  }

  if (
    !isDecimalNumberStr(basisOfRent.amount_per_area) ||
    !isDecimalNumberStr(basisOfRent.area)
  ) {
    return 0;
  }

  return (
    Number(convertStrToDecimalNumber(basisOfRent.amount_per_area)) *
    Number(convertStrToDecimalNumber(basisOfRent.area)) *
    Number(
      isDecimalNumberStr(basisOfRent.profit_margin_percentage)
        ? Number(
            convertStrToDecimalNumber(basisOfRent.profit_margin_percentage),
          ) / 100
        : 0,
    )
  );
};

/**
 * Get current basis of rent amount per area based on calculator type
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @return {number}
 */
export const getBasisOfRentAmountPerArea = (
  basisOfRent: Record<string, any>,
  indexValue: string | null | undefined,
): number => {
  if (basisOfRent.type === CalculatorTypes.LEASE2022) {
    return Number(convertStrToDecimalNumber(basisOfRent.amount_per_area));
  }

  return calculateBasisOfRentAmountPerArea(basisOfRent, indexValue);
};

/**
 * Calculate basis of rent amount per area
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @return {number}
 */
export const calculateBasisOfRentAmountPerArea = (
  basisOfRent: Record<string, any>,
  indexValue: string | null | undefined,
): number => {
  if (
    !isDecimalNumberStr(indexValue) ||
    !isDecimalNumberStr(basisOfRent.amount_per_area)
  )
    return 0;
  return roundToFixed(
    (Number(convertStrToDecimalNumber(indexValue)) / 100) *
      Number(convertStrToDecimalNumber(basisOfRent.amount_per_area)),
    2,
  );
};

/**
 * Calculate amount per area from value
 * @param {string} value
 * @param {string} indexValue
 * @return {number}
 */
export const calculateAmountFromValue = (
  value: string,
  indexValue: string | null | undefined,
): number => {
  if (!isDecimalNumberStr(indexValue) || !isDecimalNumberStr(value)) return 0;
  return roundToFixed(
    (Number(convertStrToDecimalNumber(value)) /
      Number(convertStrToDecimalNumber(indexValue))) *
      100,
    2,
  );
};

/**
 * Calculate basis of rent initial year rent
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @param {number} basicAnnualRent
 * @return {number}
 */
export const calculateBasisOfRentInitialYearRent = (
  basisOfRent: Record<string, any>,
  indexValue: string | null | undefined,
  basicAnnualRent?: number | null | undefined,
): number => {
  if (basisOfRent.type === CalculatorTypes.LEASE2022) {
    const area = convertStrToDecimalNumber(basisOfRent.area);
    const amountPerArea = convertStrToDecimalNumber(
      basisOfRent.amount_per_area,
    );
    const profitMarginPercentage = convertStrToDecimalNumber(
      basisOfRent.profit_margin_percentage,
    );

    if (
      !isDecimalNumberStr(area) ||
      !isDecimalNumberStr(amountPerArea) ||
      !isDecimalNumberStr(profitMarginPercentage)
    ) {
      return 0;
    }

    return Number(area * amountPerArea * Number(profitMarginPercentage / 100));
  }

  return (
    (Number(roundToFixed(Number(basicAnnualRent), 2)) *
      Number(convertStrToDecimalNumber(indexValue))) /
    100
  );
};

/**
 * Calculate basis of rent discounted initial year rents total
 * @param {Object[]} basisOfRents
 * @param {Object[]} indexOptions
 * @return {number}
 */
export const calculateBasisOfRentDiscountedInitialYearRentsTotal = (
  basisOfRents: Record<string, any>[],
  indexOptions: Record<string, any>[],
): number => {
  if (basisOfRents)
    return Number(
      basisOfRents
        .map((basisOfRent) =>
          calculateBasisOfRentDiscountedInitialYearRent(
            basisOfRent,
            getBasisOfRentIndexValue(basisOfRent, indexOptions),
          ),
        )
        .reduce((sum, cur) => sum + cur),
    );
  else return 0;
};

/**
 * Calculate basis of rent initial year rents total
 * @param {Object[]} basisOfRents
 * @param {Object[]} indexOptions
 * @return {number}
 */
export const calculateInitialYearRentsTotal = (
  basisOfRents: Record<string, any>[],
  indexOptions: Record<string, any>[],
): number => {
  if (basisOfRents) {
    const initialYearRents = basisOfRents.map((basisOfRent) => {
      const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(basisOfRent);
      const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
      return calculateBasisOfRentInitialYearRent(
        basisOfRent,
        indexValue,
        basicAnnualRent,
      );
    });
    return Number(initialYearRents.reduce((sum, cur) => sum + cur));
  } else {
    return 0;
  }
};

/**
 * Calculate basis of rent discounted initial year rent
 * @param {Object} basisOfRent
 * @param {string} indexValue
 * @return {number}
 */
export const calculateBasisOfRentDiscountedInitialYearRent = (
  basisOfRent: Record<string, any>,
  indexValue: string | null | undefined,
): number => {
  const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(basisOfRent);
  const initialYearRent = calculateBasisOfRentInitialYearRent(
    basisOfRent,
    indexValue,
    basicAnnualRent,
  );
  if (!isDecimalNumberStr(initialYearRent)) return 0;
  const decimalNumberInitialYearRent = Number(
    convertStrToDecimalNumber(initialYearRent),
  );
  const decimalNumberDiscountPercentage = Number(
    convertStrToDecimalNumber(basisOfRent.discount_percentage),
  );
  const discountMultiplier = Number(
    isDecimalNumberStr(basisOfRent.discount_percentage)
      ? (100 - decimalNumberDiscountPercentage) / 100
      : 1,
  );
  return decimalNumberInitialYearRent * discountMultiplier;
};

/**
 * Calculate basis of rent total discounted initial year rent
 * @param {Object[]} basisOfRent<
 * @param {Object[]} indexOptions
 * @return {number}
 */
export const calculateBasisOfRentTotalDiscountedInitialYearRent = (
  basisOfRents: Array<Record<string, any>>,
  indexOptions: Array<Record<string, any>>,
): number | null | undefined => {
  return basisOfRents.reduce((total, basisOfRent) => {
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    return (
      calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue) +
      total
    );
  }, 0);
};

/**
 * Calculate basis of rent basis subvention amount
 * @param {number} initialYearRent
 * @param {string} subventionPercent
 * @return {number}
 */
export const calculateBasisOfRentSubventionAmount = (
  initialYearRent: number,
  subventionPercent: any,
): number => {
  if (!isDecimalNumberStr(subventionPercent)) return 0;
  const multiplier = Number(subventionPercent / 100);
  const result = multiplier * initialYearRent;
  return Number(convertStrToDecimalNumber(result.toFixed(3)));
};

/**
 * Calculate basis of rent temporary rent cumulative
 * @param {number} initialYearRent
 * @param {any} subventionPercent
 * @param {Array} managementSubventions
 * @param {Array} temporarySubventions
 * @param {number} index
 * @param {string} view
 * @return {number}
 */
export const calculateBasisOfRentSubventionAmountCumulative = (
  initialYearRent: number,
  subventionPercent: string | number,
  managementSubventions: Array<Record<string, any>>,
  temporarySubventions: Array<Record<string, any>>,
  index: number,
  view: string,
  currentAmountPerArea?: number | null | undefined,
): number => {
  if (!isDecimalNumberStr(subventionPercent)) return 0;
  let discounted: any = initialYearRent;
  let discount = 0;
  managementSubventions &&
    managementSubventions.forEach((managementSubvention) => {
      if (view === "EDIT") {
        discounted =
          discounted *
          ((100 -
            Number(
              convertStrToDecimalNumber(
                managementSubvention.subvention_percent,
              ),
            )) /
            100);
      } else {
        const subventionPercentage = calculateBasisOfRentSubventionPercentage(
          managementSubvention.subvention_amount,
          currentAmountPerArea,
        );
        discounted =
          discounted *
          ((100 - Number(convertStrToDecimalNumber(subventionPercentage))) /
            100);
      }
    });
  discounted = discounted.toFixed(6);

  for (let i = 0; i <= index; i++) {
    let lastTotal = discounted;
    discounted =
      discounted *
      ((100 -
        Number(
          convertStrToDecimalNumber(
            temporarySubventions[index].subvention_percent,
          ),
        )) /
        100);
    discount =
      lastTotal - Number(convertStrToDecimalNumber(discounted.toFixed(6)));
  }

  return Number(convertStrToDecimalNumber(discount.toFixed(3))); // Return value with 3 decimals
};

/**
 * Calculate temporary subvention discount percantage for cumulative discounts
 * @param {Object} temporarySubventions
 * @return {string}
 */
export const calculateTemporarySubventionDiscountPercentage = (
  temporarySubventions: Record<string, any>,
): string => {
  let base = 1;
  temporarySubventions &&
    temporarySubventions.forEach((temporarySubvention) => {
      if (temporarySubvention.subvention_percent)
        base =
          base *
          ((100 -
            parseFloat(
              temporarySubvention.subvention_percent.replace(",", "."),
            )) /
            100);
    });
  return Number((1 - base) * 100).toFixed(2);
};

/**
 * Calculate basis of rent basis subvention percantage
 * @param {string} subventionAmount
 * @param {number} currentAmountPerArea
 * @return {number}
 */
export const calculateBasisOfRentSubventionPercentage = (
  subventionAmount: string | number,
  currentAmountPerArea: number | number,
): number => {
  if (!isDecimalNumberStr(subventionAmount)) return 0;
  if (!currentAmountPerArea) return 0;
  const subventionPercentage =
    (1 -
      Number(convertStrToDecimalNumber(subventionAmount)) /
        currentAmountPerArea) *
    100;
  return Number(subventionPercentage.toFixed(2));
};

/**
 * Calculate basis of rent basis subvention amount
 * @param {string} subventionPercantage
 * @param {number} currentAmountPerArea
 * @return {number}
 */
export const calculateSubventionAmountFromPercantage = (
  subventionPercantage: string | number,
  currentAmountPerArea: number | number,
): number => {
  if (!isDecimalNumberStr(subventionPercantage)) return 0;
  if (!currentAmountPerArea) return 0;
  const subventionAmount =
    (1 - Number(convertStrToDecimalNumber(subventionPercantage)) / 100) *
    currentAmountPerArea;
  return Number(subventionAmount.toFixed(2));
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
export const calculateRentAdjustmentSubventionPercent = (
  subventionType: string | null | undefined,
  subventionBasePercent: string | null | undefined,
  subventionGraduatedPercent: string | null | undefined,
  managementSubventions: Array<Record<string, any>> | null | undefined,
  temporarySubventions: Array<Record<string, any>> | null | undefined,
): number => {
  let discount = 0;

  if (subventionType === SubventionTypes.RE_LEASE) {
    discount += calculateReLeaseDiscountPercent(
      subventionBasePercent,
      subventionGraduatedPercent,
    );
  }

  if (subventionType === SubventionTypes.FORM_OF_MANAGEMENT) {
    if (managementSubventions) {
      managementSubventions.forEach((subvention) => {
        discount += Number(
          convertStrToDecimalNumber(subvention.subvention_percent) || 0,
        );
      });
    }
  }

  if (temporarySubventions) {
    temporarySubventions.forEach((subvention) => {
      discount += Number(
        convertStrToDecimalNumber(subvention.subvention_percent) || 0,
      );
    });
  }

  return discount;
};

/**
 * Calculate basis of rent subvention percent
 * @param {number} currentAmountPerArea
 * @param {string} subventionType
 * @param {string} subventionBasePercent
 * @param {string} subventionGraduatedPercent
 * @param {Object[]} managementSubventions
 * @param {Object[]} temporarySubventions
 * @param {string} subventionGraduatedPercent
 * @return {number}
 */
export const calculateBasisOfRentSubventionPercent = (
  currentAmountPerArea: number,
  subventionType: string | null | undefined,
  subventionBasePercent: string | null | undefined,
  subventionGraduatedPercent: string | null | undefined,
  managementSubventions: Array<Record<string, any>> | null | undefined,
  temporarySubventions: Array<Record<string, any>> | null | undefined,
): number => {
  let discount = 1;

  // Use 4 decimals for all the multipliers, because e.g. 20,19% discount as a multiplier is 0,7981
  if (subventionType === SubventionTypes.RE_LEASE) {
    const calculatedReLeasePercentage = calculateReLeaseDiscountPercent(
      subventionBasePercent,
      subventionGraduatedPercent,
    );
    const reLeaseMultiplier = (100 - calculatedReLeasePercentage) / 100 || 1;
    const reLeaseMultiplierRounded = Number(
      convertStrToDecimalNumber(reLeaseMultiplier.toFixed(4)),
    );
    discount = discount * reLeaseMultiplierRounded;
  }

  if (subventionType === SubventionTypes.FORM_OF_MANAGEMENT) {
    if (managementSubventions) {
      managementSubventions.forEach((subvention) => {
        const calculatedSubventionPercentage = Number(
          convertStrToDecimalNumber(
            calculateBasisOfRentSubventionPercentage(
              subvention.subvention_amount,
              currentAmountPerArea,
            ),
          ),
        );
        const subventionMultiplier =
          (100 - calculatedSubventionPercentage) / 100 || 1;
        const subventionMultiplierRounded = Number(
          convertStrToDecimalNumber(subventionMultiplier.toFixed(4)),
        );
        discount =
          Number(convertStrToDecimalNumber(discount.toFixed(4))) *
          subventionMultiplierRounded;
      });
    }
  }

  if (temporarySubventions) {
    temporarySubventions.forEach((subvention) => {
      const temporarySubventionPercent = Number(
        convertStrToDecimalNumber(subvention.subvention_percent),
      );
      const temporarySubventionMultiplier =
        (100 - temporarySubventionPercent) / 100 || 1;
      const temporarySubventionMultiplierRounded = Number(
        convertStrToDecimalNumber(temporarySubventionMultiplier.toFixed(4)),
      );
      discount =
        Number(convertStrToDecimalNumber(discount.toFixed(4))) *
        temporarySubventionMultiplierRounded;
    });
  }

  // Round final percentage to 6 decimals
  return Number(convertStrToDecimalNumber(((1 - discount) * 100).toFixed(6)));
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
export const calculateRentAdjustmentSubventionPercentCumulative = (
  subventionType: string | null | undefined,
  subventionBasePercent: string | null | undefined,
  subventionGraduatedPercent: string | null | undefined,
  managementSubventions: Array<Record<string, any>> | null | undefined,
  temporarySubventions: Array<Record<string, any>> | null | undefined,
): number => {
  let discount = 1;

  if (subventionType === SubventionTypes.RE_LEASE) {
    discount =
      discount *
      ((100 -
        calculateReLeaseDiscountPercent(
          subventionBasePercent,
          subventionGraduatedPercent,
        )) /
        100);
  }

  if (subventionType === SubventionTypes.FORM_OF_MANAGEMENT) {
    if (managementSubventions) {
      managementSubventions.forEach((subvention) => {
        discount =
          discount *
          (Number(
            (100 -
              Number(convertStrToDecimalNumber(subvention.subvention_amount))) /
              100,
          ) || 1);
      });
    }
  }

  if (temporarySubventions) {
    temporarySubventions.forEach((subvention) => {
      discount =
        discount *
        (Number(
          (100 -
            Number(convertStrToDecimalNumber(subvention.subvention_percent))) /
            100,
        ) || 1);
    });
  }

  return (1 - discount) * 100;
};

/**
 * Calculate subvention discount total
 * @param {number} initialYearRent
 * @param {Object[]} managementSubventions
 * @param {number} currentAmountPerArea
 * @return {number}
 */
export const calculateSubventionDiscountTotal = (
  initialYearRent: number,
  managementSubventions: Array<Record<string, any>> | null | undefined,
  currentAmountPerArea: number,
): number => {
  if (
    managementSubventions &&
    managementSubventions[0] &&
    managementSubventions[0].subvention_amount !== null
  ) {
    const roundedInitialYear: any = initialYearRent.toFixed(2);
    const roundedDiscountPercentage: any = Number(
      convertStrToDecimalNumber(
        calculateBasisOfRentSubventionPercentage(
          managementSubventions[0].subvention_amount,
          currentAmountPerArea,
        ),
      ),
    ).toFixed(2);
    const discountMultiplier = Number(
      (100 - roundedDiscountPercentage) / 100 || 1,
    );
    return Number(roundedInitialYear * discountMultiplier);
  }

  return Number(initialYearRent);
};

/**
 * Check if subvention type is specified.
 * The "unspecified" value is needed for rendering the subvention-related fields.
 * @param {?string} subventionType
 * @return {boolean}
 */
export const isSubventionTypeSpecified = (
  subventionType: string | null | undefined,
): boolean => {
  return !!subventionType && subventionType !== "unspecified";
};

/**
 * Check if subventions have values for calculation
 * @param {?Array<Object>} managementSubventions
 * @param {?Array<Object>} temporarySubventions
 * @param {?string} subventionBasePercent
 * @param {?string} subventionGraduatedPercent
 * @return {boolean}
 */
export const hasSubventionValues = (
  managementSubventions: Array<Record<string, any>> | null | undefined,
  temporarySubventions: Array<Record<string, any>> | null | undefined,
  subventionBasePercent: string | null | undefined,
  subventionGraduatedPercent: string | null | undefined,
): boolean => {
  let msWithValues =
    managementSubventions?.filter(
      (subvention) => !!subvention.subvention_amount,
    ) || [];
  let tsWithValues =
    temporarySubventions?.filter(
      (subvention) => !!subvention.subvention_percent,
    ) || [];
  return !!(
    msWithValues.length ||
    tsWithValues.length ||
    subventionBasePercent ||
    subventionGraduatedPercent
  );
};

/**
 * Calculate basis of rent subvention percent
 * @param {number} initialYearRent
 * @param {number} reLeaseDiscountPercent
 * @return {number}
 */
export const calculateSubventionDiscountTotalFromReLease = (
  initialYearRent: number,
  reLeaseDiscountPercent: number,
): number => {
  return Number(initialYearRent * (1 - reLeaseDiscountPercent / 100));
};

/**
 * Calculate Temporary rent
 * @param {number} price
 * @param {number} area
 * @return {number}
 */
export const calculateTemporaryRent = (
  price: number | null | undefined,
  area: number | null | undefined,
): number => {
  if (!price || !area) return 0;
  const areaDecimal = Number(convertStrToDecimalNumber(area));
  if (areaDecimal > 2000)
    return Number(price * 2000 + price * 0.5 * (areaDecimal - 2000));
  else return Number(price * areaDecimal);
};

/**
 * Calculate Basic Annual Rent Indexed
 * @param {number} rent
 * @param {string} indexValue
 * @return {number}
 */
export const calculateBasicAnnualRentIndexed = (
  rent: number | null | undefined,
  indexValue: string | null | undefined,
): number => {
  if (!rent || !indexValue) return 0;
  return Number(rent / (Number(convertStrToDecimalNumber(indexValue)) / 100));
};

/**
 * Calculate Extra rent
 * @param {string} price
 * @param {number} area
 * @return {number}
 */
export const calculateExtraRent = (
  price: string | null | undefined,
  area: number | null | undefined,
): number => {
  if (!price || !area) return 0;
  return Number(
    1.5 *
      Number(convertStrToDecimalNumber(price)) *
      Number(convertStrToDecimalNumber(area)) *
      0.05,
  );
};

/**
 * Calculate Extra rent
 * @param {string} price
 * @param {number} area
 * @return {number}
 */
export const calculateFieldsRent = (
  price: string | null | undefined,
  area: number | null | undefined,
): number => {
  if (!price || !area) return 0;
  return Number(
    Number(convertStrToDecimalNumber(price)) *
      Number(convertStrToDecimalNumber(area)),
  );
};

/**
 * Calculate Rack price
 * @param {number} area
 * @return {number}
 */
export const calculateRackPrice = (
  numberOfRacks: number | null | undefined,
): number => {
  if (!numberOfRacks) return 0;
  return Number(1000 * numberOfRacks);
};

/**
 * Calculate Rack price
 * @param {number} area
 * @return {number}
 */
export const calcluateHightPrice = (
  height: number | null | undefined,
): number => {
  if (!height) return 0;
  return Number(600 * height);
};

/**
 * Calculate Rack and height price
 * @param {Object} children
 * @return {number}
 */
export const calculateRackAndHeightPrice = (
  children: Record<string, any> | null | undefined,
): number => {
  let total = 0;
  if (children && children[0] && children[0].area)
    total =
      total +
      calculateRackPrice(Number(convertStrToDecimalNumber(children[0].area)));
  if (children && children[1] && children[1].area)
    total =
      total +
      calcluateHightPrice(Number(convertStrToDecimalNumber(children[1].area)));
  return total;
};

/**
 * Get content of management subventions from rent adjustment
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getContentManagementSubventions = (
  rentAdjustment: Record<string, any>,
): Array<Record<string, any>> =>
  get(rentAdjustment, "management_subventions", []).map((item) => {
    return {
      id: item.id,
      management: get(item, "management.id") || item.management,
      subvention_amount: item.subvention_amount,
    };
  });

/**
 * Get content of temporary subventions from rent adjustment
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getContentTemporarySubventions = (
  rentAdjustment: Record<string, any>,
): Array<Record<string, any>> =>
  get(rentAdjustment, "temporary_subventions", []).map((item) => {
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
export const getContentRentAdjustments = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "rent_adjustments", [])
    .map((item) => {
      return {
        id: item.id,
        type: item.type,
        intended_use: get(item, "intended_use.id") || item.intended_use,
        start_date: item.start_date,
        end_date: item.end_date,
        full_amount: item.full_amount,
        amount_type: get(item, "amount_type.id") || item.amount_type,
        amount_left: item.amount_left,
        decision: get(item, "decision.id") || item.decision,
        note: item.note,
        subvention_type:
          get(item, "subvention_type.id") || item.subvention_type,
        subvention_base_percent: item.subvention_base_percent,
        subvention_graduated_percent: item.subvention_graduated_percent,
        management_subventions: getContentManagementSubventions(item),
        temporary_subventions: getContentTemporarySubventions(item),
        zone: item.zone,
      };
    })
    .sort(sortByStartAndEndDateDesc);

/**
 * Get index adjusted rents content
 * @param {Object} rent
 * @return {Object[]}
 */
export const getContentIndexAdjustedRents = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "index_adjusted_rents", []).map((item) => {
    return {
      item: item.id,
      amount: item.amount,
      intended_use: get(item, "intended_use.id") || item.intended_use,
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
export const getContentContractRents = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "contract_rents", [])
    .map((item) => {
      return {
        id: item.id,
        amount: item.amount,
        period: item.period,
        index: get(item, "index.id") || item.index,
        intended_use: get(item, "intended_use.id") || item.intended_use,
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
export const getContentFixedInitialYearRents = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "fixed_initial_year_rents", [])
    .map((item) => {
      return {
        id: item.id,
        intended_use: get(item, "intended_use.id") || item.intended_use,
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
export const getContentRentDueDate = (
  rent: Record<string, any>,
  path: string = "due_dates",
): Array<Record<string, any>> =>
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
export const getContentRents = (lease: Lease): Array<Record<string, any>> =>
  get(lease, "rents", [])
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
        yearly_due_dates: getContentRentDueDate(rent, "yearly_due_dates"),
        override_receivable_type:
          get(rent, "override_receivable_type.id") ||
          rent.override_receivable_type,
        old_dwellings_in_housing_companies_price_index:
          rent.old_dwellings_in_housing_companies_price_index,
        periodic_rent_adjustment_type: rent.periodic_rent_adjustment_type,
        start_price_index_point_figure_value:
          rent.start_price_index_point_figure_value,
        start_price_index_point_figure_year:
          rent.start_price_index_point_figure_year,
      };
    })
    .sort(sortByStartAndEndDateDesc);

/**
 * Get warnings if amount of fixed initial year rents is different than contract rents
 * @param {Object[]} rents
 * @returns {string[]}
 */
export const getRentWarnings = (
  rents: Array<Record<string, any>>,
): Array<string> => {
  const warnings = [];
  rents.forEach((rent) => {
    if (rent.type !== RentTypes.INDEX && rent.type !== RentTypes.MANUAL) return;
    let showWarning = false;
    const fixedInitialYearRents = get(
      rent,
      "fixed_initial_year_rents",
      [],
    ).filter((rent) => isActive(rent));
    const contractRents = get(rent, "contract_rents", []).filter((rent) =>
      isActive(rent),
    );
    forEach(fixedInitialYearRents, (rent) => {
      if (rent.intended_use) {
        const filteredFixedInitialYearRents = fixedInitialYearRents.filter(
          (item) => item.intended_use === rent.intended_use,
        );
        const filteredContractRents = contractRents.filter(
          (item) => item.intended_use === rent.intended_use,
        );

        if (
          filteredFixedInitialYearRents.length !== filteredContractRents.length
        ) {
          showWarning = true;
          return false;
        }
      }
    });

    if (showWarning) {
      warnings.push(
        `Vuokralla ${formatDateRange(rent.start_date, rent.end_date)} on eri määrä kiinteitä alkuvuosivuokria ja sopimusvuokria`,
      );
    }
  });
  return warnings;
};

/**
 * Get lease basis of rents content
 * @param {Object} lease
 * @return {Object[]}
 */
export const getContentBasisOfRents = (
  lease: Lease,
): Array<Record<string, any>> => {
  const allChildren = get(lease, "basis_of_rents", []).flatMap(
    (item) => item.children,
  );

  // Get children sorted ascending by id
  const getSortedChildren = (
    lease: Lease,
    item: Record<string, any>,
  ): Array<Record<string, any>> => {
    const children = get(lease, "basis_of_rents", []).filter((filterItem) =>
      get(item, "children", []).includes(filterItem.id),
    );
    if (!children.length) return [];
    return [...children].sort((a, b) => a.id - b.id);
  };

  return get(lease, "basis_of_rents", [])
    .filter((item) => !allChildren.includes(item.id))
    .map((item) => {
      return {
        id: item.id || undefined,
        intended_use: get(item, "intended_use.id") || get(item, "intended_use"),
        area: item.area,
        area_unit: item.area_unit,
        amount_per_area: item.amount_per_area,
        index: get(item, "index.id") || get(item, "index"),
        profit_margin_percentage: item.profit_margin_percentage,
        children: getSortedChildren(lease, item),
        type: item.type,
        discount_percentage: item.discount_percentage,
        plans_inspected_at: item.plans_inspected_at,
        plans_inspected_by: item.plans_inspected_by,
        locked_at: item.locked_at,
        locked_by: item.locked_by,
        archived_at: item.archived_at,
        subvention_type:
          get(item, "subvention_type.id") || item.subvention_type,
        subvention_base_percent: item.subvention_base_percent,
        subvention_graduated_percent: item.subvention_graduated_percent,
        management_subventions: getContentManagementSubventions(item),
        temporary_subventions: getContentTemporarySubventions(item),
        zone: item.zone,
      };
    });
};

/**
 * Get invoice recipient options
 * @param {Object} lease
 * @param {boolean} addAll
 * @param {boolean} addTenants
 * @return {Object[]}
 */
export const getInvoiceRecipientOptions = (
  lease: Lease,
  addAll: boolean,
  addTenants: boolean,
): Array<Record<string, any>> => {
  const items = getContentTenants(lease);
  const recipients = [];

  if (addAll) {
    recipients.push({
      value: RecipientOptions.ALL,
      label: "Kaikki",
    });
  }

  if (addTenants) {
    recipients.push(
      ...items
        .filter((item) => isActiveOrFuture(item.tenant))
        .map((item) => {
          return {
            value: get(item, "id"),
            label: getContactFullName(get(item, "tenant.contact")),
          };
        })
        .sort((a, b) => sortStringByKeyAsc(a, b, "label")),
    );
  }

  return recipients;
};

/**
 * Get invoice tenant options
 * @param {Object} lease
 * @return {Object[]}
 */
export const getInvoiceTenantOptions = (
  lease: Lease,
): Array<Record<string, any>> => {
  const items: any = getContentTenants(lease);
  return items.map((item) => {
    return {
      value: item.id,
      label: getContactFullName(get(item, "tenant.contact")),
    };
  });
};

/**
 * Get debt collection decisions from lease data
 * @param lease
 * @returns {Object[]}
 */
export const getContentDebtCollectionDecisions = (
  lease: Lease,
): Array<Record<string, any>> =>
  get(lease, "decisions", [])
    .filter(
      (decision) =>
        get(decision, "type.kind") === DecisionTypeKinds.LEASE_CANCELLATION,
    )
    .map((decision) => getContentDecision(decision));

/**
 * Get content leases features for geojson data
 * @param {Object[]} leases
 * @returns {Object[]}
 */
export const getContentLeasesFeatures = (
  leases: Array<Record<string, any>>,
): Array<LeafletFeature> => {
  return leases.map((lease) => {
    const coordinates = [];
    const areas = get(lease, "lease_areas", []);
    areas.forEach((area) => {
      const coords = get(area, "geometry.coordinates", []);

      if (coords.length) {
        coordinates.push(coords[0]);
      }
    });
    return {
      type: "Feature",
      geometry: {
        coordinates: coordinates,
        type: "MultiPolygon",
      },
      properties: {
        id: lease.id,
        feature_type: "lease",
        identifier: getContentLeaseIdentifier(lease),
        start_date: lease.start_date,
        end_date: lease.end_date,
        state: get(lease, "state.id") || lease.state,
      },
    };
  });
};

/**
 * Get content leases geojson data
 * @param {Object[]} leases
 * @returns {Object}
 */
export const getContentLeasesGeoJson = (
  leases: Array<Record<string, any>>,
): LeafletGeoJson => {
  const features = getContentLeasesFeatures(leases);
  return {
    type: "FeatureCollection",
    features: features,
  };
};

/**
 * Get content lease areas features for geojson data
 * @param {Object[]} areas
 * @returns {Object[]}
 */
export const getContentLeaseAreasFeatures = (
  areas: Array<Record<string, any>>,
): Array<LeafletFeature> => {
  return areas.map((area) => {
    return {
      type: "Feature",
      geometry: area.geometry,
      properties: {
        id: area.id,
        feature_type: "area",
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
  const areas = get(lease, "lease_areas", []).filter(
    (area) => !area.archived_at,
  );
  const features = getContentLeaseAreasFeatures(areas);
  return {
    type: "FeatureCollection",
    features: features,
  };
};

/**
 * Get content lease plots features for geojson data
 * @param {Object[]} plots
 * @returns {Object[]}
 */
export const getContentLeasePlotsFeatures = (
  plots: Array<Record<string, any>>,
): Array<LeafletFeature> => {
  return plots.map((plot) => {
    return {
      type: "Feature",
      geometry: plot.geometry,
      properties: {
        id: plot.id,
        feature_type: "plot",
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
export const getContentPlotsGeoJson = (
  lease: Lease,
  inContract: boolean = false,
): LeafletGeoJson => {
  const plots = [];
  get(lease, "lease_areas", [])
    .filter((area) => !area.archived_at)
    .forEach((area) => {
      plots.push(
        ...get(area, "plots", []).filter(
          (plot) => plot.in_contract === inContract,
        ),
      );
    });
  const features = getContentLeasePlotsFeatures(plots);
  return {
    type: "FeatureCollection",
    features: features,
  };
};

/**
 * Get content lease plan units features for geojson data
 * @param {Object[]} plots
 * @returns {Object[]}
 */
export const getContentPlanUnitFeatures = (
  planUnits: Array<Record<string, any>>,
): Array<LeafletFeature> => {
  return planUnits.map((planUnit) => {
    return {
      type: "Feature",
      geometry: planUnit.geometry,
      properties: {
        id: planUnit.id,
        feature_type: "plan_unit",
        identifier: planUnit.identifier,
        area: planUnit.area,
        section_area: planUnit.section_area,
        detailed_plan_identifier: planUnit.detailed_plan_identifier,
        detailed_plan_latest_processing_date:
          planUnit.detailed_plan_latest_processing_date,
        detailed_plan_latest_processing_date_note:
          planUnit.detailed_plan_latest_processing_date_note,
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
export const getContentPlanUnitsGeoJson = (
  lease: Lease,
  inContract: boolean = false,
): LeafletGeoJson => {
  const planUnits = [];
  get(lease, "lease_areas", [])
    .filter((area) => !area.archived_at)
    .forEach((area) => {
      planUnits.push(
        ...get(area, "plan_units", []).filter(
          (planUnit) => planUnit.in_contract === inContract,
        ),
      );
    });
  const features = getContentPlanUnitFeatures(planUnits);
  return {
    type: "FeatureCollection",
    features: features,
  };
};

/**
 * Get coordinates of lease
 * @param {Object} lease
 * @returns {Object[]}
 */
export const getLeaseCoordinates = (
  lease: Lease,
): Array<Record<string, any>> => {
  const areas = get(lease, "lease_areas", []).filter(
    (area) => !area.archived_at,
  );
  let coordinates = [];
  areas.forEach((area) => {
    coordinates.push(...getCoordinatesOfGeometry(area.geometry));
  });
  return coordinates;
};

/**
 * Get payload for lease POST request
 * @param {Object} formValues
 * @returns {Object}
 */
export const getPayloadCreateLease = (formValues: CreateLeaseFormValues): Record<string, any> => {
  const relateTo = !isEmpty(formValues.relate_to)
    ? !isEmptyValue(formValues.relate_to.value)
      ? formValues.relate_to.value
      : undefined
    : undefined;
  return {
    state: formValues.state,
    type: formValues.type,
    start_date: formValues?.start_date || null,
    end_date: formValues?.end_date || null,
    municipality: formValues.municipality,
    district: formValues.district,
    reference_number: formValues.reference_number,
    note: formValues.note,
    application_metadata: {
      application_received_at: formValues.application_received_at,
    },
    relate_to: relateTo,
    relation_type: relateTo ? RelationTypes.TRANSFER : undefined,
    area_search_id: formValues.area_search_id,
    service_unit: formValues.service_unit,
  };
};

/**
 * Add summary form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addSummaryFormValuesToPayload = (
  payload: Record<string, any>,
  formValues: Record<string, any>,
): Record<string, any> => {
  return {
    ...payload,
    application_metadata: formValues.application_metadata,
    building_selling_price: convertStrToDecimalNumber(
      formValues.building_selling_price,
    ),
    classification: formValues.classification,
    conveyance_number: formValues.conveyance_number,
    end_date: formValues.end_date,
    financing: formValues.financing,
    hitas: formValues.hitas,
    intended_use: get(formValues, "intended_use.value"),
    intended_use_note: formValues.intended_use_note,
    internal_order: formValues.internal_order,
    is_subject_to_vat: formValues.is_subject_to_vat,
    lessor: get(formValues, "lessor.value"),
    notice_note: formValues.notice_note,
    notice_period: formValues.notice_period,
    management: formValues.management,
    note: formValues.note,
    preparer: get(formValues, "preparer.value"),
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
const getPayloadLeaseAreaAddresses = (area: Record<string, any>) =>
  get(area, "addresses", []).map((address) => {
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
const getPayloadPlots = (
  area: Record<string, any>,
): Array<Record<string, any>> => {
  const currentPlots = get(area, "plots_current", []).map((plot) => {
    return { ...plot, in_contract: false };
  });
  const contractPlots = get(area, "plots_contract", []).map((plot) => {
    return { ...plot, in_contract: true };
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
const getPayloadPlanUnits = (
  area: Record<string, any>,
): Array<Record<string, any>> => {
  const currentPlanUnits = get(area, "plan_units_current", []).map(
    (planunit) => {
      return { ...planunit, in_contract: false };
    },
  );
  const contractPlanUnits = get(area, "plan_units_contract", []).map(
    (planunit) => {
      return { ...planunit, in_contract: true };
    },
  );
  const pendingPlanUnits = get(area, "plan_units_pending", []).map(
    (planunit) => {
      return { ...planunit, in_contract: false };
    },
  );
  const planUnits = currentPlanUnits.concat(
    contractPlanUnits,
    pendingPlanUnits,
  );
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
      detailed_plan_latest_processing_date:
        planunit.detailed_plan_latest_processing_date,
      detailed_plan_latest_processing_date_note:
        planunit.detailed_plan_latest_processing_date_note,
      plan_unit_type: planunit.plan_unit_type,
      plan_unit_state: planunit.plan_unit_state,
      plan_unit_intended_use: planunit.plan_unit_intended_use,
      is_master: planunit.is_master,
    };
  });
};

/**
 * Add areas form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addAreasFormValuesToPayload = (
  payload: Record<string, any>,
  values: Record<string, any>,
): Record<string, any> => {
  const areas = [
    ...get(values, "lease_areas_active", []),
    ...get(values, "lease_areas_archived", []),
  ];
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
      custom_detailed_plan: area.custom_detailed_plan,
    };
  });
  return payload;
};

/**
 * Get decision conditions payload
 * @param {Object} decision
 * @returns {Object[]}
 */
const getPayloadDecisionConditions = (decision: Record<string, any>) => {
  return get(decision, "conditions", []).map((condition) => {
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
export const addDecisionsFormValuesToPayload = (
  payload: Record<string, any>,
  formValues: Record<string, any>,
): Record<string, any> => {
  payload.decisions = get(formValues, "decisions", []).map((decision) => {
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
const getPayloadContractChanges = (
  contract: Record<string, any>,
): Array<Record<string, any>> => {
  return get(contract, "contract_changes", []).map((change) => {
    return {
      id: change.id || undefined,
      signing_date: change.signing_date,
      sign_by_date: change.sign_by_date,
      first_call_sent: change.first_call_sent,
      second_call_sent: change.second_call_sent,
      third_call_sent: change.third_call_sent,
      description: change.description,
      decision: change.decision,
      executor: change.executor?.value,
    };
  });
};

/**
 * Get contract collaterals payload
 * @param {Object} contract
 * @returns {Object[]}
 */
const getPayloadCollaterals = (
  contract: Record<string, any>,
): Array<Record<string, any>> => {
  return get(contract, "collaterals", []).map((collateral) => {
    switch (collateral.type) {
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
export const addContractsFormValuesToPayload = (
  payload: Record<string, any>,
  formValues: Record<string, any>,
): Record<string, any> => {
  payload.contracts = get(formValues, "contracts", []).map((contract) => {
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
      executor: contract.executor?.value,
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
export const addInspectionsFormValuesToPayload = (
  payload: Record<string, any>,
  formValues: Record<string, any>,
): Record<string, any> => {
  payload.inspections = get(formValues, "inspections", []).map((inspection) => {
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
export const getPayloadConstructabilityDescriptions = (
  area: Record<string, any>,
): Array<Record<string, any>> => {
  const descriptionsPreconstruction = get(
    area,
    "descriptionsPreconstruction",
    [],
  ).map((description) => {
    return { ...description, type: ConstructabilityType.PRECONSTRUCTION };
  });
  const descriptionsDemolition = get(area, "descriptionsDemolition", []).map(
    (description) => {
      return { ...description, type: ConstructabilityType.DEMOLITION };
    },
  );
  const descriptionsPollutedLand = get(
    area,
    "descriptionsPollutedLand",
    [],
  ).map((description) => {
    return { ...description, type: ConstructabilityType.POLLUTED_LAND };
  });
  const descriptionsReport = get(area, "descriptionsReport", []).map(
    (description) => {
      return { ...description, type: ConstructabilityType.REPORT };
    },
  );
  const descriptionsOther = get(area, "descriptionsOther", []).map(
    (description) => {
      return { ...description, type: ConstructabilityType.OTHER };
    },
  );
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
export const getPayloadConstructabilityArea = (
  area: Record<string, any>,
  values: Record<string, any>,
): any => {
  return {
    ...area,
    preconstruction_state: values.preconstruction_state,
    preconstruction_estimated_construction_readiness_moment:
      values.preconstruction_estimated_construction_readiness_moment,
    preconstruction_inspection_moment: values.preconstruction_inspection_moment,
    demolition_state: values.demolition_state,
    polluted_land_state: values.polluted_land_state,
    polluted_land_rent_condition_state:
      values.polluted_land_rent_condition_state,
    polluted_land_rent_condition_date: values.polluted_land_rent_condition_date,
    polluted_land_planner: get(values, "polluted_land_planner.value"),
    polluted_land_projectwise_number: values.polluted_land_projectwise_number,
    constructability_report_state: values.constructability_report_state,
    constructability_report_investigation_state:
      values.constructability_report_investigation_state,
    constructability_report_signing_date:
      values.constructability_report_signing_date,
    constructability_report_signer: values.constructability_report_signer,
    other_state: values.other_state,
    constructability_descriptions:
      getPayloadConstructabilityDescriptions(values),
  };
};

/**
 * Add constructability form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addConstructabilityFormValuesToPayload = (
  payload: Record<string, any>,
  formValues: Record<string, any>,
): Record<string, any> => {
  const areas = payload.lease_areas;
  const constAreas = get(formValues, "lease_areas", []);

  if (areas && !!areas.length) {
    payload.lease_areas = areas.map((area) => {
      const constArea = constAreas.find((x) => x.id === area.id);

      if (constArea) {
        return getPayloadConstructabilityArea(area, constArea);
      }

      return area;
    });
  } else if (Array.isArray(constAreas)) {
    payload.lease_areas = constAreas.map((area) => {
      return getPayloadConstructabilityArea(
        {
          id: area.id,
          location: area.location,
          area: area.area,
          identifier: area.identifier,
          type: area.type,
        },
        area,
      );
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
export const getPayloadTenantContactDetails = (
  tenant: Record<string, any>,
  contactType: string,
): Record<string, any> => ({
  id: tenant.id,
  type: contactType,
  contact: tenant.contact,
  start_date: tenant.start_date,
  end_date: tenant.end_date,
});

/**
 * Get payload rent shares of a tenant
 * @param {Object} tenant
 * @returns {Object[]}
 */
export const getPayloadTenantRentShares = (
  tenant: Record<string, any>,
): Array<Record<string, any>> => {
  const rentShares = get(tenant, "rent_shares", []);
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
export const getPayloadTenantContactSet = (
  tenant: Record<string, any>,
): Array<Record<string, any>> => {
  const contacts = [];
  const tenantData = tenant.tenant;
  contacts.push(
    getPayloadTenantContactDetails(tenantData, TenantContactType.TENANT),
  );
  const billingPersons = get(tenant, "billing_persons", []);
  billingPersons.forEach((billingPerson) => {
    contacts.push(
      getPayloadTenantContactDetails(billingPerson, TenantContactType.BILLING),
    );
  });
  const contactPersons = get(tenant, "contact_persons", []);
  contactPersons.forEach((contactPerson) => {
    contacts.push(
      getPayloadTenantContactDetails(contactPerson, TenantContactType.CONTACT),
    );
  });
  return contacts;
};

/**
 * Add tenants form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @returns {Object}
 */
export const addTenantsFormValuesToPayload = (
  payload: Record<string, any>,
  formValues: Record<string, any>,
): Record<string, any> => {
  const tenantsCurrent = get(formValues, "tenants", []);
  const tenantsArchived = get(formValues, "tenantsArchived", []);
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
export const getPayloadManagementSubventions = (
  rentAdjustment: Record<string, any>,
): Array<Record<string, any>> =>
  get(rentAdjustment, "management_subventions", []).map((item) => {
    return {
      id: item.id,
      management: item.management,
      subvention_amount: convertStrToDecimalNumber(item.subvention_amount),
    };
  });

/**
 * Get temporary subventions payload
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getPayloadTemporarySubventions = (
  rentAdjustment: Record<string, any>,
): Array<Record<string, any>> =>
  get(rentAdjustment, "temporary_subventions", []).map((item) => {
    return {
      id: item.id,
      description: item.description,
      subvention_percent: convertStrToDecimalNumber(item.subvention_percent),
    };
  });

/**
 * Get children payload
 * @param {Object} rentAdjustment
 * @return {Object[]}
 */
export const getPayloadChildren = (
  rentAdjustment: Record<string, any>,
): Array<Record<string, any>> =>
  get(rentAdjustment, "children", []).map((item) => {
    return {
      intended_use: 7,
      area_unit: "m2",
      area: convertStrToDecimalNumber(item.area),
    };
  });

/**
 * Get rent adjustments payload
 * @param {Object} rent
 * @returns {Object[]}
 */
export const getPayloadRentAdjustments = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "rent_adjustments", []).map((item) => {
    return {
      id: item.id,
      type: item.type,
      intended_use: item.intended_use,
      start_date: item.start_date,
      end_date:
        item.amount_type !== RentAdjustmentAmountTypes.AMOUNT_TOTAL
          ? item.end_date
          : null,
      full_amount: convertStrToDecimalNumber(item.full_amount),
      amount_type: item.amount_type,
      amount_left: convertStrToDecimalNumber(item.amount_left),
      decision: item.decision,
      note: item.note,
      subvention_type: item.subvention_type,
      subvention_base_percent: convertStrToDecimalNumber(
        item.subvention_base_percent,
      ),
      subvention_graduated_percent: convertStrToDecimalNumber(
        item.subvention_graduated_percent,
      ),
      management_subventions: getPayloadManagementSubventions(item),
      temporary_subventions: getPayloadTemporarySubventions(item),
      zone: item.zone,
    };
  });

/**
 * Get contract rents payload
 * @param {Object} rent
 * @param {string} rentType
 * @returns {Object[]}
 */
export const getPayloadContractRents = (
  rent: Record<string, any>,
  rentType: string,
): Array<Record<string, any>> =>
  get(rent, "contract_rents", []).map((item) => {
    const contractRentData: any = {
      id: item.id,
      amount: convertStrToDecimalNumber(item.amount),
      period: item.period,
      intended_use: get(item, "intended_use.id") || item.intended_use,
      start_date: item.start_date,
      end_date: item.end_date,
    };

    // Patch these fields only if rent type is index or manual
    if (rentType === RentTypes.INDEX || rentType === RentTypes.MANUAL) {
      contractRentData.base_amount = convertStrToDecimalNumber(
        item.base_amount,
      );
      contractRentData.base_amount_period = item.base_amount_period;
      contractRentData.base_year_rent = convertStrToDecimalNumber(
        item.base_year_rent,
      );
    }

    // Patch index data only if rent type is index2022
    if (rent.type === RentTypes.INDEX2022) {
      contractRentData.index = item.index;
    }

    return contractRentData;
  });

/**
 * Get fixed initial year rents payload
 * @param {Object} rent
 * @returns {Object[]}
 */
export const getPayloadFixedInitialYearRents = (
  rent: Record<string, any>,
): Array<Record<string, any>> =>
  get(rent, "fixed_initial_year_rents", []).map((item) => {
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
export const getPayloadRentDueDates = (
  rent: Record<string, any>,
): Array<Record<string, any>> => {
  const type = rent.type;
  const dueDates = get(rent, "due_dates", []);

  if (type === RentTypes.ONE_TIME) {
    return dueDates.length
      ? [
          {
            id: dueDates[0].id,
            day: dueDates[0].day,
            month: dueDates[0].month,
          },
        ]
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
 * Return area unit by calculator type
 * @param {Object} item
 * @returns {string}
 */
export const areaUnit = (item: Record<string, any>): string => {
  if (
    item.type === CalculatorTypes.LEASE ||
    item.type === CalculatorTypes.LEASE2022
  )
    return item.area_unit;
  return "m2";
};

/**
 * Return intended use by calculator type
 * @param {Object} item
 * @returns {number}
 */
export const intendedUse = (item: Record<string, any>): number => {
  if (
    item.type === CalculatorTypes.LEASE ||
    item.type === CalculatorTypes.LEASE2022
  )
    return item.intended_use;
  return 7;
};

/**
 * Find basis of rent by id
 * @param {Object} lease
 * @param {number} id
 * @returns {Object}
 */
export const getBasisOfRentById = (
  lease: Lease,
  id: number | null | undefined,
): Record<string, any> | null | undefined => {
  if (!id) return null;
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
export const addRentsFormValuesToPayload = (
  payload: Record<string, any>,
  formValues: Record<string, any>,
  currentLease: Lease,
): Record<string, any> => {
  payload.is_rent_info_complete = formValues.is_rent_info_complete
    ? true
    : false;
  const basisOfRents = [
    ...get(formValues, "basis_of_rents", []),
    ...get(formValues, "basis_of_rents_archived", []),
  ];
  payload.basis_of_rents = basisOfRents.map((item) => {
    const savedBasisOfRent = getBasisOfRentById(currentLease, item.id);

    if (savedBasisOfRent && savedBasisOfRent.locked_at) {
      return {
        id: item.id,
        locked_at: item.locked_at,
      };
    } else {
      return {
        id: item.id,
        intended_use: intendedUse(item),
        area: convertStrToDecimalNumber(item.area),
        area_unit: areaUnit(item),
        type: item.type,
        amount_per_area: convertStrToDecimalNumber(item.amount_per_area),
        index: item.index,
        profit_margin_percentage: convertStrToDecimalNumber(
          item.profit_margin_percentage,
        ),
        discount_percentage: convertStrToDecimalNumber(
          item.discount_percentage,
        ),
        children: getPayloadChildren(item),
        plans_inspected_at: item.plans_inspected_at,
        locked_at: item.locked_at,
        archived_at: item.archived_at,
        subvention_type: item.subvention_type,
        subvention_base_percent: convertStrToDecimalNumber(
          item.subvention_base_percent,
        ),
        subvention_graduated_percent: convertStrToDecimalNumber(
          item.subvention_graduated_percent,
        ),
        management_subventions: getPayloadManagementSubventions(item),
        temporary_subventions: getPayloadTemporarySubventions(item),
        zone: item.zone,
      };
    }
  });
  const rents = [
    ...get(formValues, "rents", []),
    ...get(formValues, "rentsArchived", []),
  ];
  payload.rents = rents.map((rent) => {
    const rentData: any = {
      id: rent.id,
      type: rent.type,
      start_date: rent.start_date,
      end_date: rent.end_date,
      note: rent.note,
      old_dwellings_in_housing_companies_price_index:
        rent.old_dwellings_in_housing_companies_price_index?.id,
      periodic_rent_adjustment_type: rent.periodic_rent_adjustment_type,
    };

    // Patch amount only if rent type is one time
    if (rent.type === RentTypes.ONE_TIME) {
      rentData.amount = convertStrToDecimalNumber(rent.amount);
    }

    // Patch due dates data only if rent type is not free
    if (rent.type !== RentTypes.FREE) {
      rentData.due_dates_type = rent.due_dates_type;

      if (rent.due_dates_type === RentDueDateTypes.CUSTOM) {
        rentData.due_dates = getPayloadRentDueDates(rent);
      } else if (rent.due_dates_type === RentDueDateTypes.FIXED) {
        rentData.due_dates_per_year = rent.due_dates_per_year;
      }
    }

    // Patch cycle and fixed initial year rents data only if rent type is index, index2022 or manual
    if (
      rent.type === RentTypes.INDEX ||
      rent.type === RentTypes.INDEX2022 ||
      rent.type === RentTypes.MANUAL
    ) {
      rentData.cycle = rent.cycle;
      rentData.fixed_initial_year_rents = getPayloadFixedInitialYearRents(rent);
    }

    // Patch index type data only if rent type is index or manual
    if (rent.type === RentTypes.INDEX || rent.type === RentTypes.MANUAL) {
      rentData.index_type = rent.index_type;
    }

    if (rent.type === RentTypes.MANUAL) {
      switch (rent.cycle) {
        case RentCycles.JANUARY_TO_DECEMBER:
          rentData.manual_ratio = convertStrToDecimalNumber(rent.manual_ratio);
          break;

        case RentCycles.APRIL_TO_MARCH:
          rentData.manual_ratio = convertStrToDecimalNumber(rent.manual_ratio);
          rentData.manual_ratio_previous = convertStrToDecimalNumber(
            rent.manual_ratio_previous,
          );
          break;
      }
    }

    // Patch some data only if rent type is index, index2022, fixed, or manual
    if (
      rent.type === RentTypes.INDEX ||
      rent.type === RentTypes.INDEX2022 ||
      rent.type === RentTypes.FIXED ||
      rent.type === RentTypes.MANUAL
    ) {
      rentData.contract_rents = getPayloadContractRents(rent, rent.type);
      rentData.rent_adjustments = getPayloadRentAdjustments(rent);
      rentData.override_receivable_type =
        get(rent, "override_receivable_type.id") ||
        rent.override_receivable_type;
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
export const calculateAreasSum = (
  areas: Array<Record<string, any>>,
): number => {
  let areasSum = 0;

  if (areas) {
    forEach(areas, (area) => {
      areasSum += area.area;
    });
  }

  return areasSum;
};

/**
 * Get zone price from value
 * @param {string} zone
 * @returns {number}
 */
export const getZonePriceFromValue = (
  zone: string | null | undefined,
): number => {
  let sum = 0;

  if (zone) {
    switch (zone) {
      case "zone_1":
        sum = 0.85;
        break;

      case "zone_2":
        sum = 0.85;
        break;

      case "zone_3":
        sum = 0.65;
        break;

      default:
        sum = 0;
        break;
    }
  }

  return sum;
};

/**
 * Map lease page search filters for API
 * @param {Object} query
 * @returns {Object}
 */
export const mapLeaseSearchFilters = (
  query: Record<string, any>,
): Record<string, any> => {
  const searchQuery = { ...query };
  searchQuery.lease_state = isArray(searchQuery.lease_state)
    ? searchQuery.lease_state
    : searchQuery.lease_state
      ? [searchQuery.lease_state]
      : [];

  if (searchQuery.sort_key) {
    if (searchQuery.sort_key === "identifier") {
      searchQuery.ordering = [
        "type__identifier",
        "municipality__identifier",
        "district__identifier",
        "identifier__sequence",
      ];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if (searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map(
        (key: string) => `-${key}`,
      );
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  if (searchQuery.has_not_geometry === "true") {
    searchQuery.has_geometry = false;
  }

  delete searchQuery.has_not_geometry;
  searchQuery.lease_state.forEach((state) => {
    if (state === LeaseState.RESERVE) {
      searchQuery.lease_state.push(LeaseState.FREE);
      return false;
    }
  });
  return searchQuery;
};

/**
 * calculate mast rent
 * @param {number} index
 * @param {number} area
 * @param {string} amountPerArea
 * @returns {number}
 */
export const mastCalculatorRent = (index: number, area: number): number => {
  if (isEmpty(area)) return 0;
  if (index === 0 && area)
    return Number(1000 * Number(convertStrToDecimalNumber(area)));
  if (index === 1 && area)
    return Number(600 * Number(convertStrToDecimalNumber(area)));
  return 0;
};

/**
 * Format single due date as string
 * @param {DueDate} date
 * @returns {string}
 */
const formatDueDate = (date: DueDate): string => {
  return `${date.day}.${date.month}.`;
};

/**
 * Format due dates as string
 * @param {Array<DueDate>} dates
 * @returns {string}
 */
export const formatDueDates = (dates: Array<DueDate>): string => {
  return dates.map((date) => formatDueDate(date)).join(", ");
};

/**
 * Sort due dates by month and day
 * @param {Array<DueDate>} dueDates
 * @returns {Array<DueDate>} Sorted array of due date objects with day and month properties.
 */
export const sortDueDates = (dueDates: Array<DueDate>): Array<DueDate> => {
  return dueDates.sort((a, b) => {
    if (a.month !== b.month) {
      return a.month - b.month;
    }
    return a.day - b.day;
  });
};

/**
 * Test is any lease page form dirty
 * @param {Object} state
 * @returns {boolean}
 */
export const isAnyLeaseFormDirty = (state: RootState): boolean => {
  const isEditMode = getIsEditMode(state);
  return (
    isEditMode &&
    (isDirty(FormNames.LEASE_CONSTRUCTABILITY)(state) ||
      isDirty(FormNames.LEASE_CONTRACTS)(state) ||
      isDirty(FormNames.LEASE_DECISIONS)(state) ||
      isDirty(FormNames.LEASE_INSPECTIONS)(state) ||
      isDirty(FormNames.LEASE_AREAS)(state) ||
      isDirty(FormNames.LEASE_RENTS)(state) ||
      isDirty(FormNames.LEASE_SUMMARY)(state) ||
      isDirty(FormNames.LEASE_TENANTS)(state))
  );
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
  removeSessionStorageItem("leaseId");
};

/**
 * Get leases with contract number
 * @param {LeaseList} leasesForContractNumbers
 * @returns {boolean}
 */
export const getLeasesWithContractNumber = (
  leasesForContractNumbers: LeaseList,
): boolean => {
  return get(leasesForContractNumbers, "count") > 0;
};

/**
 * Destructures a nested lease object in a related lease.
 * @param {Object} lease
 * @returns {Object}
 */
export const restructureLease = (lease: Lease): Record<string, any> => {
  let destructuredLease = lease.lease;
  return {
    related_lease_id: lease.id,
    ...destructuredLease,
  };
};

/**
 * Sorts related leases and other items
 * by comparing start dates or received dates.
 * @param {Object} lease
 * @returns {Object}
 */
export const sortRelatedHistoryItems = (
  a: Record<string, any>,
  b: Record<string, any>,
): number => {
  let aTime = a.startDate || a.receivedAt || null;
  let bTime = b.startDate || b.receivedAt || null;

  if (aTime && bTime && aTime != bTime) {
    if (aTime < bTime) {
      return 1;
    } else {
      return -1;
    }
  } else {
    return 0;
  }
};

/**
 * Get check days for old_dwellings_in_housing_companies_price_index of the given start date.
 * @param {string} startDate
 * @param {PeriodicRentAdjustmentType} priceIndexType
 * @returns {Array<string>}
 */
export const getReviewDays = (
  startDate: string,
  priceIndexType: PeriodicRentAdjustmentType,
): Array<string> => {
  const checkDays = [];
  let increments: Array<number>;

  if (
    priceIndexType ===
    oldDwellingsInHousingCompaniesPriceIndexTypeOptions.TASOTARKISTUS_20_10
  ) {
    increments = [20, 10, 10, 10, 10, 10];
  } else if (
    priceIndexType ===
    oldDwellingsInHousingCompaniesPriceIndexTypeOptions.TASOTARKISTUS_20_20
  ) {
    increments = [20, 20, 20];
  } else {
    return [];
  }

  increments.forEach((_, i) => {
    const date = new Date(startDate);
    date.setDate(1);
    date.setMonth(6);
    const totalCurrentIncrements = increments
      .slice(0, i + 1)
      .reduce((a, b) => a + b, 0);
    date.setFullYear(date.getFullYear() + totalCurrentIncrements);
    checkDays.push(date.toLocaleDateString("fi-FI"));
  });

  return checkDays;
};

/**
 * Check if the lease is an A-typed lease.
 * old_dwellings_in_housing_companies_price_index is only available for A-typed leases.
 * @param {Lease} lease
 * @returns {string}
 */
export const isATypedLease = (leaseTypeIdentifier: string): boolean => {
  const identifier = leaseTypeIdentifier || "";
  return identifier[0] === "A";
};

/**
 * Get text for Periodic Rent Adjustment's price index's point figure's year and value from:
 * - rent if they have been saved there before, or
 * - lease's start date.
 */
export const getPointFigureFormText = (
  pointFigures: IndexPointFigureYearly[],
  leaseStartDate: string,
  yearFromRent: number | undefined,
  valueFromRent: number | undefined,
): string => {
  if (yearFromRent && valueFromRent)
    return `${yearFromRent} * ${valueFromRent}`;

  const { year: yearFromLease, value: valueFromLease } =
    getPointFigureYearAndValueFromLease(pointFigures, leaseStartDate);
  if (yearFromLease && valueFromLease)
    return `${yearFromLease} * ${valueFromLease}`;

  return "Indeksipisteluku puuttuu";
};

/**
 * Get year and value for Periodic Rent Adjustment's price index's point figure
 * based on lease start year.
 *
 * Periodic Rent Adjustment uses the point figure value of year previous from
 * lease's start date, e.g. 2023 if lease starts in 2024.
 */
const getPointFigureYearAndValueFromLease = (
  pointFigures: IndexPointFigureYearly[],
  leaseStartDate: string,
): { value?: number; year?: number } => {
  const leaseStartYear = new Date(leaseStartDate).getFullYear();
  const figure =
    pointFigures?.find(
      (point_figure: IndexPointFigureYearly) =>
        point_figure.year == leaseStartYear - 1,
    ) || null;
  if (!figure) return {};
  return { value: figure.value, year: figure.year };
};
