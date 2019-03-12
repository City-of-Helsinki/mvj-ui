// @flow
import React from 'react';
import {Redirect, Route, Switch} from 'react-router';

import ErrorPage from '$src/errorPage/ErrorPage';
import App from '$src/app/App';
import AreaNoteListPage from '$src/areaNote/components/AreaNoteListPage';
import CallbackPage from '$src/auth/components/CallbackPage';
import ContactListPage from '$src/contacts/components/ContactsListPage';
import ContactPage from '$src/contacts/components/ContactPage';
import IndexListPage from '$src/index/components/IndexListPage';
import InfillDevelopmentPage from '$src/infillDevelopment/components/InfillDevelopmentPage';
import InfillDevelopmentListPage from '$src/infillDevelopment/components/InfillDevelopmentListPage';
import LandUseContractListPage from '$src/landUseContract/components/LandUseContractListPage';
import LandUseContractPage from '$src/landUseContract/components/LandUseContractPage';
import LeaseListPage from '$src/leases/components/LeaseListPage';
import LeasePage from '$src/leases/components/LeasePage';
import LeaseholdTransferListPage from '$src/leaseholdTransfer/components/LeaseholdTransferListPage';
import NewContactPage from '$src/contacts/components/NewContactPage';
import NewInfillDevelopmentPage from '$src/infillDevelopment/components/NewInfillDevelopmentPage';
import NewRentBasisPage from '$src/rentbasis/components/NewRentBasisPage';
import RentBasisListPage from '$src/rentbasis/components/RentBasisListPage';
import RentBasisPage from '$src/rentbasis/components/RentBasisPage';
import SapInvoicesListPage from '$src/sapInvoice/components/SapInvoicesListPage';
import TradeRegisterSearchPage from '$src/tradeRegister/components/TradeRegisterSearchPage';

export const Routes = {
  AREA_NOTES: 'area_notes',
  CALLBACK: 'callback',
  CONTACTS: 'contacts',
  CONTACT_NEW: 'contact_new',
  INDEX: 'index',
  INFILL_DEVELOPMENTS: 'infill_developments',
  INFILL_DEVELOPMENT_NEW: 'infill_development_new',
  LAND_USE_CONTRACTS: 'land_use_contracts',
  LEASES: 'leases',
  LEASEHOLD_TRANSFER: 'leasehold_transfer',
  LOGOUT: 'logout',
  RENT_BASIS: 'rent_basis',
  RENT_BASIS_NEW: 'rent_basis_new',
  SAP_INVOICES: 'sap_invoices',
  TRADE_REGISTER: 'trade_register',
};

export const getRouteById = (id: string): string => {
  const routes = {
    [Routes.AREA_NOTES]: '/muistettavatehdot',
    [Routes.CALLBACK]: '/callback',
    [Routes.CONTACTS]: '/asiakkaat',
    [Routes.CONTACT_NEW]: '/uusiasiakas',
    [Routes.INDEX]: '/indeksi',
    [Routes.INFILL_DEVELOPMENTS]: '/taydennysrakennuskorvaus',
    [Routes.INFILL_DEVELOPMENT_NEW]: '/uusitaydennysrakennuskorvaus',
    [Routes.LAND_USE_CONTRACTS]: '/maankayttosopimus',
    [Routes.LEASES]: '/vuokraukset',
    [Routes.LEASEHOLD_TRANSFER]: '/vuokraoikeudensiirrot',
    [Routes.LOGOUT]: '/logout',
    [Routes.RENT_BASIS]: '/vuokrausperusteet',
    [Routes.RENT_BASIS_NEW]: '/uusivuokrausperuste',
    [Routes.SAP_INVOICES]: '/saplaskut',
    [Routes.TRADE_REGISTER]: '/kaupparekisteri',
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
    <Route exact path={`${getRouteById(Routes.INDEX)}`} component={IndexListPage} />
    <Route exact path={getRouteById(Routes.LAND_USE_CONTRACTS)} component={LandUseContractListPage} />
    <Route exact path={`${getRouteById(Routes.LAND_USE_CONTRACTS)}/:landUseContractId`} component={LandUseContractPage} />
    <Route exact path={getRouteById(Routes.AREA_NOTES)} component={AreaNoteListPage} />
    <Route exact path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}`} component={InfillDevelopmentListPage} />
    <Route exact path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/:infillDevelopmentId`} component={InfillDevelopmentPage} />
    <Route exact path={getRouteById(Routes.INFILL_DEVELOPMENT_NEW)} component={NewInfillDevelopmentPage} />
    <Route exact path={getRouteById(Routes.TRADE_REGISTER)} component={TradeRegisterSearchPage} />
    <Route exact path={getRouteById(Routes.SAP_INVOICES)} component={SapInvoicesListPage} />
    <Route exact path={getRouteById(Routes.LEASEHOLD_TRANSFER)} component={LeaseholdTransferListPage} />
    <Route exact path={getRouteById(Routes.RENT_BASIS)} component={RentBasisListPage} />
    <Route exact path={`${getRouteById(Routes.RENT_BASIS)}/:rentBasisId`} component={RentBasisPage} />
    <Route exact path={getRouteById(Routes.RENT_BASIS_NEW)} component={NewRentBasisPage} />
    <Route exact path={getRouteById(Routes.CALLBACK)} component={CallbackPage} />
    <Route component={ErrorPage} />
  </Switch>
</App>;
