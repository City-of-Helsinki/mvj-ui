// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import isArray from 'lodash/isArray';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {initialize} from 'redux-form';
import {withRouter} from 'react-router';
import debounce from 'lodash/debounce';

import AuthorizationError from '$components/authorization/AuthorizationError';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import Search from '$src/areaSearch/components/search/Search';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableFilterWrapper from '$components/table/TableFilterWrapper';
import TableWrapper from '$components/table/TableWrapper';
import IconRadioButtons from '$components/button/IconRadioButtons';
import TableIcon from '$components/icons/TableIcon';
import MapIcon from '$components/icons/MapIcon';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {getRouteById, Routes} from '$src/root/routes';
import {
  formatDate,
  getLabelOfOption,
  setPageTitle,
  getFieldOptions,
  getSearchQuery,
  getApiResponseCount,
  getApiResponseMaxPage,
  getUrlParams,
  isMethodAllowed,
} from '$util/helpers';
import {withAreaSearchAttributes} from '$components/attributes/AreaSearchAttributes';
import {
  getAreaSearchList,
  getAreaSearchListByBBox,
  getIsEditingAreaSearch,
  getIsFetchingAreaSearchList,
  getIsFetchingAreaSearchListByBBox, getLastAreaSearchEditError,
} from '$src/areaSearch/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import {
  DEFAULT_AREA_SEARCH_STATES,
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
} from '$src/areaSearch/constants';
import {editAreaSearch, fetchAreaSearchList, fetchAreaSearchListByBBox} from '$src/areaSearch/actions';
import {getUserFullName} from '$src/users/helpers';
import type {ApiResponse} from '$src/types';
import {areaSearchSearchFilters} from '$src/areaSearch/helpers';
import {BOUNDING_BOX_FOR_SEARCH_QUERY, MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES} from '$src/areaSearch/constants';
import AreaSearchMap from '$src/areaSearch/components/map/AreaSearchMap';
import VisualisationTypeWrapper from '$components/table/VisualisationTypeWrapper';
import {ButtonColors} from '$components/enums';
import Button from '$components/button/Button';
import EditAreaSearchPreparerModal from '$src/areaSearch/components/EditAreaSearchPreparerModal';

const VisualizationTypes = {
  MAP: 'map',
  TABLE: 'table',
};

