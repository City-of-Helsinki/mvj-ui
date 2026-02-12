export const MUNICIPALITY_OPTIONS = [{ label: "Helsinki", value: "1" }];

export const DISTRICT_OPTIONS = [
  { label: "Kruununhaka", value: "1" },
  { label: "Vallila", value: "22" },
  { label: "Kalasatama", value: "49" },
  { label: "Jätkäsaari", value: "18" },
];

export const getMunicipalityLabel = (value: string): string =>
  MUNICIPALITY_OPTIONS.find((option) => option.value === value)?.label ?? "";

export const getDistrictLabel = (value: string): string =>
  DISTRICT_OPTIONS.find((option) => option.value === value)?.label ?? "";
