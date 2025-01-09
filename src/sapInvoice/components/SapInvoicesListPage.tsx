import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { withRouter } from "react-router";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
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
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
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
  initialize: (...args: Array<any>) => any;
  invoiceAttributes: Attributes;
  // Via withSapInvoicesAttributes HOC
  invoiceMethods: MethodsType;
  // Via withSapInvoicesAttributes HOC
  isFetching: boolean;
  isFetchingInvoiceAttributes: boolean;
  // Via withSapInvoicesAttributes HOC
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  sapInvoiceList: SapInvoiceList;
  userActiveServiceUnit: UserServiceUnit;
};
type State = {
  activePage: number;
  columns: Array<Record<string, any>>;
  count: number;
  invoiceAttributes: Attributes;
  isSearchInitialized: boolean;
  maxPage: number;
  sapInvoiceList: SapInvoiceList;
  sapInvoices: Array<Record<string, any>>;
  sortKey: string;
  sortOrder: string;
};

class SapInvoicesListPage extends PureComponent<Props, State> {
  _isMounted: boolean;
  _hasFetchedInvoices: boolean;
  state = {
    activePage: 1,
    columns: [],
    count: 0,
    isSearchInitialized: false,
    invoiceAttributes: null,
    maxPage: 0,
    sapInvoiceList: null,
    sapInvoices: [],
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
  };

  componentDidMount() {
    const { receiveTopNavigationSettings } = this.props;
    setPageTitle("SAP laskut");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.SAP_INVOICES),
      pageTitle: "SAP laskut",
      showSearch: false,
    });
    this._isMounted = true;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.invoiceAttributes !== state.invoiceAttributes) {
      newState.invoiceAttributes = props.invoiceAttributes;
      newState.columns = getColumns(props.invoiceAttributes);
    }

    if (props.sapInvoiceList !== state.sapInvoiceList) {
      newState.sapInvoiceList = props.sapInvoiceList;
      newState.count = getApiResponseCount(props.sapInvoiceList);
      newState.sapInvoices = getSapInvoices(props.sapInvoiceList);
      newState.maxPage = getApiResponseMaxPage(
        props.sapInvoiceList,
        LIST_TABLE_PAGE_SIZE,
      );
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: currentSearch },
      userActiveServiceUnit,
    } = this.props;
    const {
      location: { search: prevSearch },
      userActiveServiceUnit: prevUserActiveServiceUnit,
    } = prevProps;

    const handleSearch = () => {
      this.setSearchValues();
      this.search();
    };

    if (userActiveServiceUnit) {
      if (!this._hasFetchedInvoices) {
        // No search has been done yet
        handleSearch();
        this._hasFetchedInvoices = true;
      } else if (
        userActiveServiceUnit !== prevUserActiveServiceUnit &&
        !currentSearch.includes("service_unit")
      ) {
        // Search again after changing user active service unit only if not explicitly setting the service unit filter
        handleSearch();
      }
    }

    if (currentSearch !== prevSearch) {
      handleSearch();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePopState);
    this._isMounted = false;
    this._hasFetchedInvoices = false;
  }

  handlePopState = () => {
    this.setSearchValues();
  };
  setSearchValues = () => {
    const {
      location: { search },
      initialize,
      userActiveServiceUnit,
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    const setSearchFormReady = () => {
      this.setState({
        isSearchInitialized: true,
      });
    };

    const initializeSearchForm = async () => {
      const initialValues = { ...searchQuery };

      if (initialValues.service_unit === undefined && userActiveServiceUnit) {
        initialValues.service_unit = userActiveServiceUnit.id;
      }

      delete initialValues.page;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      initialize(FormNames.SAP_INVOICE_SEARCH, initialValues);
    };

    this.setState(
      {
        isSearchInitialized: false,
        activePage: page,
        sortKey: searchQuery.sort_key ? searchQuery.sort_key : DEFAULT_SORT_KEY,
        sortOrder: searchQuery.sort_order
          ? searchQuery.sort_order
          : DEFAULT_SORT_ORDER,
      },
      async () => {
        await initializeSearchForm();

        if (this._isMounted) {
          setSearchFormReady();
        }
      },
    );
  };
  search = () => {
    const {
      fetchSapInvoices,
      location: { search },
      userActiveServiceUnit,
    } = this.props;
    const searchQuery = getUrlParams(search);
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
  };
  handleRowClick = (id, row) => {
    window.open(
      `${getRouteById(Routes.LEASES)}/${row.lease.id}?tab=6&opened_invoice=${id}`,
      "_blank",
    );
  };
  handleSearchChange = (query: any) => {
    const { history } = this.props;
    return history.push({
      pathname: getRouteById(Routes.SAP_INVOICES),
      search: getSearchQuery(query),
    });
  };
  handleSortingChange = ({ sortKey, sortOrder }) => {
    const {
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    this.setState(
      {
        sortKey,
        sortOrder,
      },
      this.handleSearchChange(searchQuery),
    );
  };
  handlePageClick = (page: number) => {
    const {
      location: { search },
    } = this.props;
    const query = getUrlParams(search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState(
      {
        activePage: page,
      },
      this.handleSearchChange(query),
    );
  };

  render() {
    const {
      invoiceMethods,
      isFetching,
      isFetchingInvoiceAttributes,
      userActiveServiceUnit,
    } = this.props;
    const {
      activePage,
      count,
      columns,
      isSearchInitialized,
      maxPage,
      sapInvoices,
      sortKey,
      sortOrder,
    } = this.state;
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
                onSearch={this.handleSearchChange}
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
            onRowClick={this.handleRowClick}
            onSortingChange={this.handleSortingChange}
            serverSideSorting
            sortable
            sortKey={sortKey}
            sortOrder={sortOrder}
          />
          <Pagination
            activePage={activePage}
            maxPage={maxPage}
            onPageClick={this.handlePageClick}
          />
        </TableWrapper>
      </PageContainer>
    );
  }
}

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
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(SapInvoicesListPage);
