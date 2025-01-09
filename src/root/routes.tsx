import React from "react";
import { Redirect, Route, Switch } from "react-router";
import ErrorPage from "@/errorPage/ErrorPage";
import App from "@/app/App";
import AreaNoteListPage from "@/areaNote/components/AreaNoteListPage";
import BasisOfRentCalculatorPage from "@/basisOfRentCalculator/components/BasisOfRentCalculatorPage";
import BatchRunPage from "@/batchrun/components/BatchRunPage";
import CallbackPage from "@/auth/components/CallbackPage";
import ContactListPage from "@/contacts/components/ContactsListPage";
import ContactPage from "@/contacts/components/ContactPage";
import CreditDecisionSearchPage from "@/creditDecision/components/CreditDecisionSearchPage";
import IndexListPage from "@/index/components/IndexListPage";
import InfillDevelopmentPage from "@/infillDevelopment/components/InfillDevelopmentPage";
import InfillDevelopmentListPage from "@/infillDevelopment/components/InfillDevelopmentListPage";
import InvoiceNoteListPage from "@/invoiceNote/components/InvoiceNoteListPage";
import LandUseContractListPage from "@/landUseContract/components/LandUseContractListPage";
import LandUseContractPage from "@/landUseContract/components/LandUseContractPage";
import LeaseListPage from "@/leases/components/LeaseListPage";
import LeasePage from "@/leases/components/LeasePage";
import LeaseholdTransferListPage from "@/leaseholdTransfer/components/LeaseholdTransferListPage";
import NewContactPage from "@/contacts/components/NewContactPage";
import NewInfillDevelopmentPage from "@/infillDevelopment/components/NewInfillDevelopmentPage";
import NewRentBasisPage from "@/rentbasis/components/NewRentBasisPage";
import PlotSearchListPage from "@/plotSearch/components/PlotSearchListPage";
import PlotApplicationsListPage from "@/plotApplications/components/PlotApplicationsListPage";
import PlotSearchPage from "@/plotSearch/components/PlotSearchPage";
import PlotApplicationsPage from "@/plotApplications/components/PlotApplicationPage";
import RentBasisListPage from "@/rentbasis/components/RentBasisListPage";
import RentBasisPage from "@/rentbasis/components/RentBasisPage";
import SapInvoicesListPage from "@/sapInvoice/components/SapInvoicesListPage";
import LeaseStatisticReport from "@/leaseStatisticReport/components/LeaseStatisticReportPage";
import TradeRegisterSearchPage from "@/tradeRegister/components/TradeRegisterSearchPage";
import PlotApplicationCreatePage from "@/plotApplications/components/PlotApplicationCreatePage";
import AreaSearchApplicationListPage from "@/areaSearch/components/AreaSearchApplicationListPage";
import AreaSearchApplicationPage from "@/areaSearch/components/AreaSearchApplicationPage";
import AreaSearchApplicationCreatePage from "@/areaSearch/components/AreaSearchApplicationCreatePage";

/**
 * Routes enumerate
 * @enum {string}
 */
export const Routes = {
  AREA_NOTES: "area_notes",
  AREA_SEARCH: "area_search",
  BASIS_OF_RENT_CALCULATOR: "basis_of_rent_calculator",
  BATCH_RUN: "batch_jobs",
  CALLBACK: "callback",
  CONTACTS: "contacts",
  CONTACT_NEW: "contact_new",
  CREDIT_DECISION: "asiakastieto",
  INDEX: "index",
  INFILL_DEVELOPMENTS: "infill_developments",
  INFILL_DEVELOPMENT_NEW: "infill_development_new",
  INVOICE_NOTES: "invoice_notes",
  LAND_USE_CONTRACTS: "land_use_contracts",
  LEASES: "leases",
  LEASEHOLD_TRANSFER: "leasehold_transfer",
  LOGOUT: "logout",
  PLOT_SEARCH: "plotSearch",
  PLOT_APPLICATIONS: "plotApplications",
  RENT_BASIS: "rent_basis",
  RENT_BASIS_NEW: "rent_basis_new",
  SAP_INVOICES: "sap_invoices",
  LEASE_STATISTIC_REPORT: "lease_statistic_report",
  TRADE_REGISTER: "trade_register",
};

/**
 * Get route by id
 * @param {string} string
 * @returns {string}
 */
