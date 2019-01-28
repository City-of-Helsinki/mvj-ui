// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
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
import {PermissionMissingTexts} from '$src/enums';
import {
  FormNames,
  RentBasisFieldPaths,
  RentBasisPropertyIdentifiersFieldPaths,
  RentBasisRentRatesFieldPaths,
} from '$src/rentbasis/enums';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching, getRentBasisList} from '$src/rentbasis/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Attributes, Methods} from '$src/types';
import type {RentBasisList} from '$src/rentbasis/types';

type Props = {
  fetchRentBasisList: Function,
  initialize: Function,
  initializeRentBasis: Function,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // get vie withCommonAttributes HOC
  location: Object,
  receiveTopNavigationSettings: Function,
  rentBasisAttributes: Attributes, // get vie withCommonAttributes HOC
  rentBasisMethods: Methods, // get vie withCommonAttributes HOC
  rentBasisListData: RentBasisList,
  router: Object,
}

type State = {
  activePage: number,
  isSearchInitialized: boolean,
}

class RentBasisListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    isSearchInitialized: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      initialize,
      location: {query},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.RENT_BASIS),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    this.search();

    const page = query.page ? Number(query.page) : 1;
    this.setState({activePage: page});

    const setSearchFormReadyFlag = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      try {
        const searchQuery = {...query};
        delete searchQuery.page;

        await initialize(FormNames.SEARCH, searchQuery);

        setSearchFormReadyFlag();
      } catch(e) {
        console.error(`Failed to initialize search form with error, ${e}`);
      }
    };

    initializeSearchForm();
  }

  componentDidUpdate(prevProps) {
    const {location: {query, search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;

    if(currentSearch !== prevSearch) {
      this.search();

      const searchQuery = {...query};
      delete searchQuery.page;

      if(!Object.keys(searchQuery).length) {
        initialize(FormNames.SEARCH, {});
      }
    }
  }

  handleSearchChange = (query) => {
    const {router} = this.context;

    this.setState({activePage: 1});

    return router.push({
      pathname: getRouteById(Routes.RENT_BASIS),
      query,
    });
  }

  search = () => {
    const {fetchRentBasisList, location: {query}} = this.props;
    const page = query.page ? Number(query.page) : 1;
    const searchQuery = {...query};

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;

    fetchRentBasisList(getSearchQuery(searchQuery));
  }

  handleCreateButtonClick = () => {
    const {initializeRentBasis, location: {query}} = this.props;
    const {router} = this.context;

    initializeRentBasis({
      decisions: [{}],
      property_identifiers: [{}],
      rent_rates: [{}],
    });

    return router.push({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      query,
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {location: {query}} = this.props;

    return router.push({
      pathname: `${getRouteById(Routes.RENT_BASIS)}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {location: {query}} = this.props;

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

    return router.push({
      pathname: getRouteById(Routes.RENT_BASIS),
      query,
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
        text: 'Kohteen tunnus',
        disabled: true,
      });
    }

    if(isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)) {
      columns.push({
        key: 'build_permission_types',
        text: 'Pääkäyttötarkoitus',
        disabled: true,
        renderer: (val) => val ? getLabelOfOption(buildPermissionTypeOptions, val) : '-',
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

  render() {
    const {
      isFetching,
      isFetchingCommonAttributes,
      rentBasisListData,
      rentBasisMethods,
    } = this.props;
    const {activePage, isSearchInitialized} = this.state;
    const count = this.getRentBasisCount(rentBasisListData);
    const rentBasisList = this.getRentBasisList(rentBasisListData);
    const maxPage = this.getRentBasisMaxPage(rentBasisListData);
    const columns = this.getColumns();

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!rentBasisMethods.GET) return <PageContainer><AuthorizationError text={PermissionMissingTexts.RENT_BASIS} /></PageContainer>;

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <Authorization allow={rentBasisMethods.POST}>
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
            showCollapseArrowColumn
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
