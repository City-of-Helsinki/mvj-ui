// Utilities for form field normalization

/**
 * react-final-form renders Field values as "" when they’re undefined.
 * HDS Select treats "" as a value, so the placeholder never shows.
 * This function converts "" back to undefined, so the placeholder works as
 * expected.
 */
export const normalizeSelectValue = (value?: string | null) =>
  value === "" || value == null ? undefined : value;

export const getFieldTextValue = (
  isEditMode: boolean,
  value: string | undefined,
): string => (isEditMode ? (value ?? "") : readOnlyTextValue(value));

export const readOnlyTextValue = (value: string | undefined): string =>
  value || "-";

export type SelectOption = { label: string; value: string };

export const normalizeMultiSelectValue = (
  value: string[] | string | undefined,
): SelectOption[] => {
  if (Array.isArray(value)) {
    return value.map((v) => ({ label: v, value: v }));
  }
  if (typeof value === "string" && value !== "") {
    return [{ label: value, value }];
  }
  return [];
};

export const copyNumberToClipboard = async (value: number) => {
  const formattedValue = value.toFixed(2);
  await navigator.clipboard.writeText(formattedValue);
};

export const getOptionsDisplayValue = (
  inputValue: string | undefined,
  options: SelectOption[],
): string => {
  if (!inputValue) {
    return "-";
  }

  return options.find((option) => option.value === inputValue)?.label ?? "-";
};
