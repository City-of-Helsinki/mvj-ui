export const LAND_USE_TAB_KEYS = [
  "summary",
  "parties",
  "compensations",
  "collaterals",
  "monitoring",
  "decisions",
  "invoicing",
  "map",
] as const;

export type LandUseTabKey = (typeof LAND_USE_TAB_KEYS)[number];
