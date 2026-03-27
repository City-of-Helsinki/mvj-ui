import { LandUseSite } from "../components/tabs/LandUseCompensations";
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

export const calculateSaantelynMukainenOriginalValue = (
  sites: LandUseSite[],
  compensationsRowsBySiteId: Record<string, { yksikkohinta: string }>,
  perushinta: string | undefined,
  vertailunPeruskerroin: number | null,
): number =>
  sites.reduce((sum, site) => {
    const vaadittuValue = parseLandUseNumericValue(site.km2);
    const yksikkohintaValue = compensationsRowsBySiteId[site.id]?.yksikkohinta;
    const hintaeroValue = calculateHintaero(perushinta, yksikkohintaValue);
    const kerroinPercent =
      hintaeroValue !== null ? getKerroinPercent(hintaeroValue) : null;
    const vakuustarveValue = calculateVakuustarve(
      vaadittuValue,
      hintaeroValue,
      kerroinPercent,
      vertailunPeruskerroin,
    );
    return sum + (vakuustarveValue ?? 0);
  }, 0);

export const calculateSopimussakko = (
  hintaero: number | null,
  vertailunPeruskerroin: number | null,
): number | null => {
  if (hintaero === null || vertailunPeruskerroin === null) {
    return null;
  }

  return hintaero * vertailunPeruskerroin;
};

export const calculateToteuttamatta = (
  vaadittu: number | null,
  toteutunut: number | null,
): number | null => {
  if (vaadittu === null || toteutunut === null) {
    return null;
  }

  return Math.max(0, vaadittu - toteutunut);
};
