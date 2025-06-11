import { Classification, LeaseState } from "@/leases/enums";
import type { Action, ApiResponse, Attributes, Methods, User } from "@/types";
import type { ServiceUnit } from "@/serviceUnits/types";
import type { AreaSearch } from "@/areaSearch/types";
import type { PlotSearch } from "@/plotSearch/types";

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
export type Lease = {
  id: number;
  application_metadata: Record<string, any>;
  area_notes: Array<Record<string, any>>;
  area_searches: Array<AreaSearch>;
  basis_of_rents: Array<Record<string, any>>;
  building_selling_price: number | null;
  classification: (typeof Classification)[keyof typeof Classification];
  collection_court_decisions: Array<Record<string, any>>;
  collection_letters: Array<Record<string, any>>;
  collection_notes: Array<Record<string, any>>;
  contracts: Array<Record<string, any>>;
  conveyance_number: number | null;
  created_at: string;
  decisions: Array<Record<string, any>>;
  deleted: string | null;
  deleted_by_cascade: boolean;
  district: Array<Record<string, any>>;
  email_logs: Array<Record<string, any>>;
  end_date: string | null;
  financing: number | null;
  hitas: number | null;
  identifier: Record<string, any>;
  infill_development_compensations: Array<Record<string, any>>;
  inspections: Array<Record<string, any>>;
  intended_use: IntendedUse;
  intended_use_note: string | null;
  internal_order: string | null;
  invoice_notes: Array<Record<string, any>>;
  invoicing_enabled_at: string | null;
  rent_info_completed_at: string | null;
  is_subject_to_vat: boolean;
  lease_areas: Array<LeaseArea>;
  lessor: Record<string, any>;
  management: Record<string, any> | null;
  matching_basis_of_rents: Array<Record<string, any>>;
  modified_at: string | null;
  municipality: Record<string, any>;
  note: string | null;
  notice_note: string | null;
  notice_period: number | null;
  plot_searches: Array<PlotSearch>;
  preparer: User | null;
  real_estate_developer: string | null;
  reference_number: string | null;
  regulated: boolean | null;
  regulation: Record<string, any> | null;
  related_leases: Array<RelatedLeases>;
  related_plot_applications: Array<Record<string, any>>;
  rents: Array<Record<string, any>>;
  reservation_procedure: Record<string, any> | null;
  service_unit: ServiceUnit;
  special_project: Record<string, any> | null;
  start_date: string | null;
  state: (typeof LeaseState)[keyof typeof LeaseState];
  statistical_use: Record<string, any> | null;
  supportive_housing: Record<string, any> | null;
  target_statuses: Array<Record<string, any>>;
  tenants: Array<Record<string, any>>;
  transferable: boolean | null;
  type: Record<string, any>;
};
export type LeaseList = ApiResponse;
export type LeaseId = number;
export type RelatedLeases = {
  related_from: Array<Record<string, any>>;
  related_to: Array<Record<string, any> & { to_lease: Lease }>;
};
export type RelatedPlotApplicationFormValues = {
  object_id: number;
  content_type_model: string;
  // lease id not included, because it will be received after submission
};
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
export type CreateLeaseRelateTo = {
  value: number;
  label: string;
};
export type CreateLeaseFormValues = Lease & {
  relate_to: CreateLeaseRelateTo;
  application_received_at: string;
  area_search_id: number | null;
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
  is_active: boolean;
  name: string;
  name_en: string | null;
  name_fi: string | null;
  name_sv: string | null;
  service_unit: ServiceUnit["id"];
};

export type PeriodicRentAdjustmentType =
  | "TASOTARKISTUS_20_20"
  | "TASOTARKISTUS_20_10";

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
