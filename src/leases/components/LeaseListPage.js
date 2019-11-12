// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import CreateLeaseModal from './createLease/CreateLeaseModal';
import IconRadioButtons from '$components/button/IconRadioButtons';
import LeaseListMap from '$src/leases/components/leaseSections/map/LeaseListMap';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MapIcon from '$components/icons/MapIcon';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableIcon from '$components/icons/TableIcon';
import TableFilterWrapper from '$components/table/TableFilterWrapper';
import TableWrapper from '$components/table/TableWrapper';
import VisualisationTypeWrapper from '$components/table/VisualisationTypeWrapper';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {createLease, fetchLeases, fetchLeasesByBBox} from '$src/leases/actions';
import {fetchLessors} from '$src/lessor/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {
  DEFAULT_LEASE_STATES,
  DEFAULT_ONLY_ACTIVE_LEASES,
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  MAX_ZOOM_LEVEL_TO_FETCH_LEASES,
  BOUNDING_BOX_FOR_SEARCH_QUERY,
  leaseStateFilterOptions,
} from '$src/leases/constants';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {
  LeaseAreasFieldPaths,
  LeaseAreaAddressesFieldPaths,
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeaseTenantsFieldPaths,
} from '$src/leases/enums';
import {getContentLeaseListResults, mapLeaseSearchFilters} from '$src/leases/helpers';
import {
  formatDate,
  getApiResponseCount,
  getApiResponseMaxPage,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getAreaNoteList, getMethods as getAreaNoteMethods} from '$src/areaNote/selectors';
import {
  getIsFetching,
  getIsFetchingByBBox,
  getLeasesList,
} from '$src/leases/selectors';
import {getLessorList} from '$src/lessor/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {withLeaseAttributes} from '$components/attributes/LeaseAttributes';
import {withUiDataList} from '$components/uiData/UiDataListHOC';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';
import type {LeaseList} from '$src/leases/types';
import type {LessorList} from '$src/lessor/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

const VisualizationTypes = {
  MAP: 'map',
  TABLE: 'table',
};

