// @flow

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import App from '../app/App';
import i18n from './i18n';

import DummyPage from '../dummyPage/DummyPage';

export default
<Route path="/" component={App}>

  <IndexRoute onEnter={(nextState, replace) => {
    replace(`/${i18n.language}`);
  }}/>

  <Route path="/:language">
    <IndexRoute component={(props) => {
      return <DummyPage {...props} path={`/${i18n.language}/<front>`}/>;
    }}/>
    <Route path="*" component={ErrorPage}/>
  </Route>

  <Route path="*" component={ErrorPage}/>
</Route>;
