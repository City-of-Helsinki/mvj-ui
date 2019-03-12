// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ExternalLinkIcon from '$components/icons/ExternalLinkIcon';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {fetchSapInvoices} from '$src/sapInvoice/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {TableSortOrder} from '$components/enums';
import {InvoiceFieldPaths, InvoiceRowsFieldPaths} from '$src/invoices/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {formatReceivableTypesString} from '$src/invoices/helpers';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {
  getSapInvoiceListCount,
  getSapInvoiceListMaxPage,
  getSapInvoices,
  mapSapInvoiceSearchFilters,
} from '$src/sapInvoice/helpers';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getSearchQuery,
  getUrlParams,
  isEmptyValue,
  isFieldAllowedToRead,
  isMethodAllowed,
  setPageTitle,
} from '$src/util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching, getSapInvoices as getSapInvoiceList} from '$src/sapInvoice/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {SapInvoiceList} from '$src/sapInvoice/types';

const getColumns = (invoiceAttributes: Attributes) => {
  const receivableTypeOptions = getFieldOptions(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE);
  const columns = [];

  if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
    columns.push({
      key: 'send_to_sap_date',
      text: 'Sap lähetyspvm',
      renderer: (val) => formatDate(val),
    });
  }
  if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)) {
    columns.push({
      key: 'recipient',
      text: 'Laskunsaaja',
      renderer: (val) => getContactFullName(val) || '-',
    });
  }
  if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
    columns.push({
      key: 'due_date',
      text: 'Eräpäivä',
      renderer: (val) => formatDate(val),
    });
  }
  if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)) {
    columns.push({
      key: 'billed_amount',
      text: 'Laskutettu',
      renderer: (val) => !isEmptyValue(val) ? `${formatNumber(val)} €` : '-',
    });
  }
  if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.LEASE)) {
    columns.push({
      key: 'lease',
      text: 'Vuokratunnus',
      renderer: (val) => getContentLeaseIdentifier(val),
    });
  }
  if(isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)) {
    columns.push({
      key: 'receivableTypes',
      text: 'Saamislaji',
      arrayRenderer: (val) => formatReceivableTypesString(receivableTypeOptions, val) || '-',
      sortable: false,
    });
  }
  if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.LEASE)) {
    columns.push({
      key: 'link',
      text: '',
      renderer: () => <ExternalLinkIcon className='icon-small icon-green'/>,
      sortable: false,
    });
  }

  return columns;
};

type Props = {
  fetchSapInvoices: Function,
  history: Object,
  invoiceAttributes: Attributes, // Via withCommonAttributes HOC
  invoiceMethods: MethodsType, // Via withCommonAttributes HOC
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // Via withCommonAttributes HOC
  location: Object,
  receiveTopNavigationSettings: Function,
  sapInvoiceList: SapInvoiceList,
}

type State = {
  activePage: number,
  columns: Array<Object>,
  count: number,
  invoiceAttributes: Attributes,
  maxPage: number,
  sapInvoiceList: SapInvoiceList,
  sapInvoices: Array<Object>,
  sortKey: string,
  sortOrder: string,
}

class SapInvoicesListPage extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    columns: [],
    count: 0,
    invoiceAttributes: null,
    maxPage: 0,
    sapInvoiceList: {},
    sapInvoices: [],
    sortKey: 'due_date',
    sortOrder: TableSortOrder.DESCENDING,
  }

  componentDidMount() {
    const {location: {search}, receiveTopNavigationSettings} = this.props;
    const query = getUrlParams(search);
    const newState = {};

    setPageTitle('SAP laskut');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.SAP_INVOICES),
      pageTitle: 'SAP laskut',
      showSearch: false,
    });

    this.search();

    const page = query.page ? Number(query.page) : 1;
    newState.activePage = page;

    if(query.sort_key || query.sort_order) {
      newState.sortKey = query.sort_key;
      newState.sortOrder = query.sort_order;
    }

    this.setState(newState);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.invoiceAttributes !== state.invoiceAttributes) {
      newState.invoiceAttributes = props.invoiceAttributes;
      newState.columns = getColumns(props.invoiceAttributes);
    }
    if(props.sapInvoiceList !== state.sapInvoiceList) {
      newState.sapInvoiceList = props.sapInvoiceList;
      newState.count = getSapInvoiceListCount(props.sapInvoiceList);
      newState.sapInvoices = getSapInvoices(props.sapInvoiceList);
      newState.maxPage = getSapInvoiceListMaxPage(props.sapInvoiceList, LIST_TABLE_PAGE_SIZE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      if(!Object.keys(searchQuery).length) {
        this.setState({
          activePage: 1,
          sortKey: 'due_date',
          sortOrder: TableSortOrder.DESCENDING,
        }, this.search());
      } else {
        this.search();
      }
    }
  }

  search = () => {
    const {fetchSapInvoices, location: {search}} = this.props;
    const {sortKey, sortOrder} = this.state;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;

    fetchSapInvoices(mapSapInvoiceSearchFilters(searchQuery));
  }

  handleRowClick = (id, row) => {
    window.open(`${getRouteById(Routes.LEASES)}/${row.lease.id}?tab=6&opened_invoice=${id}`, '_blank');
  };

  handleSearchChange = (query: any) => {
    const {history} = this.props;

    return history.push({
      pathname: getRouteById(Routes.SAP_INVOICES),
      search: getSearchQuery(query),
    });
  }

  handleSortingChange = ({sortKey, sortOrder}) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;

    this.setState({
      sortKey,
      sortOrder,
    }, this.handleSearchChange(searchQuery));
  }

  handlePageClick = (page: number) => {
    const {location: {search}} = this.props;
    const query = getUrlParams(search);

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page}, this.handleSearchChange(query));
  }

  render() {
    const {
      invoiceMethods,
      isFetching,
      isFetchingCommonAttributes,
    } = this.props;
    const {
      activePage,
      count,
      columns,
      maxPage,
      sapInvoices,
      sortKey,
      sortOrder,
    } = this.state;

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!invoiceMethods) return null;

    if(!isMethodAllowed(invoiceMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.INVOICE} /></PageContainer>;

    return (
      <PageContainer>
        <Row>
          <Column small={12} medium={6}></Column>
          <Column small={12} medium={6}>
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={[]}
              filterValue={[]}
            />
          </Column>
        </Row>
        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
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
  withCommonAttributes,
  withRouter,
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        sapInvoiceList: getSapInvoiceList(state),
      };
    },
    {
      fetchSapInvoices,
      receiveTopNavigationSettings,
    }
  )
)(SapInvoicesListPage);
