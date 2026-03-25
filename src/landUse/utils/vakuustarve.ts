import { parseLandUseNumericValue } from "./number";

export const getKerroinPercent = (hintaero: number): number => {
  if (hintaero <= 500) {
    return 100;
  }

  if (hintaero <= 1000) {
    return 80;
  }

  if (hintaero <= 1500) {
    return 70;
  }

  return 60;
};

export const calculateHintaero = (
  perushinta: string | undefined,
  yksikkohinta: string | undefined,
): number | null => {
  const perushintaValue = parseLandUseNumericValue(perushinta);
  const yksikkohintaValue = parseLandUseNumericValue(yksikkohinta);

  if (perushintaValue === null || yksikkohintaValue === null) {
    return null;
  }

  return Math.max(0, perushintaValue - yksikkohintaValue);
};

export const calculateVakuustarve = (
  vaadittuValue: number | null,
  hintaeroValue: number | null,
  kerroinPercent: number | null,
  vertailunPeruskerroin: number | null,
): number | null => {
  if (
    vaadittuValue === null ||
    hintaeroValue === null ||
    kerroinPercent === null ||
    vertailunPeruskerroin === null
  ) {
    return null;
  }

  return (
    vaadittuValue *
    hintaeroValue *
    (kerroinPercent / 100) *
    vertailunPeruskerroin
  );
};
