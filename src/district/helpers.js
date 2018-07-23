// @flow
import get from 'lodash/get';

export const getDistrictOptions = (districts: Array<Object>) => {
  if(!districts || !districts.length) {
    return [];
  }

  return [{value: '', label: ''}, ...districts.map((choice) => {
    return {
      value: get(choice, 'id'),
      label: `${get(choice, 'name')} (${get(choice, 'identifier')})`,
    };
  })];
};
