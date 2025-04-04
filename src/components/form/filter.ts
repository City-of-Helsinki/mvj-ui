const isValid = (value) =>
  typeof value !== "undefined" && value !== null && value !== "";

export const filterOptionsByLabel = (
  option: Record<string, any>,
  filterValue: string | null | undefined,
): boolean | null => {
  if (!filterValue) {
    return true;
  }

  const label = option["label"];
  const hasLabel = isValid(label);
  let labelTest = hasLabel ? String(label) : null;

  if (labelTest) {
    labelTest = labelTest.toLowerCase();
  }

  return !!labelTest && labelTest.indexOf(filterValue) >= 0;
};
