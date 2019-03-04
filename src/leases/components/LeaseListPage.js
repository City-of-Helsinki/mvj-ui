// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AreaNotesLayer from '$src/areaNote/components/AreaNotesLayer';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import CreateLeaseModal from './createLease/CreateLeaseModal';
import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import IconRadioButtons from '$components/button/IconRadioButtons';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MapIcon from '$components/icons/MapIcon';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableIcon from '$components/icons/TableIcon';
import TableWrapper from '$components/table/TableWrapper';
import VisualisationTypeWrapper from '$components/table/VisualisationTypeWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {createLease, fetchLeases} from '$src/leases/actions';
import {fetchLessors} from '$src/lessor/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {leaseStateFilterOptions} from '$src/leases/constants';
import {TableSortOrder} from '$components/enums';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {
  FormNames,
  LeaseAreasFieldPaths,
  LeaseAreaAddressesFieldPaths,
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeaseTenantsFieldPaths,
} from '$src/leases/enums';
import {getContentLeases, mapLeaseSearchFilters} from '$src/leases/helpers';
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
import {getAreaNoteList, getMethods as getAreaNoteMethods} from '$src/areaNote/selectors';
import {getIsFetching, getLeasesList} from '$src/leases/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withUiDataList} from '$components/uiData/UiDataListHOC';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {LeaseList} from '$src/leases/types';
import type {AreaNoteList} from '$src/areaNote/types';

