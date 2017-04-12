// @flow

import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import configureStore from './configureStore';
import renderApp from './renderApp';
import Root from './Root';

export default () => {
  const store = configureStore();
  const history = syncHistoryWithStore(browserHistory, store);

  const rootProps = {
    history,
    store,
  };

  renderApp(Root, rootProps);

  if (module.hot) {
    // $FlowFixMe
    module.hot.accept('./Root', () => {
      const nextRootComponent = require('./Root').default;
      renderApp(nextRootComponent, rootProps);
    });
  }

  if (process.env.NODE_ENV === 'production') {
    require('./enableOfflineMode');
  }
};
