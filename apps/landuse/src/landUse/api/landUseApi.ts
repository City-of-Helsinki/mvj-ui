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
import { type AsemakaavaListItem } from "@/landUse/options";
import type { LandUseListItem } from "@/landUse/api/landUseListTypes";
import {
  callApiGetAllPages,
  callApiGet,
  callApiPatch,
  callApiPost,
  callApiPut,
} from "@/landUse/api/fetchClient";
import type { District } from "@/landUse/api/landUseTypes";
import { formatLandUseDate } from "@/landUse/utils/date";
import {
  LAND_USE_INVOICE_STATUSES,
  LAND_USE_INVOICE_TYPES,
  LAND_USE_PAYMENT_SCHEDULE_STATUSES,
} from "@/landUse/options";

type DetailedPlanResponse = {
  id: number;
  plan_number: string;
  processing_stage: string;
  approval_date: string | null;
  effective_date: string | null;
  approver: string;
  diary_number: string;
};

type AgreementOverviewResponse = AgreementListResponse & {
  detailed_plan_sites: string[];
  includes_housing_obligations: boolean;
  obligations_deadline: string | null;
  authorized_signatory: { id: number; name: string } | null;
  detailed_plan: DetailedPlanResponse | null;
  addresses: {
    id?: number;
    street_address: string;
    postal_code: string;
    city: string;
  }[];
  preparers: { id?: number; preparer: number; preparer_name: string }[];
};

type AgreementListResponse = {
  party_names?: string[];
  detailed_plan_number?: string;
  detailed_plan_sites?: string[];
  id: number;
  identifier: string;
  agreement_type: string;
  district: District | null;
  is_promotion_area: boolean;
  status: string;
  estimated_presentation_year: number | null;
  estimated_payment_year: number | null;
};

type AgreementCreateResponse = {
  id: number;
};

type AgreementUpdateRequest = {
  detailed_plan: number | null;
  authorized_signatory: number | null;
  addresses: { street_address: string; postal_code: string; city: string }[];
  preparers: { preparer: number }[];
  detailed_plan_sites: string[];
  agreement_type: string;
  is_promotion_area: boolean;
  status: string;
  estimated_presentation_year: number | null;
  estimated_payment_year: number | null;
  includes_housing_obligations: boolean;
  obligations_deadline: string | null;
};

type PartyResponse = {
  id: number;
  party_type: string;
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
  role: string;
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
  monetary_compensation: string | null;
  land_compensation: string | null;
  other_compensation: string | null;
  total_compensation: string | null;
  base_price: string | null;
  land_compensation_description: string;
  other_compensation_description: string;
  value_before_detailed_plan_proposal: string | null;
  demolition_or_other_deduction: string | null;
  land_use_compensation: string | null;
  land_policy_program: { id: number; name: string } | null;
  land_policy_program_discount_percentage: string | null;
  public_areas_m2: string | null;
  public_areas_acquisition_value: string | null;
};

type AgreementSiteResponse = {
  id: number;
  identifier: string;
  area_m2: string | null;
  floor_area_kem2: string | null;
  intended_use: { id: number; name: string } | null;
  tenure_types: { id: number; name: string }[];
  preservation_designation: string;
  has_housing_obligation: boolean;
  unit_price_euro_per_kem2: string | null;
};

const DECISION_MAKER_CODES: Record<string, string> = {
  Tonttipäällikkö: "LAND_MANAGER",
  Kaupunkiympäristölautakunta: "URBAN_ENVIRONMENT_COMMITTEE",
  Kaupunginhallitus: "CITY_BOARD",
};

const DECISION_TYPE_CODES: Record<string, string> = {
  "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)":
    "EASEMENT_CONDITION_ADDITION",
  "Maankäyttösopimuksen hyväksyntä": "LAND_USE_AGREEMENT_APPROVAL",
};

const CONDITION_TYPE_CODES: Record<string, string> = {
  "Rasite - ja/tai rasitteenluont.ehto": "EASEMENT_OR_EASEMENT_LIKE_CONDITION",
  "Muu ehto": "OTHER",
};

const toIsoDate = (value: string): string | null => {
  if (!value) return null;
  if (!value.trim()) return null;
  const [day, month, year] = value.split(".");
  return day && month && year
    ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    : value;
};

