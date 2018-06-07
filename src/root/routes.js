// @flow
import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import ErrorPage from '$src/errorPage/ErrorPage';
import App from '$src/app/App';
import AreaNotesList from '$src/areaNote/components/AreaNotesList';
import CallbackPage from '$src/auth/components/CallbackPage';
import ContactListPage from '$src/contacts/components/ContactsListPage';
import ContactPage from '$src/contacts/components/ContactPage';
import InfillDevelopmentPage from '$src/infillDevelopment/components/InfillDevelopmentPage';
import InfillDevelopmentListPage from '$src/infillDevelopment/components/InfillDevelopmentListPage';
import LeaseListPage from '$src/leases/components/LeaseListPage';
import LeasePage from '$src/leases/components/LeasePage';
import LoginPage from '$src/auth/components/LoginPage';
import NewContactPage from '$src/contacts/components/NewContactPage';
import NewRentBasisPage from '$src/rentbasis/components/NewRentBasisPage';
import RentBasisListPage from '$src/rentbasis/components/RentBasisListPage';
import RentBasisPage from '$src/rentbasis/components/RentBasisPage';

export const getRouteById = (id: string): string => {
  const routes = {
    areaNotes: '/muistettavatehdot',
    callback: '/callback',
    contacts: '/asiakkaat',
    infillDevelopment: '/taydennysrakentaminen',
    leases: '/vuokraukset',
    logout: '/logout',
    newContact: '/uusiasiakas',
    newRentBasis: '/uusivuokrausperuste',
    rentBasis: '/vuokrausperusteet',
  };

  return routes[id] ? routes[id] : '';
};

export default
<Route path="/" component={App}>
  <IndexRedirect to={getRouteById('leases')} />
  <Route path={getRouteById('areaNotes')} components={AreaNotesList} />
  <Route path={getRouteById('contacts')} components={ContactListPage} />
  <Route path={`${getRouteById('contacts')}/:contactId`} components={ContactPage}/>
  <Route path={getRouteById('newContact')} components={NewContactPage} />
  <Route path={`${getRouteById('infillDevelopment')}`} components={InfillDevelopmentListPage} />
  <Route path={`${getRouteById('infillDevelopment')}/:infillDevelopmentId`} components={InfillDevelopmentPage} />
  <Route path={getRouteById('leases')} components={LeaseListPage} />
  <Route path={`${getRouteById('leases')}/:leaseId`} components={LeasePage}/>
  <Route path={getRouteById('newRentBasis')} components={NewRentBasisPage} />
  <Route path={getRouteById('rentBasis')} components={RentBasisListPage} />
  <Route path={`${getRouteById('rentBasis')}/:rentBasisId`} components={RentBasisPage} />
  <Route path={getRouteById('callback')} components={CallbackPage} />
  <Route path={getRouteById('logout')} components={LoginPage} />
  <Route path="*" components={ErrorPage}/>
</Route>;
