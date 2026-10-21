export const parseFinnishDateToIsoDate = (value: string): string | null => {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  const [day, month, year] = normalized.split(".");
  return day && month && year
    ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    : normalized;
};

export const parseIsoDateToFinnishDate = (
  value: string | null | undefined,
): string => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
};

/** Days between date-only values (exclusive end), or 0 for invalid input. */
export const calculateInvoicingPeriodDays = (
  startDateStr: string,
  endDateStr: string,
): number => {
  try {
    const startISO = parseFinnishDateToIsoDate(startDateStr);
    const endISO = parseFinnishDateToIsoDate(endDateStr);
    if (!startISO || !endISO) return 0;
    const start = Temporal.PlainDate.from(startISO);
    const end = Temporal.PlainDate.from(endISO);
    return start.until(end, { largestUnit: "day" }).days;
  } catch {
    return 0;
  }
};
