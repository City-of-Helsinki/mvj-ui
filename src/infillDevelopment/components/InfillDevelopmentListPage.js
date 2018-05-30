// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
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
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchInfillDevelopments} from '$src/infillDevelopment/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {cloneObject, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getInfillDevelopments, getIsFetching} from '$src/infillDevelopment/selectors';

import type {InfillDevelopmentList} from '$src/infillDevelopment/types';

const PAGE_SIZE = 25;

type Props = {
  fetchInfillDevelopments: Function,
  infillDevelopmentList: InfillDevelopmentList,
  initialize: Function,
  isFetching: boolean,
  location: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  activePage: number,
  count: number,
  infillDevelopments: Array<Object>,
  maxPage: number,
}

class InfillDevelopmentListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    infillDevelopments: [],
    maxPage: 1,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {receiveTopNavigationSettings} = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('infillDevelopment'),
      pageTitle: 'Täydennysrakentaminen',
      showSearch: false,
    });

    const page = Number(query.page);
    if(!page || !isNumber(page) || query.page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
    }

    this.handleSearch();
  }

  componentDidMount = () => {
    this.initializeSearchForm();
  }

  componentDidUpdate = (prevProps) => {
    if(JSON.stringify(this.props.location.query) !== JSON.stringify(prevProps.location.query)) {
      this.handleSearch();
      this.initializeSearchForm();
    }
    if(prevProps.infillDevelopmentList !== this.props.infillDevelopmentList) {
      this.updateTableData();
    }
  }

  initializeSearchForm = () => {
    const {initialize, router: {location: {query}}} = this.props;
    initialize(FormNames.SEARCH, query);
  }

  handleCreateButtonClick = () => {
    alert('TODO: Luo täydennysrakentaminen');
  }

  handleSearchChange = (query: Object) => {
    const {router} = this.context;

    this.setState({activePage: 1});
    delete query.page;

    return router.push({
      pathname: getRouteById('infillDevelopment'),
      query,
    });
  }

  handleSearch = () => {
    const {fetchInfillDevelopments} = this.props;
    const {router: {location: {query: locationQuery}}} = this.context;
    const query = cloneObject(locationQuery);

    const page = Number(query.page);
    if(page && isNumber(page) && query.page <= 1) {
      query.offset = (page - 1) * PAGE_SIZE;
    }

    query.limit = PAGE_SIZE;
    fetchInfillDevelopments(getSearchQuery(query));
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('infillDevelopment')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
    } else {
      query.page = undefined;
    }

    this.setState({activePage: page});

    return router.push({
      pathname: getRouteById('infillDevelopments'),
      query,
    });
  }

  updateTableData = () => {
    const {infillDevelopmentList} = this.props;
    this.setState({
      count: this.getInfillDevelopmentCount(infillDevelopmentList),
      infillDevelopments: this.getInfillDevelopments(infillDevelopmentList),
      maxPage: this.getInfillDevelopmentMaxPage(infillDevelopmentList),
    });
  }

  getInfillDevelopmentCount = (infillDevelopmentList: InfillDevelopmentList) => {
    return get(infillDevelopmentList, 'count', 0);
  }

  getInfillDevelopments = (infillDevelopmentList: InfillDevelopmentList) => {
    return get(infillDevelopmentList, 'results', []);
  }

  getInfillDevelopmentMaxPage = (infillDevelopmentList: InfillDevelopmentList) => {
    const count = this.getInfillDevelopmentCount(infillDevelopmentList);
    if(!count) {
      return 0;
    }
    return Math.ceil(count/PAGE_SIZE);
  }

  render() {
    const {isFetching} = this.props;
    const {activePage, infillDevelopments, maxPage} = this.state;

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              label='Luo täydennysrakentaminen'
              onClick={this.handleCreateButtonClick}
              title='Luo täydennysrakentaminen'
            />
          }
          searchComponent={
            <Search
              onSearch={this.handleSearchChange}
            />
          }
        />

        {isFetching &&
          <Row>
            <Column>
              <LoaderWrapper><Loader isLoading={!!isFetching} /></LoaderWrapper>
            </Column>
          </Row>
        }

        {!isFetching &&
          <div>
            <TableControllers
              title={`Viimeksi muokattuja`}
            />
            <Table
              data={infillDevelopments}
              dataKeys={[
                {key: 'station_code_number', label: 'Asemakaavan nro'},
                {key: 'state', label: 'Asemakaavan käsittelyvaihe'},
                {key: 'tenant', label: 'Vuokralainen'},
                {key: 'lease_identifier', label: 'Vuokratunnus'},
                {key: 'plot_identifiers', label: 'Kiinteistötunnus'},
                {key: 'nagotiation_state', label: 'Neuvotteluvaihe'},
              ]}
              onRowClick={this.handleRowClick}
            />
            <Pagination
              activePage={activePage}
              maxPage={maxPage}
              onPageClick={this.handlePageClick}
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
        infillDevelopmentList: getInfillDevelopments(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchInfillDevelopments,
      initialize,
      receiveTopNavigationSettings,
    }
  )
)(InfillDevelopmentListPage);
