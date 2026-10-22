import type { LandUseCompensationsFormValues } from "@/landUse/components/tabs/LandUseCompensations";
import type { LandUseCollateralsFormValues } from "@/landUse/components/tabs/LandUseCollaterals";
import type { LandUseContractsFormValues } from "@/landUse/components/tabs/LandUseContracts";
import type { LandUseDecisionsFormValues } from "@/landUse/components/tabs/LandUseDecisions";
import type { LandUseBillingFormValues } from "@/landUse/components/tabs/LandUseBilling";
import type { LandUsePaymentScheduleFormValues } from "@/landUse/components/tabs/LandUsePaymentSchedule";
import type { LandUseMonitoringFormValues } from "@/landUse/components/tabs/LandUseMonitoring";
import type { LandUsePartiesFormValues } from "@/landUse/components/tabs/LandUseParties";
import type { LandUseSummaryFormValues } from "@/landUse/components/tabs/LandUseSummary";
import type { Guarantee } from "@/landUse/components/collateralForms";
import { LAND_USE_INVOICE_TYPES} from "@/landUse/options";
import {
  createLandUseIdentifier,
  getNextLandUseSequence,
} from "@/landUse/utils/landUseIdentifier";
import type { LandUseListItem } from "@/landUse/api/landUseListTypes";
import {
  parseIsoDateToFinnishDate,
  parseFinnishDateToIsoDate,
} from "@/landUse/utils/date";
import {
  callApiGetAllPages,
  callApiGet,
  callApiPatch,
  callApiPost,
  callApiPut,
} from "@/landUse/api/fetchClient";
import type {
  DecisionResponse,
  DetailedPlanResponse,
  District,
  CollateralTypeCode,
  ContractTypeCode,
  AgreementStatusCode,
  InvoiceItemTypeCode,
  InvoiceStatusCode,
  InvoiceTypeCode,
  LandPolicyProgramLookup,
  LandUseNamedLookup,
  LandUseUiMetadata,
  NullableLandUseDecimalString,
  PaymentScheduleItemTypeCode,
  PaymentScheduleStatusCode,
} from "@/landUse/api/landUseTypes";

type AgreementOverviewResponse = AgreementListResponse & {
  detailed_plan_sites: string[];
  includes_housing_obligations: boolean;
  obligations_deadline: string | null;
  authorized_signatory: { id: number; name: string } | null;
  detailed_plan: DetailedPlanResponse | null;
  addresses: {
    street_address: string;
    postal_code: string;
    city: string;
  }[];
  preparers: { preparer: number; preparer_name: string }[];
};

type AgreementListResponse = {
  id: number;
  identifier: string;
  agreement_type: string;
  district: District | null;
  is_promotion_area: boolean;
  status: AgreementStatusCode | "";
  estimated_presentation_year: number | null;
  estimated_payment_year: number | null;
};

type AgreementCreateResponse = {
  id: number;
};

type AgreementUpdateRequest = {
  detailed_plan: number | null;
  authorized_signatory: number | null;
  addresses: AgreementOverviewResponse["addresses"];
  preparers: { preparer: number }[];
  detailed_plan_sites: string[];
  agreement_type: string;
  is_promotion_area: boolean;
  status: AgreementStatusCode | "";
  estimated_presentation_year: number | null;
  estimated_payment_year: number | null;
  includes_housing_obligations: boolean;
  obligations_deadline: string | null;
};

type PartyResponse = {
  id: number;
  party_type: LandUseUiMetadata["party_types"][number]["value"] | "";
  name: string;
  national_identification_number: string;
  business_id: string;
  language: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
  care_of: string;
  phone: string;
  email: string;
  note: string;
  role: LandUseUiMetadata["agreement_party_roles"][number]["value"] | "";
  contact_persons: { name: string; phone: string; email: string }[];
  billing_details: {
    ovt_code: string;
    sap_customer_number: string;
    customer_reference: string;
  } | null;
  invoice_recipient: Omit<
    PartyResponse,
    "role" | "contact_persons" | "billing_details" | "invoice_recipient"
  > | null;
};

type CompensationResponse = {
  excel_calculation_url: string | null;
  monetary_compensation: NullableLandUseDecimalString;
  land_compensation: NullableLandUseDecimalString;
  other_compensation: NullableLandUseDecimalString;
  total_compensation: NullableLandUseDecimalString;
  base_price: NullableLandUseDecimalString;
  land_compensation_description: string;
  other_compensation_description: string;
  value_before_detailed_plan_proposal: NullableLandUseDecimalString;
  demolition_or_other_deduction: NullableLandUseDecimalString;
  land_use_compensation: NullableLandUseDecimalString;
  land_policy_program: { id: number; name: string } | null;
  land_policy_program_discount_percentage: NullableLandUseDecimalString;
  public_areas_m2: NullableLandUseDecimalString;
  public_areas_acquisition_value: NullableLandUseDecimalString;
};

type CompensationWriteRequest = {
  excel_calculation_url: string | null;
  monetary_compensation: NullableLandUseDecimalString;
  land_compensation: NullableLandUseDecimalString;
  other_compensation: NullableLandUseDecimalString;
  total_compensation: NullableLandUseDecimalString;
  base_price: NullableLandUseDecimalString;
  land_compensation_description: string;
  other_compensation_description: string;
  value_before_detailed_plan_proposal: NullableLandUseDecimalString;
  demolition_or_other_deduction: NullableLandUseDecimalString;
  land_use_compensation: NullableLandUseDecimalString;
  land_policy_program: number | null;
  land_policy_program_discount_percentage: NullableLandUseDecimalString;
  public_areas_m2: NullableLandUseDecimalString;
  public_areas_acquisition_value: NullableLandUseDecimalString;
};

