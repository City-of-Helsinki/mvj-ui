// @flow

import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import {I18nextProvider} from 'react-i18next';
import routes from './routes';
import i18n from './i18n';

export type RootProps = {
  history: any,
  store: any,
};

const Root = ({history, store}: RootProps) =>
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Router history={history} routes={routes} key={Math.random()}/>
    </Provider>
  </I18nextProvider>;

export default Root;
