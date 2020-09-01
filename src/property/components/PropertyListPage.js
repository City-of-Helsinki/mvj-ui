// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {initialize} from 'redux-form';
import isArray from 'lodash/isArray';
import {withRouter} from 'react-router';

import ExternalLink from '$components/links/ExternalLink';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import IconRadioButtons from '$components/button/IconRadioButtons';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MapIcon from '$components/icons/MapIcon';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import Search from './search/Search';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableFilterWrapper from '$components/table/TableFilterWrapper';
import TableWrapper from '$components/table/TableWrapper';
import TableIcon from '$components/icons/TableIcon';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import VisualisationTypeWrapper from '$components/table/VisualisationTypeWrapper';
import {
  createProperty, 
  fetchPropertyList,
} from '$src/property/actions';
import {
  getIsFetching,
  getPropertyList,
} from '$src/property/selectors';
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
} from '$util/helpers';
import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  DEFAULT_PROPERTY_STATES,
} from '$src/property/constants';
import {
  getContentPropertyListResults,
} from '$src/property/helpers';
import type {Property, PropertyList} from '$src/property/types';
import CreatePlotSearchModal from './CreatePlotSearchModal';
import {FormNames} from '$src/enums';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import {withPropertyAttributes} from '$components/attributes/PropertyAttributes';

import type {Attributes} from '$src/types';

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
  location: Object,
  createProperty: Function,
  usersPermissions: UsersPermissionsType,
  receiveTopNavigationSettings: Function,

  propertyAttributes: Attributes,
  isFetchingPropertyAttributes: boolean,
  isFetching: boolean,
  propertyListData: PropertyList,
  initialize: Function,
  fetchPropertyList: Function,
}

type State = {
  properties: Array<Object>,
  activePage: number,
  visualizationType: string,
  propertyStates: Array<string>,
  isSearchInitialized: boolean,
  count: number,
  sortKey: string,
  sortOrder: string,
  maxPage: number,
  selectedStates: Array<string>,
  isModalOpen: boolean,
}

class PropertyListPage extends PureComponent<Props, State> {
  _isMounted: boolean

  state = {
    properties: [],
    visualizationType: VisualizationTypes.TABLE,
    propertyStates: DEFAULT_PROPERTY_STATES,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    activePage: 1,
    count: 0,
    isSearchInitialized: false,
    maxPage: 0,
    selectedStates: [],
    isModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
    } = this.props;
    setPageTitle('Tonttihaut');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PROPERTY),
      pageTitle: 'Tonttihaut',
      showSearch: false,
    });

    this.search();

    this.setSearchFormValues();

    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  handleVisualizationTypeChange = () => {

  }

  handleSearchChange = () => {

  }

  showCreateLeaseModal = () => {

  }

  handleLeaseStatesChange = () => {

  }

  getColumns = () => {
    const {propertyAttributes} = this.props;    
    const columns = [];
    const typeOptions = getFieldOptions(propertyAttributes, 'type');
    const subtypeOptions = getFieldOptions(propertyAttributes, 'subtype');
    const stageOptions = getFieldOptions(propertyAttributes, 'stage');

    columns.push({
      key: 'name',
      text: 'Haku',
      sortable: false,
    });

    columns.push({
      key: 'type',
      text: 'Hakutyyppi',
      sortable: false,
      renderer: (val) => getLabelOfOption(typeOptions, val),
    });
  
    columns.push({
      key: 'subtype',
      text: 'Haun alatyyppi',
      sortable: false,
      renderer: (val) => getLabelOfOption(subtypeOptions, val),
    });

    columns.push({
      key: 'stage',
      text: 'Haun vaihe',
      sortable: false,
      renderer: (val) => getLabelOfOption(stageOptions, val),
    });

    columns.push({
      key: 'begin_at', 
      text: 'Alkupvm', 
      sortable: false,
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'end_at', 
      text: 'Loppupvm', 
      sortable: false,
      renderer: (val) => formatDate(val),
    });
    
    columns.push({
      key: 'latest_decicion', 
      text: 'Viimeisin päätös', 
      sortable: false,
      renderer: (id) => id 
        ? <ExternalLink href={'/'} text={id}/> // getReferenceNumberLink(id)
        : null,
    });
    
    columns.push({
      key: 'id', 
      text: 'Kohteen tunnus', 
      sortable: false,
      renderer: (id) => id 
        ? <ExternalLink href={'/'} text={id}/> // getReferenceNumberLink(id)
        : null,
    });

    return columns;
  }

  search = () => {
    const {fetchPropertyList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;

    fetchPropertyList(getSearchQuery(searchQuery));
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.PROPERTY)}/${id}`,
      search: search,
    });
  }

  handleSortingChange = () => {

  }

  handlePageClick = (page: number) => {
    console.log(page);
  }

  updateTableData = () => {
    const {propertyListData} = this.props;

    this.setState({
      count: getApiResponseCount(propertyListData),
      properties: getContentPropertyListResults(propertyListData),
      maxPage: getApiResponseMaxPage(propertyListData, LIST_TABLE_PAGE_SIZE),
    });
  }

  handleCreatePlotSearch = (plot_search: Property) => {
    const {createProperty} = this.props;
    createProperty(plot_search);
  }

  openModalhandleCreatePlotSearch = () => {
    const {initialize} = this.props;

    this.setState({isModalOpen: true});

    initialize(FormNames.PLOT_SEARCH_CREATE, {});
  }

  hideCreatePlotSearchModal = () => {
    this.setState({isModalOpen: false});
  }

  handleSearchChange = (query: Object) => {
    const {history} = this.props;

    this.setState({activePage: 1});
    delete query.page;

    return history.push({
      pathname: getRouteById(Routes.PROPERTY),
      search: getSearchQuery(query),
    });
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

    if(prevProps.propertyListData !== this.props.propertyListData) {
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
      await initialize(FormNames.PROPERTY_SEARCH, initialValues);
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
      visualizationType,
      propertyStates,
      sortKey,
      sortOrder,
      isModalOpen,
    } = this.state;

    const columns = this.getColumns();

    const {isFetching, isFetchingPropertyAttributes, propertyAttributes} = this.props;
    const {activePage, isSearchInitialized, properties, maxPage, selectedStates} = this.state;
    const propertyStateFilterOptions = getFieldOptions(propertyAttributes, 'state', false);
    const filteredProperties = selectedStates.length
      ? (properties.filter((contract) => selectedStates.indexOf(contract.state)  !== -1))
      : properties;
    const count = filteredProperties.length;

    if(isFetchingPropertyAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    return (
      <PageContainer>
        <CreatePlotSearchModal
          isOpen={isModalOpen}
          onClose={this.hideCreatePlotSearchModal}
          onSubmit={this.handleCreatePlotSearch}
        />
        <Row>
          <Column small={12} large={4}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo tonttihaku'
              onClick={this.openModalhandleCreatePlotSearch}
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

        <TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={propertyStateFilterOptions}
              filterValue={propertyStates}
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
                data={filteredProperties}
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
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withRouter,
  withPropertyAttributes,
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        isFetching: getIsFetching(state),
        propertyListData: getPropertyList(state),
      };
    },
    {
      receiveTopNavigationSettings,
      createProperty,
      initialize,
      fetchPropertyList,
    },
  ),
)(PropertyListPage);