type AgreementSiteWriteRequest = {
  id?: number;
  identifier: string;
  area_m2: NullableLandUseDecimalString;
  floor_area_kem2: NullableLandUseDecimalString;
  intended_use: number | null;
  tenure_types: number[];
  preservation_designation: string | null;
  has_housing_obligation: boolean;
  unit_price_euro_per_kem2: NullableLandUseDecimalString;
};

type AgreementSiteResponse = {
  id: number;
  identifier: string;
  area_m2: NullableLandUseDecimalString;
  floor_area_kem2: NullableLandUseDecimalString;
  intended_use: { id: number; name: string } | null;
  tenure_types: { id: number; name: string }[];
  preservation_designation: string;
  has_housing_obligation: boolean;
  unit_price_euro_per_kem2: NullableLandUseDecimalString;
};

export const getLandUseUiMetadata = (): Promise<LandUseUiMetadata> =>
  callApiGet<LandUseUiMetadata>("ui-metadata/");

export const getAuthorizedSignatories = (): Promise<LandUseNamedLookup[]> =>
  callApiGetAllPages<LandUseNamedLookup>("authorized-signatories/");

export const getPreparers = async (): Promise<LandUseNamedLookup[]> => {
  const users = await callApiGetAllPages<{
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  }>("officer/", { apiNamespace: "" });

  return users.map((user) => ({
    id: user.id,
    name:
      [user.first_name, user.last_name].filter(Boolean).join(" ") ||
      user.username,
  }));
};

export const getLandPolicyPrograms = (): Promise<LandPolicyProgramLookup[]> =>
  callApiGetAllPages<LandPolicyProgramLookup>("land-policy-programs/");

export const getSiteIntendedUses = (): Promise<LandUseNamedLookup[]> =>
  callApiGetAllPages<LandUseNamedLookup>("site-intended-uses/");

export const getSiteTenureTypes = (): Promise<LandUseNamedLookup[]> =>
  callApiGetAllPages<LandUseNamedLookup>("site-tenure-types/");

type CollateralResponse = {
  id: number;
  guarantee_type: CollateralTypeCode;
  parties: number[];
  document_category?: string;
  target?: string;
  property_identifiers?: { identifier: string }[];
  facility_identifier?: string | null;
  mortgage_deed_number?: string;
  mortgage_deed_date?: string | null;
  subsequent_pledgee_name?: string | null;
  subsequent_pledgee_business_id?: string | null;
  guarantor_name?: string;
  guarantor_business_id?: string;
  guarantor_national_identification_number?: string;
  guarantee_identifier?: string;
  account_number?: string;
  paid_at_date?: string | null;
  third_party_pledger_name: string | null;
  third_party_pledger_business_id: string | null;
  start_date: string | null;
  end_date: string | null;
  amount: string | null;
  returned_date: string | null;
  marked_returned_by: string | null;
  additional_information: string;
};

type ContractResponse = {
  id: number;
  identifier: string;
  signing_date: string | null;
  signing_deadline: string | null;
  first_invitation_sent_date: string | null;
  second_invitation_sent_date: string | null;
  third_invitation_sent_date: string | null;
  executor: string | null;
  decision: number | null;
  note: string;
  title: string;
  contract_type: ContractTypeCode | "";
  changes: Omit<
    ContractResponse,
    | "title"
    | "contract_type"
    | "changes"
    | "mortgage_deed_collaterals"
    | "cash_deposit_collaterals"
    | "personal_guarantee_collaterals"
    | "deposit_pledge_collaterals"
    | "other_collaterals"
  >[];
  mortgage_deed_collaterals: CollateralResponse[];
  cash_deposit_collaterals: CollateralResponse[];
  personal_guarantee_collaterals: CollateralResponse[];
  deposit_pledge_collaterals: CollateralResponse[];
  other_collaterals: CollateralResponse[];
};

type PaymentScheduleResponse = {
  id: number;
  recipient_party: number;
  contract: number;
  status: PaymentScheduleStatusCode;
  rejected_reason: string;
  signing_date: string | null;
  increase_percentage: string | null;
  base_interest_rate: string | null;
  interest_margin: string | null;
  installments: {
    id: number;
    installment_sequence_number: number;
    installment_count_total: number;
    due_date: string | null;
    interest_calculation_period_start_date: string | null;
    interest_calculation_period_end_date: string | null;
    items: {
      id: number;
      item_type: PaymentScheduleItemTypeCode;
      description: string;
      amount: string;
    }[];
  }[];
};

type InvoiceResponse = {
  id: number;
  recipient_party: number;
  source_payment_schedule_installment: number | null;
  installment_sequence_number: number;
  installment_count_total: number;
  due_date: string | null;
  invoice_identifier: string;
  invoice_type: InvoiceTypeCode;
  status: InvoiceStatusCode;
  sent_at: string | null;
  billed_amount: string | null;
  remaining_amount: string | null;
  items: {
    item_type: InvoiceItemTypeCode;
    description: string;
    amount: string;
  }[];
};

const getOptionalYear = (value: string): number | null => {
  const normalized = value.trim();
  if (!normalized) return null;
  if (!/^\d{4}$/.test(normalized)) {
    throw new Error("Invalid year");
  }
  return Number(normalized);
};

const toText = (value: string | number | null | undefined): string =>
  value == null ? "" : String(value);

