// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MultiItemCollapse from '$components/table/MultiItemCollapse';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';

import {fetchAttributes, fetchRentBasisList, initializeRentBasis} from '$src/rentbasis/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {TABLE_PAGE_SIZE} from '$src/rentbasis/constants';
import {FormNames} from '$src/rentbasis/enums';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getIsFetching, getRentBasisList} from '$src/rentbasis/selectors';

import type {Attributes, RentBasisList} from '../types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  fetchAttributes: Function,
  fetchRentBasisList: Function,
  initialize: Function,
  initializeRentBasis: Function,
  isFetching: boolean,
  location: Object,
  receiveTopNavigationSettings: Function,
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
      attributes,
      fetchAttributes,
      initialize,
      location: {query},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentBasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    if(isEmpty(attributes)) {
      fetchAttributes();
    }

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
      pathname: getRouteById('rentBasis'),
      query,
    });
  }

  search = () => {
    const {fetchRentBasisList, location: {query}} = this.props;
    const page = query.page ? Number(query.page) : 1;
    const searchQuery = {...query};

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }

    searchQuery.limit = PAGE_SIZE;

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
      pathname: getRouteById('newRentBasis'),
      query,
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {location: {query}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentBasis')}/${id}`,
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
      pathname: getRouteById('rentBasis'),
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
    return Math.ceil(count/TABLE_PAGE_SIZE);
  }

  render() {
    const {attributes, isFetching, rentBasisListData} = this.props;
    const {activePage, isSearchInitialized} = this.state;
    const count = this.getRentBasisCount(rentBasisListData);
    const rentBasisList = this.getRentBasisList(rentBasisListData);
    const maxPage = this.getRentBasisMaxPage(rentBasisListData);

    const buildPermissionTypeOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.build_permission_type');

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo vuokrausperuste'
              onClick={this.handleCreateButtonClick}
            />
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
            columns={[
              {
                key: 'property_identifiers',
                text: 'Kiinteistötunnus',
                disabled: true,
                renderer: (val) => <MultiItemCollapse
                  items={val}
                  itemRenderer={(item) => item}
                />,
              },
              {
                key: 'build_permission_types',
                text: 'Pääkäyttötarkoitus',
                disabled: true,
                renderer: (val) => <MultiItemCollapse
                  items={val}
                  itemRenderer={(item) => item ? getLabelOfOption(buildPermissionTypeOptions, item) : '-'}
                />,
              },
              {key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val) || '-'},
              {key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val) || '-'},
            ]}
            data={rentBasisList}
            onRowClick={this.handleRowClick}
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
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        rentBasisListData: getRentBasisList(state),
      };
    },
    {
      fetchAttributes,
      fetchRentBasisList,
      initialize,
      initializeRentBasis,
      receiveTopNavigationSettings,
    },
  ),
)(RentBasisListPage);
