// @flow
import React from 'react';
import {Redirect, Route, Switch} from 'react-router';

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
<App>
  <Switch>
    <Redirect exact from="/" to={getRouteById(Routes.LEASES)} />
    <Route exact path={getRouteById(Routes.LEASES)} component={LeaseListPage} />
    <Route exact path={`${getRouteById(Routes.LEASES)}/:leaseId`} component={LeasePage}/>
    <Route exact path={getRouteById(Routes.CONTACTS)} component={ContactListPage} />
    <Route exact path={`${getRouteById(Routes.CONTACTS)}/:contactId`} component={ContactPage}/>
    <Route exact path={getRouteById(Routes.CONTACT_NEW)} component={NewContactPage} />
    <Route exact path={getRouteById(Routes.LAND_USE_CONTRACTS)} component={LandUseContractListPage} />
    <Route exact path={`${getRouteById(Routes.LAND_USE_CONTRACTS)}/:landUseContractId`} component={LandUseContractPage} />
    <Route exact path={getRouteById(Routes.AREA_NOTES)} component={AreaNoteListPage} />
    <Route exact path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}`} component={InfillDevelopmentListPage} />
    <Route exact path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/:infillDevelopmentId`} component={InfillDevelopmentPage} />
    <Route exact path={getRouteById(Routes.INFILL_DEVELOPMENT_NEW)} component={NewInfillDevelopmentPage} />
    <Route exact path={getRouteById(Routes.RENT_BASIS)} component={RentBasisListPage} />
    <Route exact path={`${getRouteById(Routes.RENT_BASIS)}/:rentBasisId`} component={RentBasisPage} />
    <Route exact path={getRouteById(Routes.RENT_BASIS_NEW)} component={NewRentBasisPage} />
    <Route exact path={getRouteById(Routes.CALLBACK)} component={CallbackPage} />
    <Route component={ErrorPage} />
  </Switch>
</App>;
