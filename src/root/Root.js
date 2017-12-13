// @flow

import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import {OidcProvider} from 'redux-oidc';

import userManager from '../auth/util/user-manager';
import routes from './routes';

export type RootProps = {
  history: any,
  store: any,
};

const Root = ({history, store}: RootProps) =>
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <Router history={history} routes={routes} key={Math.random()}/>
    </OidcProvider>
  </Provider>;

export default Root;
