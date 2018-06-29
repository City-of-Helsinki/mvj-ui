// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
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
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchLandUseContractAttributes, fetchLandUseContractList} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getContentLandUseContractList} from '$src/landUseContract/helpers';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getIsFetching, getLandUseContractList} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContractList} from '$src/landUseContract/types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  fetchLandUseContractAttributes: Function,
  fetchLandUseContractList: Function,
  initialize: Function,
  isFetching: boolean,
  landUseContractListData: LandUseContractList,
  location: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
};

type State = {
  activePage: number,
  count: number,
  landUseContracts: Array<Object>,
  maxPage: number,
  selectedStates: Array<string>,
}

class LandUseContractListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    landUseContracts: [],
    maxPage: 0,
    selectedStates: [],
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      attributes,
      fetchLandUseContractAttributes,
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('landUseContract'),
      pageTitle: 'Maankäyttösopimukset',
      showSearch: false,
    });

    const page = query.page ? Number(query.page) : 1;
    if(page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
    }

    this.search();
    this.initializeSearchForm();

    if(isEmpty(attributes)) {
      fetchLandUseContractAttributes();
    }
  }

  componentDidUpdate = (prevProps) => {
    if(JSON.stringify(this.props.location.query) !== JSON.stringify(prevProps.location.query)) {
      this.search();
      this.initializeSearchForm();
    }
    if(prevProps.landUseContractListData !== this.props.landUseContractListData) {
      this.updateTableData();
    }
  }

  handleCreateButtonClick = () => {
    alert('TODO: Create land use contract');
  }

  handleSearchChange = (query: Object) => {
    const {router} = this.context;

    this.setState({activePage: 1});
    delete query.page;

    return router.push({
      pathname: getRouteById('landUseContract'),
      query,
    });
  }

  initializeSearchForm = () => {
    const {initialize, router: {location: {query}}} = this.props;

    const searchValues = {...query};
    delete searchValues.page;
    initialize(FormNames.LAND_USE_CONTRACT_SEARCH, searchValues);
  }

  search = () => {
    const {fetchLandUseContractList, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    delete searchQuery.page;
    fetchLandUseContractList(searchQuery);
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('landUseContract')}/${id}`,
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

    return router.push({
      pathname: getRouteById('landUseContract'),
      query,
    });
  }

  updateTableData = () => {
    const {landUseContractListData} = this.props;

    this.setState({
      count: this.getLandUseContractListCount(landUseContractListData),
      landUseContracts: getContentLandUseContractList(landUseContractListData),
      maxPage: this.getLandUseContractListMaxPage(landUseContractListData),
    });
  }

  getLandUseContractListCount = (landUseContractListData: LandUseContractList) => {
    return get(landUseContractListData, 'count', 0);
  }

  getLandUseContractListMaxPage = (landUseContractListData: LandUseContractList) => {
    const count = this.getLandUseContractListCount(landUseContractListData);
    if(!count) {
      return 0;
    }
    return Math.ceil(count/PAGE_SIZE);
  }

  handleSelectedStatesChange = (states: Array<string>) => {
    this.setState({
      selectedStates: states,
    });
  }

  render() {
    const {attributes, isFetching} = this.props;
    const {activePage, landUseContracts, maxPage, selectedStates} = this.state;
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);
    const filteredLandUseContracts = selectedStates.length
      ? (landUseContracts.filter((contract) => selectedStates.indexOf(contract.state.toString())  !== -1))
      : landUseContracts;

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              label='Luo maankäyttösopimus'
              onClick={this.handleCreateButtonClick}
              title='Luo maankäyttösopimus'
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
              buttonSelectorOptions={stateOptions}
              buttonSelectorValue={selectedStates}
              onButtonSelectorChange={this.handleSelectedStatesChange}
              title={`Viimeksi muokattuja`}
            />
            <Table
              data={filteredLandUseContracts}
              dataKeys={[
                {key: 'identifier', label: 'MA1-tunnus'},
                {key: 'litigant', label: 'Osapuoli'},
                {key: 'plan_number', label: 'Asemakaavan numero'},
                {key: 'area', label: 'Kohde'},
                {key: 'project_area', label: 'Hankealue'},
                {key: 'state', label: 'Neuvotteluvaihe', renderer: (val) => getLabelOfOption(stateOptions, val)},
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
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        landUseContractListData: getLandUseContractList(state),
      };
    },
    {
      fetchLandUseContractAttributes,
      fetchLandUseContractList,
      initialize,
      receiveTopNavigationSettings,
    }
  ),
)(LandUseContractListPage);
