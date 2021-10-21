// @flow
import React from 'react';
import {Redirect, Route, Switch} from 'react-router';

import ErrorPage from '$src/errorPage/ErrorPage';
import App from '$src/app/App';
import AreaNoteListPage from '$src/areaNote/components/AreaNoteListPage';
import BasisOfRentCalculatorPage from '$src/basisOfRentCalculator/components/BasisOfRentCalculatorPage';
import BatchRunPage from '$src/batchrun/components/BatchRunPage';
import CallbackPage from '$src/auth/components/CallbackPage';
import ContactListPage from '$src/contacts/components/ContactsListPage';
import ContactPage from '$src/contacts/components/ContactPage';
import CreditDecisionSearchPage from '$src/creditDecision/components/CreditDecisionSearchPage';
import IndexListPage from '$src/index/components/IndexListPage';
import InfillDevelopmentPage from '$src/infillDevelopment/components/InfillDevelopmentPage';
import InfillDevelopmentListPage from '$src/infillDevelopment/components/InfillDevelopmentListPage';
import InvoiceNoteListPage from '$src/invoiceNote/components/InvoiceNoteListPage';
import LandUseContractListPage from '$src/landUseContract/components/LandUseContractListPage';
import LandUseContractPage from '$src/landUseContract/components/LandUseContractPage';
import LeaseListPage from '$src/leases/components/LeaseListPage';
import LeasePage from '$src/leases/components/LeasePage';
import LeaseholdTransferListPage from '$src/leaseholdTransfer/components/LeaseholdTransferListPage';
import NewContactPage from '$src/contacts/components/NewContactPage';
import NewInfillDevelopmentPage from '$src/infillDevelopment/components/NewInfillDevelopmentPage';
import NewRentBasisPage from '$src/rentbasis/components/NewRentBasisPage';
import PlotSearchListPage from '$src/plotSearch/components/PlotSearchListPage';
import PlotApplicationsListPage from '$src/plotApplications/components/PlotApplicationsListPage';
import PlotSearchPage from '$src/plotSearch/components/PlotSearchPage';
import PlotApplicationsPage from '$src/plotApplications/components/PlotApplicationsPage';
import RentBasisListPage from '$src/rentbasis/components/RentBasisListPage';
import RentBasisPage from '$src/rentbasis/components/RentBasisPage';
import SapInvoicesListPage from '$src/sapInvoice/components/SapInvoicesListPage';
import LeaseStatisticReport from '$src/leaseStatisticReport/components/LeaseStatisticReportPage';
import TradeRegisterSearchPage from '$src/tradeRegister/components/TradeRegisterSearchPage';

/**
 * Routes enumerate
 * @enum {string}
 */
export const Routes = {
  AREA_NOTES: 'area_notes',
  BASIS_OF_RENT_CALCULATOR: 'basis_of_rent_calculator',
  BATCH_RUN: 'batch_jobs',
  CALLBACK: 'callback',
  CONTACTS: 'contacts',
  CONTACT_NEW: 'contact_new',
  CREDIT_DECISION: 'asiakastieto',
  INDEX: 'index',
  INFILL_DEVELOPMENTS: 'infill_developments',
  INFILL_DEVELOPMENT_NEW: 'infill_development_new',
  INVOICE_NOTES: 'invoice_notes',
  LAND_USE_CONTRACTS: 'land_use_contracts',
  LEASES: 'leases',
  LEASEHOLD_TRANSFER: 'leasehold_transfer',
  LOGOUT: 'logout',
  PLOT_SEARCH: 'plotSearch',
  PLOT_APPLICATIONS: 'plotApplications',
  RENT_BASIS: 'rent_basis',
  RENT_BASIS_NEW: 'rent_basis_new',
  SAP_INVOICES: 'sap_invoices',
  LEASE_STATISTIC_REPORT: 'lease_statistic_report',
  TRADE_REGISTER: 'trade_register',
};

/**
 * Get route by id
 * @param {string} string
 * @returns {string}
 */