const mapPartyDetails = (
  party: Omit<
    PartyResponse,
    "role" | "contact_persons" | "billing_details" | "invoice_recipient"
  > &
    Partial<Pick<PartyResponse, "role">>,
) => {
  const details = {
    partyRole: party.role || undefined,
    partyType: party.party_type || undefined,
    name: party.name,
    language: party.language || undefined,
    streetAddress: party.street_address,
    city: party.city,
    postalCode: party.postal_code,
    country: party.country || undefined,
    careOf: party.care_of,
    phone: party.phone,
    email: party.email,
    note: party.note,
  };

  return party.party_type === "PERSON"
    ? {
        ...details,
        nationalIdentificationNumber: party.national_identification_number,
      }
    : { ...details, businessId: party.business_id };
};

export const getAsemakaavat = (): Promise<DetailedPlanResponse[]> =>
  callApiGetAllPages<DetailedPlanResponse>("detailed-plans/");

const mapAgreementOverviewToSummary = (
  agreement: AgreementOverviewResponse,
): LandUseSummaryFormValues => ({
  identifier: agreement.identifier,
  maankayttosopimusType: agreement.agreement_type || undefined,
  kaupunginosa: agreement.district?.name ?? "",
  edistamisalue: agreement.is_promotion_area,
  tila: agreement.status || undefined,
  suunnittelunPerusteenaOlevatKohteet:
    agreement.detailed_plan_sites.length > 0
      ? agreement.detailed_plan_sites.map((value) => ({ value }))
      : [{ value: undefined }],
  valmistelijat: agreement.preparers.map((preparer) => ({
    value: String(preparer.preparer),
  })),
  osoitteet: agreement.addresses.map((address) => ({
    katuosoite: address.street_address,
    postinumero: address.postal_code,
    kaupunki: address.city,
  })),
  arvioituEsittelyvuosi: String(agreement.estimated_presentation_year ?? ""),
  arvioituMaksuvuosi: String(agreement.estimated_payment_year ?? ""),
  toimivaltainenPaattaja: agreement.authorized_signatory
    ? String(agreement.authorized_signatory.id)
    : "",
  sisaltaaAmVelvoitteita: agreement.includes_housing_obligations
    ? "kyllä"
    : "ei",
  velvoitteidenMaaraika: parseIsoDateToFinnishDate(
    agreement.obligations_deadline,
  ),
  detailedPlanId: agreement.detailed_plan?.id ?? null,
  asemakaavanNumero: agreement.detailed_plan?.plan_number ?? "",
  asemakaavanKasittelyvaihe: agreement.detailed_plan?.processing_stage ?? "",
  vahvistamisHyvaksymisPvm: parseIsoDateToFinnishDate(
    agreement.detailed_plan?.approval_date,
  ),
  asemakaavanLainvoimaisuusPvm: parseIsoDateToFinnishDate(
    agreement.detailed_plan?.effective_date,
  ),
  asemakaavanHyvaksyjä: agreement.detailed_plan?.approver ?? "",
  asemakaavanDiaarinumero: agreement.detailed_plan?.diary_number ?? "",
});

export const getSummary = async (
  agreementId: string,
): Promise<LandUseSummaryFormValues> => {
  const agreement = await callApiGet<AgreementOverviewResponse>(
    `agreements/${agreementId}/overview/`,
  );

  return mapAgreementOverviewToSummary(agreement);
};

export const getAgreementIdentifiers = async (): Promise<string[]> => {
  const agreements =
    await callApiGetAllPages<AgreementListResponse>("agreements/");

  return agreements.map((agreement) => agreement.identifier);
};

export const getLandUseList = async (): Promise<LandUseListItem[]> => {
  const agreements =
    await callApiGetAllPages<AgreementListResponse>("agreements/");

  return agreements.map((agreement) => ({
    id: agreement.id,
    identifier: agreement.identifier,
    party: "",
    zoningPlanNumber: "",
    site: "",
    projectArea: agreement.is_promotion_area,
    negotiationPhase: agreement.status,
  }));
};

export const createLandUseAgreement = async (
  municipalityId: string,
  districtId: string,
): Promise<string> => {
  const existingIdentifiers = await getAgreementIdentifiers();
  const sequence = getNextLandUseSequence(
    existingIdentifiers,
    municipalityId,
    districtId,
  );
  const identifier = createLandUseIdentifier(
    municipalityId,
    districtId,
    sequence,
  );

  const agreement = await callApiPost<
    AgreementCreateResponse,
    { identifier: string; district: number }
  >("agreements/", {
    identifier,
    district: Number(districtId),
  });

  return String(agreement.id);
};

