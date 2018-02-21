// @flow
import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import App from '../app/App';
import CallbackPage from '../auth/components/CallbackPage';
import LeaseList from '../leases/components/LeaseList';
import LeasePage from '../leases/components/LeasePage';
import LoginPage from '../auth/components/LoginPage';
import RentCriteriaList from '../rentcriterias/components/RentCriteriaList';

export const getRouteById = (id: string): string => {
  const routes = {
    callback: '/callback',
    leases: '/vuokraukset',
    logout: '/logout',
    rentcriterias: '/vuokrausperusteet',
  };
  return routes[id] ? routes[id] : '';
};

export default
<Route path="/" component={App}>
  <IndexRedirect to={getRouteById('leases')} />
  <Route path={getRouteById('rentcriterias')} components={RentCriteriaList} />
  <Route path={getRouteById('leases')} components={LeaseList} />
  <Route path={`${getRouteById('leases')}/:leaseId`} component={LeasePage}/>
  <Route path={getRouteById('logout')} components={LoginPage} />
  <Route path={getRouteById('callback')} components={CallbackPage} />
  <Route path="*" component={ErrorPage}/>
</Route>;
