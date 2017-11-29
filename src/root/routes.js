// @flow

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import AppAlpha from '../app-alpha/App';
import App from '../app/App';
import i18n from './i18n';

import RoleSelector from '../role/RoleSelector';

import ApplicationsList from '../applications-alpha/components/ApplicationsList';
import CreateApplicationForm from '../applications-alpha/components/NewApplicationForm';

import LeaseListAlpha from '../leases-alpha/components/LeaseList';
import PreparerForm from '../leases-alpha/components/PreparerForm';
import LeaseList from '../leases/components/LeaseList';
import LeasePage from '../leases/components/LeasePage';

export default
<Route path="/">
  <IndexRoute onEnter={(nextState, replace) => {
    replace(`/beta`);
  }}/>
  <Route path="/alpha" component={AppAlpha}>
    <Route path=":language">
      <IndexRoute component={(props) => {
        return <RoleSelector {...props} path={`/alpha/${i18n.language}`}/>;
      }}/>
      <Route path="applications">
        <IndexRoute component={ApplicationsList}/>
        <Route path="create" component={CreateApplicationForm}/>
      </Route>
      <Route path="leases">
        <IndexRoute component={LeaseListAlpha}/>
        <Route path=":leaseId" component={PreparerForm}/>
      </Route>
      <Route path="*" component={ErrorPage}/>
    </Route>
  </Route>
  <Route path="/beta" component={App}>
    <IndexRoute onEnter={(nextState, replace) => {
      replace(`/beta/leases`);
    }}/>
    <Route path="leases">
      <IndexRoute component={LeaseList}/>
      <Route path=":leaseId" component={LeasePage}/>
    </Route>
  </Route>
</Route>;
