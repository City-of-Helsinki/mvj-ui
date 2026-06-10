import { LandUseSite } from "../components/tabs/LandUseCompensations";
import { parseLandUseNumericValue } from "./number";

export const getVakuustarveKerroinPercent = (sopimussakko: number): number => {
  if (sopimussakko <= 500) {
    return 100;
  }

  if (sopimussakko <= 1000) {
    return 80;
  }

  if (sopimussakko <= 1500) {
    return 70;
  }

  return 60;
};

export const calculateHintaero = (
  perushinta: string | undefined,
  yksikkohinta: string | undefined,
): number | null => {
  const MINIMUM_HINTAERO = 250;
  const perushintaValue = parseLandUseNumericValue(perushinta);
  const yksikkohintaValue = parseLandUseNumericValue(yksikkohinta);

  if (perushintaValue === null || yksikkohintaValue === null) {
    return null;
  }

  return Math.max(MINIMUM_HINTAERO, perushintaValue - yksikkohintaValue);
};

export const calculateVakuustarve = (
  vaadittuValue: number | null,
  hintaeroValue: number | null,
  kerroinPercent: number | null,
  korotuskerroin: number | null,
): number | null => {
  if (
    vaadittuValue === null ||
    hintaeroValue === null ||
    kerroinPercent === null ||
    korotuskerroin === null
  ) {
    return null;
  }

  return (
    vaadittuValue * hintaeroValue * (kerroinPercent / 100) * korotuskerroin
  );
};

export const calculateSaantelynMukainenOriginalValue = (
  sites: LandUseSite[],
  compensationsRowsBySiteId: Record<string, { yksikkohinta: string }>,
  perushinta: string | undefined,
  korotuskerroin: number | null,
): number =>
  sites.reduce((sum, site) => {
    const vaadittuValue = parseLandUseNumericValue(site.kem2);
    const yksikkohintaValue = compensationsRowsBySiteId[site.id]?.yksikkohinta;
    const hintaeroValue = calculateHintaero(perushinta, yksikkohintaValue);
    const sopimussakko = calculateSopimussakko(hintaeroValue, korotuskerroin);
    const vakuustarveKerroinPercent =
      sopimussakko !== null ? getVakuustarveKerroinPercent(sopimussakko) : null;
    const vakuustarveValue = calculateVakuustarve(
      vaadittuValue,
      hintaeroValue,
      vakuustarveKerroinPercent,
      korotuskerroin,
    );
    return sum + (vakuustarveValue ?? 0);
  }, 0);

export const calculateSopimussakko = (
  hintaero: number | null,
  korotuskerroin: number | null,
): number | null => {
  if (hintaero === null || korotuskerroin === null) {
    return null;
  }

  return hintaero * korotuskerroin;
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
