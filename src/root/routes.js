// @flow

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import App from '../app/App';
import i18n from './i18n';

import RoleSelector from '../role/RoleSelector';

import ApplicationsList from '../applications/components/ApplicationsList';
import CreateApplicationForm from '../applications/components/NewApplicationForm';

import LeaseList from '../leases/components/LeaseList';
import PreparerForm from '../leases/components/PreparerForm';

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
      <IndexRoute component={ApplicationsList}/>
      <Route path="create" component={CreateApplicationForm}/>
    </Route>
    <Route path="leases">
      <IndexRoute component={LeaseList}/>
      <Route path=":leaseId" component={PreparerForm}/>
    </Route>
    <Route path="*" component={ErrorPage}/>
  </Route>

</Route>;
