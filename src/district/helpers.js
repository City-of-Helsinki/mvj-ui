// @flow
import {addEmptyOption} from '$util/helpers';

export const getDistrictOptions = (districts: Array<Object>) => {
  const items = districts || [];
  
  return addEmptyOption(items.map((choice) => {
    return {
      value: choice.id,
      label: `${choice.name} (${choice.identifier})`,
    };
  }));
};
