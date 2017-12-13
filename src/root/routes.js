// @flow
import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import App from '../app/App';
import CallbackPage from '../auth/components/CallbackPage';
import LeaseList from '../leases/components/LeaseList';
import LeasePage from '../leases/components/LeasePage';
import LoginPage from '../auth/components/LoginPage';

export default
<Route path="/" component={App}>
  <IndexRedirect to="leases" />
  <Route path="leases" components={LeaseList} />
  <Route path="leases/:leaseId" component={LeasePage}/>
  <Route path="logout" components={LoginPage} />
  <Route path="callback" components={CallbackPage} />
  <Route path="*" component={ErrorPage}/>
</Route>;
