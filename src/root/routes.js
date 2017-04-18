// @flow

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import App from '../app/App';
import i18n from './i18n';

import RoleSelector from '../role/RoleSelector';
import ApplicationList from '../applications/ApplicationList';
import CreateApplication from '../applications/CreateApplication';

export default
<Route path="/" component={App}>

  <IndexRoute onEnter={(nextState, replace) => {
    replace(`/${i18n.language}`);
  }}/>

  <Route path="/:language">
    <IndexRoute component={(props) => {
      return <RoleSelector {...props} path={`/${i18n.language}`}/>;
    }}/>
    <Route path="applications">
      <IndexRoute component={ApplicationList}/>
      <Route path="create" component={CreateApplication}/>
      <Route path=":applicationId" component={ApplicationList}/>
    </Route>
    <Route path="*" component={ErrorPage}/>
  </Route>

</Route>;
