import i18n from './root/i18n';
import {Languages} from './constants';

export const getLogo = () => {
  switch (i18n.language) {
    case Languages.SV:
      return require(`../assets/images/logo-sv.svg`);
    default:
      return require(`../assets/images/logo.svg`);
  }
};

export const getLogoClass = () => {
  switch (i18n.language) {
    case Languages.SV:
      return 'logo-image-sv';
    default:
      return 'logo-image';
  }
};
