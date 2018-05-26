// @flow
import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import ErrorPage from '$src/errorPage/ErrorPage';
import App from '$src/app/App';
import CallbackPage from '$src/auth/components/CallbackPage';
import ContactListPage from '$src/contacts/components/ContactsListPage';
import ContactPage from '$src/contacts/components/ContactPage';
import LeaseListPage from '$src/leases/components/LeaseListPage';
import LeasePage from '$src/leases/components/LeasePage';
import LoginPage from '$src/auth/components/LoginPage';
import NewContactPage from '$src/contacts/components/NewContactPage';
import NewRentBasisPage from '$src/rentbasis/components/NewRentBasisPage';
import RememberableTermsList from '$src/rememberableTerms/components/RememberableTermsList';
import RentBasisListPage from '$src/rentbasis/components/RentBasisListPage';
import RentBasisPage from '$src/rentbasis/components/RentBasisPage';

export const getRouteById = (id: string): string => {
  const routes = {
    callback: '/callback',
    contacts: '/asiakkaat',
    newcontact: '/uusiasiakas',
    leases: '/vuokraukset',
    logout: '/logout',
    newrentbasis: '/uusivuokrausperuste',
    rentbasis: '/vuokrausperusteet',
    rememberableTerms: '/muistettavatehdot',
  };

  return routes[id] ? routes[id] : '';
};

export default
<Route path="/" component={App}>
  <IndexRedirect to={getRouteById('leases')} />
  <Route path={getRouteById('contacts')} components={ContactListPage} />
  <Route path={`${getRouteById('contacts')}/:contactId`} component={ContactPage}/>
  <Route path={getRouteById('newcontact')} components={NewContactPage} />
  <Route path={getRouteById('leases')} components={LeaseListPage} />
  <Route path={`${getRouteById('leases')}/:leaseId`} component={LeasePage}/>
  <Route path={getRouteById('rememberableTerms')} components={RememberableTermsList} />
  <Route path={getRouteById('newrentbasis')} components={NewRentBasisPage} />
  <Route path={getRouteById('rentbasis')} components={RentBasisListPage} />
  <Route path={`${getRouteById('rentbasis')}/:rentBasisId`} components={RentBasisPage} />
  <Route path={getRouteById('callback')} components={CallbackPage} />
  <Route path={getRouteById('logout')} components={LoginPage} />
  <Route path="*" component={ErrorPage}/>
</Route>;