export const updateSummary = async (
  agreementId: string,
  values: LandUseSummaryFormValues,
): Promise<LandUseSummaryFormValues> => {
  await callApiPatch<void, AgreementUpdateRequest>(
    `agreements/${agreementId}/`,
    {
      detailed_plan: values.detailedPlanId,
      authorized_signatory: values.toimivaltainenPaattaja
        ? Number(values.toimivaltainenPaattaja)
        : null,
      addresses: values.osoitteet
        .filter(({ katuosoite, postinumero, kaupunki }) =>
          [katuosoite, postinumero, kaupunki].some((value) => value.trim()),
        )
        .map(({ katuosoite, postinumero, kaupunki }) => ({
          street_address: katuosoite.trim(),
          postal_code: postinumero.trim(),
          city: kaupunki.trim(),
        })),
      preparers: values.valmistelijat
        .filter(({ value }) => value?.trim())
        .map(({ value }) => ({ preparer: Number(value) })),
      detailed_plan_sites: values.suunnittelunPerusteenaOlevatKohteet
        .map(({ value }) => value?.trim() ?? "")
        .filter(Boolean),
      agreement_type: values.maankayttosopimusType ?? "",
      is_promotion_area: values.edistamisalue,
      status: values.tila ?? "",
      estimated_presentation_year: getOptionalYear(
        values.arvioituEsittelyvuosi,
      ),
      estimated_payment_year: getOptionalYear(values.arvioituMaksuvuosi),
      includes_housing_obligations: values.sisaltaaAmVelvoitteita === "kyllä",
      obligations_deadline: parseFinnishDateToIsoDate(
        values.velvoitteidenMaaraika,
      ),
    },
  );

  return getSummary(agreementId);
};

export const getParties = async (
  agreementId: string,
): Promise<LandUsePartiesFormValues> => {
  const parties = await callApiGetAllPages<PartyResponse>(
    `agreements/${agreementId}/parties/`,
  );

  return {
    parties: parties.map((party) => ({
      id: String(party.id),
      party: { details: mapPartyDetails(party) },
      contactPersons: party.contact_persons.map((person) => ({
        name: person.name || undefined,
        phone: person.phone,
        email: person.email,
      })),
      billingDetails: {
        ovtCode: party.billing_details?.ovt_code ?? "",
        sapCustomerNumber: party.billing_details?.sap_customer_number ?? "",
        reference: party.billing_details?.customer_reference ?? "",
      },
      ...(party.invoice_recipient
        ? {
            invoiceRecipient: {
              details: mapPartyDetails(party.invoice_recipient),
            },
          }
        : {}),
    })),
  };
};

type PartyDetailsWriteRequest = Omit<
  PartyResponse,
  "id" | "role" | "contact_persons" | "billing_details" | "invoice_recipient"
>;

type PartyWriteRequest = PartyDetailsWriteRequest & {
  id?: number;
  role: string;
  contact_persons: PartyResponse["contact_persons"];
  billing_details: PartyResponse["billing_details"];
  invoice_recipient: PartyDetailsWriteRequest | null;
};

const mapPartyDetailsToRequest = (
  details: LandUsePartiesFormValues["parties"][number]["party"]["details"],
) => ({
  party_type: (details.partyType ??
    "") as PartyDetailsWriteRequest["party_type"],
  name: details.name,
  national_identification_number:
    "nationalIdentificationNumber" in details
      ? details.nationalIdentificationNumber
      : "",
  business_id: "businessId" in details ? details.businessId : "",
  language: details.language ?? "",
  street_address: details.streetAddress,
  postal_code: details.postalCode,
  city: details.city,
  country: details.country ?? "",
  care_of: details.careOf,
  phone: details.phone,
  email: details.email,
  note: details.note,
});

export const updateParties = async (
  agreementId: string,
  values: LandUsePartiesFormValues,
): Promise<LandUsePartiesFormValues> => {
  const payload: PartyWriteRequest[] = values.parties.map((entry) => ({
    ...(entry.id ? { id: Number(entry.id) } : {}),
    ...mapPartyDetailsToRequest(entry.party.details),
    role: entry.party.details.partyRole ?? "",
    contact_persons: entry.contactPersons.map((person) => ({
      name: person.name ?? "",
      phone: person.phone,
      email: person.email,
    })),
    billing_details: {
      ovt_code: entry.billingDetails.ovtCode,
      sap_customer_number: entry.billingDetails.sapCustomerNumber,
      customer_reference: entry.billingDetails.reference,
    },
    invoice_recipient: entry.invoiceRecipient
      ? mapPartyDetailsToRequest(entry.invoiceRecipient.details)
      : null,
  }));
  const parties = await callApiPut<PartyResponse[], PartyWriteRequest[]>(
    `agreements/${agreementId}/parties/`,
    payload,
  );

  return {
    parties: parties.map((party) => ({
      id: String(party.id),
      party: { details: mapPartyDetails(party) },
      contactPersons: party.contact_persons.map((person) => ({
        name: person.name || undefined,
        phone: person.phone,
        email: person.email,
      })),
      billingDetails: {
        ovtCode: party.billing_details?.ovt_code ?? "",
        sapCustomerNumber: party.billing_details?.sap_customer_number ?? "",
        reference: party.billing_details?.customer_reference ?? "",
      },
      ...(party.invoice_recipient
        ? {
            invoiceRecipient: {
              details: mapPartyDetails(party.invoice_recipient),
            },
          }
        : {}),
    })),
  };
};

export const getDistricts = async (): Promise<District[]> => {
  return callApiGetAllPages<District>("districts/");
};

