// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {formValueSelector, initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Button from '$components/button/Button';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';

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
  search: ?string,
}

type State = {
  activePage: number,
}

class RentBasisListPage extends Component<Props, State> {
  state = {
    activePage: 1,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      attributes,
      fetchAttributes,
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentBasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    const page = query.page ? Number(query.page) : 1;
    this.setState({activePage: page});
    this.search();

    if(isEmpty(attributes)) {
      fetchAttributes();
    }
  }

  componentDidMount = () => {
    const {initialize, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    delete searchQuery.page;
    initialize(FormNames.SEARCH, searchQuery);
  }

  componentDidUpdate(prevProps) {
    const {location: {query, search: currentSearch}, search, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const {activePage} = this.state;

    if(currentSearch !== prevSearch) {
      this.search();
      if(query.search !== search) {
        const searchQuery = {...query};
        delete searchQuery.page;
        initialize(FormNames.SEARCH, searchQuery);
      }
      const page = query.page ? Number(query.page) : 1;
      if(page !== activePage) {
        this.setState({activePage: page});
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
    const {fetchRentBasisList, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }
    searchQuery.limit = PAGE_SIZE;
    fetchRentBasisList(getSearchQuery(searchQuery));
  }

  handleCreateButtonClick = () => {
    const {initializeRentBasis} = this.props;
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

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
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentBasis')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

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
        property_identifier: get(item, 'property_identifiers[0].identifier'),
        build_permission_type: get(item, 'rent_rates[0].build_permission_type.id') || get(item, 'rent_rates[0].build_permission_type'),
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
    else {
      return Math.ceil(count/TABLE_PAGE_SIZE);
    }
  }

  render() {
    const {attributes, isFetching, rentBasisListData} = this.props;
    const {activePage} = this.state;
    const count = this.getRentBasisCount(rentBasisListData);
    const rentBasisList = this.getRentBasisList(rentBasisListData);
    const maxPage = this.getRentBasisMaxPage(rentBasisListData);

    const buildPermissionTypeOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.build_permission_type');

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              label='Luo vuokrausperuste'
              onClick={() => this.handleCreateButtonClick()}
            />
          }
          searchComponent={
            <Search
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />
        <TableControllers
          title={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
        />

        {isFetching && <Row><Column><LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper></Column></Row>}
        {!isFetching &&
          <div>
            <Table
              data={rentBasisList}
              dataKeys={[
                {key: 'property_identifier', label: 'Kiinteistötunnus'},
                {key: 'build_permission_type', label: 'Pääkäyttötarkoitus', renderer: (val) => val ? getLabelOfOption(buildPermissionTypeOptions, val) : '-'},
                {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDate(val) || '-'},
                {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDate(val) || '-'},
              ]}
              onRowClick={this.handleRowClick}
            />
            <Pagination
              activePage={activePage}
              maxPage={maxPage}
              onPageClick={(page) => this.handlePageClick(page)}
            />
          </div>
        }
      </PageContainer>
    );
  }
}

const formName = FormNames.SEARCH;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        rentBasisListData: getRentBasisList(state),
        search: selector(state, 'search'),
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
