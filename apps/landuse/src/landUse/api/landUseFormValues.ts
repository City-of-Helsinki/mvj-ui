import type { LandUseBillingFormValues } from "@/landUse/components/tabs/LandUseBilling";
import type { LandUsePaymentScheduleFormValues } from "@/landUse/components/tabs/LandUsePaymentSchedule";
import type { LandUseSummaryFormValues } from "@/landUse/components/tabs/LandUseSummary";
import type {
  LandUsePartiesFormValues,
  PartyEntry,
} from "@/landUse/components/tabs/LandUseParties";

export const createEmptySummaryFormValues = (): LandUseSummaryFormValues => ({
  maankayttosopimusType: undefined,
  kaupunginosa: "",
  edistamisalue: false,
  tila: undefined,
  suunnittelunPerusteenaOlevatKohteet: [{ value: undefined }],
  valmistelijat: [{ value: undefined }],
  osoitteet: [{ katuosoite: "", postinumero: "", kaupunki: "" }],
  arvioituEsittelyvuosi: "",
  arvioituMaksuvuosi: "",
  toimivaltainenPaattaja: "",
  sisaltaaAmVelvoitteita: "kyllä",
  velvoitteidenMaaraika: "",
  asemakaavanNumero: "",
  asemakaavanKasittelyvaihe: "",
  vahvistamisHyvaksymisPvm: "",
  asemakaavanLainvoimaisuusPvm: "",
  asemakaavanHyvaksyjä: "",
  asemakaavanDiaarinumero: "",
});

export const createEmptyPartyEntry = (): PartyEntry => ({
  party: {
    details: {
      partyRole: undefined,
      ownershipShare: undefined,
      partyType: undefined,
      name: "",
      businessId: "",
      language: undefined,
      streetAddress: "",
      city: "",
      postalCode: "",
      country: undefined,
      careOf: "",
      phone: "",
      email: "",
      note: "",
    },
  },
  contactPersons: [
    {
      name: undefined,
      phone: "",
      email: "",
    },
  ],
  billingDetails: {
    ovtCode: "",
    sapCustomerNumber: "",
    reference: "",
  },
  invoiceRecipient: undefined,
});

export const createEmptyPartiesFormValues = (): LandUsePartiesFormValues => ({
  parties: [createEmptyPartyEntry()],
});

export const clonePartiesFormValues = (
  values: LandUsePartiesFormValues,
): LandUsePartiesFormValues =>
  JSON.parse(JSON.stringify(values)) as LandUsePartiesFormValues;

export const createEmptyPaymentScheduleFormValues =
  (): LandUsePaymentScheduleFormValues => ({
    paymentSchedules: [],
  });

export const createEmptyBillingFormValues = (): LandUseBillingFormValues => ({
  invoices: [],
});
