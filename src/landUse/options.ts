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