export const getCompensations = async (
  agreementId: string,
): Promise<LandUseCompensationsFormValues> => {
  const [compensation, sites] = await Promise.all([
    callApiGet<CompensationResponse | null>(
      `agreements/${agreementId}/compensation/`,
    ),
    callApiGet<{ agreement_sites: AgreementSiteResponse[] }>(
      `agreements/${agreementId}/sites/`,
    ),
  ]);

  return {
    sites: sites.agreement_sites.map((site) => ({
      id: String(site.id),
      kohteenTunnus: site.identifier,
      pintaAlaM2: toText(site.area_m2),
      kem2: toText(site.floor_area_kem2),
      kayttotarkoitusId: site.intended_use?.id ?? null,
      kayttotarkoitus: site.intended_use?.name,
      hallintamuotoIds: site.tenure_types.map((tenureType) => tenureType.id),
      hallintamuoto: site.tenure_types.map((tenureType) => tenureType.name),
      suojeltu: site.preservation_designation || undefined,
      amVelvoite: site.has_housing_obligation,
    })),
    rahakorvaus: toText(compensation?.monetary_compensation),
    maakorvaus: toText(compensation?.land_compensation),
    muuKorvaus: toText(compensation?.other_compensation),
    maankayttokorvausYhteensa: toText(compensation?.total_compensation),
    perushinta: toText(compensation?.base_price),
    maakorvausSelite: compensation?.land_compensation_description ?? "",
    muuSelite: compensation?.other_compensation_description ?? "",
    excelLaskelmaUrl: compensation?.excel_calculation_url ?? "",
    kaavaehdotustaEdeltavaArvo: toText(
      compensation?.value_before_detailed_plan_proposal,
    ),
    perustietotaulukkoRowsBySiteId: Object.fromEntries(
      sites.agreement_sites.map((site) => [
        String(site.id),
        { yksikkohinta: toText(site.unit_price_euro_per_kem2) },
      ]),
    ),
    purkuTaiMuuVahennys: Number(
      compensation?.demolition_or_other_deduction ?? 0,
    ),
    maankayttokorvaus: toText(compensation?.land_use_compensation),
    maapoliittinenOhjelmaId: compensation?.land_policy_program?.id ?? null,
    maapoliittinenOhjelma: compensation?.land_policy_program?.name,
    huojennusProsentti: toText(
      compensation?.land_policy_program_discount_percentage,
    ),
    yleisetAlueetNeliot: toText(compensation?.public_areas_m2),
    yleisetAlueetHankinnanArvo: toText(
      compensation?.public_areas_acquisition_value,
    ),
  };
};

const parseOptionalDecimal = (
  value: string | number | undefined,
): NullableLandUseDecimalString => {
  if (value === undefined || value === "") return null;
  const normalized = String(value).trim().replace(",", ".");
  if (!normalized) return null;
  return /^-?(?:\d+|\d*\.\d+)$/.test(normalized) ? normalized : null;
};

const parsePreservationDesignation = (value: string | undefined): string | null => {
  if (!value) return null;
  if (!new Set(["SR1", "SR2", "SR3"]).has(value)) {
    throw new Error("Invalid preservation designation");
  }
  return value;
};

export const updateCompensations = async (
  agreementId: string,
  values: LandUseCompensationsFormValues,
): Promise<LandUseCompensationsFormValues> => {
  await callApiPut<
    unknown,
    { compensation: CompensationWriteRequest; sites: AgreementSiteWriteRequest[] }
  >(`agreements/${agreementId}/compensation-with-sites/`, {
    compensation: {
        excel_calculation_url: values.excelLaskelmaUrl || null,
        monetary_compensation: parseOptionalDecimal(values.rahakorvaus),
        land_compensation: parseOptionalDecimal(values.maakorvaus),
        other_compensation: parseOptionalDecimal(values.muuKorvaus),
        total_compensation: parseOptionalDecimal(
          values.maankayttokorvausYhteensa,
        ),
        base_price: parseOptionalDecimal(values.perushinta),
        land_compensation_description: values.maakorvausSelite,
        other_compensation_description: values.muuSelite,
        value_before_detailed_plan_proposal: parseOptionalDecimal(
          values.kaavaehdotustaEdeltavaArvo,
        ),
        demolition_or_other_deduction: parseOptionalDecimal(
          values.purkuTaiMuuVahennys,
        ),
        land_use_compensation: parseOptionalDecimal(values.maankayttokorvaus),
        land_policy_program: values.maapoliittinenOhjelmaId ?? null,
        land_policy_program_discount_percentage: parseOptionalDecimal(
          values.huojennusProsentti,
        ),
        public_areas_m2: parseOptionalDecimal(values.yleisetAlueetNeliot),
        public_areas_acquisition_value: parseOptionalDecimal(
          values.yleisetAlueetHankinnanArvo,
        ),
    },
    sites: values.sites.map((site): AgreementSiteWriteRequest => ({
        ...(Number.isInteger(Number(site.id)) ? { id: Number(site.id) } : {}),
        identifier: site.kohteenTunnus,
        area_m2: parseOptionalDecimal(site.pintaAlaM2),
        floor_area_kem2: parseOptionalDecimal(site.kem2),
        intended_use: site.kayttotarkoitusId ?? null,
        tenure_types: (site.hallintamuotoIds ?? []).map(Number),
        preservation_designation: parsePreservationDesignation(site.suojeltu),
        has_housing_obligation: site.amVelvoite,
        unit_price_euro_per_kem2: parseOptionalDecimal(
          values.perustietotaulukkoRowsBySiteId[site.id]?.yksikkohinta,
        ),
    })),
  });

  return getCompensations(agreementId);
};

export const getCollaterals = async (
  agreementId: string,
): Promise<LandUseCollateralsFormValues> => {
  const agreement = await callApiGet<{ collateral_multiplier: string | null }>(
    `agreements/${agreementId}/`,
  );

  return { korotuskerroin: agreement.collateral_multiplier ?? undefined };
};

export const updateCollaterals = async (
  agreementId: string,
  values: LandUseCollateralsFormValues,
): Promise<LandUseCollateralsFormValues> => {
  await callApiPatch<
    void,
    { collateral_multiplier: NullableLandUseDecimalString }
  >(`agreements/${agreementId}/`, {
    collateral_multiplier: parseOptionalDecimal(
      values.korotuskerroin?.toString(),
    ),
  });

  return getCollaterals(agreementId);
};

