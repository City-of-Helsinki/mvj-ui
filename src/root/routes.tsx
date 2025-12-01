import React from "react";
import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";
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
    <RouterRoutes>
      <Route path="/" element={<Navigate to={getRouteById(Routes.LEASES)} />} />
      <Route path={getRouteById(Routes.LEASES)} element={<LeaseListPage />} />
      <Route
        path={`${getRouteById(Routes.LEASES)}/:leaseId`}
        element={<LeasePage />}
      />
      <Route
        path={getRouteById(Routes.CONTACTS)}
        element={<ContactListPage />}
      />
      <Route
        path={`${getRouteById(Routes.CONTACTS)}/:contactId`}
        element={<ContactPage />}
      />
      <Route
        path={getRouteById(Routes.CONTACT_NEW)}
        element={<NewContactPage />}
      />
      <Route
        path={getRouteById(Routes.INVOICE_NOTES)}
        element={<InvoiceNoteListPage />}
      />
      <Route
        path={`${getRouteById(Routes.INDEX)}`}
        element={<IndexListPage />}
      />
      <Route
        path={getRouteById(Routes.LAND_USE_CONTRACTS)}
        element={<LandUseContractListPage />}
      />
      <Route
        path={`${getRouteById(Routes.LAND_USE_CONTRACTS)}/:landUseContractId`}
        element={<LandUseContractPage />}
      />
      <Route
        path={getRouteById(Routes.AREA_NOTES)}
        element={<AreaNoteListPage />}
      />
      <Route
        path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}`}
        element={<InfillDevelopmentListPage />}
      />
      <Route
        path={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/:infillDevelopmentId`}
        element={<InfillDevelopmentPage />}
      />
      <Route
        path={getRouteById(Routes.INFILL_DEVELOPMENT_NEW)}
        element={<NewInfillDevelopmentPage />}
      />
      <Route
        path={getRouteById(Routes.TRADE_REGISTER)}
        element={<TradeRegisterSearchPage />}
      />
      <Route
        path={getRouteById(Routes.SAP_INVOICES)}
        element={<SapInvoicesListPage />}
      />
      <Route
        path={getRouteById(Routes.LEASE_STATISTIC_REPORT)}
        element={<LeaseStatisticReport />}
      />
      <Route
        path={getRouteById(Routes.LEASEHOLD_TRANSFER)}
        element={<LeaseholdTransferListPage />}
      />
      <Route
        path={getRouteById(Routes.RENT_BASIS)}
        element={<RentBasisListPage />}
      />
      <Route
        path={`${getRouteById(Routes.RENT_BASIS)}/:rentBasisId`}
        element={<RentBasisPage />}
      />
      <Route
        path={getRouteById(Routes.RENT_BASIS_NEW)}
        element={<NewRentBasisPage />}
      />
      <Route path={getRouteById(Routes.BATCH_RUN)} element={<BatchRunPage />} />
      <Route
        path={getRouteById(Routes.BASIS_OF_RENT_CALCULATOR)}
        element={<BasisOfRentCalculatorPage />}
      />
      <Route path={getRouteById(Routes.CALLBACK)} element={<CallbackPage />} />
      <Route
        path={getRouteById(Routes.PLOT_SEARCH)}
        element={<PlotSearchListPage />}
      />
      <Route
        path={`${getRouteById(Routes.PLOT_SEARCH)}/:plotSearchId`}
        element={<PlotSearchPage />}
      />
      <Route
        path={getRouteById(Routes.PLOT_APPLICATIONS)}
        element={<PlotApplicationsListPage />}
      />
      <Route
        path={`${getRouteById(Routes.PLOT_APPLICATIONS)}/uusi`}
        element={<PlotApplicationCreatePage />}
      />
      <Route
        path={`${getRouteById(Routes.PLOT_APPLICATIONS)}/:plotApplicationId`}
        element={<PlotApplicationsPage />}
      />
      <Route
        path={getRouteById(Routes.AREA_SEARCH)}
        element={<AreaSearchApplicationListPage />}
      />
      <Route
        path={`${getRouteById(Routes.AREA_SEARCH)}/uusi`}
        element={<AreaSearchApplicationCreatePage />}
      />
      <Route
        path={`${getRouteById(Routes.AREA_SEARCH)}/:areaSearchId`}
        element={<AreaSearchApplicationPage />}
      />
      <Route
        path={getRouteById(Routes.CREDIT_DECISION)}
        element={<CreditDecisionSearchPage />}
      />
      <Route element={<ErrorPage />} />
    </RouterRoutes>
  </App>
) as JSX.Element;
