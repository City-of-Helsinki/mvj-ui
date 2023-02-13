// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import debounce from 'lodash/debounce';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import type {ContextRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import {initialize} from 'redux-form';

import Search from './search/Search';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {
  fetchPlotApplicationsList,
  fetchPlotApplicationsByBBox,
} from '$src/plotApplications/actions';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import IconRadioButtons from '$components/button/IconRadioButtons';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import ExternalLink from '$components/links/ExternalLink';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableFilterWrapper from '$components/table/TableFilterWrapper';
import TableWrapper from '$components/table/TableWrapper';
import TableIcon from '$components/icons/TableIcon';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {getRouteById, Routes} from '$src/root/routes';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import PageContainer from '$components/content/PageContainer';
import {withPlotApplicationsAttributes} from '$components/attributes/PlotApplicationsAttributes';
import Pagination from '$components/table/Pagination';
import VisualisationTypeWrapper from '$components/table/VisualisationTypeWrapper';
import MapIcon from '$components/icons/MapIcon';
import {
  getContentPlotApplicationsListResults,
} from '$src/plotApplications/helpers';
import {
  isMethodAllowed,
  getUrlParams,
  setPageTitle,
  getFieldOptions,
  getApiResponseCount,
  getApiResponseMaxPage,
  getSearchQuery,
} from '$util/helpers';
import {
  getIsFetching,
  getPlotApplicationsList,
  getIsFetchingByBBox,
} from '$src/plotApplications/selectors';
import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  DEFAULT_PLOT_APPLICATIONS_STATES,
  BOUNDING_BOX_FOR_SEARCH_QUERY,
  MAX_ZOOM_LEVEL_TO_FETCH_LEASES,
} from '$src/plotApplications/constants';
import type {Attributes, Methods as MethodsType} from '$src/types';
import {fetchPlotSearchList, fetchAttributes as fetchPlotSearchAttributes} from '$src/plotSearch/actions';
import ApplicationListMap from '$src/plotApplications/components/map/ApplicationListMap';
import {getPlotApplicationsListByBBox} from '$src/plotApplications/selectors';

const VisualizationTypes = {
  MAP: 'map',
  TABLE: 'table',
};

const MIN_QUERY_LENGTH = 6;