export const getMonitoring = async (
  agreementId: string,
): Promise<LandUseMonitoringFormValues | null> => null;

export const getDecisions = async (
  agreementId: string,
): Promise<LandUseDecisionsFormValues> => {
  const decisions = await callApiGetAllPages<DecisionResponse>(
    `agreements/${agreementId}/decisions/`,
  );

  return {
    decisions: decisions.map((decision) => ({
      id: String(decision.id),
      title: decision.title,
      paattaja: decision.decision_maker || undefined,
      paatospvm: parseIsoDateToFinnishDate(decision.decision_date),
      pykala: decision.section == null ? undefined : String(decision.section),
      paatoksenTyyppi: decision.decision_type || undefined,
      diaarinumero: decision.diary_number,
      huomautus: decision.note,
      ehdot: decision.conditions.map((condition) => ({
        conditionType: condition.condition_type || undefined,
        valvontapvm: parseIsoDateToFinnishDate(condition.supervision_date),
        valvottuPvm: parseIsoDateToFinnishDate(condition.supervised_date),
        note: condition.note,
      })),
    })),
  };
};

export const updateDecisions = async (
  agreementId: string,
  values: LandUseDecisionsFormValues,
): Promise<LandUseDecisionsFormValues> => {
  await callApiPut(
    `agreements/${agreementId}/decisions/`,
    (values.decisions ?? []).map((decision) => ({
      ...(decision.id ? { id: Number(decision.id) } : {}),
      title: decision.title,
      decision_maker: decision.paattaja ?? "",
      decision_date: parseFinnishDateToIsoDate(decision.paatospvm),
      section: decision.pykala ? Number(decision.pykala) : null,
      decision_type: decision.paatoksenTyyppi ?? "",
      diary_number: decision.diaarinumero,
      note: decision.huomautus,
      conditions: (decision.ehdot ?? []).map((condition) => ({
        condition_type: condition.conditionType ?? "",
        supervision_date: parseFinnishDateToIsoDate(condition.valvontapvm),
        supervised_date: parseFinnishDateToIsoDate(condition.valvottuPvm),
        note: condition.note,
      })),
    })),
  );
  return getDecisions(agreementId);
};

export const getContracts = async (
  agreementId: string,
): Promise<LandUseContractsFormValues> => {
  const contracts = await callApiGetAllPages<ContractResponse>(
    `agreements/${agreementId}/contracts/`,
  );

  const mapCollateral = (collateral: CollateralResponse): Guarantee => ({
    id: String(collateral.id),
    tyyppi: collateral.guarantee_type,
    osapuolet: collateral.parties.map(String),
    vakuusasiakirjanLaji: collateral.document_category,
    kiinteistoVaiLaitos: collateral.target,
    kiinteistotunnukset: collateral.property_identifiers?.map(
      (property) => property.identifier,
    ),
    laitostunnus: collateral.facility_identifier ?? undefined,
    vierasvelkapanttaus: Boolean(
      collateral.third_party_pledger_name ||
      collateral.third_party_pledger_business_id,
    ),
    vierasvelkapanttauksenAntajanNimi:
      collateral.third_party_pledger_name ?? undefined,
    vierasvelkapanttauksenAntajanYTunnus:
      collateral.third_party_pledger_business_id ?? undefined,
    jalkipanttaus: Boolean(
      collateral.subsequent_pledgee_name ||
      collateral.subsequent_pledgee_business_id,
    ),
    jalkipantinSaajanNimi: collateral.subsequent_pledgee_name ?? undefined,
    jalkipantinSaajanYTunnus:
      collateral.subsequent_pledgee_business_id ?? undefined,
    antajanNimi: collateral.guarantor_name,
    antajanYTunnus: collateral.guarantor_business_id,
    antajanHenkilotunnus: collateral.guarantor_national_identification_number,
    panttikirjanNumero: collateral.mortgage_deed_number,
    panttikirjanPaivays:
      parseIsoDateToFinnishDate(collateral.mortgage_deed_date) || undefined,
    takausnumero: collateral.guarantee_identifier,
    tilinumero: collateral.account_number,
    alkupvm: parseIsoDateToFinnishDate(collateral.start_date) || undefined,
    loppupvm: parseIsoDateToFinnishDate(collateral.end_date) || undefined,
    maara: toText(collateral.amount),
    maksettuPvm:
      parseIsoDateToFinnishDate(collateral.paid_at_date) || undefined,
    palautettuPvm:
      parseIsoDateToFinnishDate(collateral.returned_date) || undefined,
    merkitsijaPalautus: collateral.marked_returned_by ?? undefined,
    lisatiedot: collateral.additional_information,
  });

  return {
    contracts: contracts.map((contract) => ({
      id: String(contract.id),
      title: contract.title,
      sopimuksenTyyppi: contract.contract_type || undefined,
      sopimusnumero: contract.identifier,
      allekirjoituspvm: parseIsoDateToFinnishDate(contract.signing_date),
      huomautus: contract.note,
      allekirjoitettavaMennessa: parseIsoDateToFinnishDate(
        contract.signing_deadline,
      ),
      ensimmainenKutsuLahetetty: parseIsoDateToFinnishDate(
        contract.first_invitation_sent_date,
      ),
      toinenKutsuLahetetty: parseIsoDateToFinnishDate(
        contract.second_invitation_sent_date,
      ),
      kolmasKutsuLahetetty: parseIsoDateToFinnishDate(
        contract.third_invitation_sent_date,
      ),
      paatos: contract.decision ? String(contract.decision) : undefined,
      toimeenpanija: contract.executor ?? "",
      muutokset: contract.changes.map((change) => ({
        id: String(change.id),
        sopimusnumero: change.identifier,
        allekirjoituspvm: parseIsoDateToFinnishDate(change.signing_date),
        allekirjoitettavaMennessa: parseIsoDateToFinnishDate(
          change.signing_deadline,
        ),
        ensimmainenKutsuLahetetty: parseIsoDateToFinnishDate(
          change.first_invitation_sent_date,
        ),
        toinenKutsuLahetetty: parseIsoDateToFinnishDate(
          change.second_invitation_sent_date,
        ),
        kolmasKutsuLahetetty: parseIsoDateToFinnishDate(
          change.third_invitation_sent_date,
        ),
        paatos: change.decision ? String(change.decision) : undefined,
        huomautus: change.note,
        toimeenpanija: change.executor ?? "",
      })),
      vakuudet: [
        ...contract.mortgage_deed_collaterals,
        ...contract.cash_deposit_collaterals,
        ...contract.personal_guarantee_collaterals,
        ...contract.deposit_pledge_collaterals,
        ...contract.other_collaterals,
      ].map(mapCollateral),
    })),
  };
};

