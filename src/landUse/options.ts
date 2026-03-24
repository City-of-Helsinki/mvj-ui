/**
 * Options for all Select elements.
 * This data will eventually be fetched from the backend, but for now it is hardcoded here
 * during UI mocking phase.
 */

export const MUNICIPALITY_OPTIONS = [{ label: "Helsinki", value: "1" }];

export const DISTRICT_OPTIONS = [
  { label: "Kruununhaka", value: "1" },
  { label: "Vallila", value: "22" },
  { label: "Kalasatama", value: "49" },
  { label: "Jätkäsaari", value: "18" },
];

export const LAND_USE_EDISTAMISALUE_VALUES = [
  "Kalasatama",
  "Jätkäsaari",
  "Östersundom",
  "Pasila",
  "Kruunuvuorenranta",
  "Kuninkaantammi",
  "Honkasuo",
] as const;

export const landUseEdistamisalueOptions = LAND_USE_EDISTAMISALUE_VALUES.map(
  (value) => ({
    label: value,
    value,
  }),
);

export const LAND_USE_NEGOTIATION_PHASES = {
  VIREILLA: "Vireillä",
  NEUVOTTEILLA: "Neuvotteilla",
  PAATOS: "Päätös",
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
  { label: "Ville Virkailija", value: "Ville Virkailija" },
  {
    label: "Asuntotontit tiimipäällikkö",
    value: "Asuntotontit tiimipäällikkö",
  },
];

export const landUseSectionOptions = [
  { label: "60 §", value: "60 §" },
  { label: "61 §", value: "61 §" },
  { label: "62 §", value: "62 §" },
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
  { label: "Esisopimus", value: "Esisopimus" },
];

export const landUseGuaranteeTypeOptions = [
  { label: "Muu vakuus", value: "Muu vakuus" },
  { label: "Pankkitakaus", value: "Pankkitakaus" },
];

export const landUseGuaranteeCategoryOptions = [
  { label: "-", value: "-" },
  { label: "Rahavakuus", value: "Rahavakuus" },
];

export const ASEMAKAAVA_KASITTELYVAIHE_OPTIONS = [
  "1. Käynnistys",
  "2. OAS",
  "3. Ehdotus",
  "4. Tarkistettu ehdotus",
  "5. Hyväksyminen",
  "6. Voimaantulo",
] as const;

export type AsemakaavaKasittelyvaihe =
  (typeof ASEMAKAAVA_KASITTELYVAIHE_OPTIONS)[number];

export interface AsemakaavaListItem {
  asemakaavanNumero: string;
  asemakaavanKasittelyvaihe: AsemakaavaKasittelyvaihe;
  kasittelyvaiheenViimeisinPvm: string;
  asemakaavanHyvaksyjä: string;
  asemakaavanDiaarinumero: string;
}

export const landUseAsemakaavaListItems: AsemakaavaListItem[] = [
  {
    asemakaavanNumero: "0000255",
    asemakaavanKasittelyvaihe: "1. Käynnistys",
    kasittelyvaiheenViimeisinPvm: "12.01.2025",
    asemakaavanHyvaksyjä: "Henkilö 1",
    asemakaavanDiaarinumero: "HEL 2947-138205",
  },
  {
    asemakaavanNumero: "0000412",
    asemakaavanKasittelyvaihe: "2. OAS",
    kasittelyvaiheenViimeisinPvm: "27.03.2025",
    asemakaavanHyvaksyjä: "Henkilö 2",
    asemakaavanDiaarinumero: "HEL 1035-880164",
  },
  {
    asemakaavanNumero: "0000569",
    asemakaavanKasittelyvaihe: "3. Ehdotus",
    kasittelyvaiheenViimeisinPvm: "08.06.2025",
    asemakaavanHyvaksyjä: "Henkilö 3",
    asemakaavanDiaarinumero: "HEL 7408-064219",
  },
  {
    asemakaavanNumero: "0000623",
    asemakaavanKasittelyvaihe: "4. Tarkistettu ehdotus",
    kasittelyvaiheenViimeisinPvm: "14.09.2025",
    asemakaavanHyvaksyjä: "Henkilö 4",
    asemakaavanDiaarinumero: "HEL 5512-972406",
  },
  {
    asemakaavanNumero: "0000738",
    asemakaavanKasittelyvaihe: "5. Hyväksyminen",
    kasittelyvaiheenViimeisinPvm: "02.11.2025",
    asemakaavanHyvaksyjä: "Henkilö 5",
    asemakaavanDiaarinumero: "HEL 4120-305774",
  },
  {
    asemakaavanNumero: "0000891",
    asemakaavanKasittelyvaihe: "6. Voimaantulo",
    kasittelyvaiheenViimeisinPvm: "19.01.2026",
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
  hallintamuoto: ["Vapaarahoitteinen omistus", "ARA-Vuokra", "ASO"],
  suojeltu: ["-", "SR1", "SR2"],
};

export const landUseKohdeSelectOptions = [
  { label: "01-49-920-6", value: "01-49-920-6" },
  { label: "02-18-450-3", value: "02-18-450-3" },
  { label: "03-27-780-1", value: "03-27-780-1" },
  { label: "04-15-320-2", value: "04-15-320-2" },
  { label: "05-33-120-9", value: "05-33-120-9" },
];

export const negotiatorsOptions = [
  { label: "NN", value: "NN" },
  { label: "Liisa Virtanen", value: "Liisa Virtanen" },
  { label: "Matti Meikäläinen", value: "Matti Meikäläinen" },
];

export const signatoriesOptions = [
  { label: "Ylipäällikkö", value: "Ylipäällikkö" },
  { label: "Välipäällikkö", value: "Välipäällikkö" },
  { label: "Alipäällikkö", value: "Alipäällikkö" },
];
