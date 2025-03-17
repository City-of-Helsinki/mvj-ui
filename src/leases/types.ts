import type { Action, ApiResponse, Attributes, Methods } from "@/types";
import type { ServiceUnit } from "@/serviceUnits/types";
import type { PeriodicRentAdjustmentPriceIndex } from "@/periodicRentAdjustmentPriceIndex/types";

export type LeaseState = {
  attributes: Attributes;
  byId: Record<string, any>;
  collapseStates: Record<string, any>;
  current: Lease;
  isAttachDecisionModalOpen: boolean;
  isCreateModalOpen: boolean;
  isFormValidById: Record<string, any>;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingByBBox: boolean;
  isFetchingById: Record<string, any>;
  isFetchingAttributes: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  list: LeaseList;
  listByBBox: LeaseList;
  methods: Methods;
  leasesForContractNumbers: LeaseList;
  isFetchingLeasesForContractNumbers: boolean;
};
export type Lease = Record<string, any>;
export type LeaseList = ApiResponse;
export type LeaseId = number;
// Lease area object as expected from API response
export type LeaseArea = {
  id: number;
  identifier: string;
  area: number;
  section_area: number | null;
  geometry: Record<string, any> | null;
  addresses: Array<LeaseAreaAddress>;
  type: string;
  location: string;
  plots: Array<Record<string, any>>; // TODO type for Plot
  plan_units: Array<Record<string, any>>; // TODO type for PlanUnit
  preconstruction_state: string | null; // TODO enum type for ConstructabilityState
  preconstruction_estimated_construction_readiness_moment: string | null;
  preconstruction_inspection_moment: string | null;
  demolition_state: string | null; // ConstructabilityState
  polluted_land_state: string | null; // ConstructabilityState
  polluted_land_rent_condition_state: string | null; // TODO enum type for PollutedLandRentConditionState
  polluted_land_rent_condition_date: string | null;
  polluted_land_planner: Record<string, any> | null; // TODO type for User as in backend
  polluted_land_projectwise_number: string | null;
  constructability_report_state: string | null; // ConstructabilityState
  constructability_report_investigation_state: string | null; // TODO enum type for ConstructabilityReportInvestigationState
  constructability_report_signing_date: string | null;
  constructability_report_signer: string | null;
  constructability_descriptions: Array<Record<string, any>>; // TODO type for ConstructabilityDescription
  other_state: string | null; // ConstructabilityState
  archived_decision: Record<string, any>; // TODO type for Decision
  archived_at: string | null;
  archived_note: string | null;
  attachments: Array<Record<string, any>>; // TODO type for LeaseAreaAttachment
  custom_detailed_plan: Record<string, any>; // TODO type for CustomDetailedPlan
};
// Lease area address object as expected from API response
export type LeaseAreaAddress = {
  id: number;
  address: string;
  postal_code: string | null;
  city: string | null;
  is_primary: boolean;
};
export type CreateChargePayload = {
  leaseId: LeaseId;
  data: Record<string, any>;
};
export type FetchSingleLeaseAfterEditPayload = {
  leaseId: LeaseId;
  callbackFunctions?: Array<
    Record<string, any> | ((...args: Array<any>) => any)
  >;
};
export type ReceivableType = {
  id: number;
  name: string;
  is_active: boolean;
  service_unit_id: ServiceUnit["id"];
};
export type SendEmailPayload = {
  type: string;
  lease: LeaseId;
  recipients: Array<number>;
  text: string;
};
export type IntendedUse = {
  id: number;
  name: string;
  service_unit: ServiceUnit["id"];
};
export type PeriodicRentAdjustmentType =
  | "TASOTARKISTUS_20_20"
  | "TASOTARKISTUS_20_10";
export type PeriodicRentAdjustment = {
  id: number;
  adjustment_type: PeriodicRentAdjustmentType;
  price_index: PeriodicRentAdjustmentPriceIndex;
  starting_point_figure: number;
};

export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type FetchLeasesAction = Action<string, Record<string, any>>;
export type FetchLeasesByBBoxAction = Action<string, Record<string, any>>;
export type ReceiveLeasesAction = Action<string, LeaseList>;
export type ReceiveLeasesByBBoxAction = Action<string, LeaseList>;
export type FetchSingleLeaseAction = Action<string, LeaseId>;
export type FetchSingleLeaseAfterEditAction = Action<
  string,
  FetchSingleLeaseAfterEditPayload
>;
export type ReceiveSingleLeaseAction = Action<string, Lease>;
export type FetchLeaseByIdAction = Action<string, LeaseId>;
export type ReceiveLeaseByIdAction = Action<string, Lease>;
export type CreateLeaseAction = Action<string, Lease>;
export type CreateLeaseAndUpdateCurrentLeaseAction = Action<string, Lease>;
export type DeleteLeaseAction = Action<string, LeaseId>;
export type PatchLeaseAction = Action<string, Lease>;
export type PatchLeaseInvoiceNotesAction = Action<string, Lease>;
export type StartInvoicingAction = Action<string, LeaseId>;
export type StopInvoicingAction = Action<string, LeaseId>;
export type SetRentInfoCompleteAction = Action<string, LeaseId>;
export type SetRentInfoUncompleteAction = Action<string, LeaseId>;
export type LeaseAttributesNotFoundAction = Action<string, void>;
export type LeaseNotFoundAction = Action<string, void>;
export type NotFoundByBBoxAction = Action<string, void>;
export type LeaseNotFoundByIdAction = Action<string, LeaseId>;
export type SendEmailAction = Action<string, SendEmailPayload>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type HideCreateModalAction = Action<string, void>;
export type ShowCreateModalAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type CopyAreasToContractAction = Action<string, LeaseId>;
export type CopyDecisionToLeasesAction = Action<string, Record<string, any>>;
export type HideAttachDecisionModalAction = Action<string, void>;
export type ShowAttachDecisionModalAction = Action<string, void>;
export type CreateChargeAction = Action<string, CreateChargePayload>;
export type ReceiveFormValidFlagsAction = Action<string, Record<string, any>>;
export type ClearFormValidFlagsAction = Action<string, void>;
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
export type FetchLeasesForContractNumberAction = Action<
  string,
  Record<string, any>
>;
export type ReceiveLeasesForContractNumbersAction = Action<string, LeaseList>;
export type DueDate = {
  id: number;
  day: number;
  month: number;
};
