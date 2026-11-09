/** Shared form types and legacy fixture constants; live backend choices come from landuse metadata/lookups. */

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

// TODO delete this unused mock
export const landUseAsemakaavaListItems: AsemakaavaListItem[] = [
  {
    asemakaavanNumero: "0000412",
    asemakaavanKasittelyvaihe: "Vireillä",
    vahvistamisHyvaksymisPvm: "27.03.2025",
    asemakaavanLainvoimaisuusPvm: undefined,
    asemakaavanHyvaksyjä: "Henkilö 2",
    asemakaavanDiaarinumero: "HEL 1035-880164",
  },
  {
    asemakaavanNumero: "0000623",
    asemakaavanKasittelyvaihe: "Lainvoimainen",
    vahvistamisHyvaksymisPvm: "14.09.2025",
    asemakaavanLainvoimaisuusPvm: "01.11.2025",
    asemakaavanHyvaksyjä: "Henkilö 4",
    asemakaavanDiaarinumero: "HEL 5512-972406",
  },
  {
    asemakaavanNumero: "0000891",
    asemakaavanKasittelyvaihe: "Kumottu",
    vahvistamisHyvaksymisPvm: "01.01.2010",
    asemakaavanLainvoimaisuusPvm: "01.01.2010",
    asemakaavanHyvaksyjä: "Henkilö 6",
    asemakaavanDiaarinumero: "HEL 6689-451392",
  },
];

export const LAND_USE_INVOICE_STATUSES = {
  DRAFT: "draft",
  OPEN: "open",
  PAID: "paid",
  CREDITED: "credited",
} as const;

export type LandUseInvoiceStatus =
  (typeof LAND_USE_INVOICE_STATUSES)[keyof typeof LAND_USE_INVOICE_STATUSES];

export const LAND_USE_PAYMENT_SCHEDULE_STATUSES = {
  DRAFT: "draft",
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type LandUsePaymentScheduleStatus =
  (typeof LAND_USE_PAYMENT_SCHEDULE_STATUSES)[keyof typeof LAND_USE_PAYMENT_SCHEDULE_STATUSES];

export interface LandUseInvoiceItem {
  id?: string;
  description: string;
  itemType: string;
  amountExcludingVat: string;
}

export interface LandUseInvoicePayment {
  id: string;
  paidAmount: string;
  paidDate: string;
  filingCode: string;
}

export const LAND_USE_INVOICE_TYPES = {
  MAANKAYTTOKORVAUS: "land_use_compensation",
  SAKKO: "penalty",
} as const;

export type LandUseInvoiceType =
  (typeof LAND_USE_INVOICE_TYPES)[keyof typeof LAND_USE_INVOICE_TYPES];

export interface LandUseInvoice {
  id?: string;
  recipientPartyIndex: string | undefined;
  contractIndex: string | undefined;
  installmentNumber: string;
  installmentTotal: string;
  signedDate: string;
  asemakaavanLainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
  dueDate: string;
  laskentajaksonAlkupvm: string;
  laskentajaksonLoppupvm: string;
  invoiceNumber: string;
  type: LandUseInvoiceType | undefined;
  status: LandUseInvoiceStatus | undefined;
  sentAt?: string;
  billedAmount: string;
  remainingAmount: string;
  invoiceItems?: LandUseInvoiceItem[];
  payments?: LandUseInvoicePayment[];
}

export const LAND_USE_INVOICE_ITEM_TYPES = {
  MAANKAYTTOKORVAUS: "land_use_compensation",
  KOROTUS: "increase",
  KORKO: "interest",
  SAKKO: "penalty",
} as const;

export type LandUseInvoiceItemType =
  (typeof LAND_USE_INVOICE_ITEM_TYPES)[keyof typeof LAND_USE_INVOICE_ITEM_TYPES];

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
