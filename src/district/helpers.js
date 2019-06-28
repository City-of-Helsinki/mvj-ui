// @flow
import {addEmptyOption} from '$util/helpers';

/**
 * Get district options
 * @param {Object[]} districts
 * @returns {Object[]}
 */
export const getDistrictOptions = (districts: Array<Object>): Array<Object> => {
  const items = districts || [];
  
  return addEmptyOption(items.map((choice) => {
    return {
      value: choice.id,
      label: `${choice.name} (${choice.identifier})`,
    };
  }));
};