const visualizationTypeOptions = [
  {value: VisualizationTypes.TABLE, label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
  {value: VisualizationTypes.MAP, label: 'Kartta', icon: <MapIcon className='icon-medium' />},
];

type OwnProps = {
  ...ContextRouter
};

type Props = {
  ...OwnProps,
  plotApplicationsMethods: MethodsType,
  plotApplicationsAttributes: Attributes,
  isFetching: boolean,
  isFetchingByBBox: boolean,
  fetchPlotApplicationsList: Function,
  fetchPlotApplicationsByBBox: Function,
  fetchPlotSearchAttributes: Function,
  fetchPlotSearchList: Function,
  receiveTopNavigationSettings: Function,
  plotApplicationsListData: Object,
  plotApplicationsMapData: Object,
  sortKey: string,
  sortOrder: string,
  initialize: Function,
}

type State = {
  activePage: number,
  applications: Array<Object>,
  count: number,
  visualizationType: string,
  plotApplicationStates: Array<Object>,
  isSearchInitialized: boolean,
  maxPage: number,
  selectedStates: Array<string>,
  sortKey: string,
  sortOrder: string,
}

class PlotApplicationsListPage extends PureComponent<Props, State> {
  _isMounted: boolean

  state = {
    applications: [],
    selectedStates: [],
    count: 0,
    visualizationType: VisualizationTypes.TABLE,
    isSearchInitialized: false,
    plotApplicationStates: DEFAULT_PLOT_APPLICATIONS_STATES,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    maxPage: 0,
    activePage: 1,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
      fetchPlotSearchAttributes,
      fetchPlotSearchList,
      location: {search},
    } = this.props;
    const searchQuery = getUrlParams(search);
    setPageTitle('Tonttihakemukset');

    if(searchQuery.visualization === VisualizationTypes.MAP) {
      this.setState({visualizationType: VisualizationTypes.MAP});
      this.searchByBBox();
    } else {
      this.search();
    }

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_APPLICATIONS),
      pageTitle: 'Tonttihakemukset',
      showSearch: false,
    });
    fetchPlotSearchAttributes();
    fetchPlotSearchList();
    this.setSearchFormValues();
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const {visualizationType} = this.state;

    const prevSearchQuery = getUrlParams(prevSearch);
    const searchQuery = getUrlParams(currentSearch);

    if (currentSearch !== prevSearch) {
      if (searchQuery.visualization && searchQuery.visualization !== prevSearchQuery.visualization) {
        this.setSearchFormValues();
        this.handleVisualizationTypeChange(searchQuery.visualization);
      }

      switch(visualizationType) {
        case VisualizationTypes.MAP:
          this.searchByBBox();
          break;
        case VisualizationTypes.TABLE:
          this.search();
          break;
      }

      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if(!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }

    if (prevProps.plotApplicationsListData !== this.props.plotApplicationsListData) {
      this.updateTableData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  searchByBBox = () => {
    const {fetchPlotApplicationsByBBox, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    if (searchQuery && searchQuery.search && searchQuery.search.length > MIN_QUERY_LENGTH) {
      searchQuery.in_bbox = BOUNDING_BOX_FOR_SEARCH_QUERY;
    } else if (!searchQuery.zoom || searchQuery.zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES) {
      return;
    }

    searchQuery.limit = 10000;
    delete searchQuery.page;
    delete searchQuery.visualization;
    delete searchQuery.zoom;
    delete searchQuery.sort_key;
    delete searchQuery.sort_order;

    fetchPlotApplicationsByBBox(searchQuery);
  }

  setSearchFormValues = () => {
    const {location: {search}, initialize} = this.props;
    const searchQuery = getUrlParams(search);
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
      await initialize(FormNames.PLOT_APPLICATIONS_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
    }, async() => {
      await initializeSearchForm();

      if(this._isMounted) {
        setSearchFormReady();
      }
    });
  }

  search = () => {
    const {fetchPlotApplicationsList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if (page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;
    delete searchQuery.in_bbox;
    delete searchQuery.zoom;
    fetchPlotApplicationsList(searchQuery);
  }

  openCreatePlotApplication = () => {
    const {history} = this.props;

    history.push({
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}/uusi`,
    });
  }

  updateTableData = () => {
    const {plotApplicationsListData} = this.props;

    this.setState({
      count: getApiResponseCount(plotApplicationsListData),
      applications: getContentPlotApplicationsListResults(plotApplicationsListData),
      maxPage: getApiResponseMaxPage(plotApplicationsListData, LIST_TABLE_PAGE_SIZE),
    });
  }

  getColumns = () => {
    const columns = [];

    columns.push({
      key: 'plot_search',
      text: 'Haku',
      sortable: false,
      renderer: ({name, id}) => name
        ? <ExternalLink href={`${getRouteById(Routes.PLOT_SEARCH)}/${id}`} text={name} />
        : null,
    });

    columns.push({
      key: 'plot_search_type',
      text: 'Hakutyyppi',
      sortable: false,
    });

    columns.push({
      key: 'plot_search_subtype',
      text: 'Haun alatyyppi',
      sortable: false,
    });

    columns.push({
      key: 'applicants',
      text: 'Hakija',
      sortable: false,
    });

    columns.push({
      key: 'target_identifier',
      text: 'Kohteen hakemustunnus',
      sortable: false,
      renderer: ({identifier, application}) => identifier
        ? <ExternalLink
          href={`${getRouteById(Routes.PLOT_APPLICATIONS)}/${application}`}
          text={identifier} />
        : null,
    });

    columns.push({
      key: 'target_address',
      text: 'Haetun kohteen osoite',
      sortable: false,
    });

    columns.push({
      key: 'target_reserved',
      text: 'Varaus',
      sortable: false,
      renderer: (isReserved) => isReserved ? 'Kyllä' : 'Ei',
    });


    return columns;
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
      pathname: getRouteById(Routes.PLOT_APPLICATIONS),
      search: getSearchQuery(query),
    });
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}/${id}`,
      search: search,
    });
  }

  handleSearchUpdated = (query: Object, resetActivePage?: boolean = true) => {
    const {history} = this.props;

    if (resetActivePage) {
      this.setState({activePage: 1});
      delete query.page;
    }

    return history.push({
      pathname: getRouteById(Routes.PLOT_APPLICATIONS),
      search: getSearchQuery(query),
    });
  }

  handleVisualizationTypeChange = (value: string) => {
    this.setState({visualizationType: value}, () => {
      const {history, location: {search}} = this.props;
      const searchQuery = getUrlParams(search);

      if (value === VisualizationTypes.MAP) {
        searchQuery.visualization = VisualizationTypes.MAP;
      } else {
        delete searchQuery.visualization;
      }

      return history.push({
        pathname: getRouteById(Routes.PLOT_APPLICATIONS),
        search: getSearchQuery(searchQuery),
      });
    });
  }

  handleMapViewportChanged = debounce((mapOptions: Object) => {
    const {history, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.in_bbox = mapOptions.bBox.split(',');
    searchQuery.zoom = mapOptions.zoom;

    return history.push({
      pathname: getRouteById(Routes.PLOT_APPLICATIONS),
      search: getSearchQuery(searchQuery),
    });
  }, 1000);

  render() {
    const {
      isFetching,
      isFetchingByBBox,
      plotApplicationsMethods,
      plotApplicationsAttributes,
      plotApplicationsMapData,
      location: {search},
    } = this.props;

    const {
      activePage,
      isSearchInitialized,
      applications,
      maxPage,
      selectedStates,
      visualizationType,
      plotApplicationStates,
      sortKey,
      sortOrder,
    } = this.state;

    if (!plotApplicationsMethods && !plotApplicationsAttributes) {
      return null;
    }

    if (!isMethodAllowed(plotApplicationsMethods, Methods.GET)) {
      return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_SEARCH} /></PageContainer>;
    }

    const isTable = visualizationType === VisualizationTypes.TABLE;
    const isMap = visualizationType === VisualizationTypes.MAP;

    const plotApplicationStateFilterOptions = getFieldOptions(plotApplicationsAttributes, 'state', false);
    const filteredApplications = selectedStates.length
      ? (applications.filter((application) => selectedStates.indexOf(application.state) !== -1))
      : applications;

    const count = isMap ? getApiResponseCount(plotApplicationsMapData) : filteredApplications.length;
    const columns = this.getColumns();

    let amountText;
    if (isMap && isFetchingByBBox || isTable && isFetching) {
      amountText = 'Ladataan...';
    } else {
      if (isMap && Number(getUrlParams(search)?.zoom || 0) < MAX_ZOOM_LEVEL_TO_FETCH_LEASES) {
        amountText = '';
      } else {
        amountText = `Löytyi ${count} kpl`;
      }
    }

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(plotApplicationsMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo tonttihakemus'
                onClick={this.openCreatePlotApplication}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchUpdated}
              states={selectedStates}
              context={visualizationType}
            />
          </Column>
        </Row>
        <TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={amountText}
              filterOptions={plotApplicationStateFilterOptions}
              filterValue={plotApplicationStates}
              onFilterChange={() => { }}
            />

          }
          visualizationComponent={
            <VisualisationTypeWrapper>
              <IconRadioButtons
                legend={'Kartta/taulukko'}
                onChange={(value) => this.handleVisualizationTypeChange(value)}
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

          {isTable &&
            <Fragment>
              <SortableTable
                columns={columns}
                data={filteredApplications}
                listTable
                onRowClick={this.handleRowClick}
                onSortingChange={() => { }} // this.handleSortingChange
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
          {isMap &&
            <ApplicationListMap
              allowToEdit={false}
              isLoading={isFetching}
              onViewportChanged={this.handleMapViewportChanged}
            />
          }
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default (flowRight(
  withRouter,
  withPlotApplicationsAttributes,
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        isFetchingByBBox: getIsFetchingByBBox(state),
        plotApplicationsListData: getPlotApplicationsList(state),
        plotApplicationsMapData: getPlotApplicationsListByBBox(state),
      };
    },
    {
      receiveTopNavigationSettings,
      fetchPlotApplicationsByBBox,
      fetchPlotApplicationsList,
      fetchPlotSearchList,
      fetchPlotSearchAttributes,
      initialize,
    }
  ),
)(PlotApplicationsListPage): React$ComponentType<OwnProps>);
