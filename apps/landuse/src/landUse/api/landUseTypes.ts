export const LAND_USE_TAB_KEYS = [
  "summary",
  "parties",
  "compensations",
  "collaterals",
  "monitoring",
  "decisions",
  "contracts",
  "paymentSchedule",
  "billing",
] as const;

export type LandUseTabKey = (typeof LAND_USE_TAB_KEYS)[number];

export type District = {
  id: number;
  name: string;
  identifier: string;
};

export type LandUseChoice<Code extends string = string> = {
  value: Code;
  label: string;
};

export type LandUseDecimalString = string;
export type NullableLandUseDecimalString = LandUseDecimalString | null;

export type LandUseUiMetadata = {
  agreement_statuses: LandUseChoice<
    | "draft"
    | "in_progress"
    | "negotiation"
    | "decision"
    | "signature"
    | "no_agreement"
  >[];
  detailed_plan_processing_stages: LandUseChoice<
    "draft" | "effective" | "revoked"
  >[];
  party_types: LandUseChoice<"company" | "person">[];
  agreement_party_roles: LandUseChoice<"land_owner" | "developer">[];
  contract_types: LandUseChoice<
    "land_use_agreement" | "real_estate_preliminary_agreement" | "other"
  >[];
  collateral_types: LandUseChoice<
    | "mortgage_document"
    | "financial_guarantee"
    | "self_debtor_guarantee"
    | "pledge_of_funds"
    | "other"
  >[];
  collateral_document_categories: LandUseChoice<"electronic" | "paper">[];
  mortgage_deed_collateral_targets: LandUseChoice<"property" | "facility">[];
  decision_makers: LandUseChoice<
    "land_manager" | "urban_environment_committee" | "city_board"
  >[];
  decision_types: LandUseChoice<
    "easement_condition_addition" | "land_use_agreement_approval"
  >[];
  decision_condition_types: LandUseChoice<
    "easement_or_easement_like_condition" | "other"
  >[];
  invoice_types: LandUseChoice<"land_use_compensation" | "penalty">[];
  invoice_statuses: LandUseChoice<"draft" | "open" | "paid" | "credited">[];
  invoice_item_types: LandUseChoice<
    "land_use_compensation" | "increase" | "interest" | "penalty"
  >[];
  payment_schedule_statuses: LandUseChoice<
    "draft" | "pending_approval" | "approved" | "rejected"
  >[];
  payment_schedule_item_types: LandUseChoice<
    "land_use_compensation" | "increase" | "interest"
  >[];
  preservation_designations: LandUseChoice<"sr1" | "sr2" | "sr3">[];
  languages: LandUseChoice<"fi" | "sv" | "en">[];
  countries: LandUseChoice[];
};

export type AgreementResponse = {
  id: number;
  identifier: string;
  district: number | null;
  is_promotion_area: boolean;
  status: LandUseUiMetadata["agreement_statuses"][number]["value"] | "";
  estimated_presentation_year: number | null;
  estimated_payment_year: number | null;
  includes_housing_obligations: boolean;
  obligations_deadline: string | null;
  authorized_signatory: number | null;
  detailed_plan: number | null;
  detailed_plan_sites: string[];
  collateral_multiplier: string | null;
  created_at: string;
  modified_at: string;
};

export type AgreementStatusCode =
  LandUseUiMetadata["agreement_statuses"][number]["value"];

export type DetailedPlanResponse = {
  id: number;
  plan_number: string;
  processing_stage:
    LandUseUiMetadata["detailed_plan_processing_stages"][number]["value"] | "";
  approval_date: string | null;
  effective_date: string | null;
  approver: string;
  diary_number: string;
};

export type LandUseNamedLookup = {
  id: number;
  name: string;
};

export type LandPolicyProgramLookup = LandUseNamedLookup & {
  default_discount_percentage: string;
};

export type DecisionResponse = {
  id: number;
  title: string;
  decision_maker: LandUseUiMetadata["decision_makers"][number]["value"] | "";
  decision_date: string | null;
  section: number | null;
  decision_type: LandUseUiMetadata["decision_types"][number]["value"] | "";
  diary_number: string;
  note: string;
  conditions: {
    id: number;
    condition_type:
      LandUseUiMetadata["decision_condition_types"][number]["value"] | "";
    supervision_date: string | null;
    supervised_date: string | null;
    note: string;
  }[];
};

export type ContractTypeCode =
  LandUseUiMetadata["contract_types"][number]["value"];
export type CollateralTypeCode =
  LandUseUiMetadata["collateral_types"][number]["value"];
export type InvoiceTypeCode =
  LandUseUiMetadata["invoice_types"][number]["value"];
export type InvoiceStatusCode =
  LandUseUiMetadata["invoice_statuses"][number]["value"];
export type InvoiceItemTypeCode =
  LandUseUiMetadata["invoice_item_types"][number]["value"];
export type PaymentScheduleStatusCode =
  LandUseUiMetadata["payment_schedule_statuses"][number]["value"];
export type PaymentScheduleItemTypeCode =
  LandUseUiMetadata["payment_schedule_item_types"][number]["value"];
