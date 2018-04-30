// @flow
import {addEmptyOption} from '$util/helpers';

export const getNoticePeriodOptions = (noticePeriods: Array<Object>) => {
  if(!noticePeriods || !noticePeriods.length) {
    return [];
  }

  return addEmptyOption(noticePeriods.map((noticePeriod) => {
    return {
      value: noticePeriod.id,
      label: noticePeriod.name,
    };
  }));
};
