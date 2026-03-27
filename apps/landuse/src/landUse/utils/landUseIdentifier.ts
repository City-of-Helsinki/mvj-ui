const LAND_USE_PREFIX = "MA";

const padDistrict = (district: string | number): string =>
  String(district).padStart(2, "0");

export const createLandUseIdentifier = (
  municipalityId: string,
  districtId: string,
  sequence: number,
): string =>
  `${LAND_USE_PREFIX}${municipalityId}${padDistrict(districtId)}-${sequence}`;

export const getNextLandUseSequence = (
  existingIdentifiers: string[],
  municipalityId: string,
  districtId: string,
): number => {
  const prefix = `${LAND_USE_PREFIX}${municipalityId}${padDistrict(districtId)}-`;
  const sequences = existingIdentifiers
    .filter((identifier) => identifier.startsWith(prefix))
    .map((identifier) => identifier.replace(prefix, ""))
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (sequences.length === 0) {
    return 1;
  }

  return Math.max(...sequences) + 1;
};
