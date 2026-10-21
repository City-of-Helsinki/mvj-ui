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
    | "DRAFT"
    | "IN_PROGRESS"
    | "NEGOTIATION"
    | "DECISION"
    | "SIGNATURE"
    | "NO_AGREEMENT"
  >[];
  detailed_plan_processing_stages: LandUseChoice<
    "DRAFT" | "EFFECTIVE" | "REVOKED"
  >[];
  party_types: LandUseChoice<"COMPANY" | "PERSON">[];
  agreement_party_roles: LandUseChoice<"LAND_OWNER" | "DEVELOPER">[];
  contract_types: LandUseChoice<
    "LAND_USE_AGREEMENT" | "REAL_ESTATE_PRELIMINARY_AGREEMENT" | "OTHER"
  >[];
  collateral_types: LandUseChoice<
    | "MORTGAGE_DEED"
    | "CASH_DEPOSIT"
    | "PERSONAL_GUARANTEE"
    | "DEPOSIT_PLEDGE"
    | "OTHER"
  >[];
  collateral_document_categories: LandUseChoice<"ELECTRONIC" | "PAPER">[];
  mortgage_deed_collateral_targets: LandUseChoice<"PROPERTY" | "FACILITY">[];
  decision_makers: LandUseChoice<
    "LAND_MANAGER" | "URBAN_ENVIRONMENT_COMMITTEE" | "CITY_BOARD"
  >[];
  decision_types: LandUseChoice<
    "EASEMENT_CONDITION_ADDITION" | "LAND_USE_AGREEMENT_APPROVAL"
  >[];
  decision_condition_types: LandUseChoice<
    "EASEMENT_OR_EASEMENT_LIKE_CONDITION" | "OTHER"
  >[];
  invoice_types: LandUseChoice<"LAND_USE_COMPENSATION" | "PENALTY">[];
  invoice_statuses: LandUseChoice<"DRAFT" | "OPEN" | "PAID" | "CREDITED">[];
  invoice_item_types: LandUseChoice<
    "LAND_USE_COMPENSATION" | "INCREASE" | "INTEREST" | "PENALTY"
  >[];
  payment_schedule_statuses: LandUseChoice<
    "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
  >[];
  payment_schedule_item_types: LandUseChoice<
    "LAND_USE_COMPENSATION" | "INCREASE" | "INTEREST"
  >[];
  preservation_designations: LandUseChoice<"SR1" | "SR2" | "SR3">[];
  languages: LandUseChoice<"fi" | "sv" | "en">[];
  countries: LandUseChoice[];
};

export type AgreementResponse = {
  id: number;
  identifier: string;
  agreement_type: string;
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