const visualizationTypeOptions = [
  {value: VisualizationTypes.TABLE, label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
  {value: VisualizationTypes.MAP, label: 'Kartta', icon: <MapIcon className='icon-medium' />},
];

type OwnProps = {|

|};

type Props = {
  ...OwnProps,
  history: Object,
  location: Object,
  usersPermissions: UsersPermissionsType,
  receiveTopNavigationSettings: Function,
  areaSearchListAttributes: Attributes,
  areaSearchListMethods: MethodsType,
  isFetchingAreaSearchListAttributes: boolean,
  isFetching: boolean,
  initialize: Function,
  isFetchingByBBox: boolean,
  fetchAreaSearchList: Function,
  fetchAreaSearchListByBBox: Function,
  areaSearches: ApiResponse,
  areaSearchesByBBox: ApiResponse,
  editAreaSearch: Function,
  isEditingAreaSearch: boolean,
  lastEditError: any,
}

type State = {
  properties: Array<Object>,
  activePage: number,
  isSearchInitialized: boolean,
  count: number,
  sortKey: string,
  sortOrder: string,
  maxPage: number,
  selectedStates: Array<string>,
  visualizationType: string,
  isEditModalOpen: boolean,
  editModalTargetAreaSearch: ?number,
}

class AreaSearchApplicationListPage extends PureComponent<Props, State> {
  _isMounted: boolean

  state: State = {
    properties: [],
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    activePage: 1,
    count: 0,
    isSearchInitialized: false,
    maxPage: 0,
    selectedStates: DEFAULT_AREA_SEARCH_STATES,
    visualizationType: VisualizationTypes.TABLE,
    isEditModalOpen: false,
    editModalTargetAreaSearch: null,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
      location: {search},
    } = this.props;
    const searchQuery = getUrlParams(search);

    setPageTitle('Aluehaun hakemukset');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_SEARCH),
      pageTitle: 'Aluehaun hakemukset',
      showSearch: false,
    });

    if(searchQuery.visualization === VisualizationTypes.MAP) {
      this.setState({visualizationType: VisualizationTypes.MAP});
      this.searchByBBox();
    } else {
      this.search();
    }

    this.setSearchFormValues();

    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  handleVisualizationTypeChange = (value: string) => {
    this.setState({visualizationType: value}, () => {
      const {history, location: {search}} = this.props;
      const searchQuery = getUrlParams(search);

      if (value === VisualizationTypes.MAP) {
        searchQuery.visualization = VisualizationTypes.MAP;
      } else {
        delete searchQuery.visualization;
        delete searchQuery.in_bbox;
        delete searchQuery.zoom;
      }

      return history.push({
        pathname: getRouteById(Routes.AREA_SEARCH),
        search: getSearchQuery(searchQuery),
      });
    });
  }

  handleAreaSearchStatesChange = (values: Array<string>) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.page;
    searchQuery.state = values;

    this.setState({selectedStates: values});
    this.handleSearchChange(searchQuery, true);
  }

  getColumns = () => {
    const {areaSearchListAttributes} = this.props;
    const columns = [];
    const intendedUseOptions = getFieldOptions(areaSearchListAttributes, 'intended_use');
    const stateOptions = getFieldOptions(areaSearchListAttributes, 'state');

    columns.push({
      key: 'identifier',
      text: 'Hakemus',
    });

    columns.push({
      key: 'applicants',
      text: 'Hakija',
      sortable: false,
    });

    columns.push({
      key: 'received_date',
      text: 'Saapunut',
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'intended_use',
      text: 'Käyttötarkoitus',
      renderer: (val) => getLabelOfOption(intendedUseOptions, val),
    });

    columns.push({
      key: 'address',
      text: 'Osoite',
    });

    columns.push({
      key: 'district',
      text: 'Kaupunginosa',
    });

    columns.push({
      key: 'start_date',
      text: 'Alkupvm',
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'end_date',
      text: 'Loppupvm',
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'state',
      text: 'Tila',
      renderer: (val) => getLabelOfOption(stateOptions, val),
    });

    columns.push({
      key: 'lessor',
      text: 'Vuokranantaja',
      renderer: (val, row) => <span onMouseUp={(e) => e.stopPropagation()}>
        <Button
          className={ButtonColors.LINK}
          onClick={() => this.openAreaSearchEditModal(row.id)}
          text={val} />
      </span>,
    });

    columns.push({
      key: 'preparer',
      text: 'Käsittelijä',
      renderer: (val, row) => <span onMouseUp={(e) => e.stopPropagation()}>
        <Button
          className={ButtonColors.LINK}
          onClick={() => this.openAreaSearchEditModal(row.id)}
          text={getUserFullName(val) || 'Avoin'} />
      </span>,
    });

    return columns;
  }

  openAreaSearchEditModal = (id: number) => {
    this.setState(() => ({
      isEditModalOpen: true,
      editModalTargetAreaSearch: id,
    }));
  };

  closeAreaSearchEditModal = () => {
    this.setState(() => ({
      isEditModalOpen: false,
      editModalTargetAreaSearch: null,
    }));
  };

  submitAreaSearchEditModal = (data: Object) => {
    const {editAreaSearch} = this.props;

    editAreaSearch({
      id: data.id,
      preparer: data.preparer?.id,
      lessor: data.lessor,
      area_search_status: {
        status_notes: data.status_notes ? [
          {note: data.status_notes},
        ] : undefined,
      },
    });
  };

  search = () => {
    const {fetchAreaSearchList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;
    delete searchQuery.in_bbox;
    delete searchQuery.visualization;
    delete searchQuery.zoom;

    fetchAreaSearchList(areaSearchSearchFilters(searchQuery));
  }

  searchByBBox = () => {
    const {fetchAreaSearchListByBBox, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const leaseStates = this.getSearchStates(searchQuery);

    if (searchQuery && searchQuery.search && searchQuery.search.length > 6) {
      searchQuery.in_bbox = BOUNDING_BOX_FOR_SEARCH_QUERY;
    } else if (!searchQuery.zoom || searchQuery.zoom < MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES) {
      return;
    }

    if (leaseStates.length) {
      searchQuery.lease_state = leaseStates;
    }

    searchQuery.limit = 10000;
    delete searchQuery.page;
    delete searchQuery.visualization;
    delete searchQuery.zoom;
    delete searchQuery.sort_key;
    delete searchQuery.sort_order;

    fetchAreaSearchListByBBox(areaSearchSearchFilters(searchQuery));
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}/${id}`,
      search: search,
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
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(searchQuery),
    });
  }

  handlePageClick = (page: number) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(query),
    });
  }

  updateTableData = () => {
    const {areaSearches} = this.props;

    this.setState({
      count: getApiResponseCount(areaSearches),
      maxPage: getApiResponseMaxPage(areaSearches, LIST_TABLE_PAGE_SIZE),
    });
  }

  handleSearchChange = (query: Object, resetActivePage?: boolean = true) => {
    const {history, location: {search}} = this.props;
    const urlQuery = getUrlParams(search);

    if (resetActivePage) {
      this.setState({activePage: 1});
      delete query.page;
    }

    if (urlQuery.visualization) {
      query.visualization = urlQuery.visualization;
    }
    if (urlQuery.in_bbox) {
      query.in_bbox = urlQuery.in_bbox;
    }
    if (urlQuery.zoom) {
      query.zoom = urlQuery.zoom;
    }

    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(query),
    });
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}, isEditingAreaSearch, lastEditError} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const {visualizationType} = this.state;
    const searchQuery = getUrlParams(currentSearch);

    if ((currentSearch !== prevSearch) ||
      (!isEditingAreaSearch && !lastEditError && prevProps.isEditingAreaSearch)) {
      this.closeAreaSearchEditModal();

      switch (visualizationType) {
        case VisualizationTypes.MAP:
          this.searchByBBox();
          break;
        case VisualizationTypes.TABLE:
          this.search();
          break;
      }

      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if (!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }

    if (prevProps.areaSearches !== this.props.areaSearches) {
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

  handleMapViewportChanged = debounce((mapOptions: Object) => {
    const {history, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.in_bbox = mapOptions.bBox.split(',');
    searchQuery.zoom = mapOptions.zoom;

    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(searchQuery),
    });
  }, 1000);

  getSearchStates = (query: Object) => {
    if (isArray(query.state)) {
      return query.state;
    }

    if (query.state) {
      return [query.state];
    }

    return (query.search || query?.state) ? [] : DEFAULT_AREA_SEARCH_STATES;
  }

  setSearchFormValues = () => {
    const {location: {search}, initialize} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    const states = this.getSearchStates(searchQuery);

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      const initialValues = {...searchQuery};
      delete initialValues.page;
      delete initialValues.state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      delete initialValues.in_bbox;
      delete initialValues.visualization;
      delete initialValues.zoom;

      await initialize(FormNames.AREA_SEARCH_SEARCH, initialValues);
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

  render() {
    const {
      areaSearchListMethods,
      areaSearches,
      areaSearchesByBBox,
      areaSearchListAttributes,
      isFetching,
      isFetchingByBBox,
      isFetchingAreaSearchListAttributes,
      location: {search},
    } = this.props;

    const {
      sortKey,
      sortOrder,
      activePage,
      isSearchInitialized,
      maxPage,
      selectedStates,
      visualizationType,
      isEditModalOpen,
      editModalTargetAreaSearch,
    } = this.state;
    const searchQuery = getUrlParams(search);

    const columns = this.getColumns();
    const stateOptions = getFieldOptions(areaSearchListAttributes, 'state', false);

    if (isFetchingAreaSearchListAttributes || (visualizationType === VisualizationTypes.TABLE && !areaSearches)) {
      return <PageContainer>
        <Loader isLoading={true}/>
      </PageContainer>;
    }

    if (!areaSearchListMethods) {
      return null;
    }

    if (!isMethodAllowed(areaSearchListMethods, Methods.GET)) {
      return <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.AREA_SEARCH} />
      </PageContainer>;
    }

    let amountText = '';
    switch (visualizationType) {
      case VisualizationTypes.MAP:
        if (searchQuery.zoom && searchQuery.zoom >= MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES) {
          amountText = (isFetchingByBBox || areaSearchesByBBox?.count === undefined)
            ? 'Ladataan...'
            : `Löytyi ${areaSearchesByBBox.count} kpl`;
        }
        break;
      case VisualizationTypes.TABLE:
      default:
        amountText = (isFetching || areaSearches?.count === undefined)
          ? 'Ladataan...'
          : `Löytyi ${areaSearches.count} kpl`;
    }

    return (
      <PageContainer className="AreaSearchApplicationListPage">
        <Row>
          <Column small={12} medium={4} large={4} />
          <Column small={12} medium={8} large={8}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              states={selectedStates}
              handleSubmit={() => {}}
            />
          </Column>
        </Row>

        {<TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={amountText}
              filterOptions={stateOptions}
              filterValue={selectedStates}
              onFilterChange={this.handleAreaSearchStatesChange}
            />

          }
          visualizationComponent={
            <VisualisationTypeWrapper>
              {<IconRadioButtons
                legend={'Kartta/taulukko'}
                onChange={this.handleVisualizationTypeChange}
                options={visualizationTypeOptions}
                radioName='visualization-type-radio'
                value={visualizationType}
              />}
            </VisualisationTypeWrapper>
          }
        />}
        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
          }
          {visualizationType === 'table' &&
            <Fragment>
              <SortableTable
                columns={columns}
                data={areaSearches?.results || []}
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
            <AreaSearchMap
              allowToEdit={false}
              isLoading={isFetchingByBBox}
              onViewportChanged={this.handleMapViewportChanged}
            />
          }
        </TableWrapper>
        <EditAreaSearchPreparerModal
          isOpen={isEditModalOpen}
          onClose={this.closeAreaSearchEditModal}
          onSubmit={this.submitAreaSearchEditModal}
          areaSearchId={editModalTargetAreaSearch}
        />
      </PageContainer>
    );
  }
}

export default (flowRight(
  withRouter,
  withAreaSearchAttributes,
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        isFetching: getIsFetchingAreaSearchList(state),
        isFetchingByBBox: getIsFetchingAreaSearchListByBBox(state),
        areaSearches: getAreaSearchList(state),
        areaSearchesByBBox: getAreaSearchListByBBox(state),
        isEditingAreaSearch: getIsEditingAreaSearch(state),
        lastEditError: getLastAreaSearchEditError(state),
      };
    },
    {
      receiveTopNavigationSettings,
      initialize,
      fetchAreaSearchList,
      fetchAreaSearchListByBBox,
      editAreaSearch,
    },
  ),
)(AreaSearchApplicationListPage): React$ComponentType<OwnProps>);
