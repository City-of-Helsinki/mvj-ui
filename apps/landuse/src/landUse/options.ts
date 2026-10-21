/** Shared form types and legacy fixture constants; live backend choices come from landuse metadata/lookups. */

export const MUNICIPALITY_OPTIONS = [{ label: "Helsinki", value: "1" }];

export const LAND_USE_NEGOTIATION_PHASES = {
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN_PROGRESS",
  NEGOTIATION: "NEGOTIATION",
  DECISION: "DECISION",
  SIGNATURE: "SIGNATURE",
  NO_AGREEMENT: "NO_AGREEMENT",
} as const;

export type LandUseNegotiationPhase =
  (typeof LAND_USE_NEGOTIATION_PHASES)[keyof typeof LAND_USE_NEGOTIATION_PHASES];

export const landUseNegotiationPhaseOptions = Object.values(
  LAND_USE_NEGOTIATION_PHASES,
).map((value) => ({
  label: value,
  value,
}));

export const LAND_USE_GUARANTEE_TYPES = {
  PANTTIKIRJA: "MORTGAGE_DEED",
  RAHAVAKUUS: "CASH_DEPOSIT",
  OMAVELKAINEN_TAKAUS: "PERSONAL_GUARANTEE",
  TILIVAROJEN_PANTTAUS: "DEPOSIT_PLEDGE",
  MUU_VAKUUS: "OTHER",
} as const;

export type LandUseGuaranteeType =
  (typeof LAND_USE_GUARANTEE_TYPES)[keyof typeof LAND_USE_GUARANTEE_TYPES];

export const landUseGuaranteeTypeOptions: {
  label: string;
  value: LandUseGuaranteeType;
}[] = Object.values(LAND_USE_GUARANTEE_TYPES).map((value) => ({
  label: value,
  value,
}));

export const landUseGuaranteeVierasvelkapanttausOptions = [
  { label: "Kyllä", value: "Kyllä" },
  { label: "Ei", value: "Ei" },
];

export const ASEMAKAAVA_KASITTELYVAIHE_OPTIONS = [
  "DRAFT",
  "EFFECTIVE",
  "REVOKED",
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
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  PAID: "PAID",
  CREDITED: "CREDITED",
} as const;

export type LandUseInvoiceStatus =
  (typeof LAND_USE_INVOICE_STATUSES)[keyof typeof LAND_USE_INVOICE_STATUSES];

export const LAND_USE_PAYMENT_SCHEDULE_STATUSES = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type LandUsePaymentScheduleStatus =
  (typeof LAND_USE_PAYMENT_SCHEDULE_STATUSES)[keyof typeof LAND_USE_PAYMENT_SCHEDULE_STATUSES];

export interface LandUseInvoiceItem {
  description: string;
  itemType: string;
  amountExcludingVat: string;
}

export const LAND_USE_INVOICE_TYPES = {
  MAANKAYTTOKORVAUS: "LAND_USE_COMPENSATION",
  SAKKO: "PENALTY",
} as const;

export type LandUseInvoiceType =
  (typeof LAND_USE_INVOICE_TYPES)[keyof typeof LAND_USE_INVOICE_TYPES];

export interface LandUseInvoice {
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
}

export const LAND_USE_INVOICE_ITEM_TYPES = {
  MAANKAYTTOKORVAUS: "LAND_USE_COMPENSATION",
  KOROTUS: "INCREASE",
  KORKO: "INTEREST",
  SAKKO: "PENALTY",
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

