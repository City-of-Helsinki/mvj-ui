// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import {initialize} from 'redux-form';

import Search from './search/Search';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {
  fetchPlotApplicationsList,
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
import CreatePlotApplicationsModal from './CreatePlotApplicationsModal';
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
  getLabelOfOption,
  getSearchQuery,
} from '$util/helpers';
import {
  getIsFetching,
  getPlotApplicationsList,
} from '$src/plotApplications/selectors';
import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  DEFAULT_PLOT_APPLICATIONS_STATES,
} from '$src/plotApplications/constants';
import type {Attributes, Methods as MethodsType} from '$src/types';
import {fetchPlotSearchList, fetchAttributes as fetchPlotSearchAttributes} from '$src/plotSearch/actions';


const VisualizationTypes = {
  MAP: 'map',
  TABLE: 'table',
};

const visualizationTypeOptions = [
  {value: VisualizationTypes.TABLE, label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
  {value: VisualizationTypes.MAP, label: 'Kartta', icon: <MapIcon className='icon-medium' />},
];


type Props = {
  history: Object,
  plotApplicationsMethods: MethodsType,
  plotApplicationsAttributes: Attributes,
  isFetching: boolean,
  fetchPlotApplicationsList: Function,
  fetchPlotSearchAttributes: Function,
  fetchPlotSearchList: Function,
  location: Object,
  receiveTopNavigationSettings: Function,
  plotApplicationsListData: Object,
  sortKey: string,
  sortOrder: string,
  initialize: Function,
}

type State = {
  activePage: number,
  applications: Array<Object>,
  isModalOpen: boolean,
  count: number,
  visualizationType: string,
  plotApplicationStates: Array<Object>,
  isSearchInitialized: boolean,
  maxPage: number,
  selectedStates: Array<string>,
  sortKey: string,
  sortOrder: string,
  selectedStates: Array<string>,
}

class PlotApplicationsListPage extends PureComponent<Props, State> {
  _isMounted: boolean

  state = {
    applications: [],
    selectedStates: [],
    isModalOpen: false,
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
    } = this.props;
    setPageTitle('Tonttihakemukset');
    
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_APPLICATIONS),
      pageTitle: 'Tonttihakemukset',
      showSearch: false,
    });
    fetchPlotSearchAttributes();
    fetchPlotSearchList();
    this.search();
    this.setSearchFormValues();
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if (currentSearch !== prevSearch) {
      this.search();

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

  hideCreatePlotApplicationsModal = () => {
    this.setState({isModalOpen: false});
  }

  handleCreatePlotApplications = () => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}/1`,
      search: search,
    });
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

    fetchPlotApplicationsList(searchQuery);
  }

  openModalhandleCreatePlotApplication = () => {
    this.setState({isModalOpen: true});
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
    const {plotApplicationsAttributes} = this.props;
    const typeOptions = getFieldOptions(plotApplicationsAttributes, 'type');
    const subtypeOptions = getFieldOptions(plotApplicationsAttributes, 'subtype');
    const columns = [];

    columns.push({
      key: 'plot_search',
      text: 'Haku',
      sortable: false,
      renderer: (id) => id 
        ? <ExternalLink href={'/tonttihaku/'} text={id}/> // getReferenceNumberLink(id)
        : null,
    });

    columns.push({
      key: 'plot_search_type',
      text: 'Hakutyyppi',
      sortable: false,
      renderer: (val) => getLabelOfOption(typeOptions, val),
    });

    columns.push({
      key: 'plot_search_subtype',
      text: 'Haun alatyyppi',
      sortable: false,
      renderer: (val) => getLabelOfOption(subtypeOptions, val),
    });

    columns.push({
      key: 'applicant',
      text: 'Hakija',
      sortable: false,
    });

    columns.push({
      key: 'target_identifier',
      text: 'Kohteen hakemustunnus',
      sortable: false,
      renderer: (id) => id 
        ? <ExternalLink href={'/'} text={id}/> // getReferenceNumberLink(id)
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

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}/${id}`,
      search: search,
    });
  }

  handleSearchUpdated = (query: Object, resetActivePage?: boolean = true) => {
    const {history} = this.props;
    
    if(resetActivePage) {
      this.setState({activePage: 1});
      delete query.page;
    }

    return history.push({
      pathname: getRouteById(Routes.PLOT_APPLICATIONS),
      search: getSearchQuery(query),
    });
  }

  render() {
    const {
      isFetching,
      plotApplicationsMethods,
      plotApplicationsAttributes,
    } = this.props;

    const {
      isModalOpen,
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

    const plotApplicationStateFilterOptions = getFieldOptions(plotApplicationsAttributes, 'state', false);
    const filteredApplications = selectedStates.length
      ? (applications.filter((application) => selectedStates.indexOf(application.state) !== -1))
      : applications;
    const count = filteredApplications.length;
    const columns = this.getColumns();

    if (!plotApplicationsMethods && !plotApplicationsAttributes) return null;

    if (!isMethodAllowed(plotApplicationsMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_SEARCH} /></PageContainer>;

    return (
      <PageContainer>
        <Authorization allow={isMethodAllowed(plotApplicationsMethods, Methods.POST)}>
          <CreatePlotApplicationsModal
            isOpen={isModalOpen}
            onClose={this.hideCreatePlotApplicationsModal}
            onSubmit={this.handleCreatePlotApplications}
          />
        </Authorization>
        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(plotApplicationsMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo tonttihakemus'
                onClick={this.openModalhandleCreatePlotApplication}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchUpdated}
              states={selectedStates}
            />
          </Column>
        </Row>
        <TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={plotApplicationStateFilterOptions}
              filterValue={plotApplicationStates}
              onFilterChange={() => { }}
            />

          }
          visualizationComponent={
            <VisualisationTypeWrapper>
              <IconRadioButtons
                legend={'Kartta/taulukko'}
                onChange={() => { }} // this.handleVisualizationTypeChange
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
                onPageClick={() => { }} // this.handlePageClick(page)
              />
            </Fragment>
          }
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withRouter,
  withPlotApplicationsAttributes,
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        plotApplicationsListData: getPlotApplicationsList(state),
      };
    },
    {
      receiveTopNavigationSettings,
      fetchPlotApplicationsList,
      fetchPlotSearchList,
      fetchPlotSearchAttributes,
      initialize,
    }
  ),
)(PlotApplicationsListPage);
