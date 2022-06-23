// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
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
import Search from './Search';
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
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {InvoiceNoteFieldPaths, InvoiceNoteFieldTitles} from '$src/invoiceNote/enums';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {
  formatDate,
  getApiResponseCount,
  getApiResponseResults,
  getApiResponseMaxPage,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getInvoiceNoteList, getIsCreateModalOpen, getIsFetching} from '$src/invoiceNote/selectors';
import {withInvoiceNoteAttributes} from '$components/attributes/InvoiceNoteAttributes';
import {getUserActiveServiceUnit} from '$src/usersPermissions/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {InvoiceNoteList} from '$src/invoiceNote/types';
import type {UserServiceUnit} from '$src/usersPermissions/types';

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
          text={getContentLeaseIdentifier(val) || '-'}
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
  initialize: Function,
  invoiceNoteAttributes: Attributes,
  invoiceNoteList: InvoiceNoteList,
  invoiceNoteMethods: MethodsType,
  isCreateModalOpen: boolean,
  isFetching: boolean,
  isFetchingInvoiceNoteAttributes: boolean,
  location: Object,
  receiveInvoiceNoteList: Function,
  receiveTopNavigationSettings: Function,
  showCreateInvoiceNoteModal: Function,
  userActiveServiceUnit: UserServiceUnit,
}

type State = {
  activePage: number,
  columns: Array<Object>,
  count: number,
  invoiceNoteAttributes: Attributes,
  invoiceNoteList: InvoiceNoteList,
  invoiceNotes: Array<Object>,
  isSearchInitialized: boolean,
  maxPage: number,
}

class InvoiceNoteListPage extends PureComponent<Props, State> {
  _isMounted: boolean
  _hasFetchedInvoiceNotes: boolean

  state = {
    activePage: 1,
    columns: [],
    count: 0,
    invoiceNoteAttributes: null,
    invoiceNoteList: {},
    invoiceNotes: [],
    isSearchInitialized: false,
    maxPage: 0,
  }

  componentDidMount() {
    const {receiveTopNavigationSettings} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INVOICE_NOTES),
      pageTitle: 'Laskujen tiedotteet',
      showSearch: false,
    });

    this._isMounted = true;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.invoiceNoteAttributes !== state.invoiceNoteAttributes) {
      newState.invoiceNoteAttributes = props.invoiceNoteAttributes;
      newState.columns = getColumns(props.invoiceNoteAttributes);
    }

    if(props.invoiceNoteList !== state.invoiceNoteList) {
      newState.invoiceNoteList = props.invoiceNoteList;
      newState.count = getApiResponseCount(props.invoiceNoteList);
      newState.invoiceNotes = getApiResponseResults(props.invoiceNoteList);
      newState.maxPage = getApiResponseMaxPage(props.invoiceNoteList, LIST_TABLE_PAGE_SIZE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}, userActiveServiceUnit} = this.props;
    const {location: {search: prevSearch}, userActiveServiceUnit: prevUserActiveServiceUnit} = prevProps;

    const handleSearch = () => {
      this.setSearchValues();
      this.search();
    };

    if (userActiveServiceUnit) {
      if (userActiveServiceUnit !== prevUserActiveServiceUnit) {
        if (!this._hasFetchedInvoiceNotes) { // No search has been done yet
          handleSearch();
          this._hasFetchedInvoiceNotes = true;
        } else {
          // Search again after changing user active service unit only if not explicitly setting the service unit filter
          if (!currentSearch.includes('service_unit')) {
            handleSearch();
          }
        }
      } else {
        if (!this._hasFetchedInvoiceNotes) { // No search has been done yet
          handleSearch();
          this._hasFetchedInvoiceNotes = true;
        }
      }
    }

    if (currentSearch !== prevSearch) {
      handleSearch();
    }
  }

  componentWillUnmount() {
    const {receiveInvoiceNoteList} = this.props;

    // Clear invoice note list
    receiveInvoiceNoteList({});

    this._isMounted = false;
    this._hasFetchedInvoiceNotes = false;
  }

  setSearchValues = () => {
    const {location: {search}, initialize, userActiveServiceUnit} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async () => {
      const initialValues = {...searchQuery};

      if (initialValues.service_unit === undefined && userActiveServiceUnit) {
        initialValues.service_unit = userActiveServiceUnit.id;
      }

      delete initialValues.page;

      initialize(FormNames.INVOICE_NOTE_SEARCH, initialValues);
    };

    this.setState({
      isSearchInitialized: false,
      activePage: page,
    }, async () => {
      await initializeSearchForm();

      if (this._isMounted) {
        setSearchFormReady();
      }
    });
  }

  search = () => {
    const {fetchInvoiceNoteList, location: {search}, userActiveServiceUnit} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    if (searchQuery.service_unit === undefined && userActiveServiceUnit) {
      searchQuery.service_unit = userActiveServiceUnit.id;
    }

    fetchInvoiceNoteList(searchQuery);
  }

  handleSearchChange = (query: any) => {
    const {history} = this.props;

    return history.push({
      pathname: getRouteById(Routes.INVOICE_NOTES),
      search: getSearchQuery(query),
    });
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
      invoiceNoteMethods,
      isCreateModalOpen,
      isFetching,
      isFetchingInvoiceNoteAttributes,
      userActiveServiceUnit,
    } = this.props;
    const {
      activePage,
      columns,
      count,
      invoiceNotes,
      isSearchInitialized,
      maxPage,
    } = this.state;

    if(isFetchingInvoiceNoteAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

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
          <Column small={12} large={8}>
            <Authorization allow={isMethodAllowed(invoiceNoteMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo tiedote'
                onClick={this.showCreateInvoiceNoteModal}
              />
            </Authorization>
          </Column>
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
  withInvoiceNoteAttributes,
  withRouter,
  connect(
    (state) => {
      return {
        invoiceNoteList: getInvoiceNoteList(state),
        isCreateModalOpen: getIsCreateModalOpen(state),
        isFetching: getIsFetching(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
      };
    },
    {
      createInvoiceNoteAndFetchList,
      fetchInvoiceNoteList,
      hideCreateInvoiceNoteModal,
      receiveInvoiceNoteList,
      receiveTopNavigationSettings,
      showCreateInvoiceNoteModal,
      initialize,
    }
  ),
)(InvoiceNoteListPage);
