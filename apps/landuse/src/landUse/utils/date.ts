export const formatLandUseDate = (value: string | null | undefined): string => {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : value;
};

const parseDate = (value: string): number | null => {
  const normalized = formatLandUseDate(value);
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(normalized);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day
    ? date.getTime() : null;
};

/** Days between two DD.MM.YYYY dates (exclusive end), or 0 if either is invalid. */
export const calculateInvoicingPeriodDays = (
  startDateStr: string,
  endDateStr: string,
): number => {
  const start = parseDate(startDateStr ?? "");
  const end = parseDate(endDateStr ?? "");
  return start === null || end === null ? 0 : (end - start) / 86400000;
};
