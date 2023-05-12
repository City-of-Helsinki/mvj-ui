// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import isArray from 'lodash/isArray';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {initialize} from 'redux-form';
import {withRouter} from 'react-router';

import AuthorizationError from '$components/authorization/AuthorizationError';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import Search from '$src/areaSearch/components/search/Search';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableFilterWrapper from '$components/table/TableFilterWrapper';
import TableWrapper from '$components/table/TableWrapper';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {getRouteById, Routes} from '$src/root/routes';
import {
  formatDate,
  getLabelOfOption,
  setPageTitle,
  getFieldOptions,
  getSearchQuery,
  getApiResponseCount,
  getApiResponseMaxPage,
  getUrlParams,
  isMethodAllowed,
} from '$util/helpers';
import {withAreaSearchAttributes} from '$components/attributes/AreaSearchAttributes';
import {getAreaSearchList, getIsFetchingAreaSearchList} from '$src/areaSearch/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import {
  DEFAULT_AREA_SEARCH_STATES,
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
} from '$src/areaSearch/constants';
import {fetchAreaSearchList} from '$src/areaSearch/actions';
import {getUserFullName} from '$src/users/helpers';
import type {ApiResponse} from '$src/types';
import {areaSearchSearchFilters} from '$src/areaSearch/helpers';

type OwnProps = {|

|};

type Props = {
  ...OwnProps,
  history: Object,
  location: Object,
  usersPermissions: UsersPermissionsType,
  receiveTopNavigationSettings: Function,
  areaSearchAttributes: Attributes,
  areaSearchMethods: MethodsType,
  isFetchingAreaSearchAttributes: boolean,
  isFetching: boolean,
  initialize: Function,
  fetchAreaSearchList: Function,
  areaSearches: ApiResponse,
}

type State = {
  properties: Array<Object>,
  activePage: number,
  isSearchInitialized: boolean,
  count: number,
  sortKey: string,
  sortOrder: string,
  maxPage: number,
  selectedStates: Array<string>,
}

class AreaSearchApplicationListPage extends PureComponent<Props, State> {
  _isMounted: boolean

