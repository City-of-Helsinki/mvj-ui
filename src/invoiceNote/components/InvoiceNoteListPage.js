// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import CreateInvoiceNoteModal from './CreateInvoiceNoteModal';
import ExternalLink from '$components/links/ExternalLink';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import ShowMore from '$components/showMore/ShowMore';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {
  createInvoiceNoteAndFetchList,
  fetchInvoiceNoteList,
  hideCreateInvoiceNoteModal,
  receiveInvoiceNoteList,
  showCreateInvoiceNoteModal,
} from '$src/invoiceNote/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {InvoiceNoteFieldPaths, InvoiceNoteFieldTitles} from '$src/invoiceNote/enums';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {
  formatDate,
  getApiReponseListCount,
  getApiResponseListItems,
  getApiReponseListMaxPage,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getInvoiceNoteList, getIsCreateModalOpen, getIsFetching} from '$src/invoiceNote/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {InvoiceNoteList} from '$src/invoiceNote/types';

const getColumns = (invoiceNoteAttributes: Attributes) => {
  const columns = [];

  if(isFieldAllowedToRead(invoiceNoteAttributes, InvoiceNoteFieldPaths.LEASE)) {
    columns.push({
      key: 'lease',
      text: InvoiceNoteFieldTitles.LEASE,
      renderer: (val) => val
        ? <ExternalLink
          className='no-margin'
          href={`${getRouteById(Routes.LEASES)}/${val.id}?tab=6`}
          text={getContentLeaseIdentifier(val)}
        />
        : '-',
    });
  }

  if(isFieldAllowedToRead(invoiceNoteAttributes, InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE)) {
    columns.push({
      key: 'billing_period_start_date',
      text: InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE,
      renderer: (val) => formatDate(val),
    });
  }

  if(isFieldAllowedToRead(invoiceNoteAttributes, InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE)) {
    columns.push({
      key: 'billing_period_end_date',
      text: InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE,
      renderer: (val) => formatDate(val),
    });
  }

  if(isFieldAllowedToRead(invoiceNoteAttributes, InvoiceNoteFieldPaths.NOTES)) {
    columns.push({
      key: 'notes',
      text: InvoiceNoteFieldTitles.NOTES,
      renderer: (val) => <ShowMore className='no-margin' text={val} />,
    });
  }

  return columns;
};

type Props = {
  createInvoiceNoteAndFetchList: Function,
  fetchInvoiceNoteList: Function,
  hideCreateInvoiceNoteModal: Function,
  history: Object,
  invoiceNoteAttributes: Attributes,
  invoiceNoteList: InvoiceNoteList,
  invoiceNoteMethods: MethodsType,
  isCreateModalOpen: boolean,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean,
  location: Object,
  receiveInvoiceNoteList: Function,
  receiveTopNavigationSettings: Function,
  showCreateInvoiceNoteModal: Function,
}

type State = {
  activePage: number,
  columns: Array<Object>,
  count: number,
  invoiceNoteAttributes: Attributes,
  invoiceNoteList: InvoiceNoteList,
  invoiceNotes: Array<Object>,
  maxPage: number,
}

class InvoiceNoteListPage extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    columns: [],
    count: 0,
    invoiceNoteAttributes: null,
    invoiceNoteList: {},
    invoiceNotes: [],
    maxPage: 0,
  }

  componentDidMount() {
    const {location: {search}, receiveTopNavigationSettings} = this.props;
    const query = getUrlParams(search);
    const page = query.page ? Number(query.page) : 1;

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INVOICE_NOTES),
      pageTitle: 'Laskujen tiedotteet',
      showSearch: false,
    });

    this.setState({activePage: page});

    this.search();
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.invoiceNoteAttributes !== state.invoiceNoteAttributes) {
      newState.invoiceNoteAttributes = props.invoiceNoteAttributes;
      newState.columns = getColumns(props.invoiceNoteAttributes);
    }

    if(props.invoiceNoteList !== state.invoiceNoteList) {
      newState.invoiceNoteList = props.invoiceNoteList;
      newState.count = getApiReponseListCount(props.invoiceNoteList);
      newState.invoiceNotes = getApiResponseListItems(props.invoiceNoteList);
      newState.maxPage = getApiReponseListMaxPage(props.invoiceNoteList, LIST_TABLE_PAGE_SIZE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    if(currentSearch !== prevSearch) {
      const query = getUrlParams(currentSearch);
      const page = query.page ? Number(query.page) : 1;

      this.setState({activePage: page}, () => {
        this.search();
      });
    }
  }

  componentWillUnmount() {
    const {receiveInvoiceNoteList} = this.props;

    // Clear invoice note list
    receiveInvoiceNoteList({});
  }

  search = () => {
    const {fetchInvoiceNoteList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    fetchInvoiceNoteList(searchQuery);
  }

  handlePageClick = (page: number) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

    return history.push({
      pathname: getRouteById(Routes.INVOICE_NOTES),
      search: getSearchQuery(query),
    });
  }

  hideCreateInvoiceNoteModal = () => {
    const {hideCreateInvoiceNoteModal} = this.props;

    hideCreateInvoiceNoteModal();
  }

  showCreateInvoiceNoteModal = () => {
    const {showCreateInvoiceNoteModal} = this.props;

    showCreateInvoiceNoteModal();
  }

  createInvoiceNote = (data: Object) => {
    const {createInvoiceNoteAndFetchList, location: {search}} = this.props;
    const query = getUrlParams(search);

    createInvoiceNoteAndFetchList({
      data,
      query,
    });
  }

  render() {
    const {
      invoiceNoteList,
      invoiceNoteMethods,
      isCreateModalOpen,
      isFetching,
      isFetchingCommonAttributes,
    } = this.props;
    const {
      activePage,
      columns,
      count,
      invoiceNotes,
      maxPage,
    } = this.state;

    if(isFetchingCommonAttributes || isFetching && isEmpty(invoiceNoteList)) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!invoiceNoteMethods) return null;

    if(!isMethodAllowed(invoiceNoteMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.INVOICE_NOTE} /></PageContainer>;

    return (
      <PageContainer>
        <Authorization allow={isMethodAllowed(invoiceNoteMethods, Methods.POST)}>
          <CreateInvoiceNoteModal
            isOpen={isCreateModalOpen}
            onClose={this.hideCreateInvoiceNoteModal}
            onSubmit={this.createInvoiceNote}
          />
        </Authorization>
        <Row>
          <Column small={12} large={6}>
            <Authorization allow={isMethodAllowed(invoiceNoteMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo tiedote'
                onClick={this.showCreateInvoiceNoteModal}
              />
            </Authorization>
          </Column>
        </Row>
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
            data={invoiceNotes}
            listTable
            sortable={false}
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
        invoiceNoteList: getInvoiceNoteList(state),
        isCreateModalOpen: getIsCreateModalOpen(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      createInvoiceNoteAndFetchList,
      fetchInvoiceNoteList,
      hideCreateInvoiceNoteModal,
      receiveInvoiceNoteList,
      receiveTopNavigationSettings,
      showCreateInvoiceNoteModal,
    }
  ),
)(InvoiceNoteListPage);
