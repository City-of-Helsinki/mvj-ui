import type { LandUseCollateralsFormValues } from "../components/tabs/LandUseCollaterals";
import type {
  LandUseCompensationsFormValues,
  LandUseSite,
} from "../components/tabs/LandUseCompensations";
import type { LandUseDecisionsFormValues } from "../components/tabs/LandUseDecisions";
import type { LandUseInvoicingFormValues } from "../components/tabs/LandUseInvoicing";
import type { LandUseMapFormValues } from "../components/tabs/LandUseMap";
import type { LandUseMonitoringFormValues } from "../components/tabs/LandUseMonitoring";
import type { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";
import { negotiatorsOptions, signatoriesOptions } from "../options";

export interface MockLandUseData {
  identifier: string;
  maankayttosopimusType: string;
  edistamisalue: string;
  tila: string;
  suunnittelunPerusteenaOlevatKohteet: string[];
  kohteet: Array<{
    kohteenTunnus: string;
    kayttotarkoitus: string;
    hallintamuoto: string;
    suojeltu: string;
  }>;
  osoitteet: Array<{
    katuosoite: string;
    postinumero: string;
    kaupunki: string;
  }>;
  valmistelijat: Array<{
    firstName: string;
    lastName: string;
  }>;
  arvioituEsittelyvuosi: string;
  arvioituMaksuvuosi: string;
  toimivaltainenPaattaja: string;
  sisaltaaAmVelvoitteita: string;
  velvoitteidenMaaraika: string;
  asemakaavanNumero: string;
  asemakaavanKasittelyvaihe: string;
  kasittelyvaiheenViimeisinPvm: string;
  asemakaavanHyvaksyjä: string;
  asemakaavanDiaarinumero: string;
}

const createBasePartiesFormValues = (): LandUsePartiesFormValues => ({
  customer: {
    reference: "",
    details: {
      customerType: "",
      name: "",
      businessId: "",
      language: "",
      partnerCode: "",
      ovtCode: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      careOf: "",
      phone: "",
      email: "",
      landlord: "",
      note: "",
    },
  },
  contactPerson: {
    name: "",
    phone: "",
    email: "",
  },
  invoiceRecipient: {
    details: {
      customerType: "",
      name: "",
      businessId: "",
      language: "",
      partnerCode: "",
      ovtCode: "",
      customerNumber: "",
      sapCustomerNumber: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      careOf: "",
      phone: "",
      email: "",
      landlord: "",
      note: "",
    },
  },
  negotiatorsOptions,
  signatoriesOptions,
  negotiators: [{ name: "" }],
  signatories: [{ name: "" }],
});

const ma113Parties = createBasePartiesFormValues();
ma113Parties.customer = {
  ...ma113Parties.customer,
  reference: "MA113-REF",
};
ma113Parties.customer.details = {
  ...ma113Parties.customer.details,
  customerType: "yritys",
  name: "Helsingin kaupunki",
  businessId: "3100001-5",
  language: "suomi",
  country: "suomi",
  landlord: "kylla",
};
ma113Parties.contactPerson = {
  name: "Liisa Virtanen",
  phone: "050 555 0000",
  email: "liisa.virtanen@example.com",
};
ma113Parties.invoiceRecipient = {
  ...ma113Parties.invoiceRecipient,
  details: {
    ...ma113Parties.invoiceRecipient.details,
    customerType: "yritys",
    name: "Helsingin kaupunki",
    businessId: "3100001-5",
    language: "suomi",
    partnerCode: "77777",
    ovtCode: "003703100001",
    customerNumber: "C-0456",
    sapCustomerNumber: "SAP-0456",
    streetAddress: "Kaupungintalo 1",
    city: "Helsinki",
    postalCode: "00100",
    country: "suomi",
    landlord: "kylla",
  },
};
ma113Parties.negotiators = [{ name: negotiatorsOptions[1].value }];
ma113Parties.signatories = [{ name: signatoriesOptions[0].value }];

export interface LandUseAgreementMockTabs {
  summary: MockLandUseData | null;
  parties: LandUsePartiesFormValues | null;
  compensations: LandUseCompensationsFormValues;
  collaterals: LandUseCollateralsFormValues;
  monitoring: LandUseMonitoringFormValues;
  decisions: LandUseDecisionsFormValues;
  invoicing: LandUseInvoicingFormValues;
  map: LandUseMapFormValues;
}

const ma113Sites: LandUseSite[] = [
  {
    id: "MA113-1-site-1",
    kohteenTunnus: "01-49-920-6",
    pintaAlaM2: "4500",
    km2: "3600",
    kayttotarkoitus: "Asuinkerrostalojen korttelialue",
    hallintamuoto: "Vapaarahoitteinen omistus",
    suojeltu: "SR1",
  },
];

const ma113Compensations: LandUseCompensationsFormValues = {
  sites: ma113Sites,
  rahakorvaus: "450000",
  maakorvaus: "120000",
  muuKorvaus: "25000",
  perushinta: "1850",
  maakorvausSelite: "Maakorvaus kohdistuu puistoalueiden hankintaan.",
  muuSelite: "Muu korvaus sisältää kunnallistekniikan liittymismaksuja.",
  perustietotaulukkoRowsBySiteId: {
    "MA113-1-site-1": {
      yksikkohinta: "1725",
    },
  },
  yleisetAlueetNeliot: "850",
  yleisetAlueetHankinnanArvo: "40000",
};

const ma113Decisions: LandUseDecisionsFormValues = {
  decisions: [
    {
      title: "Päätös 1",
      paattaja: "Ville Virkailija",
      paatospvm: "15.01.2026",
      pykala: "60 §",
      paatoksenTyyppi: "Maankäyttösopimuksen hyväksyntä",
      diaarinumero: "HEL 2024-012345",
      huomautus: "Päätös eteni lautakunnan käsittelyyn suunnitellusti.",
      ehdot: [
        {
          conditionType: "Muu ehto",
          valvontapvm: "31.12.2026",
          valvottuPvm: "",
          note: "Rakennusoikeuden toteumaa seurataan vuosittain.",
        },
      ],
    },
  ],
  agreements: [
    {
      title: "Sopimus 1",
      sopimuksenTyyppi: "Maankäyttösopimus",
      sopimusnumero: "MA113-SOP-2026-01",
      allekirjoituspvm: "20.01.2026",
      huomautus: "Allekirjoitettu osapuolten yhteisessä tilaisuudessa.",
      allekirjoitettavaMennessa: "28.02.2026",
      ensimmainenKutsuLahetetty: "22.01.2026",
      toinenKutsuLahetetty: "29.01.2026",
      kolmasKutsuLahetetty: "05.02.2026",
      paatos: "Maankäyttösopimuksen hyväksyntä",
      muutokset: [
        {
          allekirjoituspvm: "10.03.2026",
          allekirjoitettavaMennessa: "31.03.2026",
          ensimmainenKutsuLahetetty: "12.03.2026",
          toinenKutsuLahetetty: "19.03.2026",
          kolmasKutsuLahetetty: "26.03.2026",
          paatos: "Maankäyttösopimuksen hyväksyntä",
          huomautus: "Muutoksella tarkennettu vakuuden ehtoja.",
        },
      ],
      vakuuslaskuri: true,
      vakuudet: [
        {
          jarjestysnumero: "1",
          tyyppi: "Pankkitakaus",
          laji: "Rahavakuus",
          vakuusnumero: "VAK-113-1",
          alkupvm: "20.01.2026",
          loppupvm: "31.12.2028",
          palautettuPvm: "",
          huomautus: "Vakuus voimassa koko rakentamisvaiheen ajan.",
          panttikirjanNumero: "PT-998877",
          vakuudenMaara: "250000",
          vakuuttaKaytetty: "80000",
          vakuuttaJaljella: "170000",
          siteUsages: [
            {
              kohde: "01-49-920-6",
              hallintamuoto: "Vapaarahoitteinen omistus",
              vakuuttaKaytettyEuro: "80000",
              vakuuttaKaytettyProsentti: "32",
            },
          ],
        },
      ],
    },
  ],
};

const ma113Collaterals: LandUseCollateralsFormValues = {
  vertailunPeruskerroin: 1,
  vakuusValinnatBySiteId: {
    "MA113-1-site-1": [
      {
        guaranteeId: "agreement-0-guarantee-0",
        sopimusnumero: "MA113-SOP-2026-01",
        jarjestysnumero: "1",
        vakuuttaJaljella: "250000",
        kaytettavaMaara: "80000",
      },
    ],
  },
};

const ma113Monitoring: LandUseMonitoringFormValues = {
  toteumaEntriesBySiteId: {
    "MA113-1-site-1": [
      {
        value: "2800",
        createdAt: "2026-02-10T10:30:00.000Z",
      },
      {
        value: "3100",
        createdAt: "2026-03-05T09:15:00.000Z",
      },
    ],
  },
  sakkoRows: [
    {
      kohteenTunnus: "01-49-920-6",
      hallintamuoto: "Vapaarahoitteinen omistus",
      vaadittuKerrosala: "3600",
      toteutunutKerrosala: "3100",
      hintaero: "500",
      korotus: "15 %",
    },
  ],
};

const ma113Invoicing: LandUseInvoicingFormValues = {};
const ma113Map: LandUseMapFormValues = {};

export const mockLandUseTabStore: Record<string, LandUseAgreementMockTabs> = {
  "MA113-1": {
    summary: {
      identifier: "MA113-1",
      maankayttosopimusType: "Maankäyttösopimus",
      edistamisalue: "Kalasatama",
      tila: "Vireillä",
      suunnittelunPerusteenaOlevatKohteet: ["01-49-920-6"],
      kohteet: [
        {
          kohteenTunnus: "01-49-920-6",
          kayttotarkoitus: "Asuinkerrostalojen korttelialue",
          hallintamuoto: "Vapaarahoitteinen omistus",
          suojeltu: "SR1",
        },
      ],
      osoitteet: [
        {
          katuosoite: "Tyynenmerenkatu 10",
          postinumero: "00220",
          kaupunki: "Helsinki",
        },
      ],
      valmistelijat: [
        { firstName: "Matti", lastName: "Meikäläinen" },
        { firstName: "Liisa", lastName: "Virtanen" },
      ],
      arvioituEsittelyvuosi: "2026",
      arvioituMaksuvuosi: "2027",
      toimivaltainenPaattaja: "Kaupunkiympäristölautakunta",
      sisaltaaAmVelvoitteita: "kyllä",
      velvoitteidenMaaraika: "11.2030",
      asemakaavanNumero: "0000738",
      asemakaavanKasittelyvaihe: "5. Hyväksyminen",
      kasittelyvaiheenViimeisinPvm: "02.11.2025",
      asemakaavanHyvaksyjä: "Henkilö 5",
      asemakaavanDiaarinumero: "HEL 4120-305774",
    },
    parties: ma113Parties,
    compensations: ma113Compensations,
    collaterals: ma113Collaterals,
    monitoring: ma113Monitoring,
    decisions: ma113Decisions,
    invoicing: ma113Invoicing,
    map: ma113Map,
  },
};

export const mockLandUseStore: Record<string, MockLandUseData> = Object.entries(
  mockLandUseTabStore,
).reduce<Record<string, MockLandUseData>>((acc, [agreementId, tabs]) => {
  if (tabs.summary) {
    acc[agreementId] = tabs.summary;
  }
  return acc;
}, {});
