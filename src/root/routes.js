// @flow
import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import ErrorPage from '$src/errorPage/ErrorPage';
import App from '$src/app/App';
import AreaNoteListPage from '$src/areaNote/components/AreaNoteListPage';
import CallbackPage from '$src/auth/components/CallbackPage';
import ContactListPage from '$src/contacts/components/ContactsListPage';
import ContactPage from '$src/contacts/components/ContactPage';
import InfillDevelopmentPage from '$src/infillDevelopment/components/InfillDevelopmentPage';
import InfillDevelopmentListPage from '$src/infillDevelopment/components/InfillDevelopmentListPage';
import LandUseContractListPage from '$src/landUseContract/components/LandUseContractListPage';
import LandUseContractPage from '$src/landUseContract/components/LandUseContractPage';
import LeaseListPage from '$src/leases/components/LeaseListPage';
import LeasePage from '$src/leases/components/LeasePage';
import LoginPage from '$src/auth/components/LoginPage';
import NewContactPage from '$src/contacts/components/NewContactPage';
import NewInfillDevelopmentPage from '$src/infillDevelopment/components/NewInfillDevelopmentPage';
import NewRentBasisPage from '$src/rentbasis/components/NewRentBasisPage';
import RentBasisListPage from '$src/rentbasis/components/RentBasisListPage';
import RentBasisPage from '$src/rentbasis/components/RentBasisPage';

export const Routes = {
  AREA_NOTES: 'area_notes',
  CALLBACK: 'callback',
  CONTACTS: 'contacts',
  CONTACT_NEW: 'contact_new',
  INFILL_DEVELOPMENTS: 'infill_developments',
  INFILL_DEVELOPMENT_NEW: 'infill_development_new',
  LAND_USE_CONTRACTS: 'land_use_contracts',
  LEASES: 'leases',
  LOGOUT: 'logout',
  RENT_BASIS: 'rent_basis',
  RENT_BASIS_NEW: 'rent_basis_new',
};

export const getRouteById = (id: string): string => {
  const routes = {
    [Routes.AREA_NOTES]: '/muistettavatehdot',
    [Routes.CALLBACK]: '/callback',
    [Routes.CONTACTS]: '/asiakkaat',
    [Routes.CONTACT_NEW]: '/uusiasiakas',
    [Routes.INFILL_DEVELOPMENTS]: '/taydennysrakennuskorvaus',
    [Routes.INFILL_DEVELOPMENT_NEW]: '/uusitaydennysrakennuskorvaus',
    [Routes.LAND_USE_CONTRACTS]: '/maankayttosopimus',
    [Routes.LEASES]: '/vuokraukset',
    [Routes.LOGOUT]: '/logout',
    [Routes.RENT_BASIS]: '/vuokrausperusteet',
    [Routes.RENT_BASIS_NEW]: '/uusivuokrausperuste',
  };

  return routes[id] ? routes[id] : '';
};

export default
<Route path="/" component={App}>
  <IndexRedirect to={getRouteById(Routes.LEASES)} />
  <Route path={getRouteById(Routes.AREA_NOTES)} components={AreaNoteListPage} />
  <Route path={getRouteById(Routes.CONTACTS)} components={ContactListPage} />
  <Route path={`${getRouteById(Routes.CONTACTS)}/:contactId`} components={ContactPage}/>
  <Route path={getRouteById(Routes.CONTACT_NEW)} components={NewContactPage} />
  <Route path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}`} components={InfillDevelopmentListPage} />
  <Route path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/:infillDevelopmentId`} components={InfillDevelopmentPage} />
  <Route path={getRouteById(Routes.INFILL_DEVELOPMENT_NEW)} components={NewInfillDevelopmentPage} />
  <Route path={getRouteById(Routes.LAND_USE_CONTRACTS)} components={LandUseContractListPage} />
  <Route path={`${getRouteById(Routes.LAND_USE_CONTRACTS)}/:landUseContractId`} components={LandUseContractPage} />
  <Route path={getRouteById(Routes.LEASES)} components={LeaseListPage} />
  <Route path={`${getRouteById(Routes.LEASES)}/:leaseId`} components={LeasePage}/>
  <Route path={getRouteById(Routes.RENT_BASIS)} components={RentBasisListPage} />
  <Route path={`${getRouteById(Routes.RENT_BASIS)}/:rentBasisId`} components={RentBasisPage} />
  <Route path={getRouteById(Routes.RENT_BASIS_NEW)} components={NewRentBasisPage} />
  <Route path={getRouteById(Routes.CALLBACK)} components={CallbackPage} />
  <Route path={getRouteById(Routes.LOGOUT)} components={LoginPage} />
  <Route path="*" components={ErrorPage}/>
</Route>;
