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
