import {Languages} from '../constants';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import {toastr} from 'react-redux-toastr';
import moment from 'moment';
import i18n from '../root/i18n';

/**
 *
 * @returns {number}
 */
export const getDocumentWidth = () => {
  return Math.max(
    document.documentElement['clientWidth'],
    document.body['scrollWidth'],
    document.documentElement['scrollWidth'],
    document.body['offsetWidth'],
    document.documentElement['offsetWidth'],
  );
};

/**
 *
 * @returns {*}
 */
export const getFoundationBreakpoint = () => {
  const width = getDocumentWidth();
  if (width < 640)
    return 'small';
  if (width < 1024)
    return 'medium';
  if (width < 1200)
    return 'large';
  if (width < 1440)
    return 'xlarge';
  return 'xxlarge';
};

/**
 *
 * @param language
 * @returns {boolean}
 */
export const isAllowedLanguage = (language) => {
  return !!find(Languages, (item) => {
    return language === item;
  });
};

export const getActiveLanguage = () => {
  const {language} = i18n;
  let active = null;

  forEach(Languages, (item) => {
    if (item.id === language) {
      active = item;
      return false;
    }
  });

  return active;
};

/**
 *
 * @param title
 */
export const setPageTitle = (title) => {
  document.title = `${title}`;
};

/**
 * Display message in UI
 * @param message
 * @param opts
 */
export const displayUIMessage = (message, opts = {type: 'success'}) => {
  const {title, body} = message;
  return toastr[opts.type](title, body, opts);
};

/**
 *
 * @param unix
 * @param format
 * @returns {string}
 */
export const formatDateObj = (unix, format = 'DD.MM.YYYY HH:mm') => {
  return moment(unix).format(format);
};