export const getRouteById = (id: string): string => {
  const routes = {
    [Routes.AREA_NOTES]: '/muistettavatehdot',
    [Routes.BASIS_OF_RENT_CALCULATOR]: '/vuokralaskuri',
    [Routes.BATCH_RUN]: '/eraajot',
    [Routes.CALLBACK]: '/callback',
    [Routes.CONTACTS]: '/asiakkaat',
    [Routes.CONTACT_NEW]: '/uusiasiakas',
    [Routes.CREDIT_DECISION]: '/asiakastieto',
    [Routes.INDEX]: '/indeksi',
    [Routes.INFILL_DEVELOPMENTS]: '/taydennysrakennuskorvaus',
    [Routes.INFILL_DEVELOPMENT_NEW]: '/uusitaydennysrakennuskorvaus',
    [Routes.INVOICE_NOTES]: '/laskujentiedotteet',
    [Routes.LAND_USE_CONTRACTS]: '/maankayttosopimus',
    [Routes.LEASES]: '/vuokraukset',
    [Routes.LEASEHOLD_TRANSFER]: '/vuokraoikeudensiirrot',
    [Routes.LOGOUT]: '/logout',
    [Routes.PLOT_SEARCH]: '/tonttihaku',
    [Routes.PLOT_APPLICATIONS]: '/tonttihakemukset',
    [Routes.RENT_BASIS]: '/vuokrausperusteet',
    [Routes.RENT_BASIS_NEW]: '/uusivuokrausperuste',
    [Routes.SAP_INVOICES]: '/saplaskut',
    [Routes.LEASE_STATISTIC_REPORT]: '/tilastoraportti',
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
    <Route exact path={getRouteById(Routes.INVOICE_NOTES)} component={InvoiceNoteListPage} />
    <Route exact path={`${getRouteById(Routes.INDEX)}`} component={IndexListPage} />
    <Route exact path={getRouteById(Routes.LAND_USE_CONTRACTS)} component={LandUseContractListPage} />
    <Route exact path={`${getRouteById(Routes.LAND_USE_CONTRACTS)}/:landUseContractId`} component={LandUseContractPage} />
    <Route exact path={getRouteById(Routes.AREA_NOTES)} component={AreaNoteListPage} />
    <Route exact path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}`} component={InfillDevelopmentListPage} />
    <Route exact path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/:infillDevelopmentId`} component={InfillDevelopmentPage} />
    <Route exact path={getRouteById(Routes.INFILL_DEVELOPMENT_NEW)} component={NewInfillDevelopmentPage} />
    <Route exact path={getRouteById(Routes.TRADE_REGISTER)} component={TradeRegisterSearchPage} />
    <Route exact path={getRouteById(Routes.SAP_INVOICES)} component={SapInvoicesListPage} />
    <Route exact path={getRouteById(Routes.LEASE_STATISTIC_REPORT)} component={LeaseStatisticReport} />
    <Route exact path={getRouteById(Routes.LEASEHOLD_TRANSFER)} component={LeaseholdTransferListPage} />
    <Route exact path={getRouteById(Routes.RENT_BASIS)} component={RentBasisListPage} />
    <Route exact path={`${getRouteById(Routes.RENT_BASIS)}/:rentBasisId`} component={RentBasisPage} />
    <Route exact path={getRouteById(Routes.RENT_BASIS_NEW)} component={NewRentBasisPage} />
    <Route exact path={getRouteById(Routes.BATCH_RUN)} component={BatchRunPage} />
    <Route exact path={getRouteById(Routes.BASIS_OF_RENT_CALCULATOR)} component={BasisOfRentCalculatorPage} />
    <Route exact path={getRouteById(Routes.CALLBACK)} component={CallbackPage} />
    <Route exact path={getRouteById(Routes.PLOT_SEARCH)} component={PlotSearchListPage} />
    <Route exact path={`${getRouteById(Routes.PLOT_SEARCH)}/:plotSearchId`} component={PlotSearchPage} />
    <Route exact path={getRouteById(Routes.PLOT_APPLICATIONS)} component={PlotApplicationsListPage} />
    <Route exact path={`${getRouteById(Routes.PLOT_APPLICATIONS)}/:plotApplicationId`} component={PlotApplicationsPage} />
    <Route exact path={getRouteById(Routes.CREDIT_DECISION)} component={CreditDecisionSearchPage} />
    <Route component={ErrorPage} />
  </Switch>
</App>;
