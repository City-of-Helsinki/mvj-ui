import { addEmptyOption } from "@/util/helpers";
import type { SelectListOption } from "@/types";

/**
 * Get district options
 * @param {Object[]} districts
 * @returns {Object[]}
 */
export const getDistrictOptions = (
  districts: Array<Record<string, any>>,
  addEmpty: boolean = true,
): Array<SelectListOption> => {
  const items = districts || [];
  if (addEmpty) {
    return addEmptyOption(
      items.map((choice) => {
        return {
          value: choice.id,
          label: `${choice.name} (${choice.identifier})`,
        };
      }),
    );
  }
  return items.map((choice) => {
    return {
      value: choice.id,
      label: `${choice.name} (${choice.identifier})`,
    };
  });
};
