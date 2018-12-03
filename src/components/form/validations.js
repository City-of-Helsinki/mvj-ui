// @flow
import moment from 'moment';
import isArray from 'lodash/isArray';

import {isEmptyValue} from '$util/helpers';

const decimalPlaces = (n) => {
  let result= /^-?[0-9]+\.([0-9]+)$/.exec(n);
  return result === null ? 0 : result[1].length;
};

export const required = (value: any, error?: string) => {
  let val = value;
  if(isArray(value)) {
    return value.length ? undefined : (error ? error : 'Pakollinen kenttä');
  }
  if(value === Object(value)) {
    val = value.value;
  }
  return (!!val || val === 0) ? undefined : (error ? error : 'Pakollinen kenttä');
};

export const integer = (value: any, error?: string) => (isEmptyValue(value) || (Number.isInteger(Number(value))) ? undefined : (error ? error : 'Arvon tulee olla kokonaisluku'));

export const isDate = (value: any, error?: string) => (isEmptyValue(value) || moment(value).isValid() ? undefined : (error ? error : 'Arvon tulee olla päivämäärä'));

export const decimalNumber = (value: any, error?: string) => (isEmptyValue(value) || !isNaN(value.toString().replace(',', '.').replace(/\s+/g, '')) ? undefined : (error ? error : 'Arvon tulee olla numero'));

export const min = (value: any, min: number, error?: string) => (isEmptyValue(value) || (Number(value) >= min) ? undefined : (error ? error : `Minimiarvo on ${min}`));

export const max = (value: any, max: number, error?: string) => (isEmptyValue(value) || (Number(value) <= max) ? undefined : (error ? error : `Maksimiarvo on ${max}`));

export const maxLength = (value: any, max: number, error?: string) => ((!value || value.length <= max) ? undefined : (error ? error : `Maksimipituus on ${max}`));

export const digitsMaxLength = (value: any, max: number, error?: string) => ((isEmptyValue(value) || parseInt(value).toString().length <= max) ? undefined : (error ? error : `Kokonaislukuosan maksimipituus on ${max}`));

export const decimalsMaxLength = (value: any, max: number, error?: string) => ((isEmptyValue(value) || decimalPlaces(value.toString().replace(',', '.')) <= max) ? undefined : (error ? error : `Desimaaliosan maksimipituus on ${max}`));

export const dateGreaterOrEqual = (date: ?string, otherDate: ?string, error?: string) => {
  if(isEmptyValue(date) || isEmptyValue(otherDate)) {
    return undefined;
  }

  return moment(date).isBefore(moment(otherDate), 'day')
    ? error ? error : 'Loppupvm ei voi olla ennen alkupvm:ää'
    : undefined;
};

export const referenceNumber = (value: any, error?: string) => {
  if(isEmptyValue(value)) {
    return undefined;
  }
  const regex = RegExp('^[Hh][Ee][Ll] [0-9]{4}-[0-9]{6}$');
  return regex.test(value) ? undefined : (error ? error : 'Arvon tulee olla muotoa HEL 0000-000000');
};

export const year = (value: any, error?: string) => {
  if(isEmptyValue(value)) {
    return undefined;
  }
  const numbers = /^[0-9]+$/;
  const year = value.toString();

  if (!numbers.test(year) || year.length != 4) return error ? error : 'Vuoden tulee olla 4 numeron mittainen';

  return undefined;
};

export const genericValidator = (value: any, options: Object) => {
  if(!options) {
    return undefined;
  }
  let error = '';
  if(options.required) {
    error = required(value);
    if(error) {return error;}
  }
  if(options.type === 'date') {
    error = isDate(value);
    if(error) {return error;}
  }
  if(options.type === 'decimal') {
    error = decimalNumber(value);
    if(error) {return error;}

    if(options.max_digits) {
      error = digitsMaxLength(value, options.max_digits);
      if(error) {return error;}
    }

    if(options.decimal_places) {
      error = decimalsMaxLength(value, options.decimal_places);
      if(error) {return error;}
    }
  }
  if(options.type === 'integer') {
    error = integer(value);
    if(error) {return error;}
  }
  if(options.type === 'string' && options.max_length) {
    error = maxLength(value, options.max_length);
    if(error) {return error;}
  }
  if(options.min_value !== undefined && options.min_value !== null) {
    error = min(value, options.min_value);
    if(error) {return error;}
  }
  if(options.max_value !== undefined && options.max_value !== null) {
    error = max(value, options.max_value);
    if(error) {return error;}
  }
  return undefined;
};
