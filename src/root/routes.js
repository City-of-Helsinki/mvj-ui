// @flow
import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import ErrorPage from '../errorPage/ErrorPage';
import App from '../app/App';
import CallbackPage from '../auth/components/CallbackPage';
import ContactListPage from '../contacts/components/ContactsListPage';
import ContactPage from '../contacts/components/ContactPage';
import LeaseList from '../leases/components/LeaseList';
import LeasePage from '../leases/components/LeasePage';
import LoginPage from '../auth/components/LoginPage';
import NewContactPage from '../contacts/components/NewContactPage';
import NewRentCriteriaPage from '../rentcriterias/components/NewRentCriteriaPage';
import RentCriteriaList from '../rentcriterias/components/RentCriteriaList';
import RentCriteriaPage from '../rentcriterias/components/RentCriteriaPage';

export const getRouteById = (id: string): string => {
  const routes = {
    callback: '/callback',
    contacts: '/asiakkaat',
    newcontact: '/uusiasiakas',
    leases: '/vuokraukset',
    logout: '/logout',
    newrentcriteria: '/uusivuokrausperuste',
    rentcriterias: '/vuokrausperusteet',
  };
  return routes[id] ? routes[id] : '';
};

export default
<Route path="/" component={App}>
  <IndexRedirect to={getRouteById('leases')} />
  <Route path={getRouteById('contacts')} components={ContactListPage} />
  <Route path={`${getRouteById('contacts')}/:contactId`} component={ContactPage}/>
  <Route path={getRouteById('newcontact')} components={NewContactPage} />
  <Route path={getRouteById('leases')} components={LeaseList} />
  <Route path={`${getRouteById('leases')}/:leaseId`} component={LeasePage}/>
  <Route path={getRouteById('newrentcriteria')} components={NewRentCriteriaPage} />
  <Route path={getRouteById('rentcriterias')} components={RentCriteriaList} />
  <Route path={`${getRouteById('rentcriterias')}/:criteriaId`} components={RentCriteriaPage} />
  <Route path={getRouteById('callback')} components={CallbackPage} />
  <Route path={getRouteById('logout')} components={LoginPage} />
  <Route path="*" component={ErrorPage}/>
</Route>;
