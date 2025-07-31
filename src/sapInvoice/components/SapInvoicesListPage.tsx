import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "./Search";
import SortableTable from "@/components/table/SortableTable";
import TableFilters from "@/components/table/TableFilters";
import TableWrapper from "@/components/table/TableWrapper";
import { fetchSapInvoices } from "@/sapInvoice/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "@/sapInvoice/constants";
import { Methods, PermissionMissingTexts } from "@/enums";
import { InvoiceFieldPaths, InvoiceRowsFieldPaths } from "@/invoices/enums";
import { getContactFullName } from "@/contacts/helpers";
import { formatReceivableTypesString } from "@/invoices/helpers";
import { getContentLeaseIdentifier } from "@/leases/helpers";
import {
  getSapInvoices,
  mapSapInvoiceSearchFilters,
} from "@/sapInvoice/helpers";
import {
  formatDate,
  formatNumber,
  getApiResponseCount,
  getApiResponseMaxPage,
  getFieldOptions,
  getSearchQuery,
  getUrlParams,
  isEmptyValue,
  isFieldAllowedToRead,
  isMethodAllowed,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getIsFetching,
  getSapInvoices as getSapInvoiceList,
} from "@/sapInvoice/selectors";
import { withSapInvoicesAttributes } from "@/components/attributes/SapInvoicesAttributes";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { SapInvoiceList } from "@/sapInvoice/types";
import type { UserServiceUnit } from "@/usersPermissions/types";

