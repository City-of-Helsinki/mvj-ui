/**
 * Options for all Select elements.
 * This data will eventually be fetched from the backend, but for now it is hardcoded here
 * during UI mocking phase.
 */

export const MUNICIPALITY_OPTIONS = [{ label: "Helsinki", value: "1" }];

export const DISTRICT_OPTIONS = [
  {
    value: "0",
    label: "Koko Helsinki",
  },
  {
    value: "1",
    label: "Kruununhaka",
  },
  {
    value: "2",
    label: "Kluuvi",
  },
  {
    value: "3",
    label: "Kaartinkaupunki",
  },
  {
    value: "4",
    label: "Kamppi",
  },
  {
    value: "5",
    label: "Punavuori",
  },
  {
    value: "6",
    label: "Eira",
  },
  {
    value: "7",
    label: "Ullanlinna",
  },
  {
    value: "8",
    label: "Katajanokka",
  },
  {
    value: "9",
    label: "Kaivopuisto",
  },
  {
    value: "10",
    label: "Sörnäinen",
  },
  {
    value: "11",
    label: "Kallio",
  },
  {
    value: "12",
    label: "Alppiharju",
  },
  {
    value: "13",
    label: "Etu-töölö",
  },
  {
    value: "14",
    label: "Taka-töölö",
  },
  {
    value: "15",
    label: "Meilahti",
  },
  {
    value: "16",
    label: "Ruskeasuo",
  },
  {
    value: "17",
    label: "Pasila",
  },
  {
    value: "18",
    label: "Laakso",
  },
  {
    value: "19",
    label: "Mustikkamaa-Korkeasaari",
  },
  {
    value: "20",
    label: "Länsisatama",
  },
  {
    value: "21",
    label: "Hermanni",
  },
  {
    value: "22",
    label: "Vallila",
  },
  {
    value: "23",
    label: "Toukola",
  },
  {
    value: "24",
    label: "Kumpula",
  },
  {
    value: "25",
    label: "Käpylä",
  },
  {
    value: "26",
    label: "Koskela",
  },
  {
    value: "27",
    label: "Vanhakaupunki",
  },
  {
    value: "28",
    label: "Oulunkylä",
  },
  {
    value: "29",
    label: "Haaga",
  },
  {
    value: "30",
    label: "Munkkiniemi",
  },
  {
    value: "31",
    label: "Lauttasaari",
  },
  {
    value: "32",
    label: "Konala",
  },
  {
    value: "33",
    label: "Kaarela",
  },
  {
    value: "34",
    label: "Pakila",
  },
  {
    value: "35",
    label: "Tuomarinkylä",
  },
  {
    value: "36",
    label: "Viikki",
  },
  {
    value: "37",
    label: "Pukinmäki",
  },
  {
    value: "38",
    label: "Malmi",
  },
  {
    value: "39",
    label: "Tapaninkylä",
  },
  {
    value: "40",
    label: "Suutarila",
  },
  {
    value: "41",
    label: "Suurmetsä",
  },
  {
    value: "42",
    label: "Kulosaari",
  },
  {
    value: "43",
    label: "Herttoniemi",
  },
  {
    value: "44",
    label: "Tammisalo",
  },
  {
    value: "45",
    label: "Vartiokylä",
  },
  {
    value: "46",
    label: "Pitäjänmäki",
  },
  {
    value: "47",
    label: "Mellunkylä",
  },
  {
    value: "48",
    label: "Vartiosaari",
  },
  {
    value: "49",
    label: "Laajasalo",
  },
  {
    value: "50",
    label: "Villinki",
  },
  {
    value: "51",
    label: "Santahamina",
  },
  {
    value: "52",
    label: "Suomenlinna",
  },
  {
    value: "53",
    label: "Ulkosaaret",
  },
  {
    value: "54",
    label: "Vuosaari",
  },
  {
    value: "55",
    label: "Östersundom",
  },
  {
    value: "56",
    label: "Salmenkallio",
  },
  {
    value: "57",
    label: "Talosaari",
  },
  {
    value: "58",
    label: "Karhusaari",
  },
  {
    value: "59",
    label: "Ultuna",
  },
];

export const LAND_USE_NEGOTIATION_PHASES = {
  DRAFT: "Luonnos",
  IN_PROGRESS: "Vireillä",
  NEGOTIATION: "Neuvottelu",
  DECISION: "Päätös",
  SIGNATURE: "Allekirjoitus",
  NO_AGREEMENT: "Ei sopimusta",
} as const;

export type LandUseNegotiationPhase =
  (typeof LAND_USE_NEGOTIATION_PHASES)[keyof typeof LAND_USE_NEGOTIATION_PHASES];

export const landUseNegotiationPhaseOptions = Object.values(
  LAND_USE_NEGOTIATION_PHASES,
).map((value) => ({
  label: value,
  value,
}));

export const landUseDecisionMakerOptions = [
  {
    label: "Tonttipäällikkö",
    value: "Tonttipäällikkö",
  },
  {
    label: "Kaupunkiympäristölautakunta",
    value: "Kaupunkiympäristölautakunta",
  },
  { label: "Kaupunginhallitus", value: "Kaupunginhallitus" },
];