const visualizationTypeOptions = [
  {value: 'table', label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
  {value: 'map', label: 'Kartta', icon: <MapIcon className='icon-medium' />},
];

type Props = {
  areaNoteMethods: MethodsType,
  areaNotes: AreaNoteList,
  createLease: Function,
  fetchAreaNoteList: Function,
  fetchLeases: Function,
  fetchLessors: Function,
  history: Object,
  initialize: Function,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean,
  leaseAttributes: Attributes,
  leaseMethods: MethodsType,
  leases: LeaseList,
  lessors: Array<Object>,
  location: Object,
  receiveTopNavigationSettings: Function,
}

type State = {
  activePage: number,
  isModalOpen: boolean,
  leaseStates: Array<string>,
  isSearchInitialized: boolean,
  sortKey: string,
  sortOrder: string,
  visualizationType: string,
}

class LeaseListPage extends PureComponent<Props, State> {
  firstLeaseModalField: any

  state = {
    activePage: 1,
    isModalOpen: false,
    leaseStates: [],
    isSearchInitialized: false,
    sortKey: 'identifier',
    sortOrder: TableSortOrder.ASCENDING,
    visualizationType: 'table',
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {fetchAreaNoteList, fetchLessors, initialize, receiveTopNavigationSettings} = this.props;
    const {location: {search}} = this.props;
    const query = getUrlParams(search);
    const newState = {};

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASES),
      pageTitle: 'Vuokraukset',
      showSearch: false,
    });

    fetchAreaNoteList({});

    fetchLessors({limit: 10000});

    this.search();

    const page = query.page ? Number(query.page) : 1;
    newState.activePage = page;

    const states = isArray(query.lease_state)
      ? query.lease_state
      : query.lease_state ? [query.lease_state] : undefined;

    if(states) {
      newState.leaseStates = states;
    }

    if(query.sort_key || query.sort_order) {
      newState.sortKey = query.sort_key;
      newState.sortOrder = query.sort_order;
    }

    const setSearchFormReadyFlag = () => {
      this.setState({isSearchInitialized: true});
    };

    this.setState(newState);

    const initializeSearchForm = async() => {
      try {
        const searchQuery = {...query};

        delete searchQuery.page;
        delete searchQuery.lease_state;
        delete searchQuery.sort_key;
        delete searchQuery.sort_order;

        if(searchQuery.tenantcontact_type) {
          searchQuery.tenantcontact_type = isArray(searchQuery.tenantcontact_type)
            ? searchQuery.tenantcontact_type
            : [searchQuery.tenantcontact_type];
        }


        await initialize(FormNames.SEARCH, searchQuery);
        setSearchFormReadyFlag();
      } catch(e) {
        console.error(`Failed to initialize search form with error, ${e}`);
      }
    };

    initializeSearchForm();
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}, initialize} = this.props;
    const searchQuery = getUrlParams(currentSearch);
    const {location: {search: prevSearch}} = prevProps;
    const {activePage} = this.state;

    if(currentSearch !== prevSearch) {
      this.search();

      delete searchQuery.page;

      if(!Object.keys(searchQuery).length) {
        this.setState({
          leaseStates: [],
          sortKey: 'identifier',
          sortOrder: TableSortOrder.ASCENDING,
        });
        
        initialize(FormNames.SEARCH, {});
      }
    }

    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page !== activePage) {
      this.setState({activePage: page});
    }
  }

  showCreateLeaseModal = () => {
    this.setState({isModalOpen: true});
  }

  hideCreateLeaseModal = () => {
    this.setState({isModalOpen: false});
  }

  search = () => {
    const {fetchLeases, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    fetchLeases(mapLeaseSearchFilters(searchQuery));
  }

  handleSearchChange = (query) => {
    const {history} = this.props;

    this.setState({activePage: 1});

    return history.push({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(query),
    });
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.LEASES)}/${id}`,
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
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(query),
    });
  }

  getColumns = () => {
    const {leaseAttributes} = this.props;
    const stateOptions = getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE, false);
    const columns = [];

    if(isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.IDENTIFIER)) {
      columns.push({key: 'identifier', text: LeaseFieldTitles.IDENTIFIER});
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.IDENTIFIER)) {
      columns.push({
        key: 'lease_area_identifiers',
        text: 'Vuokrakohde',
        sortable: false,
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseAreaAddressesFieldPaths.ADDRESSES)) {
      columns.push({
        key: 'addresses',
        text: 'Osoite',
        sortable: false,
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)) {
      columns.push({
        key: 'tenants',
        text: 'Vuokralainen',
        sortable: false,
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.LESSOR)) {
      columns.push({key: 'lessor', text: 'Vuokranantaja'});
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.STATE)) {
      columns.push({key: 'state', text: 'Tyyppi', renderer: (val) => getLabelOfOption(stateOptions, val)});
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.START_DATE)) {
      columns.push({key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val)});
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.END_DATE)) {
      columns.push({key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val)});
    }

    return columns;
  }

  getLeasesCount = (leases: LeaseList) => {
    return get(leases, 'count', 0);
  }

  getLeasesMaxPage = (leases: LeaseList) => {
    const count = this.getLeasesCount(leases);
    if(!count) {
      return 0;
    }
    else {
      return Math.ceil(count/LIST_TABLE_PAGE_SIZE);
    }
  }

  handleLeaseStatesChange = (values: Array<string>) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.page;
    searchQuery.lease_state = values;

    this.setState({leaseStates: values});

    this.handleSearchChange(searchQuery);
  }

  handleVisualizationTypeChange = (value: string) => {
    this.setState({visualizationType: value});
  }

  getOverlayLayers = () => {
    const layers = [];
    const {
      areaNoteMethods,
      areaNotes,
    } = this.props;

    {isMethodAllowed(areaNoteMethods, Methods.GET) && !isEmpty(areaNotes) &&
      layers.push({
        checked: false,
        component: <AreaNotesLayer
          key='area_notes'
          allowToEdit={false}
          areaNotes={areaNotes}
        />,
        name: 'Muistettavat ehdot',
      });
    }

    return layers;
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
      activePage,
      isModalOpen,
      leaseStates,
      isSearchInitialized,
      sortKey,
      sortOrder,
      visualizationType,
    } = this.state;
    const {
      createLease,
      isFetchingCommonAttributes,
      leaseAttributes,
      leaseMethods,
      leases: content,
      location: {query},
      isFetching,
    } = this.props;
    const leases = getContentLeases(content, query);
    const count = this.getLeasesCount(content);
    const maxPage = this.getLeasesMaxPage(content);
    const columns = this.getColumns();
    const overlayLayers = this.getOverlayLayers();

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!leaseMethods) return null;

    if(!isMethodAllowed(leaseMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.LEASE} /></PageContainer>;

    return (
      <PageContainer>
        <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
          <CreateLeaseModal
            isOpen={isModalOpen}
            onClose={this.hideCreateLeaseModal}
            onSubmit={createLease}
          />
        </Authorization>
        <Row>
          <Column small={12} large={6}>
            <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo vuokratunnus'
                onClick={this.showCreateLeaseModal}
              />
            </Authorization>
          </Column>
          <Column small={12} large={6}>
            <Search
              attributes={leaseAttributes}
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              sortKey={sortKey}
              sortOrder={sortOrder}
              states={leaseStates}
            />
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6}>
            <VisualisationTypeWrapper>
              <IconRadioButtons
                legend={'Kartta/taulukko'}
                onChange={this.handleVisualizationTypeChange}
                options={visualizationTypeOptions}
                radioName='visualization-type-radio'
                value={visualizationType}
              />
            </VisualisationTypeWrapper>
          </Column>
          <Column small={12} medium={6}>
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={leaseStateFilterOptions}
              filterValue={leaseStates}
              onFilterChange={this.handleLeaseStatesChange}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }

          {visualizationType === 'table' &&
            <Fragment>
              <SortableTable
                columns={columns}
                data={leases}
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
            </Fragment>
          }
          {visualizationType === 'map' &&
            <AreaNotesEditMap
              allowToEdit={false}
              overlayLayers={overlayLayers}
            />
          }
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withCommonAttributes,
  withUiDataList,
  connect(
    (state) => {
      return {
        areaNoteMethods: getAreaNoteMethods(state),
        areaNotes: getAreaNoteList(state),
        isFetching: getIsFetching(state),
        leases: getLeasesList(state),
      };
    },
    {
      createLease,
      fetchAreaNoteList,
      fetchLeases,
      fetchLessors,
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseListPage);