const getColumns = (invoiceAttributes: Attributes) => {
  const receivableTypeOptions = getFieldOptions(
    invoiceAttributes,
    InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
  );
  const columns = [];

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
    columns.push({
      key: "send_to_sap_date",
      text: "Sap lähetyspvm",
      renderer: (val) => formatDate(val),
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)) {
    columns.push({
      key: "recipient",
      text: "Laskunsaaja",
      renderer: (val) => getContactFullName(val) || "-",
      sortable: false,
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
    columns.push({
      key: "due_date",
      text: "Eräpäivä",
      renderer: (val) => formatDate(val),
    });
  }

  if (
    isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)
  ) {
    columns.push({
      key: "billed_amount",
      text: "Laskutettu",
      renderer: (val) => (!isEmptyValue(val) ? `${formatNumber(val)} €` : "-"),
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.LEASE)) {
    columns.push({
      key: "lease",
      text: "Vuokraustunnus",
      renderer: (val) => getContentLeaseIdentifier(val),
      sortable: false,
    });
  }

  if (
    isFieldAllowedToRead(
      invoiceAttributes,
      InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
    )
  ) {
    columns.push({
      key: "receivableTypes",
      text: "Saamislaji",
      arrayRenderer: (val) =>
        formatReceivableTypesString(receivableTypeOptions, val) || "-",
      sortable: false,
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.LEASE)) {
    columns.push({
      key: "link",
      text: "",
      renderer: () => <ExternalLinkIcon className="icon-small icon-green" />,
      sortable: false,
    });
  }

  return columns;
};

type Props = {
  fetchSapInvoices: (...args: Array<any>) => any;
  history: Record<string, any>;
  invoiceAttributes: Attributes;
  invoiceMethods: MethodsType;
  isFetching: boolean;
  isFetchingInvoiceAttributes: boolean;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  sapInvoiceList: SapInvoiceList;
  userActiveServiceUnit: UserServiceUnit;
};

const SapInvoicesListPage: React.FC<Props> = ({
  fetchSapInvoices,
  history,
  invoiceAttributes,
  invoiceMethods,
  isFetching,
  isFetchingInvoiceAttributes,
  location,
  receiveTopNavigationSettings,
  sapInvoiceList,
  userActiveServiceUnit,
}) => {
  const [activePage, setActivePage] = useState(1);
  const [columns, setColumns] = useState<Array<Record<string, any>>>([]);
  const [count, setCount] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [sapInvoices, setSapInvoices] = useState<Array<Record<string, any>>>([]);
  const [isSearchInitialized, setIsSearchInitialized] = useState(false);
  const [searchFormInitialValues, setSearchFormInitialValues] = useState<Record<string, any>>({});
  const [sortKey, setSortKey] = useState(DEFAULT_SORT_KEY);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER);

  // Track if initial search has been performed
  const [hasFetchedInvoices, setHasFetchedInvoices] = useState(false);

  useEffect(() => {
    setPageTitle("SAP laskut");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.SAP_INVOICES),
      pageTitle: "SAP laskut",
      showSearch: false,
    });
  }, []);

  useEffect(() => {
    if (invoiceAttributes) {
      setColumns(getColumns(invoiceAttributes));
    }
  }, [invoiceAttributes]);

  useEffect(() => {
    if (sapInvoiceList) {
      setCount(getApiResponseCount(sapInvoiceList));
      setSapInvoices(getSapInvoices(sapInvoiceList));
      setMaxPage(getApiResponseMaxPage(sapInvoiceList, LIST_TABLE_PAGE_SIZE));
    }
  }, [sapInvoiceList]);

  useEffect(() => {
    const currentSearch = location.search;

    const handleSearch = () => {
      setSearchFormValues();
      search();
    };

    if (userActiveServiceUnit) {
      if (!hasFetchedInvoices) {
        handleSearch();
        setHasFetchedInvoices(true);
      } else if (!currentSearch.includes("service_unit")) {
        handleSearch();
      }
    }

    // Always search when search string changes
    handleSearch();
  }, [location.search, userActiveServiceUnit]);

  const setSearchFormValues = useCallback(() => {
    const searchQuery = getUrlParams(location.search);

    const initialValues = { ...searchQuery };
    if (initialValues.service_unit === undefined && userActiveServiceUnit) {
      initialValues.service_unit = userActiveServiceUnit.id;
    }
    delete initialValues.page;
    delete initialValues.sort_key;
    delete initialValues.sort_order;

    setActivePage(searchQuery.page ? Number(searchQuery.page) : 1);
    setIsSearchInitialized(true);
    setSearchFormInitialValues(initialValues);
    setSortKey(searchQuery.sort_key ? searchQuery.sort_key : DEFAULT_SORT_KEY);
    setSortOrder(searchQuery.sort_order ? searchQuery.sort_order : DEFAULT_SORT_ORDER);
  }, [location.search, userActiveServiceUnit]);

  const search = useCallback(() => {
    const searchQuery = getUrlParams(location.search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if (page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;
    searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
    searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;

    if (searchQuery.service_unit === undefined && userActiveServiceUnit) {
      searchQuery.service_unit = userActiveServiceUnit.id;
    }

    fetchSapInvoices(mapSapInvoiceSearchFilters(searchQuery));
  }, [fetchSapInvoices, location.search, userActiveServiceUnit]);

  const handleRowClick = useCallback((id, row) => {
    window.open(
      `${getRouteById(Routes.LEASES)}/${row.lease.id}?tab=6&opened_invoice=${id}`,
      "_blank",
    );
  }, []);

  const handleSearchChange = useCallback((query: any) => {
    history.push({
      pathname: getRouteById(Routes.SAP_INVOICES),
      search: getSearchQuery(query),
    });
  }, [history]);

  const handleSortingChange = useCallback(({ sortKey, sortOrder }) => {
    const searchQuery = getUrlParams(location.search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    setSortKey(sortKey);
    setSortOrder(sortOrder);
    handleSearchChange(searchQuery);
  }, [location.search, handleSearchChange]);

  const handlePageClick = useCallback((page: number) => {
    const query = getUrlParams(location.search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    setActivePage(page);
    handleSearchChange(query);
  }, [location.search, handleSearchChange]);

  if (isFetchingInvoiceAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!invoiceMethods) return null;
  if (!isMethodAllowed(invoiceMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.INVOICE} />
      </PageContainer>
    );
  return (
    <PageContainer>
      <Row>
        <Column small={12} large={8} />
        <Column small={12} large={4}>
          {userActiveServiceUnit && (
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={handleSearchChange}
              sortKey={sortKey}
              sortOrder={sortOrder}
              initialValues={searchFormInitialValues || {}}
            />
          )}
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6}></Column>
        <Column small={12} medium={6}>
          <TableFilters
            amountText={isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
            filterOptions={[]}
            filterValue={[]}
          />
        </Column>
      </Row>
      <TableWrapper>
        {isFetching && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={isFetching} />
          </LoaderWrapper>
        )}
        <SortableTable
          columns={columns}
          data={sapInvoices}
          listTable
          onRowClick={handleRowClick}
          onSortingChange={handleSortingChange}
          serverSideSorting
          sortable
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
        <Pagination
          activePage={activePage}
          maxPage={maxPage}
          onPageClick={handlePageClick}
        />
      </TableWrapper>
    </PageContainer>
  );
};

export default flowRight(
  withSapInvoicesAttributes,
  withRouter,
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        sapInvoiceList: getSapInvoiceList(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
      };
    },
    {
      fetchSapInvoices,
      receiveTopNavigationSettings,
    },
  ),
)(SapInvoicesListPage);
