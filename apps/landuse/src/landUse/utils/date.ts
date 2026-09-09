const parseFinnishDateToISO = (dateStr: string): string | null => {
  const [day, month, year] = dateStr.split(".");
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/** Days between two DD.MM.YYYY dates (exclusive end), or 0 if either is invalid. */
export const calculateInvoicingPeriodDays = (
  startDateStr: string,
  endDateStr: string,
): number => {
  if (!startDateStr.trim() || !endDateStr.trim()) return 0;
  const startISO = parseFinnishDateToISO(startDateStr);
  const endISO = parseFinnishDateToISO(endDateStr);
  if (!startISO || !endISO) return 0;
  const start = Temporal.PlainDate.from(startISO);
  const end = Temporal.PlainDate.from(endISO);
  return start.until(end, { largestUnit: "day" }).days;
};