export const landUseSectionOptions = [
  { label: "10 §", value: "10 §" },
  { label: "20 §", value: "20 §" },
  { label: "30 §", value: "30 §" },
];

export const landUseDecisionTypeOptions = [
  {
    label: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    value: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
  },
  {
    label: "Maankäyttösopimuksen hyväksyntä",
    value: "Maankäyttösopimuksen hyväksyntä",
  },
];

export const landUseConditionTypeOptions = [
  {
    label: "Rasite - ja/tai rasitteenluont.ehto",
    value: "Rasite - ja/tai rasitteenluont.ehto",
  },
  { label: "Muu ehto", value: "Muu ehto" },
];

export const landUseAgreementTypeOptions = [
  { label: "Maankäyttösopimus", value: "Maankäyttösopimus" },
  {
    label: "Kiinteistökaupan esitietosopimus",
    value: "Kiinteistökaupan esitietosopimus",
  },
  { label: "Muu", value: "Muu" },
];

export const LAND_USE_GUARANTEE_TYPES = {
  PANTTIKIRJA: "Panttikirja",
  RAHAVAKUUS: "Rahavakuus",
  OMAVELKAINEN_TAKAUS: "Omavelkainen takaus",
  TILIVAROJEN_PANTTAUS: "Tilivarojen panttaus",
  MUU_VAKUUS: "Muu vakuus",
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

export const landUseGuaranteeCategoryOptions = [
  { label: "Sähköinen", value: "Sähköinen" },
  { label: "Paperinen", value: "Paperinen" },
];

export const landUseGuaranteeTargetOptions = [
  { label: "Kiinteistö", value: "Kiinteistö" },
  { label: "Laitos", value: "Laitos" },
];

export const landUseGuaranteeVierasvelkapanttausOptions = [
  { label: "Kyllä", value: "Kyllä" },
  { label: "Ei", value: "Ei" },
];

export const ASEMAKAAVA_KASITTELYVAIHE_OPTIONS = [
  "Vireillä",
  "Lainvoimainen",
  "Kumottu",
] as const;

export type AsemakaavaKasittelyvaihe =
  (typeof ASEMAKAAVA_KASITTELYVAIHE_OPTIONS)[number];

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

export const landUseCompensationSelectOptions = {
  kayttotarkoitus: [
    "Asuinkerrostalojen korttelialue",
    "Asuinkerrostalojen, liike- ja toimistorakennusten korttelialue",
    "Toimitilat",
  ],
  hallintamuoto: [
    "Vapaarahoitteinen omistus",
    "Vapaarahoitteinen vuokra",
    "Lyhyt korkotuki (ARA 10)",
    "ASO",
  ],
  suojeltu: ["-", "SR1", "SR2"],
};

export const LAND_USE_INVOICE_TYPES = {
  MAANKAYTTOKORVAUS: "Maankäyttökorvaus",
  SAKKO: "Sakko",
  PERINTA: "Perintä",
} as const;

export type LandUseInvoiceType =
  (typeof LAND_USE_INVOICE_TYPES)[keyof typeof LAND_USE_INVOICE_TYPES];

export const landUseInvoiceTypeSelectOptions: {
  label: string;
  value: LandUseInvoiceType;
}[] = Object.values(LAND_USE_INVOICE_TYPES).map((value) => ({
  label: value,
  value,
}));

export const landUseInvoiceStatusSelectOptions = [
  "Luonnos",
  "Odottaa hyväksyntää",
  "Avoin",
  "Maksettu",
].map((status) => ({ label: status, value: status }));

export const LAND_USE_INVOICE_ITEM_TYPES = {
  MAANKAYTTOKORVAUS: "Maankäyttökorvaus",
  KOROTUS: "Korotus",
  KORKO: "Korko",
  SAKKO: "Sakko",
} as const;

export type LandUseInvoiceItemType =
  (typeof LAND_USE_INVOICE_ITEM_TYPES)[keyof typeof LAND_USE_INVOICE_ITEM_TYPES];

export const landUseInvoiceItemTypeSelectOptions: {
  label: string;
  value: LandUseInvoiceItemType;
}[] = Object.values(LAND_USE_INVOICE_ITEM_TYPES).map((value) => ({
  label: value,
  value,
}));

export const landUseKohdeSelectOptions = [
  { label: "91-10-100-1", value: "91-10-100-1" },
  { label: "91-11-200-2", value: "91-11-200-2" },
  { label: "91-12-300-3", value: "91-12-300-3" },
  { label: "91-13-400-4", value: "91-13-400-4" },
  { label: "91-14-500-5", value: "91-14-500-5" },
  { label: "91-15-600-6", value: "91-15-600-6" },
];

export const partyRoleOptions = [
  { label: "Maanomistaja", value: "maanomistaja" },
  { label: "Toteuttaja", value: "toteuttaja" },
];

export const partyTypeOptions = [
  { label: "Yritys", value: "yritys" },
  { label: "Yksityishenkilö", value: "yksityishenkilo" },
];

export const languageOptions = [
  { label: "suomi", value: "suomi" },
  { label: "ruotsi", value: "ruotsi" },
  { label: "englanti", value: "englanti" },
];

export const countryOptions = [
  { label: "Suomi", value: "suomi" },
  { label: "Ruotsi", value: "ruotsi" },
  { label: "Norja", value: "norja" },
];
