// @flow

import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import configureStore from './configureStore';
import renderApp from './renderApp';
import Root from './Root';

export const store = configureStore();
export default () => {

  const history = syncHistoryWithStore(browserHistory, store);

  const rootProps = {
    history,
    store,
  };

  renderApp(Root, rootProps);
  // $FlowFixMe
  if (module.hot) {
    // $FlowFixMe
    module.hot.accept('./Root', () => {
      const nextRootComponent = require('./Root').default;
      renderApp(nextRootComponent, rootProps);
    });
  }

  // if (process.env.NODE_ENV === 'production') {
  //   require('./enableOfflineMode');
  // }
};