type DecisionResponse = {
  id: number;
  title: string;
  decision_maker: string;
  decision_date: string | null;
  section: string;
  decision_type: string;
  diary_number: string;
  note: string;
  conditions: {
    condition_type: string;
    supervision_date: string | null;
    supervised_date: string | null;
    note: string;
  }[];
};

type CollateralResponse = {
  id: number;
  guarantee_type: string;
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
  contract_type: string;
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
  status: string;
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
    items: { item_type: string; description: string; amount: string }[];
  }[];
};

type InvoiceResponse = {
  recipient_snapshot: PartyResponse & { ovt_code: string; sap_customer_number: string; customer_reference: string };
  payments: { id: number; paid_amount: string; paid_date: string; filing_code: string }[];
  id: number;
  recipient_party: number;
  source_payment_schedule_installment: number | null;
  installment_sequence_number: number;
  installment_count_total: number;
  due_date: string | null;
  invoice_identifier: string;
  invoice_type: string;
  status: string;
  sent_at: string | null;
  billed_amount: string | null;
  remaining_amount: string | null;
  items: { item_type: string; description: string; amount: string }[];
};

const getAgreementStatusValue = (status: string | undefined): string =>
  status ?? "";

const getOptionalYear = (value: string): number | null => {
  if (!value.trim()) return null;
  const year = Number(value);
  return Number.isInteger(year) ? year : null;
};

const getLabelForCode = <T extends Record<string, string>>(
  options: T,
  code: string,
): T[keyof T] | undefined => options[code as keyof T];

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
    partyRole:
      party.role === "LAND_OWNER"
        ? "maanomistaja"
        : party.role === "DEVELOPER"
          ? "toteuttaja"
          : undefined,
    partyType:
      party.party_type === "COMPANY"
        ? "yritys"
        : party.party_type === "PERSON"
          ? "yksityishenkilo"
          : undefined,
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

export const getAsemakaavat = async (): Promise<AsemakaavaListItem[]> => {
  const plans =
    await callApiGetAllPages<DetailedPlanResponse>("detailed-plans/");

  return plans.map((plan) => ({
    id: plan.id,
    asemakaavanNumero: plan.plan_number,
    asemakaavanKasittelyvaihe:
      plan.processing_stage as AsemakaavaListItem["asemakaavanKasittelyvaihe"],
    vahvistamisHyvaksymisPvm: formatLandUseDate(plan.approval_date),
    asemakaavanLainvoimaisuusPvm: formatLandUseDate(plan.effective_date) || undefined,
    asemakaavanHyvaksyjä: plan.approver,
    asemakaavanDiaarinumero: plan.diary_number,
  }));
};

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
    ...(preparer.id ? { id: preparer.id } : {}),
    value: String(preparer.preparer),
  })),
  osoitteet: agreement.addresses.map((address) => ({
    ...(address.id ? { id: address.id } : {}),
    katuosoite: address.street_address,
    postinumero: address.postal_code,
    kaupunki: address.city,
  })),
  arvioituEsittelyvuosi: String(agreement.estimated_presentation_year ?? ""),
  arvioituMaksuvuosi: String(agreement.estimated_payment_year ?? ""),
  toimivaltainenPaattaja: agreement.authorized_signatory?.name ?? "",
  toimivaltainenPaattajaId: agreement.authorized_signatory?.id ?? null,
  asemakaavaId: agreement.detailed_plan?.id ?? null,
  sisaltaaAmVelvoitteita: agreement.includes_housing_obligations
    ? "kyllä"
    : "ei",
  velvoitteidenMaaraika: formatLandUseDate(agreement.obligations_deadline),
  asemakaavanNumero: agreement.detailed_plan?.plan_number ?? "",
  asemakaavanKasittelyvaihe: agreement.detailed_plan?.processing_stage ?? "",
  vahvistamisHyvaksymisPvm: formatLandUseDate(agreement.detailed_plan?.approval_date),
  asemakaavanLainvoimaisuusPvm: formatLandUseDate(agreement.detailed_plan?.effective_date),
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
    party: (agreement.party_names ?? []).join(", "),
    zoningPlanNumber: agreement.detailed_plan_number ?? "",
    site: (agreement.detailed_plan_sites ?? []).join(", "),
    projectArea: agreement.is_promotion_area,
    negotiationPhase: agreement.status,
  }));
};

