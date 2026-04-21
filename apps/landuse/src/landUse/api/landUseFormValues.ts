import { normalizeSelectValue } from "../utils/fieldUtils";
import type { MockLandUseData } from "../mocks/landUseMockData";
import type { LandUseSummaryFormValues } from "../components/tabs/LandUseSummary";
import type { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";

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

export const createEmptyPartiesFormValues = (): LandUsePartiesFormValues => ({
  customer: {
    reference: "",
    details: {
      customerType: undefined,
      name: "",
      businessId: "",
      language: undefined,
      partnerCode: "",
      ovtCode: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: undefined,
      careOf: "",
      phone: "",
      email: "",
      landlord: undefined,
      note: "",
    },
  },
  contactPerson: {
    name: undefined,
    phone: "",
    email: "",
  },
  invoiceRecipient: {
    details: {
      customerType: undefined,
      name: "",
      businessId: "",
      language: undefined,
      partnerCode: "",
      ovtCode: "",
      customerNumber: "",
      sapCustomerNumber: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: undefined,
      careOf: "",
      phone: "",
      email: "",
      landlord: undefined,
      note: "",
    },
  },
  negotiatorsOptions: [],
  signatoriesOptions: [],
  negotiators: [{ name: undefined }],
  signatories: [{ name: undefined }],
});

export const clonePartiesFormValues = (
  values: LandUsePartiesFormValues,
): LandUsePartiesFormValues =>
  JSON.parse(JSON.stringify(values)) as LandUsePartiesFormValues;
