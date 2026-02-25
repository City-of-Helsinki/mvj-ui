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
