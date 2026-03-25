export const parseLandUseNumericValue = (
  value: string | number | undefined,
): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const compactValue = value
    .replace(/\u00A0/g, "")
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/[^0-9,.-]/g, "");

  if (!compactValue) {
    return null;
  }

  let normalized = compactValue.replace(/,/g, ".");
  if ((normalized.match(/\./g) ?? []).length > 1) {
    const lastDotIndex = normalized.lastIndexOf(".");
    normalized =
      normalized.slice(0, lastDotIndex).replace(/\./g, "") +
      normalized.slice(lastDotIndex);
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatLandUseNumericValue = (value: number): string =>
  value.toLocaleString("fi-FI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export const formatLandUseIntegerValue = (value: number): string =>
  value.toLocaleString("fi-FI", {
    maximumFractionDigits: 0,
  });

export const formatLandUseNumericValueWithUnit = (
  value: number,
  unit: string,
): string => {
  if (value === null || value === undefined) {
    return "-";
  }
  return `${formatLandUseNumericValue(value)} ${unit}`;
};

export const formatLandUseEuroValue = (value: number): string =>
  `${formatLandUseNumericValue(value)} €`;

export const formatLandUseEuroDisplayValue = (
  value: string | number | undefined,
): string => {
  const parsedValue = parseLandUseNumericValue(value);
  if (parsedValue === null) {
    return value?.toString() ?? "-";
  }

  return formatLandUseEuroValue(parsedValue);
};

export const parseLandUseNumericValueOrZero = (
  value: string | number | undefined,
): number => parseLandUseNumericValue(value) ?? 0;
