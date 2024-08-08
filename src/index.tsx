import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { OidcProvider } from 'redux-oidc';
import configureStore, { history } from '@/root/configureStore';
import routes from '@/root/routes';
import userManager from '@/auth/util/user-manager';

import './polyfills';
export const store = configureStore();

const container = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    {/*
    // @ts-ignore: Children not included in type error */}
    <OidcProvider store={store} userManager={userManager}>
      {/*
      // @ts-ignore: Children not included in type error */}
      <ConnectedRouter history={history}>
        {routes}
      </ConnectedRouter>
    </OidcProvider>
  </Provider>,
  container
  );