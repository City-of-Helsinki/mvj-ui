import { addEmptyOption } from "util/helpers";

/**
 * Get district options
 * @param {Object[]} districts
 * @returns {Object[]}
 */
export const getDistrictOptions = (districts: Array<Record<string, any>>): Array<Record<string, any>> => {
  const items = districts || [];
  return addEmptyOption(items.map(choice => {
    return {
      value: choice.id,
      label: `${choice.name} (${choice.identifier})`
    };
  }));
};