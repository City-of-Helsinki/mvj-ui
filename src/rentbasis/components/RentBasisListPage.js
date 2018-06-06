// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

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

type Props = {
  attributes: Attributes,
  fetchAttributes: Function,
  fetchRentBasisList: Function,
  initialize: Function,
  initializeRentBasis: Function,
  isFetching: boolean,
  receiveTopNavigationSettings: Function,
  rentBasisListData: RentBasisList,
  router: Object,
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
      fetchRentBasisList,
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentBasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    const page = Number(query.page);

    if(!page || !isNumber(page) || query.page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
      query.offset = (page - 1) * TABLE_PAGE_SIZE;
    }
    query.limit = TABLE_PAGE_SIZE;

    fetchRentBasisList(getSearchQuery(query));
    delete query.limit;

    if(isEmpty(attributes)) {
      fetchAttributes();
    }
  }

  componentDidMount = () => {
    const {initialize, router: {location: {query}}} = this.props;
    initialize(FormNames.SEARCH, query);
  }

  handleSearchChange = (query) => {
    const {fetchRentBasisList} = this.props;
    const {router} = this.context;

    query.limit = TABLE_PAGE_SIZE;
    fetchRentBasisList(getSearchQuery(query));

    this.setState({activePage: 1});
    delete query.limit;
    delete query.offset;
    delete query.page;

    return router.push({
      pathname: getRouteById('rentBasis'),
      query,
    });
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
    const {fetchRentBasisList, router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
      query.offset = (page - 1) * TABLE_PAGE_SIZE;
    } else {
      query.page = undefined;
      query.offset = undefined;
    }
    query.limit = TABLE_PAGE_SIZE;

    fetchRentBasisList(getSearchQuery(query));

    this.setState({activePage: page});
    delete query.limit;
    delete query.offset;

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
        intended_use: get(item, 'rent_rates[0].intended_use.id') || get(item, 'rent_rates[0].intended_use'),
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

    const intendedUseOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.intended_use');

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              label='Luo vuokrausperuste'
              onClick={() => this.handleCreateButtonClick()}
              title='Luo vuokrausperuste'
            />
          }
          searchComponent={
            <Search
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />
        <TableControllers
          title={`Löytyi ${count} kpl`}
        />

        {isFetching && <Row><Column><LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper></Column></Row>}
        {!isFetching &&
          <div>
            <Table
              data={rentBasisList}
              dataKeys={[
                {key: 'property_identifier', label: 'Kiinteistötunnus'},
                {key: 'intended_use', label: 'Pääkäyttötarkoitus', renderer: (val) => val ? getLabelOfOption(intendedUseOptions, val) : '-'},
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
