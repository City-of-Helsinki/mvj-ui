// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';

import {fetchRentBasisList, initializeRentBasis} from '$src/rentbasis/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {TableSortOrder} from '$components/enums';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {
  FormNames,
  RentBasisFieldPaths,
  RentBasisPropertyIdentifiersFieldPaths,
  RentBasisRentRatesFieldPaths,
} from '$src/rentbasis/enums';
import {mapRentBasisSearchFilters} from '$src/rentbasis/helpers';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching, getRentBasisList} from '$src/rentbasis/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {RentBasisList} from '$src/rentbasis/types';

type Props = {
  fetchRentBasisList: Function,
  history: Object,
  initialize: Function,
  initializeRentBasis: Function,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // get vie withCommonAttributes HOC
  location: Object,
  receiveTopNavigationSettings: Function,
  rentBasisAttributes: Attributes, // get vie withCommonAttributes HOC
  rentBasisMethods: MethodsType, // get vie withCommonAttributes HOC
  rentBasisListData: RentBasisList,
}

type State = {
  activePage: number,
  isSearchInitialized: boolean,
  sortKey: string,
  sortOrder: string,
}

class RentBasisListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    isSearchInitialized: false,
    sortKey: 'start_date',
    sortOrder: TableSortOrder.DESCENDING,
  }

  componentDidMount() {
    const {
      initialize,
      location: {search},
      receiveTopNavigationSettings,
    } = this.props;
    const newState = {};
    const query = getUrlParams(search);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.RENT_BASIS),
      pageTitle: 'Vuokrausperusteet',
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

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      try {
        const searchQuery = {...query};

        delete searchQuery.page;
        delete searchQuery.sort_key;
        delete searchQuery.sort_order;

        await initialize(FormNames.SEARCH, searchQuery);

        setSearchFormReady();
      } catch(e) {
        console.error(`Failed to initialize search form with error, ${e}`);
      }
    };

    initializeSearchForm();
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;

    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.search();

      if(!Object.keys(searchQuery).length) {
        const setSearchFormReady = () => {
          this.setState({isSearchInitialized: true});
        };

        const clearSearchForm = async() => {
          await initialize(FormNames.SEARCH, {});
        };

        this.setState({
          activePage: 1,
          isSearchInitialized: false,
          sortKey: 'start_date',
          sortOrder: TableSortOrder.DESCENDING,
        }, async() => {
          await clearSearchForm();
          setSearchFormReady();
        });
      }
    }
  }

  handleSearchChange = (query, resetActivePage?: boolean = false) => {
    const {history} = this.props;

    if(resetActivePage) {
      this.setState({activePage: 1});
    }

    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS),
      search: getSearchQuery(query),
    });
  }

  search = () => {
    const {fetchRentBasisList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;

    fetchRentBasisList(mapRentBasisSearchFilters(searchQuery));
  }

  handleCreateButtonClick = () => {
    const {history, initializeRentBasis, location: {search}} = this.props;

    initializeRentBasis({
      decisions: [{}],
      property_identifiers: [{}],
      rent_rates: [{}],
    });

    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      search: search,
    });
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.RENT_BASIS)}/${id}`,
      search: search,
    });
  };

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
      pathname: getRouteById(Routes.RENT_BASIS),
      search: getSearchQuery(query),
    });
  }

  getRentBasisCount = (rentBasisList: RentBasisList) => {
    return get(rentBasisList, 'count', 0);
  }

  getRentBasisList = (rentBasisList: RentBasisList) => {
    const items = get(rentBasisList, 'results', []);
    return items.map((item) => {
      return {
        id: item.id,
        property_identifiers: get(item, 'property_identifiers').map((item) => item.identifier),
        build_permission_types: get(item, 'rent_rates').map((rate) =>
          get(rate, 'build_permission_type.id') || get(rate, 'build_permission_type')),
        start_date: get(item, 'start_date'),
        end_date: get(item, 'end_date'),
      };
    });
  }

  getRentBasisMaxPage = (rentBasisList: RentBasisList) => {
    const count = this.getRentBasisCount(rentBasisList);

    if(!count) {
      return 0;
    }
    return Math.ceil(count/LIST_TABLE_PAGE_SIZE);
  }

  getColumns = () => {
    const {rentBasisAttributes} = this.props;
    const columns = [];
    const buildPermissionTypeOptions = getFieldOptions(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE);

    if(isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS)) {
      columns.push({
        key: 'property_identifiers',
        sortable: false,
        text: 'Kohteen tunnus',
      });
    }

    if(isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)) {
      columns.push({
        key: 'build_permission_types',
        text: 'Pääkäyttötarkoitus',
        renderer: (val) => val ? getLabelOfOption(buildPermissionTypeOptions, val) : '-',
        sortable: false,
      });
    }

    if(isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.START_DATE)) {
      columns.push({key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val) || '-'});
    }

    if(isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.END_DATE)) {
      columns.push({key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val) || '-'});
    }

    return columns;
  }

  handleSortingChange = ({sortKey, sortOrder}) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;

    this.setState({
      sortKey,
      sortOrder,
    });

    this.handleSearchChange(searchQuery);
  }

  render() {
    const {
      isFetching,
      isFetchingCommonAttributes,
      rentBasisListData,
      rentBasisMethods,
    } = this.props;
    const {activePage, isSearchInitialized, sortKey, sortOrder} = this.state;
    const count = this.getRentBasisCount(rentBasisListData);
    const rentBasisList = this.getRentBasisList(rentBasisListData);
    const maxPage = this.getRentBasisMaxPage(rentBasisListData);
    const columns = this.getColumns();

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!rentBasisMethods) return null;

    if(!isMethodAllowed(rentBasisMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.RENT_BASIS} /></PageContainer>;

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <Authorization allow={isMethodAllowed(rentBasisMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo vuokrausperuste'
                onClick={this.handleCreateButtonClick}
              />
            </Authorization>
          </Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
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
            data={rentBasisList}
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
        rentBasisListData: getRentBasisList(state),
      };
    },
    {
      fetchRentBasisList,
      initialize,
      initializeRentBasis,
      receiveTopNavigationSettings,
    },
  ),
)(RentBasisListPage);
