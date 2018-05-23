// @flow
import moment from 'moment';

export const normalizeDate = (date: any) => (date && moment(date).format('YYYY-MM-DD')) || null;

export const normalizeInteger = (value: any) => (value && Number.isInteger(Number(value))) ? Number(value) : value;

export const genericNormalizer = (value: any, options: Object) => {
  if(!options) {
    return value;
  }
  if(options.type === 'date') {
    return normalizeDate(value);
  }

  if(options.type === 'integer') {
    return normalizeInteger(value);
  }
  return value;
};
