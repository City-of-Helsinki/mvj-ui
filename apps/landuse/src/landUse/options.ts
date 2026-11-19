/** Shared form types and legacy fixture constants; live backend choices come from landuse metadata/lookups. */

import { SelectedPartyInvoiceData } from "@/landUse/api/landUseTypes";

export const MUNICIPALITY_OPTIONS = [{ label: "Helsinki", value: "1" }];

export const LAND_USE_NEGOTIATION_PHASES = {
  DRAFT: "draft",
  IN_PROGRESS: "in_progress",
  NEGOTIATION: "negotiation",
  DECISION: "decision",
  SIGNATURE: "signature",
  NO_AGREEMENT: "no_agreement",
} as const;

export type LandUseNegotiationPhase =
  (typeof LAND_USE_NEGOTIATION_PHASES)[keyof typeof LAND_USE_NEGOTIATION_PHASES];

export const landUseNegotiationPhaseOptions = Object.values(
  LAND_USE_NEGOTIATION_PHASES,
).map((value) => ({
  label: value,
  value,
}));

export const COLLATERAL_TYPES = {
  PANTTIKIRJA: "mortgage_document",
  RAHAVAKUUS: "financial_guarantee",
  OMAVELKAINEN_TAKAUS: "self_debtor_guarantee",
  TILIVAROJEN_PANTTAUS: "pledge_of_funds",
  MUU_VAKUUS: "other",
} as const;

export type CollateralType =
  (typeof COLLATERAL_TYPES)[keyof typeof COLLATERAL_TYPES];

export const collateralTypeOptions: {
  label: string;
  value: CollateralType;
}[] = Object.values(COLLATERAL_TYPES).map((value) => ({
  label: value,
  value,
}));

export const landUseGuaranteeVierasvelkapanttausOptions = [
  { label: "Kyllä", value: "Kyllä" },
  { label: "Ei", value: "Ei" },
];

export const ASEMAKAAVA_KASITTELYVAIHE_OPTIONS = [
  "draft",
  "effective",
  "revoked",
] as const;

export type AsemakaavaKasittelyvaihe = string;

export interface AsemakaavaListItem {
  asemakaavanNumero: string;
  asemakaavanKasittelyvaihe: AsemakaavaKasittelyvaihe;
  vahvistamisHyvaksymisPvm: string;
  asemakaavanHyvaksyjä: string;
  asemakaavanDiaarinumero: string;
  asemakaavanLainvoimaisuusPvm: string | undefined;
}

export const INVOICE_STATUSES = {
  DRAFT: "draft",
  WAITING_TO_BE_SENT: "waiting_to_be_sent",
  OPEN: "open",
  PAID: "paid",
  CREDITED: "credited",
} as const;

export type InvoiceStatus =
  (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES];

export const INVOICE_STATUSES_ALLOWED_BEFORE_SAP_EXPORT: ReadonlySet<InvoiceStatus> =
  new Set([INVOICE_STATUSES.DRAFT, INVOICE_STATUSES.WAITING_TO_BE_SENT]);

export const PAYMENT_SCHEDULE_STATUSES = {
  DRAFT: "draft",
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type PaymentScheduleStatus =
  (typeof PAYMENT_SCHEDULE_STATUSES)[keyof typeof PAYMENT_SCHEDULE_STATUSES];

export interface InvoiceItem {
  id?: string;
  description: string;
  itemType: string;
  amountExcludingVat: string;
}

export interface InvoicePayment {
  id: string;
  paidAmount: string;
  paidDate: string;
  filingCode: string;
}

export const INVOICE_TYPES = {
  MAANKAYTTOKORVAUS: "land_use_compensation",
  SAKKO: "penalty",
} as const;

export type InvoiceType = (typeof INVOICE_TYPES)[keyof typeof INVOICE_TYPES];

export interface Invoice {
  id?: string;
  recipientSnapshot?: SelectedPartyInvoiceData;
  recipientPartyIndex: string | undefined;
  contractIndex: string | undefined;
  installmentNumber: string;
  installmentTotal: string;
  signedDate: string;
  asemakaavanLainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
  dueDate: string;
  laskentajaksonAlkupvm: string;
  laskentajaksonLoppupvm: string;
  invoiceNumber: number | undefined;
  type: InvoiceType | undefined;
  status: InvoiceStatus | undefined;
  sentAt?: string;
  billedAmount: string;
  remainingAmount: string;
  invoiceItems?: InvoiceItem[];
  payments?: InvoicePayment[];
}

export type PaymentScheduleInstallment = Omit<
  Invoice,
  | "invoiceNumber"
  | "recipientSnapshot"
  | "status"
  | "sentAt"
  | "billedAmount"
  | "remainingAmount"
  | "payments"
  | "invoiceItems"
> & {
  items?: InvoiceItem[];
  invoice?: Pick<
    Invoice,
    | "id"
    | "invoiceNumber"
    | "recipientSnapshot"
    | "recipientPartyIndex"
    | "installmentNumber"
    | "installmentTotal"
    | "dueDate"
    | "type"
    | "status"
    | "sentAt"
    | "billedAmount"
    | "remainingAmount"
    | "invoiceItems"
    | "payments"
  >;
};

export const INVOICE_ITEM_TYPES = {
  MAANKAYTTOKORVAUS: "land_use_compensation",
  KOROTUS: "increase",
  KORKO: "interest",
  SAKKO: "penalty",
} as const;

export type InvoiceItemType =
  (typeof INVOICE_ITEM_TYPES)[keyof typeof INVOICE_ITEM_TYPES];

// Only 365 is supported for now; additional entries can be added later without
// requiring further changes to the payment schedule UI.
export const INTEREST_CALCULATION_DAYS_IN_YEAR = {
  DAYS_365: "365",
} as const;

export type InterestCalculationDaysInYear =
  (typeof INTEREST_CALCULATION_DAYS_IN_YEAR)[keyof typeof INTEREST_CALCULATION_DAYS_IN_YEAR];

export const interestCalculationDaysInYearOptions = Object.values(
  INTEREST_CALCULATION_DAYS_IN_YEAR,
).map((value) => ({ label: value, value }));
