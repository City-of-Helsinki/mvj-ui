import keyBy from 'lodash/keyBy';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';

import {AvailableLanguages, FallbackLanguage} from '../constants';

const localesContext = require.context('../../locales', true, /\.json$/);
const listOfLocalePaths = localesContext.keys();
const localesByPath = mapValues(
  keyBy(listOfLocalePaths, (s) => s),
  (localePath) => localesContext(localePath)
);
const resources = mapKeys(localesByPath, (_, localePath) =>
  localePath.replace(/^\.\//, '').replace(/\.json$/, ''));

i18n
  .use(LanguageDetector)
  .init({
    whitelist: AvailableLanguages,
    fallbackLng: FallbackLanguage,
    ns: ['common'],
    defaultNS: 'common',
    resources,
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
  }, () => {
    moment.locale(i18n.language);

    i18n.on('languageChanged', (language) => {
      moment.locale(language);
    });
  });

export default i18n;
