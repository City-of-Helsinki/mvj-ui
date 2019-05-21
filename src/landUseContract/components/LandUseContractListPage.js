// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import CreateLandUseContractModal from './createLandUseContract/CreateLandUseContractModal';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {createLandUseContract, fetchLandUseContractList} from '$src/landUseContract/actions';
import {FormNames} from '$src/enums';
import {getContentLandUseContractList} from '$src/landUseContract/helpers';
import {
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching, getLandUseContractList} from '$src/landUseContract/selectors';
import {withLandUseContractAttributes} from '$components/attributes/LandUseContractAttributes';

import type {Attributes} from '$src/types';
import type {LandUseContract, LandUseContractList} from '$src/landUseContract/types';

const PAGE_SIZE = 25;

type Props = {
  createLandUseContract: Function,
  fetchLandUseContractList: Function,
  history: Object,
  initialize: Function,
  isFetching: boolean,
  isFetchingLandUseContractAttributes: boolean,
  landUseContractAttributes: Attributes,
  landUseContractListData: LandUseContractList,
  location: Object,
  receiveTopNavigationSettings: Function,
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
  _isMounted: boolean

  state = {
    activePage: 1,
    count: 0,
    isModalOpen: false,
    isSearchInitialized: false,
    landUseContracts: [],
    maxPage: 0,
    selectedStates: [],
  }

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
    } = this.props;

    setPageTitle('Maankäyttösopimukset');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LAND_USE_CONTRACTS),
      pageTitle: 'Maankäyttösopimukset',
      showSearch: false,
    });

    this.search();

    this.setSearchFormValues();

    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.search();

      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if(!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }

    if(prevProps.landUseContractListData !== this.props.landUseContractListData) {
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

  setSearchFormValues = () => {
    const {location: {search}, initialize} = this.props;
    const searchQuery = getUrlParams(search);
    const states = isArray(searchQuery.state)
      ? searchQuery.state
      : searchQuery.state ? [searchQuery.lease_state] : [];
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      const initialValues = {...searchQuery};
      delete initialValues.page;
      delete initialValues.state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.LAND_USE_CONTRACT_SEARCH, initialValues);
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

  handleCreateButtonClick = () => {
    const {initialize} = this.props;

    this.setState({isModalOpen: true});

    initialize(FormNames.LAND_USE_CONTRACT_CREATE, {});
  }

  hideCreateLandUseContractModal = () => {
    this.setState({isModalOpen: false});
  }

  handleCreateLease = (landUseContract: LandUseContract) => {
    const {createLandUseContract} = this.props;
    createLandUseContract(landUseContract);
  }

  handleSearchChange = (query: Object) => {
    const {history} = this.props;

    this.setState({activePage: 1});
    delete query.page;

    return history.push({
      pathname: getRouteById(Routes.LAND_USE_CONTRACTS),
      search: getSearchQuery(query),
    });
  }

  search = () => {
    const {fetchLandUseContractList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }

    searchQuery.limit = PAGE_SIZE;

    fetchLandUseContractList(getSearchQuery(searchQuery));
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.LAND_USE_CONTRACTS)}/${id}`,
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

    return history.push({
      pathname: getRouteById(Routes.LAND_USE_CONTRACTS),
      search: getSearchQuery(query),
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
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.page;
    searchQuery.state = states;

    this.setState({selectedStates: states});

    this.handleSearchChange(searchQuery);
  }

  render() {
    const {isFetching, isFetchingLandUseContractAttributes, landUseContractAttributes} = this.props;
    const {activePage, isModalOpen, isSearchInitialized, landUseContracts, maxPage, selectedStates} = this.state;
    const stateOptions = getFieldOptions(landUseContractAttributes, 'state', false);
    const filteredLandUseContracts = selectedStates.length
      ? (landUseContracts.filter((contract) => selectedStates.indexOf(contract.state)  !== -1))
      : landUseContracts;
    const count = filteredLandUseContracts.length;

    if(isFetchingLandUseContractAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    return (
      <PageContainer>
        <CreateLandUseContractModal
          isOpen={isModalOpen}
          onClose={this.hideCreateLandUseContractModal}
          onSubmit={this.handleCreateLease}
        />

        <Row>
          <Column small={12} large={4}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo maankäyttösopimus'
              onClick={this.handleCreateButtonClick}
            />
          </Column>
          <Column small={12} large={8}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              states={selectedStates}
            />
          </Column>
        </Row>

        <TableFilters
          alignFiltersRight
          amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
          filterOptions={stateOptions}
          filterValue={selectedStates}
          onFilterChange={this.handleSelectedStatesChange}
        />

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
              },
              {key: 'plan_number', text: 'Asemakaavan numero'},
              {
                key: 'areas',
                text: 'Kohde',
              },
              {key: 'project_area', text: 'Hankealue'},
              {key: 'state', text: 'Neuvotteluvaihe', renderer: (val) => getLabelOfOption(stateOptions, val)},
            ]}
            data={filteredLandUseContracts}
            listTable
            onRowClick={this.handleRowClick}
            showCollapseArrowColumn
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
  // $FlowFixMe
  withRouter,
  withLandUseContractAttributes,
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        landUseContractListData: getLandUseContractList(state),
      };
    },
    {
      createLandUseContract,
      fetchLandUseContractList,
      initialize,
      receiveTopNavigationSettings,
    }
  ),
)(LandUseContractListPage);
