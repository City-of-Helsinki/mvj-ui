// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import {fetchAttributes, fetchRentBasisList, initializeRentBasis} from '../actions';
import {getAttributes, getIsFetching, getRentBasisList} from '../selectors';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {formatDateObj, getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import Button from '$components/button/Button';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';

import type {Attributes, RentBasisList} from '../types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  fetchAttributes: Function,
  fetchRentBasisList: Function,
  initializeRentBasis: Function,
  isFetching: boolean,
  receiveTopNavigationSettings: Function,
  rentBasisListData: RentBasisList,
  router: Object,
}

type State = {
  activePage: number,
}

class RentBasisListPage extends Component {
  props: Props

  state: State = {
    activePage: 1,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  search: any

  componentWillMount() {
    const {fetchAttributes, fetchRentBasisList, receiveTopNavigationSettings} = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    const page = Number(query.page);

    if(!page || !isNumber(page) || query.page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
      query.offset = (page - 1) * PAGE_SIZE;
    }
    query.limit = PAGE_SIZE;

    fetchRentBasisList(getSearchQuery(query));
    delete query.limit;

    fetchAttributes();
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  handleSearchChange = (query) => {
    const {fetchRentBasisList} = this.props;
    const {router} = this.context;

    query.limit = PAGE_SIZE;
    fetchRentBasisList(getSearchQuery(query));

    this.setState({activePage: 1});
    delete query.limit;
    delete query.offset;
    delete query.page;

    return router.push({
      pathname: getRouteById('rentbasis'),
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
      pathname: getRouteById('newrentbasis'),
      query,
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentbasis')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {fetchRentBasisList, router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
      query.offset = (page - 1) * PAGE_SIZE;
    } else {
      query.page = undefined;
      query.offset = undefined;
    }
    query.limit = PAGE_SIZE;

    fetchRentBasisList(getSearchQuery(query));

    this.setState({activePage: page});
    delete query.limit;
    delete query.offset;

    return router.push({
      pathname: getRouteById('rentbasis'),
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
      return Math.ceil(count/PAGE_SIZE);
    }
  }

  render() {
    const {attributes, isFetching, rentBasisListData} = this.props;
    const {activePage} = this.state;

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
              ref={(input) => { this.search = input; }}
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />

        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <div>
            <TableControllers
              title={`Viimeksi muokattuja`}
            />
            <Table
              data={rentBasisList}
              dataKeys={[
                {key: 'property_identifier', label: 'Kiinteistötunnus'},
                {key: 'intended_use', label: 'Pääkäyttötarkoitus', renderer: (val) => val ? getLabelOfOption(intendedUseOptions, val) : '-'},
                {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
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
      initializeRentBasis,
      receiveTopNavigationSettings,
    },
  ),
)(RentBasisListPage);
