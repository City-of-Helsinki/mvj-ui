// @flow
import isNumber from 'lodash/isNumber';
import moment from 'moment';

export const formatDate = (date: string) => {
  if (!date) {
    return '';
  }

  const d = isNumber(date) ? moment.unix(date) : moment(date);
  return d.format('DD.MM.YYYY');
};
export const getLogo = () => {
  return require(`../assets/images/logo.svg`);
};

export const getLogoClass = () => {
  return 'logo-image';
};
