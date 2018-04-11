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
import NewRentBasisPage from '../rentbasis/components/NewRentBasisPage';
import RentBasisListPage from '../rentbasis/components/RentBasisListPage';
import RentBasisPage from '../rentbasis/components/RentBasisPage';

export const getRouteById = (id: string): string => {
  const routes = {
    callback: '/callback',
    contacts: '/asiakkaat',
    newcontact: '/uusiasiakas',
    leases: '/vuokraukset',
    logout: '/logout',
    newrentbasis: '/uusivuokrausperuste',
    rentbasis: '/vuokrausperusteet',
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
  <Route path={getRouteById('newrentbasis')} components={NewRentBasisPage} />
  <Route path={getRouteById('rentbasis')} components={RentBasisListPage} />
  <Route path={`${getRouteById('rentbasis')}/:rentBasisId`} components={RentBasisPage} />
  <Route path={getRouteById('callback')} components={CallbackPage} />
  <Route path={getRouteById('logout')} components={LoginPage} />
  <Route path="*" component={ErrorPage}/>
</Route>;