const visualizationTypeOptions = [
  {value: VisualizationTypes.TABLE, label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
  {value: VisualizationTypes.MAP, label: 'Kartta', icon: <MapIcon className='icon-medium' />},
];

type Props = {
  areaNotes: AreaNoteList,
  createLease: Function,
  fetchAreaNoteList: Function,
  fetchLeases: Function,
  fetchLeasesByBBox: Function,
  fetchLessors: Function,
  history: Object,
  initialize: Function,
  isFetching: boolean,
  isFetchingByBBox: boolean,
  isFetchingLeaseAttributes: boolean,
  leaseAttributes: Attributes,
  leaseMethods: MethodsType,
  leases: LeaseList,
  lessors: LessorList,
  location: Object,
  receiveTopNavigationSettings: Function,
  usersPermissions: UsersPermissionsType,
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
  _isMounted: boolean

  firstLeaseModalField: any

  state = {
    activePage: 1,
    isModalOpen: false,
    leaseStates: DEFAULT_LEASE_STATES,
    isSearchInitialized: false,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    visualizationType: VisualizationTypes.TABLE,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      fetchAreaNoteList,
      fetchLessors,
      lessors,
      location: {search},
      receiveTopNavigationSettings,
    } = this.props;
    const searchQuery = getUrlParams(search);

    setPageTitle('Vuokraukset');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASES),
      pageTitle: 'Vuokraukset',
      showSearch: false,
    });

    if(searchQuery.visualization === VisualizationTypes.MAP) {
      this.setState({visualizationType: VisualizationTypes.MAP});
      this.searchByBBox();
    } else {
      this.search();
    }

    fetchAreaNoteList({limit: 10000});

    if(isEmpty(lessors)) {
      fetchLessors({limit: 10000});
    }

    this.setSearchFormValues();

    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {visualizationType} = this.state;
    const {location: {search: prevSearch}} = prevProps;

    if(currentSearch !== prevSearch) {
      switch(visualizationType) {
        case VisualizationTypes.MAP:
          this.searchByBBox();
          break;
        case VisualizationTypes.TABLE:
          this.search();
          break;
      }

      this.setSearchFormValues();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);

    this._isMounted = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  }

  getLeaseStates = (query: Object) => {
    return isArray(query.lease_state)
      ? query.lease_state
      : query.lease_state
        ? [query.lease_state]
        : query.search || Object.prototype.hasOwnProperty.call(query, 'lease_state') ? [] : DEFAULT_LEASE_STATES;
  }

  getOnlyActiveLeasesValue = (query: Object) => {
    return query.only_active_leases != undefined
      ? query.only_active_leases
      : query.search ? undefined : DEFAULT_ONLY_ACTIVE_LEASES;
  }

  setSearchFormValues = () => {
    const {location: {search}, initialize} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    const states = this.getLeaseStates(searchQuery);

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      const initialValues = {...searchQuery};
      const onlyActiveLeases = this.getOnlyActiveLeasesValue(searchQuery);
      const tenantContactTypes = isArray(searchQuery.tenantcontact_type)
        ? searchQuery.tenantcontact_type
        : searchQuery.tenantcontact_type ? [searchQuery.tenantcontact_type] : [];

      if(onlyActiveLeases != undefined) {
        initialValues.only_active_leases = onlyActiveLeases;
      }

      if(tenantContactTypes.length) {
        initialValues.tenantcontact_type = tenantContactTypes;
      }

      delete initialValues.page;
      delete initialValues.lease_state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      delete initialValues.in_bbox;
      delete initialValues.visualization;
      delete initialValues.zoom;

      initialize(FormNames.LEASE_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      leaseStates: states,
      sortKey: searchQuery.sort_key ? searchQuery.sort_key : DEFAULT_SORT_KEY,
      sortOrder: searchQuery.sort_order ? searchQuery.sort_order : DEFAULT_SORT_ORDER,
    }, async() => {
      await initializeSearchForm();

      if(this._isMounted) {
        setSearchFormReady();
      }
    });
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
    const leaseStates = this.getLeaseStates(searchQuery);
    const onlyActiveLeases = this.getOnlyActiveLeasesValue(searchQuery);

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    if(onlyActiveLeases != undefined) {
      searchQuery.only_active_leases = onlyActiveLeases;
    }

    if(leaseStates.length) {
      searchQuery.lease_state = leaseStates;
    }

    searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
    searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;
    delete searchQuery.in_bbox;
    delete searchQuery.visualization;
    delete searchQuery.zoom;

    fetchLeases(mapLeaseSearchFilters(searchQuery));
  }

  searchByBBox = () => {
    const {fetchLeasesByBBox, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const leaseStates = this.getLeaseStates(searchQuery);
    const onlyActiveLeases = this.getOnlyActiveLeasesValue(searchQuery);

    if(searchQuery && searchQuery.search && searchQuery.search.length>6){
      searchQuery.in_bbox = BOUNDING_BOX_FOR_SEARCH_QUERY;
    } else if(!searchQuery.zoom || searchQuery.zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES) return;

    if(onlyActiveLeases != undefined) {
      searchQuery.only_active_leases = onlyActiveLeases;
    }

    if(leaseStates.length) {
      searchQuery.lease_state = leaseStates;
    }

    searchQuery.limit = 10000;
    delete searchQuery.page;
    delete searchQuery.visualization;
    delete searchQuery.zoom;
    delete searchQuery.sort_key;
    delete searchQuery.sort_order;

    fetchLeasesByBBox(mapLeaseSearchFilters(searchQuery));
  }

  handleSearchChange = (formValues: Object, resetActivePage?: boolean = false, resetFilters?: boolean = false) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);
    const searchQuery = {...formValues};

    if(query.lease_state && !formValues.lease_state) {
      searchQuery.lease_state = query.lease_state;
    }

    if(query.sort_key) {
      searchQuery.sort_key = query.sort_key;
    }

    if(query.sort_order) {
      searchQuery.sort_order = query.sort_order;
    }

    if(query.in_bbox) {
      searchQuery.in_bbox = query.in_bbox;
    }

    if(query.zoom) {
      searchQuery.zoom = query.zoom;
    }

    if(query.visualization) {
      searchQuery.visualization = query.visualization;
    }

    if(resetActivePage) {
      this.setState({activePage: 1});
      delete searchQuery.page;
    }

    if(resetFilters) {
      this.setState({leaseStates: DEFAULT_LEASE_STATES});
      delete searchQuery.lease_state;
    }

    return history.push({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
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

  handleLeaseStatesChange = (values: Array<string>) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.page;
    searchQuery.lease_state = values;

    this.setState({leaseStates: values});
    this.handleSearchChange(searchQuery, true);
  }

  handleVisualizationTypeChange = (value: string) => {
    this.setState({visualizationType: value}, () => {
      const {history, location: {search}} = this.props;
      const searchQuery = getUrlParams(search);

      if(value === VisualizationTypes.MAP) {
        searchQuery.visualization = VisualizationTypes.MAP;
      } else {
        delete searchQuery.visualization;
      }

      return history.push({
        pathname: getRouteById(Routes.LEASES),
        search: getSearchQuery(searchQuery),
      });
    });
  }

  handleSortingChange = ({sortKey, sortOrder}) => {
    const {history, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;

    this.setState({
      sortKey,
      sortOrder,
    });

    return history.push({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  }

  handleMapViewportChanged = debounce((mapOptions: Object) => {
    const {history, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.in_bbox = mapOptions.bBox.split(',');
    searchQuery.zoom = mapOptions.zoom;

    return history.push({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  }, 1000);

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
      isFetching,
      isFetchingByBBox,
      isFetchingLeaseAttributes,
      leaseAttributes,
      leaseMethods,
      leases: content,
      location: {query},
    } = this.props;
    const leases = getContentLeaseListResults(content, query);
    const count = getApiResponseCount(content);
    const maxPage = getApiResponseMaxPage(content, LIST_TABLE_PAGE_SIZE);
    const columns = this.getColumns();

    if(isFetchingLeaseAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

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
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo vuokraustunnus'
                onClick={this.showCreateLeaseModal}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search
              attributes={leaseAttributes}
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
            />
          </Column>
        </Row>

        <TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={leaseStateFilterOptions}
              filterValue={leaseStates}
              onFilterChange={this.handleLeaseStatesChange}
            />
          }
          visualizationComponent={
            <VisualisationTypeWrapper>
              <IconRadioButtons
                legend={'Kartta/taulukko'}
                onChange={this.handleVisualizationTypeChange}
                options={visualizationTypeOptions}
                radioName='visualization-type-radio'
                value={visualizationType}
              />
            </VisualisationTypeWrapper>
          }
        />

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
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
            <LeaseListMap
              allowToEdit={false}
              isLoading={isFetchingByBBox}
              onViewportChanged={this.handleMapViewportChanged}
            />
          }
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withLeaseAttributes,
  withUiDataList,
  connect(
    (state) => {
      return {
        areaNoteMethods: getAreaNoteMethods(state),
        areaNotes: getAreaNoteList(state),
        isFetching: getIsFetching(state),
        isFetchingByBBox: getIsFetchingByBBox(state),
        leases: getLeasesList(state),
        lessors: getLessorList(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      createLease,
      fetchAreaNoteList,
      fetchLeases,
      fetchLeasesByBBox,
      fetchLessors,
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseListPage);
