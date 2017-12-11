// @flow
import React from 'react';
import {Route, IndexRoute} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import App from '../app/App';
import LeaseList from '../leases/components/LeaseList';
import LeasePage from '../leases/components/LeasePage';

export default
<Route path="/" component={App}>
  <IndexRoute onEnter={(nextState, replace) => {
    replace(`/leases`);
  }}/>
  <Route path="leases">
    <IndexRoute component={LeaseList}/>
    <Route path=":leaseId" component={LeasePage}/>
  </Route>
  <Route path="*" component={ErrorPage}/>
</Route>;