export const createLandUseAgreement = async (
  municipalityId: string,
  districtId: string,
): Promise<string> => {
  const agreement = await callApiPost<
    AgreementCreateResponse,
    { municipality: string; district: number }
  >("agreements/", {
    municipality: municipalityId,
    district: Number(districtId),
  });

  return String(agreement.id);
};

export const updateSummary = async (
  agreementId: string,
  values: LandUseSummaryFormValues,
): Promise<LandUseSummaryFormValues> => {
  await callApiPatch<AgreementOverviewResponse, AgreementUpdateRequest>(
    `agreements/${agreementId}/`,
    {
      detailed_plan: values.asemakaavaId ?? null,
      authorized_signatory: values.toimivaltainenPaattajaId ?? null,
      addresses: values.osoitteet.map((address) => ({
        ...(address.id ? { id: address.id } : {}),
        street_address: address.katuosoite,
        postal_code: address.postinumero,
        city: address.kaupunki,
      })),
      preparers: values.valmistelijat.filter((entry) => entry.value).map((entry) => ({ ...(entry.id ? { id: entry.id } : {}), preparer: Number(entry.value) })),
      detailed_plan_sites: values.suunnittelunPerusteenaOlevatKohteet
        .map(({ value }) => value?.trim() ?? "")
        .filter(Boolean),
      agreement_type: values.maankayttosopimusType ?? "",
      is_promotion_area: values.edistamisalue,
      status: getAgreementStatusValue(values.tila),
      estimated_presentation_year: getOptionalYear(
        values.arvioituEsittelyvuosi,
      ),
      estimated_payment_year: getOptionalYear(values.arvioituMaksuvuosi),
      includes_housing_obligations: values.sisaltaaAmVelvoitteita === "kyllä",
      obligations_deadline: toIsoDate(values.velvoitteidenMaaraika),
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
  party_type:
    details.partyType === "yritys"
      ? "COMPANY"
      : details.partyType === "yksityishenkilo"
        ? "PERSON"
        : "",
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
    role:
      entry.party.details.partyRole === "maanomistaja"
        ? "LAND_OWNER"
        : entry.party.details.partyRole === "toteuttaja"
          ? "DEVELOPER"
          : "",
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

export type UiChoice = { label: string; value: string };
export type LandUseUiMetadata = Record<string, UiChoice[]>;

export const getUiMetadata = (): Promise<LandUseUiMetadata> =>
  callApiGet<LandUseUiMetadata>("ui-metadata/");

export const getAuthorizedSignatories = (): Promise<NamedLookup[]> =>
  callApiGetAllPages<NamedLookup>("authorized-signatories/");

export type NamedLookup = { id: number; name: string };
export type LandPolicyProgram = NamedLookup & {
  default_discount_percentage: string | null;
};

export const getCompensationLookups = async () => {
  const [intendedUses, tenureTypes, landPolicyPrograms] = await Promise.all([
    callApiGetAllPages<NamedLookup>("site-intended-uses/"),
    callApiGetAllPages<NamedLookup>("site-tenure-types/"),
    callApiGetAllPages<LandPolicyProgram>("land-policy-programs/"),
  ]);
  return { intendedUses, tenureTypes, landPolicyPrograms };
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

const parseOptionalNumber = (value: string | undefined): number | null => {
  const parsed = Number(value?.replace(",", "."));
  return value?.trim() && Number.isFinite(parsed) ? parsed : null;
};

export const updateCompensations = async (
  agreementId: string,
  values: LandUseCompensationsFormValues,
): Promise<LandUseCompensationsFormValues> => {
  await callApiPut(`agreements/${agreementId}/compensation-document/`, {
    compensation: {
      excel_calculation_url: values.excelLaskelmaUrl || null,
      monetary_compensation: parseOptionalNumber(values.rahakorvaus),
      land_compensation: parseOptionalNumber(values.maakorvaus),
      other_compensation: parseOptionalNumber(values.muuKorvaus),
      total_compensation: parseOptionalNumber(values.maankayttokorvausYhteensa),
      base_price: parseOptionalNumber(values.perushinta),
      land_compensation_description: values.maakorvausSelite,
      other_compensation_description: values.muuSelite,
      value_before_detailed_plan_proposal: parseOptionalNumber(
        values.kaavaehdotustaEdeltavaArvo,
      ),
      demolition_or_other_deduction: values.purkuTaiMuuVahennys,
      land_use_compensation: parseOptionalNumber(values.maankayttokorvaus),
      land_policy_program: values.maapoliittinenOhjelmaId ?? null,
      land_policy_program_discount_percentage: parseOptionalNumber(
        values.huojennusProsentti,
      ),
      public_areas_m2: parseOptionalNumber(values.yleisetAlueetNeliot),
      public_areas_acquisition_value: parseOptionalNumber(
        values.yleisetAlueetHankinnanArvo,
      ),
    },
    sites: values.sites.map((site) => ({
        ...(Number.isInteger(Number(site.id)) ? { id: Number(site.id) } : {}),
        identifier: site.kohteenTunnus,
        area_m2: parseOptionalNumber(site.pintaAlaM2),
        floor_area_kem2: parseOptionalNumber(site.kem2),
        intended_use: site.kayttotarkoitusId ?? null,
        tenure_types: site.hallintamuotoIds ?? [],
        preservation_designation: site.suojeltu || null,
        has_housing_obligation: site.amVelvoite,
        unit_price_euro_per_kem2: parseOptionalNumber(
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
  await callApiPatch(`agreements/${agreementId}/`, {
    collateral_multiplier: parseOptionalNumber(
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
      paatospvm: formatLandUseDate(decision.decision_date),
      pykala: decision.section || undefined,
      paatoksenTyyppi: decision.decision_type || undefined,
      diaarinumero: decision.diary_number,
      huomautus: decision.note,
      ehdot: decision.conditions.map((condition) => ({
        conditionType: condition.condition_type || undefined,
        valvontapvm: formatLandUseDate(condition.supervision_date),
        valvottuPvm: formatLandUseDate(condition.supervised_date),
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
      decision_maker: decision.paattaja
        ? (DECISION_MAKER_CODES[decision.paattaja] ?? decision.paattaja)
        : "",
      decision_date: toIsoDate(decision.paatospvm),
      section: decision.pykala ? Number(decision.pykala) : null,
      decision_type: decision.paatoksenTyyppi
        ? (DECISION_TYPE_CODES[decision.paatoksenTyyppi] ??
          decision.paatoksenTyyppi)
        : "",
      diary_number: decision.diaarinumero,
      note: decision.huomautus,
      conditions: (decision.ehdot ?? []).map((condition) => ({
        condition_type: condition.conditionType
          ? (CONDITION_TYPE_CODES[condition.conditionType] ??
            condition.conditionType)
          : "",
        supervision_date: toIsoDate(condition.valvontapvm),
        supervised_date: toIsoDate(condition.valvottuPvm),
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
  const metadata = await getUiMetadata();
  const label = (key: string, code: string | undefined) =>
    metadata[key]?.find((option) => option.value === code)?.label ?? code;

  const mapCollateral = (collateral: CollateralResponse): Guarantee => ({
    id: String(collateral.id),
    tyyppi: label("collateral_types", collateral.guarantee_type) as Guarantee["tyyppi"],
    osapuolet: collateral.parties.map(String),
    vakuusasiakirjanLaji: label("collateral_document_categories", collateral.document_category),
    kiinteistoVaiLaitos: label("mortgage_deed_collateral_targets", collateral.target),
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
    panttikirjanPaivays: formatLandUseDate(collateral.mortgage_deed_date) || undefined,
    takausnumero: collateral.guarantee_identifier,
    tilinumero: collateral.account_number,
    alkupvm: formatLandUseDate(collateral.start_date) || undefined,
    loppupvm: formatLandUseDate(collateral.end_date) || undefined,
    maara: toText(collateral.amount),
    maksettuPvm: formatLandUseDate(collateral.paid_at_date) || undefined,
    palautettuPvm: formatLandUseDate(collateral.returned_date) || undefined,
    merkitsijaPalautus: collateral.marked_returned_by ?? undefined,
    lisatiedot: collateral.additional_information,
  });

  return {
    contracts: contracts.map((contract) => ({
      id: String(contract.id),
      title: contract.title,
      sopimuksenTyyppi: label("contract_types", contract.contract_type) || undefined,
      sopimusnumero: contract.identifier,
      allekirjoituspvm: formatLandUseDate(contract.signing_date),
      huomautus: contract.note,
      allekirjoitettavaMennessa: formatLandUseDate(contract.signing_deadline),
      ensimmainenKutsuLahetetty: formatLandUseDate(contract.first_invitation_sent_date),
      toinenKutsuLahetetty: formatLandUseDate(contract.second_invitation_sent_date),
      kolmasKutsuLahetetty: formatLandUseDate(contract.third_invitation_sent_date),
      paatos: contract.decision ? String(contract.decision) : undefined,
      toimeenpanija: contract.executor ?? "",
      muutokset: contract.changes.map((change) => ({
        id: String(change.id),
        sopimusnumero: change.identifier,
        allekirjoituspvm: formatLandUseDate(change.signing_date),
        allekirjoitettavaMennessa: formatLandUseDate(change.signing_deadline),
        ensimmainenKutsuLahetetty: formatLandUseDate(change.first_invitation_sent_date),
        toinenKutsuLahetetty: formatLandUseDate(change.second_invitation_sent_date),
        kolmasKutsuLahetetty: formatLandUseDate(change.third_invitation_sent_date),
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
  const metadata = await getUiMetadata();
  const code = (key: string, value: string | undefined) =>
    metadata[key]?.find((option) => option.label === value || option.value === value)?.value ?? value ?? "";
  const details = (contract: NonNullable<LandUseContractsFormValues["contracts"]>[number] | NonNullable<LandUseContractsFormValues["contracts"]>[number]["muutokset"][number]) => ({
    ...(contract.id ? { id: Number(contract.id) } : {}),
    identifier: contract.sopimusnumero,
    signing_date: toIsoDate(contract.allekirjoituspvm),
    signing_deadline: toIsoDate(contract.allekirjoitettavaMennessa),
    first_invitation_sent_date: toIsoDate(contract.ensimmainenKutsuLahetetty),
    second_invitation_sent_date: toIsoDate(contract.toinenKutsuLahetetty),
    third_invitation_sent_date: toIsoDate(contract.kolmasKutsuLahetetty),
    executor: contract.toimeenpanija || null,
    decision: contract.paatos ? Number(contract.paatos) : null,
    note: contract.huomautus,
  });
  const payload = (values.contracts ?? []).map((contract) => {
    const collaterals: Record<string, unknown[]> = {
      mortgage_deed_collaterals: [], cash_deposit_collaterals: [],
      personal_guarantee_collaterals: [], deposit_pledge_collaterals: [], other_collaterals: [],
    };
    const collections: Record<string, string> = {
      MORTGAGE_DEED: "mortgage_deed_collaterals", CASH_DEPOSIT: "cash_deposit_collaterals",
      PERSONAL_GUARANTEE: "personal_guarantee_collaterals", DEPOSIT_PLEDGE: "deposit_pledge_collaterals", OTHER: "other_collaterals",
    };
    for (const guarantee of contract.vakuudet) {
      const type = code("collateral_types", guarantee.tyyppi);
      if (!collections[type]) throw new Error("Unknown collateral type");
      collaterals[collections[type]].push({
        ...(guarantee.id ? { id: Number(guarantee.id) } : {}),
        guarantee_type: type, parties: (guarantee.osapuolet ?? []).map(Number),
        third_party_pledger_name: guarantee.vierasvelkapanttaus ? guarantee.vierasvelkapanttauksenAntajanNimi || null : null,
        third_party_pledger_business_id: guarantee.vierasvelkapanttaus ? guarantee.vierasvelkapanttauksenAntajanYTunnus || null : null,
        start_date: toIsoDate(guarantee.alkupvm ?? ""), end_date: toIsoDate(guarantee.loppupvm ?? ""),
        amount: parseOptionalNumber(guarantee.maara), returned_date: toIsoDate(guarantee.palautettuPvm ?? ""),
        marked_returned_by: guarantee.merkitsijaPalautus || null, additional_information: guarantee.lisatiedot ?? "",
        ...(type !== "CASH_DEPOSIT" ? { document_category: code("collateral_document_categories", guarantee.vakuusasiakirjanLaji) } : {}),
        ...(type === "MORTGAGE_DEED" ? {
          target: code("mortgage_deed_collateral_targets", guarantee.kiinteistoVaiLaitos),
          facility_identifier: guarantee.laitostunnus || null,
          property_identifiers: (guarantee.kiinteistotunnukset ?? []).map((identifier) => ({ identifier })),
          mortgage_deed_number: guarantee.panttikirjanNumero ?? "", mortgage_deed_date: toIsoDate(guarantee.panttikirjanPaivays ?? ""),
          subsequent_pledgee_name: guarantee.jalkipanttaus ? guarantee.jalkipantinSaajanNimi || null : null,
          subsequent_pledgee_business_id: guarantee.jalkipanttaus ? guarantee.jalkipantinSaajanYTunnus || null : null,
        } : {
          guarantor_name: guarantee.antajanNimi ?? "", guarantor_business_id: guarantee.antajanYTunnus ?? "",
          guarantor_national_identification_number: guarantee.antajanHenkilotunnus ?? "",
          ...(type === "CASH_DEPOSIT" || type === "DEPOSIT_PLEDGE" ? { account_number: guarantee.tilinumero ?? "" } : {}),
          ...(type === "CASH_DEPOSIT" ? { paid_at_date: toIsoDate(guarantee.maksettuPvm ?? "") } : {}),
          ...(type === "PERSONAL_GUARANTEE" ? { guarantee_identifier: guarantee.takausnumero ?? "" } : {}),
        }),
      });
    }
    return { ...details(contract), title: contract.title, contract_type: code("contract_types", contract.sopimuksenTyyppi), changes: contract.muutokset.map(details), ...collaterals };
  });
  await callApiPut(`agreements/${agreementId}/contracts/`, payload);
  return getContracts(agreementId);
};

export const getPaymentSchedule = async (
  agreementId: string,
): Promise<LandUsePaymentScheduleFormValues> => {
  const [schedules, parties, contracts] = await Promise.all([
    callApiGetAllPages<PaymentScheduleResponse>(
      `agreements/${agreementId}/payment-schedules/`,
    ),
    callApiGetAllPages<PartyResponse>(`agreements/${agreementId}/parties/`),
    callApiGetAllPages<ContractResponse>(
      `agreements/${agreementId}/contracts/`,
    ),
  ]);
  const partyIndexes = new Map(
    parties.map((party, index) => [party.id, index]),
  );
  const contractIndexes = new Map(
    contracts.map((contract, index) => [contract.id, index]),
  );

  return {
    paymentSchedules: schedules.map((schedule) => ({
      id: String(schedule.id),
      recipientPartyId: String(schedule.recipient_party),
      contractId: String(schedule.contract),
      recipientPartyIndex: partyIndexes.has(schedule.recipient_party)
        ? String(partyIndexes.get(schedule.recipient_party))
        : undefined,
      contractIndex: contractIndexes.has(schedule.contract)
        ? String(contractIndexes.get(schedule.contract))
        : undefined,
      status: getLabelForCode(
        LAND_USE_PAYMENT_SCHEDULE_STATUSES,
        schedule.status,
      ),
      rejectedReason: schedule.rejected_reason || null,
      signedDate: formatLandUseDate(schedule.signing_date),
      korotusProsentti: toText(schedule.increase_percentage),
      korkoPeruskorko: toText(schedule.base_interest_rate),
      korkoMarginaali: toText(schedule.interest_margin),
      daysInYear: "365",
      installments: schedule.installments.map((installment) => ({
        id: String(installment.id),
        recipientPartyIndex: partyIndexes.has(schedule.recipient_party)
          ? String(partyIndexes.get(schedule.recipient_party))
          : undefined,
        contractIndex: contractIndexes.has(schedule.contract)
          ? String(contractIndexes.get(schedule.contract))
          : undefined,
        installmentNumber: String(installment.installment_sequence_number),
        installmentTotal: String(installment.installment_count_total),
        signedDate: formatLandUseDate(schedule.signing_date),
        asemakaavanLainvoimaisuusPvm: undefined,
        dueDate: formatLandUseDate(installment.due_date),
        laskentajaksonAlkupvm: formatLandUseDate(installment.interest_calculation_period_start_date),
        laskentajaksonLoppupvm: formatLandUseDate(installment.interest_calculation_period_end_date),
        invoiceNumber: "",
        type: undefined,
        status: undefined,
        billedAmount: "",
        remainingAmount: "",
        invoiceItems: installment.items.map((item) => ({
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
  const [parties, contracts] = await Promise.all([
    callApiGetAllPages<PartyResponse>(`agreements/${agreementId}/parties/`),
    callApiGetAllPages<ContractResponse>(`agreements/${agreementId}/contracts/`),
  ]);
  const editable = (values.paymentSchedules ?? []).filter((schedule) =>
    !schedule.status || schedule.status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.DRAFT || schedule.status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.REJECTED,
  );
  await callApiPut(`agreements/${agreementId}/payment-schedules/`, editable.map((schedule) => ({
    ...(Number.isInteger(Number(schedule.id)) ? { id: Number(schedule.id) } : {}),
    recipient_party: Number(schedule.recipientPartyId ?? parties[Number(schedule.recipientPartyIndex)]?.id),
    contract: Number(schedule.contractId ?? contracts[Number(schedule.contractIndex)]?.id),
    signing_date: toIsoDate(schedule.signedDate),
    increase_percentage: parseOptionalNumber(schedule.korotusProsentti),
    base_interest_rate: parseOptionalNumber(schedule.korkoPeruskorko),
    interest_margin: parseOptionalNumber(schedule.korkoMarginaali),
    installments: schedule.installments.map((installment) => ({
      ...(installment.id ? { id: Number(installment.id) } : {}),
      installment_sequence_number: Number(installment.installmentNumber),
      installment_count_total: Number(installment.installmentTotal),
      due_date: toIsoDate(installment.dueDate),
      interest_calculation_period_start_date: toIsoDate(installment.laskentajaksonAlkupvm),
      interest_calculation_period_end_date: toIsoDate(installment.laskentajaksonLoppupvm),
      items: (installment.invoiceItems ?? []).map((item) => ({ item_type: item.itemType, description: item.description, amount: item.amountExcludingVat })),
    })),
  })));
  return getPaymentSchedule(agreementId);
};

export const getBilling = async (
  agreementId: string,
): Promise<LandUseBillingFormValues> => {
  const [invoices, parties] = await Promise.all([
    callApiGetAllPages<InvoiceResponse>(`agreements/${agreementId}/invoices/`),
    callApiGetAllPages<PartyResponse>(`agreements/${agreementId}/parties/`),
  ]);
  const partyIndexes = new Map(
    parties.map((party, index) => [party.id, index]),
  );

  return {
    invoices: invoices.map((invoice) => ({
      id: String(invoice.id),
      sourceInstallmentId: invoice.source_payment_schedule_installment == null ? undefined : String(invoice.source_payment_schedule_installment),
      recipientSnapshot: invoice.recipient_snapshot ? {
        party: { details: mapPartyDetails(invoice.recipient_snapshot) },
        billingDetails: {
          ovtCode: invoice.recipient_snapshot.ovt_code,
          sapCustomerNumber: invoice.recipient_snapshot.sap_customer_number,
          reference: invoice.recipient_snapshot.customer_reference,
        },
      } : undefined,
      payments: invoice.payments ?? [],
      recipientPartyIndex: partyIndexes.has(invoice.recipient_party)
        ? String(partyIndexes.get(invoice.recipient_party))
        : undefined,
      installmentNumber: String(invoice.installment_sequence_number),
      installmentTotal: String(invoice.installment_count_total),
      dueDate: formatLandUseDate(invoice.due_date),
      invoiceNumber: invoice.invoice_identifier,
      type: invoice.invoice_type === "LAND_USE_COMPENSATION" ? LAND_USE_INVOICE_TYPES.MAANKAYTTOKORVAUS : invoice.invoice_type === "PENALTY" ? LAND_USE_INVOICE_TYPES.SAKKO : undefined,
      status: getLabelForCode(LAND_USE_INVOICE_STATUSES, invoice.status),
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

export const sendInvoiceToSap = async (invoiceId: string): Promise<void> => {
  await callApiPost(`invoices/${invoiceId}/send-to-sap/`, {});
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
