// Utilities for form field normalization

/**
 * react-final-form renders Field values as "" when they’re undefined.
 * HDS Select treats "" as a value, so the placeholder never shows.
 * This function converts "" back to undefined, so the placeholder works as
 * expected.
 */
export const normalizeSelectValue = (value?: string | null) =>
  value === "" || value == null ? undefined : value;