  state: State = {
    properties: [],
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    activePage: 1,
    count: 0,
    isSearchInitialized: false,
    maxPage: 0,
    selectedStates: DEFAULT_AREA_SEARCH_STATES,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
    } = this.props;
    setPageTitle('Aluehaun hakemukset');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_SEARCH),
      pageTitle: 'Aluehaun hakemukset',
      showSearch: false,
    });

    this.search();

    this.setSearchFormValues();

    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  handleAreaSearchStatesChange = (values: Array<string>) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.page;
    searchQuery.state = values;

    this.setState({selectedStates: values});
    this.handleSearchChange(searchQuery, true);
  }

  getColumns = () => {
    const {areaSearchAttributes} = this.props;
    const columns = [];
    const intendedUseOptions = getFieldOptions(areaSearchAttributes, 'intended_use');
    const stateOptions = getFieldOptions(areaSearchAttributes, 'state');

    columns.push({
      key: 'identifier',
      text: 'Hakemus',
    });

    columns.push({
      key: 'applicants',
      text: 'Hakija',
      sortable: false,
    });

    columns.push({
      key: 'received_date',
      text: 'Saapunut',
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'intended_use',
      text: 'Käyttötarkoitus',
      renderer: (val) => getLabelOfOption(intendedUseOptions, val),
    });

    columns.push({
      key: 'address',
      text: 'Osoite',
    });

    columns.push({
      key: 'district',
      text: 'Kaupunginosa',
    });

    columns.push({
      key: 'start_date',
      text: 'Alkupvm',
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'end_date',
      text: 'Loppupvm',
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'state',
      text: 'Tila',
      renderer: (val) => getLabelOfOption(stateOptions, val),
    });

    columns.push({
      key: 'lessor',
      text: 'Vuokranantaja',
    });

    columns.push({
      key: 'preparer',
      text: 'Käsittelijä',
      renderer: (val) => getUserFullName(val),
    });

    return columns;
  }

  search = () => {
    const {fetchAreaSearchList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    fetchAreaSearchList(areaSearchSearchFilters(searchQuery));
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}/${id}`,
      search: search,
    });
  }

  handleSortingChange = ({sortKey, sortOrder}) => {
    const {history, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;

    this.setState({
      sortKey,
      sortOrder,
    });

    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(searchQuery),
    });
  }

  handlePageClick = (page: number) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(query),
    });
  }

  updateTableData = () => {
    const {areaSearches} = this.props;

    this.setState({
      count: getApiResponseCount(areaSearches),
      maxPage: getApiResponseMaxPage(areaSearches, LIST_TABLE_PAGE_SIZE),
    });
  }

  handleSearchChange = (query: Object, resetActivePage?: boolean = true) => {
    const {history} = this.props;

    if (resetActivePage) {
      this.setState({activePage: 1});
      delete query.page;
    }

    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(query),
    });
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if (currentSearch !== prevSearch) {
      this.search();

      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if (!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }

    if (prevProps.areaSearches !== this.props.areaSearches) {
      this.updateTableData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
    this._isMounted = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  }

  getSearchStates = (query: Object) => {
    if (isArray(query.state)) {
      return query.state;
    }

    if (query.state) {
      return [query.state];
    }

    return (query.search || query?.state) ? [] : DEFAULT_AREA_SEARCH_STATES;
  }

  setSearchFormValues = () => {
    const {location: {search}, initialize} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    const states = this.getSearchStates(searchQuery);

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      const initialValues = {...searchQuery};
      delete initialValues.page;
      delete initialValues.state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.AREA_SEARCH_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      selectedStates: states,
    }, async() => {
      await initializeSearchForm();

      if(this._isMounted) {
        setSearchFormReady();
      }
    });
  }

  render() {
    const {
      areaSearchMethods,
      areaSearches,
      areaSearchAttributes,
      isFetching,
      isFetchingAreaSearchAttributes,
    } = this.props;

    const {
      sortKey,
      sortOrder,
      activePage,
      isSearchInitialized,
      maxPage,
      selectedStates,
    } = this.state;

    const columns = this.getColumns();
    const stateOptions = getFieldOptions(areaSearchAttributes, 'state', false);

    if (isFetchingAreaSearchAttributes || !areaSearches) {
      return <PageContainer>
        <Loader isLoading={true}/>
      </PageContainer>;
    }

    if (!areaSearchMethods) {
      return null;
    }

    if (!isMethodAllowed(areaSearchMethods, Methods.GET)) {
      return <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.AREA_SEARCH} />
      </PageContainer>;
    }

    return (
      <PageContainer>
        <Row>
          <Column small={12} medium={4} large={4} />
          <Column small={12} medium={8} large={8}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              states={selectedStates}
              handleSubmit={() => {}}
            />
          </Column>
        </Row>

        {<TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${areaSearches?.count} kpl`}
              filterOptions={stateOptions}
              filterValue={selectedStates}
              onFilterChange={this.handleAreaSearchStatesChange}
            />

          }
        />}

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
          }

          <Fragment>
            <SortableTable
              columns={columns}
              data={areaSearches?.results || []}
              listTable
              onRowClick={this.handleRowClick}
              onSortingChange={this.handleSortingChange}
              serverSideSorting
              showCollapseArrowColumn
              sortable
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
            <Pagination
              activePage={activePage}
              maxPage={maxPage}
              onPageClick={(page) => this.handlePageClick(page)}
            />
          </Fragment>
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default (flowRight(
  withRouter,
  withAreaSearchAttributes,
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        isFetching: getIsFetchingAreaSearchList(state),
        areaSearches: getAreaSearchList(state),
      };
    },
    {
      receiveTopNavigationSettings,
      initialize,
      fetchAreaSearchList,
    },
  ),
)(AreaSearchApplicationListPage): React$ComponentType<OwnProps>);