export const updateContracts = async (
  agreementId: string,
  values: LandUseContractsFormValues,
): Promise<LandUseContractsFormValues> => {
  await callApiPut(
    `agreements/${agreementId}/contracts/`,
    (values.contracts ?? []).map((contract) => ({
      ...(Number.isInteger(Number(contract.id)) ? { id: Number(contract.id) } : {}),
      identifier: contract.sopimusnumero,
      signing_date: parseFinnishDateToIsoDate(contract.allekirjoituspvm),
      signing_deadline: parseFinnishDateToIsoDate(contract.allekirjoitettavaMennessa),
      first_invitation_sent_date: parseFinnishDateToIsoDate(contract.ensimmainenKutsuLahetetty),
      second_invitation_sent_date: parseFinnishDateToIsoDate(contract.toinenKutsuLahetetty),
      third_invitation_sent_date: parseFinnishDateToIsoDate(contract.kolmasKutsuLahetetty),
      executor: contract.toimeenpanija,
      decision: contract.paatos ? Number(contract.paatos) : null,
      note: contract.huomautus,
      title: contract.title,
      contract_type: contract.sopimuksenTyyppi ?? "",
      changes: contract.muutokset.map((change) => ({
        ...(Number.isInteger(Number(change.id)) ? { id: Number(change.id) } : {}),
        identifier: change.sopimusnumero,
        signing_date: parseFinnishDateToIsoDate(change.allekirjoituspvm),
        signing_deadline: parseFinnishDateToIsoDate(change.allekirjoitettavaMennessa),
        first_invitation_sent_date: parseFinnishDateToIsoDate(change.ensimmainenKutsuLahetetty),
        second_invitation_sent_date: parseFinnishDateToIsoDate(change.toinenKutsuLahetetty),
        third_invitation_sent_date: parseFinnishDateToIsoDate(change.kolmasKutsuLahetetty),
        executor: change.toimeenpanija,
        decision: change.paatos ? Number(change.paatos) : null,
        note: change.huomautus,
      })),
      collaterals: contract.vakuudet.map((collateral) => ({
        ...(Number.isInteger(Number(collateral.id)) ? { id: Number(collateral.id) } : {}),
        guarantee_type: collateral.tyyppi,
        parties: (collateral.osapuolet ?? []).map(Number),
        document_category: collateral.vakuusasiakirjanLaji ?? "",
        target: collateral.kiinteistoVaiLaitos ?? "",
        property_identifiers: collateral.kiinteistotunnukset ?? [],
        facility_identifier: collateral.laitostunnus ?? null,
        mortgage_deed_number: collateral.panttikirjanNumero ?? "",
        mortgage_deed_date: parseFinnishDateToIsoDate(collateral.panttikirjanPaivays),
        subsequent_pledgee_name: collateral.jalkipantinSaajanNimi ?? null,
        subsequent_pledgee_business_id: collateral.jalkipantinSaajanYTunnus ?? null,
        guarantor_name: collateral.antajanNimi ?? "",
        guarantor_business_id: collateral.antajanYTunnus ?? "",
        guarantor_national_identification_number: collateral.antajanHenkilotunnus ?? "",
        guarantee_identifier: collateral.takausnumero ?? "",
        account_number: collateral.tilinumero ?? "",
        paid_at_date: parseFinnishDateToIsoDate(collateral.maksettuPvm),
        third_party_pledger_name: collateral.vierasvelkapanttauksenAntajanNimi ?? null,
        third_party_pledger_business_id: collateral.vierasvelkapanttauksenAntajanYTunnus ?? null,
        start_date: parseFinnishDateToIsoDate(collateral.alkupvm),
        end_date: parseFinnishDateToIsoDate(collateral.loppupvm),
        amount: parseOptionalDecimal(collateral.maara),
        returned_date: parseFinnishDateToIsoDate(collateral.palautettuPvm),
        marked_returned_by: collateral.merkitsijaPalautus ?? null,
        additional_information: collateral.lisatiedot ?? "",
      })),
    })),
  );
  return getContracts(agreementId);
};

