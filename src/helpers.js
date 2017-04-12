import {Languages} from './constants';
import find from 'lodash/find';

export const getDocumentWidth = () => {
  return Math.max(
    document.documentElement['clientWidth'],
    document.body['scrollWidth'],
    document.documentElement['scrollWidth'],
    document.body['offsetWidth'],
    document.documentElement['offsetWidth'],
  );
};

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

export const isAllowedLanguage = (language) => {
  return !!find(Languages, (item) => {
    return language === item;
  });
};

export const setPageTitle = (title) => {
  document.title = `${title}`;
};
