// @flow
import type Moment from 'moment';
import moment from 'moment';

export const required = (value: any, error?: string) => (value ? undefined : (error ? error : 'Pakollinen kenttä'));

export const integer = (value: any, error?: string) => (Number.isInteger(Number(value)) ? undefined : (error ? error : 'Arvon tulee olla kokonaisluku'));

export const decimalNumber = (value: any, error?: string) => (value === null || value === undefined || !isNaN(value.toString().replace(',', '.')) ? undefined : (error ? error : 'Arvon tulee olla numero'));

export const min = (value: any, min: number, error?: string) => ((Number(value) >= min) ? undefined : (error ? error : `Arvon tulee olla vähintään ${min}`));

export const max = (value: any, max: number, error?: string) => ((Number(value) <= max) ? undefined : (error ? error : `Arvon tulee olla vähintään ${max}`));

export const dateGreaterOrEqual = (date: ?Moment, otherDate: ?Moment, error?: string) => {
  if(!date || !otherDate) {
    return undefined;
  }
  console.log(date, otherDate);
  return !moment(otherDate, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']).isAfter(moment(date, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY'])) ? undefined : (error ? error : 'Loppupäivämäärä on aikaisempi kuin alkupäivämäärää');
};
