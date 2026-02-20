import { normalizeSelectValue } from "../fieldUtils";
import type { MockLandUseData } from "../mocks/landUseMockData";
import type { LandUseSummaryFormValues } from "../components/tabs/LandUseSummary";
import type { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";
import type { LandUseSitesFormValues } from "../components/tabs/LandUseSites";

export const createEmptySummaryFormValues = (): LandUseSummaryFormValues => ({
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
    velvoitteidenMaaraika: mockData.velvotteidenMaaraAika,
    asemakaavanNumero: mockData.asemakaavanNumero,
    asemakaavanKasittelyvaihe: mockData.asemakaavanKayttotarkoitusyhmä,
    kasittelyvaiheenViimeisinPvm: mockData.kasittelyvaiheenViimeisinPvm,
    asemakaavanHyvaksyjä: mockData.asemakaavanHyvaksyjä,
    asemakaavanDiaarinumero: mockData.asemakaavanDiaarinumero,
  };
};

export const mapMockToSitesFormValues = (
  mockData: MockLandUseData | null,
): LandUseSitesFormValues => {
  if (!mockData) {
    return { items: [] };
  }

  return {
    items: mockData.kohteet.map((kohde, index) => ({
      id: `${mockData.identifier}-site-${index + 1}`,
      kohteenTunnus: kohde.kohteenTunnus,
      kayttotarkoitus: normalizeSelectValue(kohde.kayttotarkoitus),
      hallintamuoto: normalizeSelectValue(kohde.hallintamuoto),
      suojeltu: normalizeSelectValue(kohde.suojeltu),
      maankayttosopimusType: normalizeSelectValue(kohde.maankayttosopimusType),
      edistamisalue: normalizeSelectValue(kohde.edistamisalue),
      tila: normalizeSelectValue(kohde.tila),
      label: kohde.kohteenTunnus,
    })),
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
