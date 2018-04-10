// @flow
import type Moment from 'moment';
import moment from 'moment';

export const required = (value: any, error?: string) => (value ? undefined : (error ? error : 'Pakollinen kenttä'));

export const integer = (value: any, error?: string) => (Number.isInteger(Number(value)) ? undefined : (error ? error : 'Arvon tulee olla kokonaisluku'));

export const isDate = (value: any, error?: string) => (value === null || value === undefined || moment(value).isValid() ? undefined : (error ? error : 'Arvon tulee olla päivämäärä'));

export const decimalNumber = (value: any, error?: string) => (value === null || value === undefined || !isNaN(value.toString().replace(',', '.')) ? undefined : (error ? error : 'Arvon tulee olla numero'));

export const min = (value: any, min: number, error?: string) => ((Number(value) >= min) ? undefined : (error ? error : `Minimiarvo on ${min}`));

export const max = (value: any, max: number, error?: string) => ((Number(value) <= max) ? undefined : (error ? error : `Maksimiarvo on ${max}`));

export const maxLength = (value: any, max: number, error?: string) => ((!value || value.length <= max) ? undefined : (error ? error : `Maksimipituus on ${max}`));

export const dateGreaterOrEqual = (date: ?Moment, otherDate: ?Moment, error?: string) => {
  if(!date || !otherDate) {
    return undefined;
  }
  return !moment(otherDate, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']).isAfter(moment(date, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY'])) ? undefined : (error ? error : 'Loppupäivämäärä on aikaisempi kuin alkupäivämäärää');
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