export const getRouteById = (id: string): string => {
  const routes = {
    [Routes.AREA_NOTES]: "/muistettavatehdot",
    [Routes.AREA_SEARCH]: "/aluehaut",
    [Routes.BASIS_OF_RENT_CALCULATOR]: "/vuokralaskuri",
    [Routes.BATCH_RUN]: "/eraajot",
    [Routes.CALLBACK]: "/callback",
    [Routes.CONTACTS]: "/asiakkaat",
    [Routes.CONTACT_NEW]: "/uusiasiakas",
    [Routes.CREDIT_DECISION]: "/asiakastieto",
    [Routes.INDEX]: "/indeksi",
    [Routes.INFILL_DEVELOPMENTS]: "/taydennysrakennuskorvaus",
    [Routes.INFILL_DEVELOPMENT_NEW]: "/uusitaydennysrakennuskorvaus",
    [Routes.INVOICE_NOTES]: "/laskujentiedotteet",
    [Routes.LAND_USE_CONTRACTS]: "/maankayttosopimus",
    [Routes.LEASES]: "/vuokraukset",
    [Routes.LEASEHOLD_TRANSFER]: "/vuokraoikeudensiirrot",
    [Routes.LOGOUT]: "/logout",
    [Routes.PLOT_SEARCH]: "/tonttihaku",
    [Routes.PLOT_APPLICATIONS]: "/tonttihakemukset",
    [Routes.RENT_BASIS]: "/vuokrausperusteet",
    [Routes.RENT_BASIS_NEW]: "/uusivuokrausperuste",
    [Routes.SAP_INVOICES]: "/saplaskut",
    [Routes.LEASE_STATISTIC_REPORT]: "/tilastoraportti",
    [Routes.TRADE_REGISTER]: "/kaupparekisteri",
  };
  return routes[id] ? routes[id] : "";
};
export default (
  <App>
    <Switch>
      <Redirect exact from="/" to={getRouteById(Routes.LEASES)} />
      <Route
        exact
        path={getRouteById(Routes.LEASES)}
        component={LeaseListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.LEASES)}/:leaseId`}
        component={LeasePage}
      />
      <Route
        exact
        path={getRouteById(Routes.CONTACTS)}
        component={ContactListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.CONTACTS)}/:contactId`}
        component={ContactPage}
      />
      <Route
        exact
        path={getRouteById(Routes.CONTACT_NEW)}
        component={NewContactPage}
      />
      <Route
        exact
        path={getRouteById(Routes.INVOICE_NOTES)}
        component={InvoiceNoteListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.INDEX)}`}
        component={IndexListPage}
      />
      <Route
        exact
        path={getRouteById(Routes.LAND_USE_CONTRACTS)}
        component={LandUseContractListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.LAND_USE_CONTRACTS)}/:landUseContractId`}
        component={LandUseContractPage}
      />
      <Route
        exact
        path={getRouteById(Routes.AREA_NOTES)}
        component={AreaNoteListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}`}
        component={InfillDevelopmentListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/:infillDevelopmentId`}
        component={InfillDevelopmentPage}
      />
      <Route
        exact
        path={getRouteById(Routes.INFILL_DEVELOPMENT_NEW)}
        component={NewInfillDevelopmentPage}
      />
      <Route
        exact
        path={getRouteById(Routes.TRADE_REGISTER)}
        component={TradeRegisterSearchPage}
      />
      <Route
        exact
        path={getRouteById(Routes.SAP_INVOICES)}
        component={SapInvoicesListPage}
      />
      <Route
        exact
        path={getRouteById(Routes.LEASE_STATISTIC_REPORT)}
        component={LeaseStatisticReport}
      />
      <Route
        exact
        path={getRouteById(Routes.LEASEHOLD_TRANSFER)}
        component={LeaseholdTransferListPage}
      />
      <Route
        exact
        path={getRouteById(Routes.RENT_BASIS)}
        component={RentBasisListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.RENT_BASIS)}/:rentBasisId`}
        component={RentBasisPage}
      />
      <Route
        exact
        path={getRouteById(Routes.RENT_BASIS_NEW)}
        component={NewRentBasisPage}
      />
      <Route
        exact
        path={getRouteById(Routes.BATCH_RUN)}
        component={BatchRunPage}
      />
      <Route
        exact
        path={getRouteById(Routes.BASIS_OF_RENT_CALCULATOR)}
        component={BasisOfRentCalculatorPage}
      />
      <Route
        exact
        path={getRouteById(Routes.CALLBACK)}
        component={CallbackPage}
      />
      <Route
        exact
        path={getRouteById(Routes.PLOT_SEARCH)}
        component={PlotSearchListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.PLOT_SEARCH)}/:plotSearchId`}
        component={PlotSearchPage}
      />
      <Route
        exact
        path={getRouteById(Routes.PLOT_APPLICATIONS)}
        component={PlotApplicationsListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.PLOT_APPLICATIONS)}/uusi`}
        component={PlotApplicationCreatePage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.PLOT_APPLICATIONS)}/:plotApplicationId`}
        component={PlotApplicationsPage}
      />
      <Route
        exact
        path={getRouteById(Routes.AREA_SEARCH)}
        component={AreaSearchApplicationListPage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.AREA_SEARCH)}/uusi`}
        component={AreaSearchApplicationCreatePage}
      />
      <Route
        exact
        path={`${getRouteById(Routes.AREA_SEARCH)}/:areaSearchId`}
        component={AreaSearchApplicationPage}
      />
      <Route
        exact
        path={getRouteById(Routes.CREDIT_DECISION)}
        component={CreditDecisionSearchPage}
      />
      <Route component={ErrorPage} />
    </Switch>
  </App>
) as JSX.Element;
