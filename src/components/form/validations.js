// @flow
import type Moment from 'moment';
import moment from 'moment';

export const required = (value: any, error?: string) => (value ? undefined : (error ? error : 'Pakollinen kenttä'));

export const dateGreaterOrEqual = (date: ?Moment, otherDate: ?Moment, error?: string) => {
  if(!date || !otherDate) {
    return undefined;
  }
  return !moment(otherDate, 'DD.MM.YYYY').isAfter(moment(date, 'DD.MM.YYYY')) ? undefined : (error ? error : 'Loppupäivämäärä on aikaisempi kuin alkupäivämäärää');
};
