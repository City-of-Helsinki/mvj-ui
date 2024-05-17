import format from "date-fns/format";
import { FieldTypes } from "src/enums";
export const normalizeDate = (date: any): string | null => date && format(new Date(date), 'yyyy-MM-dd') || null;
export const normalizeInteger = (value: any): any => value && Number.isInteger(Number(value)) ? Number(value) : value;
export const genericNormalizer = (value: any, options: Record<string, any>): any => {
  if (!options) {
    return value;
  }

  if (options.type === FieldTypes.DATE) {
    return normalizeDate(value);
  }

  if (options.type === FieldTypes.INTEGER) {
    return normalizeInteger(value);
  }

  return value;
};