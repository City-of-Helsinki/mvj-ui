// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import CreateLandUseContractModal from './createLandUseContract/CreateLandUseContractModal';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MultiItemCollapse from '$components/table/MultiItemCollapse';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {createLandUseContract, fetchLandUseContractAttributes, fetchLandUseContractList} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getContentLandUseContractList} from '$src/landUseContract/helpers';
import {getFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getIsFetching, getLandUseContractList} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/types';
import type {LandUseContract, LandUseContractList} from '$src/landUseContract/types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  createLandUseContract: Function,
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
  isModalOpen: boolean,
  isSearchInitialized: boolean,
  landUseContracts: Array<Object>,
  maxPage: number,
  selectedStates: Array<string>,
}

class LandUseContractListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    isModalOpen: false,
    isSearchInitialized: false,
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
      initialize,
      location: {query},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('landUseContract'),
      pageTitle: 'Maankäyttösopimukset',
      showSearch: false,
    });

    if(isEmpty(attributes)) {
      fetchLandUseContractAttributes();
    }

    this.search();

    const page = query.page ? Number(query.page) : 1;
    this.setState({activePage: page});

    const states = isArray(query.state)
      ? query.state
      : query.state ? [query.state] : null;
    if(states) {
      this.setState({selectedStates: states});
    }

    const setSearchFormReadyFlag = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      try {
        const searchQuery = {...query};
        delete searchQuery.page;
        delete searchQuery.state;

        await initialize(FormNames.LAND_USE_CONTRACT_SEARCH, searchQuery);

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
        this.setState({selectedStates: []});
        initialize(FormNames.LAND_USE_CONTRACT_SEARCH, {});
      }
    }

    if(prevProps.landUseContractListData !== this.props.landUseContractListData) {
      this.updateTableData();
    }
  }

  handleCreateButtonClick = () => {
    const {initialize} = this.props;

    this.setState({isModalOpen: true});

    initialize(FormNames.CREATE_LAND_USE_CONTRACT, {});
  }

  hideCreateLandUseContractModal = () => {
    this.setState({isModalOpen: false});
  }

  handleCreateLease = (landUseContract: LandUseContract) => {
    const {createLandUseContract} = this.props;
    createLandUseContract(landUseContract);
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

  search = () => {
    const {fetchLandUseContractList, location: {query}} = this.props;
    const page = query.page ? Number(query.page) : 1;
    const searchQuery = {...query};

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }

    searchQuery.limit = PAGE_SIZE;

    fetchLandUseContractList(getSearchQuery(searchQuery));
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {location: {query}} = this.props;

    return router.push({
      pathname: `${getRouteById('landUseContract')}/${id}`,
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
    const {location: {query}} = this.props;
    const searchQuery = {...query};

    delete searchQuery.page;
    searchQuery.state = states;

    this.setState({selectedStates: states});

    this.handleSearchChange(searchQuery);
  }

  render() {
    const {attributes, isFetching} = this.props;
    const {activePage, isModalOpen, isSearchInitialized, landUseContracts, maxPage, selectedStates} = this.state;
    const stateOptions = getFieldOptions(attributes, 'state', false);
    const filteredLandUseContracts = selectedStates.length
      ? (landUseContracts.filter((contract) => selectedStates.indexOf(contract.state)  !== -1))
      : landUseContracts;
    const count = filteredLandUseContracts.length;

    return (
      <PageContainer>
        <CreateLandUseContractModal
          isOpen={isModalOpen}
          onClose={this.hideCreateLandUseContractModal}
          onSubmit={this.handleCreateLease}
        />

        <Row>
          <Column small={12} large={6}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo maankäyttösopimus'
              onClick={this.handleCreateButtonClick}
            />
          </Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              states={selectedStates}
            />
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6}></Column>
          <Column small={12} medium={6}>
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={stateOptions}
              filterValue={selectedStates}
              onFilterChange={this.handleSelectedStatesChange}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
          <SortableTable
            columns={[
              {key: 'identifier', text: 'MA-tunnus'},
              {
                key: 'litigants',
                text: 'Osapuoli',
                disabled: true,
                renderer: (val) => <MultiItemCollapse
                  items={val}
                  itemRenderer={(item) => item}
                />,
              },
              {key: 'plan_number', text: 'Asemakaavan numero'},
              {
                key: 'areas',
                text: 'Kohde',
                disabled: true,
                renderer: (val) => <MultiItemCollapse
                  items={val}
                  itemRenderer={(item) => item}
                />,
              },
              {key: 'project_area', text: 'Hankealue'},
              {key: 'state', text: 'Neuvotteluvaihe', renderer: (val) => getLabelOfOption(stateOptions, val)},
            ]}
            data={filteredLandUseContracts}
            listTable
            onRowClick={this.handleRowClick}
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
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        landUseContractListData: getLandUseContractList(state),
      };
    },
    {
      createLandUseContract,
      fetchLandUseContractAttributes,
      fetchLandUseContractList,
      initialize,
      receiveTopNavigationSettings,
    }
  ),
)(LandUseContractListPage);
