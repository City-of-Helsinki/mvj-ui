import { normalizeSelectValue } from "../utils/fieldUtils";
import type { MockLandUseData } from "../mocks/landUseMockData";
import type { LandUseInvoicingFormValues } from "../components/tabs/LandUseInvoicing";
import type { LandUseSummaryFormValues } from "../components/tabs/LandUseSummary";
import type {
  LandUsePartiesFormValues,
  PartyEntry,
} from "../components/tabs/LandUseParties";

const normalizeProjectAreaBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return false;
};

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
  kasittelyvaiheenViimeisinPvm: "",
  asemakaavanHyvaksyjä: "",
  asemakaavanDiaarinumero: "",
});

export const mapMockToSummaryFormValues = (
  mockData: MockLandUseData | null,
): LandUseSummaryFormValues => {
  if (!mockData) {
    return createEmptySummaryFormValues();
  }

  return {
    maankayttosopimusType: normalizeSelectValue(mockData.maankayttosopimusType),
    kaupunginosa: mockData.kaupunginosa ?? "",
    edistamisalue: normalizeProjectAreaBoolean(mockData.edistamisalue),
    tila: normalizeSelectValue(mockData.tila),
    suunnittelunPerusteenaOlevatKohteet:
      mockData.suunnittelunPerusteenaOlevatKohteet.map((kohde) => ({
        value: normalizeSelectValue(kohde),
      })),
    valmistelijat: mockData.valmistelijat.map((valmistelija) => ({
      value: normalizeSelectValue(
        `${valmistelija.firstName} ${valmistelija.lastName}`.trim(),
      ),
    })),
    osoitteet: mockData.osoitteet.map((osoite) => ({
      katuosoite: osoite.katuosoite,
      postinumero: osoite.postinumero,
      kaupunki: osoite.kaupunki,
    })),
    arvioituEsittelyvuosi: mockData.arvioituEsittelyvuosi,
    arvioituMaksuvuosi: mockData.arvioituMaksuvuosi,
    toimivaltainenPaattaja: mockData.toimivaltainenPaattaja,
    sisaltaaAmVelvoitteita: mockData.sisaltaaAmVelvoitteita,
    velvoitteidenMaaraika: mockData.velvoitteidenMaaraika,
    asemakaavanNumero: mockData.asemakaavanNumero,
    asemakaavanKasittelyvaihe: mockData.asemakaavanKasittelyvaihe,
    kasittelyvaiheenViimeisinPvm: mockData.kasittelyvaiheenViimeisinPvm,
    asemakaavanHyvaksyjä: mockData.asemakaavanHyvaksyjä,
    asemakaavanDiaarinumero: mockData.asemakaavanDiaarinumero,
  };
};

export const createEmptyPartyEntry = (): PartyEntry => ({
  party: {
    details: {
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
  invoiceRecipient: {
    details: {
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
});

export const createEmptyPartiesFormValues = (): LandUsePartiesFormValues => ({
  parties: [createEmptyPartyEntry()],
});

export const clonePartiesFormValues = (
  values: LandUsePartiesFormValues,
): LandUsePartiesFormValues =>
  JSON.parse(JSON.stringify(values)) as LandUsePartiesFormValues;

export const createEmptyInvoicingFormValues =
  (): LandUseInvoicingFormValues => ({
    invoices: [],
  });