export const getPaymentSchedule = async (
  agreementId: string,
): Promise<LandUsePaymentScheduleFormValues> => {
  const schedules = await callApiGetAllPages<PaymentScheduleResponse>(
    `agreements/${agreementId}/payment-schedules/`,
  );

  return {
    paymentSchedules: schedules.map((schedule) => ({
      id: String(schedule.id),
      recipientPartyIndex: String(schedule.recipient_party),
      contractIndex: String(schedule.contract),
      status: schedule.status,
      rejectedReason: schedule.rejected_reason || null,
      signedDate: parseIsoDateToFinnishDate(schedule.signing_date),
      korotusProsentti: toText(schedule.increase_percentage),
      korkoPeruskorko: toText(schedule.base_interest_rate),
      korkoMarginaali: toText(schedule.interest_margin),
      daysInYear: "365",
      installments: schedule.installments.map((installment) => ({
        id: String(installment.id),
        recipientPartyIndex: String(schedule.recipient_party),
        contractIndex: String(schedule.contract),
        installmentNumber: String(installment.installment_sequence_number),
        installmentTotal: String(installment.installment_count_total),
        signedDate: parseIsoDateToFinnishDate(schedule.signing_date),
        asemakaavanLainvoimaisuusPvm: undefined,
        dueDate: parseIsoDateToFinnishDate(installment.due_date),
        laskentajaksonAlkupvm: parseIsoDateToFinnishDate(
          installment.interest_calculation_period_start_date,
        ),
        laskentajaksonLoppupvm: parseIsoDateToFinnishDate(
          installment.interest_calculation_period_end_date,
        ),
        invoiceNumber: "",
        type: LAND_USE_INVOICE_TYPES.MAANKAYTTOKORVAUS,
        status: undefined,
        billedAmount: "",
        remainingAmount: "",
        invoiceItems: installment.items.map((item) => ({
          id: String(item.id),
          itemType: item.item_type,
          description: item.description,
          amountExcludingVat: item.amount,
        })),
      })),
    })),
  };
};

export const updatePaymentSchedule = async (
  agreementId: string,
  values: LandUsePaymentScheduleFormValues,
): Promise<LandUsePaymentScheduleFormValues> => {
  await callApiPut(
    `agreements/${agreementId}/payment-schedules/`,
    (values.paymentSchedules ?? []).map((schedule) => ({
      ...(Number.isInteger(Number(schedule.id)) ? { id: Number(schedule.id) } : {}),
      recipient_party: Number(schedule.recipientPartyIndex),
      contract: Number(schedule.contractIndex),
      signing_date: parseFinnishDateToIsoDate(schedule.signedDate),
      increase_percentage: parseOptionalDecimal(schedule.korotusProsentti),
      base_interest_rate: parseOptionalDecimal(schedule.korkoPeruskorko),
      interest_margin: parseOptionalDecimal(schedule.korkoMarginaali),
      installments: schedule.installments.map((installment) => ({
        ...(Number.isInteger(Number(installment.id)) ? { id: Number(installment.id) } : {}),
        installment_sequence_number: Number(installment.installmentNumber),
        installment_count_total: Number(installment.installmentTotal),
        due_date: parseFinnishDateToIsoDate(installment.dueDate),
        interest_calculation_period_start_date: parseFinnishDateToIsoDate(installment.laskentajaksonAlkupvm),
        interest_calculation_period_end_date: parseFinnishDateToIsoDate(installment.laskentajaksonLoppupvm),
        items: (installment.invoiceItems ?? []).map((item) => ({
          ...(Number.isInteger(Number(item.id)) ? { id: Number(item.id) } : {}),
          item_type: item.itemType,
          description: item.description,
          amount: parseOptionalDecimal(item.amountExcludingVat),
        })),
      })),
    })),
  );
  return getPaymentSchedule(agreementId);
};

export const getBilling = async (
  agreementId: string,
): Promise<LandUseBillingFormValues> => {
  const invoices = await callApiGetAllPages<InvoiceResponse>(
    `agreements/${agreementId}/invoices/`,
  );

  return {
    invoices: invoices.map((invoice) => ({
      recipientPartyIndex: String(invoice.recipient_party),
      installmentNumber: String(invoice.installment_sequence_number),
      installmentTotal: String(invoice.installment_count_total),
      dueDate: parseIsoDateToFinnishDate(invoice.due_date),
      invoiceNumber: invoice.invoice_identifier,
      type: invoice.invoice_type,
      status: invoice.status,
      sentAt: invoice.sent_at ?? undefined,
      billedAmount: toText(invoice.billed_amount),
      remainingAmount: toText(invoice.remaining_amount),
      invoiceItems: invoice.items.map((item) => ({
        itemType: item.item_type,
        description: item.description,
        amountExcludingVat: item.amount,
      })),
    })),
  };
};

export const submitPaymentSchedule = async (
  scheduleId: string,
): Promise<void> => {
  await callApiPost<PaymentScheduleResponse, Record<string, never>>(
    `payment-schedules/${scheduleId}/submit/`,
    {},
  );
};

export const approvePaymentSchedule = async (
  scheduleId: string,
): Promise<void> => {
  await callApiPost<PaymentScheduleResponse, Record<string, never>>(
    `payment-schedules/${scheduleId}/approve/`,
    {},
  );
};

export const rejectPaymentSchedule = async (
  scheduleId: string,
  reason: string,
): Promise<void> => {
  await callApiPost<PaymentScheduleResponse, { reason: string }>(
    `payment-schedules/${scheduleId}/reject/`,
    { reason },
  );
};
