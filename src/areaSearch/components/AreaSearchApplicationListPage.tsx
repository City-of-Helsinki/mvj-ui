import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import flowRight from "lodash/flowRight";
import isArray from "lodash/isArray";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { formValueSelector, initialize, reduxForm } from "redux-form";
import { withRouter } from "react-router";
import debounce from "lodash/debounce";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import { FieldTypes, FormNames, Methods, PermissionMissingTexts } from "enums";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import PageContainer from "/src/components/content/PageContainer";
import Pagination from "/src/components/table/Pagination";
import { receiveTopNavigationSettings } from "/src/components/topNavigation/actions";
import Search from "/src/areaSearch/components/search/Search";
import { LIST_TABLE_PAGE_SIZE } from "util/constants";
import SortableTable from "/src/components/table/SortableTable";
import TableFilters from "/src/components/table/TableFilters";
import TableFilterWrapper from "/src/components/table/TableFilterWrapper";
import TableWrapper from "/src/components/table/TableWrapper";
import IconRadioButtons from "/src/components/button/IconRadioButtons";
import TableIcon from "/src/components/icons/TableIcon";
import MapIcon from "/src/components/icons/MapIcon";
import { getRouteById, Routes } from "/src/root/routes";
import { formatDate, getLabelOfOption, setPageTitle, getFieldOptions, getSearchQuery, getApiResponseCount, getApiResponseMaxPage, getUrlParams, isMethodAllowed } from "util/helpers";
import { withAreaSearchAttributes } from "/src/components/attributes/AreaSearchAttributes";
import { getAreaSearchList, getAreaSearchListByBBox, getIsEditingAreaSearch, getIsFetchingAreaSearchList, getIsFetchingAreaSearchListByBBox, getLastAreaSearchEditError } from "/src/areaSearch/selectors";
import { DEFAULT_AREA_SEARCH_STATES, DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "/src/areaSearch/constants";
import { editAreaSearch, fetchAreaSearchList, fetchAreaSearchListByBBox } from "/src/areaSearch/actions";
import { getUserFullName } from "/src/users/helpers";
import { areaSearchSearchFilters } from "/src/areaSearch/helpers";
import { BOUNDING_BOX_FOR_SEARCH_QUERY, MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES } from "/src/areaSearch/constants";
import AreaSearchListMap from "/src/areaSearch/components/map/AreaSearchListMap";
import VisualisationTypeWrapper from "/src/components/table/VisualisationTypeWrapper";
import { ButtonColors } from "/src/components/enums";
import Button from "/src/components/button/Button";
import EditAreaSearchPreparerModal from "/src/areaSearch/components/EditAreaSearchPreparerModal";
import Authorization from "/src/components/authorization/Authorization";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import FormField from "/src/components/form/FormField";
import type { Attributes, Methods as MethodsType } from "types";
import type { ApiResponse } from "types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
import AreaSearchExportModal from "/src/areaSearch/components/AreaSearchExportModal";
import { getUserActiveServiceUnit } from "/src/usersPermissions/selectors";
import type { UserServiceUnit } from "/src/usersPermissions/types";
const VisualizationTypes = {
  MAP: 'map',
  TABLE: 'table'
};
const visualizationTypeOptions = [{
  value: VisualizationTypes.TABLE,
  label: 'Taulukko',
  icon: <TableIcon className='icon-medium' />
}, {
  value: VisualizationTypes.MAP,
  label: 'Kartta',
  icon: <MapIcon className='icon-medium' />
}];
type OwnProps = {};
type Props = OwnProps & {
  history: Record<string, any>;
  location: Record<string, any>;
  usersPermissions: UsersPermissionsType;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  areaSearchListAttributes: Attributes;
  areaSearchListMethods: MethodsType;
  isFetchingAreaSearchListAttributes: boolean;
  isFetching: boolean;
  initialize: (...args: Array<any>) => any;
  initializeForm: (...args: Array<any>) => any;
  isFetchingByBBox: boolean;
  fetchAreaSearchList: (...args: Array<any>) => any;
  fetchAreaSearchListByBBox: (...args: Array<any>) => any;
  areaSearches: ApiResponse;
  areaSearchesByBBox: ApiResponse;
  editAreaSearch: (...args: Array<any>) => any;
  isEditingAreaSearch: boolean;
  lastEditError: any;
  change: (...args: Array<any>) => any;
  selectedSearches: Record<string, any>;
  userActiveServiceUnit: UserServiceUnit;
};
type State = {
  properties: Array<Record<string, any>>;
  activePage: number;
  isSearchInitialized: boolean;
  count: number;
  sortKey: string;
  sortOrder: string;
  maxPage: number;
  selectedStates: Array<any>;
  visualizationType: string;
  isEditModalOpen: boolean;
  isExportModalOpen: boolean;
  editModalTargetAreaSearch: number | null | undefined;
  userActiveServiceUnit?: any;
};

class AreaSearchApplicationListPage extends PureComponent<Props, State> {
  _isMounted: boolean;
  _hasFetchedAreaSearches: boolean;
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
    isExportModalOpen: false,
    editModalTargetAreaSearch: null,
    userActiveServiceUnit: undefined
  };
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    setPageTitle('Aluehaun hakemukset');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_SEARCH),
      pageTitle: 'Aluehaun hakemukset',
      showSearch: false
    });

    if (searchQuery.visualization === VisualizationTypes.MAP) {
      this.setState({
        visualizationType: VisualizationTypes.MAP
      });
      this.searchByBBox();
    } else {
      this.search();
    }

    this.setSearchFormValues();
    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  handleVisualizationTypeChange = (value: string) => {
    this.setState({
      visualizationType: value
    }, () => {
      const {
        history,
        location: {
          search
        }
      } = this.props;
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
        search: getSearchQuery(searchQuery)
      });
    });
  };
  handleAreaSearchStatesChange = (values: Array<string>) => {
    const {
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    delete searchQuery.page;
    searchQuery.state = values;
    this.setState({
      selectedStates: values
    });
    this.handleSearchChange(searchQuery, true);
  };
  getColumns = () => {
    const {
      areaSearchListAttributes,
      selectedSearches
    } = this.props;
    const columns = [];
    const intendedUseOptions = getFieldOptions(areaSearchListAttributes, 'intended_use');
    const stateOptions = getFieldOptions(areaSearchListAttributes, 'state');
    columns.push({
      key: 'checkbox',
      text: 'Tulosta',
      sortable: false,
      renderer: (_, item) => <div onMouseDown={e => {
        e.stopPropagation();
      }}>
        <FormField name={`selectedSearches.${item.id}`} fieldAttributes={{
          type: FieldTypes.CHECKBOX,
          label: 'Valitse hakemus ' + item.identifier,
          read_only: false
        }} autoBlur disableDirty invisibleLabel overrideValues={{
          options: [{
            value: true,
            label: ''
          }]
        }} onBlur={(_, value) => this.updateAllSearchesSelected({ ...selectedSearches,
          [item.id]: value
        })} />
      </div>
    });
    columns.push({
      key: 'identifier',
      text: 'Hakemus'
    });
    columns.push({
      key: 'applicants',
      text: 'Hakija',
      sortable: false
    });
    columns.push({
      key: 'received_date',
      text: 'Saapunut',
      renderer: val => formatDate(val)
    });
    columns.push({
      key: 'intended_use',
      text: 'Käyttötarkoitus',
      renderer: val => getLabelOfOption(intendedUseOptions, val)
    });
    columns.push({
      key: 'address',
      text: 'Osoite'
    });
    columns.push({
      key: 'district',
      text: 'Kaupunginosa'
    });
    columns.push({
      key: 'start_date',
      text: 'Alkupvm',
      renderer: val => formatDate(val)
    });
    columns.push({
      key: 'end_date',
      text: 'Loppupvm',
      renderer: val => formatDate(val)
    });
    columns.push({
      key: 'state',
      text: 'Tila',
      renderer: val => getLabelOfOption(stateOptions, val)
    });
    columns.push({
      key: 'lessor',
      text: 'Vuokranantaja',
      renderer: (val, row) => <span onMouseUp={e => e.stopPropagation()}>
        <Button className={ButtonColors.LINK} onClick={() => this.openAreaSearchEditModal(row.id)} text={val || 'Avoin'} />
      </span>
    });
    columns.push({
      key: 'preparer',
      text: 'Käsittelijä',
      renderer: (val, row) => <span onMouseUp={e => e.stopPropagation()}>
        <Button className={ButtonColors.LINK} onClick={() => this.openAreaSearchEditModal(row.id)} text={getUserFullName(val) || 'Avoin'} />
      </span>
    });
    return columns;
  };
  openAreaSearchEditModal = (id: number) => {
    this.setState(() => ({
      isEditModalOpen: true,
      editModalTargetAreaSearch: id
    }));
  };
  closeAreaSearchEditModal = () => {
    this.setState(() => ({
      isEditModalOpen: false,
      editModalTargetAreaSearch: null
    }));
  };
  openExportModal = () => {
    this.setState(() => ({
      isExportModalOpen: true
    }));
  };
  closeExportModal = () => {
    this.setState(() => ({
      isExportModalOpen: false
    }));
  };
  submitAreaSearchEditModal = (data: Record<string, any>) => {
    const {
      editAreaSearch
    } = this.props;
    editAreaSearch({
      id: data.id,
      preparer: data.preparer?.id || null,
      lessor: data.lessor,
      area_search_status: {
        status_notes: data.status_notes ? [{
          note: data.status_notes
        }] : undefined
      }
    });
  };
  search = () => {
    const {
      fetchAreaSearchList,
      location: {
        search
      },
      userActiveServiceUnit
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if (page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;
    delete searchQuery.in_bbox;
    delete searchQuery.visualization;
    delete searchQuery.zoom;
    fetchAreaSearchList(areaSearchSearchFilters(searchQuery));
  };
  searchByBBox = () => {
    const {
      fetchAreaSearchListByBBox,
      location: {
        search
      },
      userActiveServiceUnit
    } = this.props;
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

    if (searchQuery.service_unit === undefined && userActiveServiceUnit) {
      searchQuery.service_unit = userActiveServiceUnit.id;
    }

    searchQuery.limit = 10000;
    delete searchQuery.page;
    delete searchQuery.visualization;
    delete searchQuery.zoom;
    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
    fetchAreaSearchListByBBox(areaSearchSearchFilters(searchQuery));
  };
  handleRowClick = id => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}/${id}`,
      search: search
    });
  };
  handleSortingChange = ({
    sortKey,
    sortOrder
  }) => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    this.setState({
      sortKey,
      sortOrder
    });
    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(searchQuery)
    });
  };
  handlePageClick = (page: number) => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({
      activePage: page
    });
    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(query)
    });
  };
  updateTableData = () => {
    const {
      areaSearches,
      change
    } = this.props;
    this.setState({
      count: getApiResponseCount(areaSearches),
      maxPage: getApiResponseMaxPage(areaSearches, LIST_TABLE_PAGE_SIZE)
    });
    change('selectedSearches', {});
    change('allSelected', false);
  };
  handleSearchChange = (query: Record<string, any>, resetActivePage: boolean = true) => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const urlQuery = getUrlParams(search);

    if (resetActivePage) {
      this.setState({
        activePage: 1
      });
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
      search: getSearchQuery(query)
    });
  };

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: currentSearch
      },
      isEditingAreaSearch,
      lastEditError,
      userActiveServiceUnit
    } = this.props;
    const {
      location: {
        search: prevSearch
      },
      userActiveServiceUnit: prevUserActiveServiceUnit
    } = prevProps;
    const {
      visualizationType
    } = this.state;
    const searchQuery = getUrlParams(currentSearch);

    const handleSearch = () => {
      this.setSearchFormValues();
      this.search();
    };

    if (userActiveServiceUnit) {
      if (!this._hasFetchedAreaSearches) {
        // No search has been done yet
        handleSearch();
        this._hasFetchedAreaSearches = true;
      } else if (userActiveServiceUnit !== prevUserActiveServiceUnit && !currentSearch.includes('service_unit')) {
        // Search again after changing user active service unit only if not explicitly setting the service unit filter
        handleSearch();
      }
    }

    if (currentSearch !== prevSearch || !isEditingAreaSearch && !lastEditError && prevProps.isEditingAreaSearch) {
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
    this._hasFetchedAreaSearches = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  };
  handleMapViewportChanged = debounce((mapOptions: Record<string, any>) => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    searchQuery.in_bbox = mapOptions.bBox.split(',');
    searchQuery.zoom = mapOptions.zoom;
    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(searchQuery)
    });
  }, 1000);
  getSearchStates = (query: Record<string, any>) => {
    if (isArray(query.state)) {
      return query.state;
    }

    if (query.state) {
      return [query.state];
    }

    return query.search || query?.state ? [] : DEFAULT_AREA_SEARCH_STATES;
  };
  setSearchFormValues = () => {
    const {
      location: {
        search
      },
      initializeForm,
      userActiveServiceUnit
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    const states = this.getSearchStates(searchQuery);

    const setSearchFormReady = () => {
      this.setState({
        isSearchInitialized: true
      });
    };

    const initializeSearchForm = async () => {
      const initialValues = { ...searchQuery
      };
      delete initialValues.page;
      delete initialValues.state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      delete initialValues.in_bbox;
      delete initialValues.visualization;
      delete initialValues.zoom;

      if (initialValues.service_unit === undefined && userActiveServiceUnit) {
        initialValues.service_unit = userActiveServiceUnit.id;
      }

      await initializeForm(FormNames.AREA_SEARCH_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      selectedStates: states
    }, async () => {
      await initializeSearchForm();

      if (this._isMounted) {
        setSearchFormReady();
      }
    });
  };
  openCreateAreaSearch = () => {
    const {
      history
    } = this.props;
    history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}/uusi`
    });
  };
  selectAllSearches = (event: React.FocusEvent<HTMLInputElement>, value: boolean) => {
    const {
      change,
      areaSearches
    } = this.props;
    change('selectedSearches', areaSearches?.results.reduce((acc, result) => {
      acc[result.id] = value;
      return acc;
    }, {}));
  };
  updateAllSearchesSelected = (selectedSearches: Record<string, any>) => {
    const {
      change,
      areaSearches
    } = this.props;
    const isAllSelected = areaSearches?.results.every(search => selectedSearches[search.id] === true);
    change('allSelected', isAllSelected);
  };

  render() {
    const {
      areaSearchListMethods,
      areaSearches,
      areaSearchesByBBox,
      areaSearchListAttributes,
      isFetching,
      isFetchingByBBox,
      isFetchingAreaSearchListAttributes,
      location: {
        search
      },
      selectedSearches = {}
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
      isExportModalOpen,
      editModalTargetAreaSearch
    } = this.state;
    const searchQuery = getUrlParams(search);
    const columns = this.getColumns();
    const stateOptions = getFieldOptions(areaSearchListAttributes, 'state', false);

    if (isFetchingAreaSearchListAttributes || visualizationType === VisualizationTypes.TABLE && !areaSearches) {
      return <PageContainer>
        <Loader isLoading={true} />
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
          amountText = isFetchingByBBox || areaSearchesByBBox?.count === undefined ? 'Ladataan...' : `Löytyi ${areaSearchesByBBox.count} kpl`;
        }

        break;

      case VisualizationTypes.TABLE:
      default:
        amountText = isFetching || areaSearches?.count === undefined ? 'Ladataan...' : `Löytyi ${areaSearches.count} kpl`;
    }

    return <PageContainer className="AreaSearchApplicationListPage">
        <Row>
          <Column small={12} medium={4} large={4}>
            <Authorization allow={isMethodAllowed(areaSearchListMethods, Methods.POST)}>
              <AddButtonSecondary className='no-top-margin' label='Luo aluehakemus' onClick={this.openCreateAreaSearch} />
            </Authorization>
          </Column>
          <Column small={12} medium={8} large={8}>
            <Search isSearchInitialized={isSearchInitialized} onSearch={this.handleSearchChange} states={selectedStates} handleSubmit={() => {}} />
          </Column>
        </Row>

        {<TableFilterWrapper filterComponent={<TableFilters amountText={amountText} filterOptions={stateOptions} filterValue={selectedStates} onFilterChange={this.handleAreaSearchStatesChange} />} visualizationComponent={<VisualisationTypeWrapper>
              {<IconRadioButtons legend={'Kartta/taulukko'} onChange={this.handleVisualizationTypeChange} options={visualizationTypeOptions} radioName='visualization-type-radio' value={visualizationType} />}
            </VisualisationTypeWrapper>} />}
        <TableWrapper>
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>}
          {visualizationType === 'table' && <Fragment>
              <SortableTable columns={columns} data={areaSearches?.results || []} listTable onRowClick={this.handleRowClick} onSortingChange={this.handleSortingChange} serverSideSorting showCollapseArrowColumn sortable sortKey={sortKey} sortOrder={sortOrder} footer={({
            columnCount
          }: {
            columnCount: number;
          }) => <tr>
                  <td />
                  <td colSpan={columnCount - 1}>
                    <FormField name={`allSelected`} fieldAttributes={{
                type: FieldTypes.CHECKBOX,
                label: '',
                read_only: false
              }} autoBlur disableDirty invisibleLabel overrideValues={{
                options: [{
                  value: true,
                  label: 'Valitse kaikki suodatuksen mukaan'
                }]
              }} onBlur={this.selectAllSearches} onChange={this.selectAllSearches} />
                  </td>
                </tr>} />

              <Pagination activePage={activePage} maxPage={maxPage} onPageClick={page => this.handlePageClick(page)} />
            </Fragment>}
          {visualizationType === 'map' && <AreaSearchListMap allowToEdit={false} isLoading={isFetchingByBBox} onViewportChanged={this.handleMapViewportChanged} />}
        </TableWrapper>
        <Button onClick={this.openExportModal} text="Tulosta" disabled={selectedSearches.length === 0} />
        <EditAreaSearchPreparerModal isOpen={isEditModalOpen} onClose={this.closeAreaSearchEditModal} onSubmit={this.submitAreaSearchEditModal} areaSearchId={editModalTargetAreaSearch} />
        <AreaSearchExportModal isOpen={isExportModalOpen} onClose={this.closeExportModal} />
      </PageContainer>;
  }

}

const FORM_NAME = FormNames.AREA_SEARCH_EXPORT;
const selector = formValueSelector(FORM_NAME);
export default (flowRight(withRouter, withAreaSearchAttributes, connect(state => {
  return {
    usersPermissions: getUsersPermissions(state),
    isFetching: getIsFetchingAreaSearchList(state),
    isFetchingByBBox: getIsFetchingAreaSearchListByBBox(state),
    areaSearches: getAreaSearchList(state),
    areaSearchesByBBox: getAreaSearchListByBBox(state),
    isEditingAreaSearch: getIsEditingAreaSearch(state),
    lastEditError: getLastAreaSearchEditError(state),
    selectedSearches: selector(state, 'selectedSearches'),
    userActiveServiceUnit: getUserActiveServiceUnit(state)
  };
}, {
  receiveTopNavigationSettings,
  // initialize bound to the row selection form is set by reduxForm
  initializeForm: initialize,
  fetchAreaSearchList,
  fetchAreaSearchListByBBox,
  editAreaSearch
}), reduxForm({
  form: FORM_NAME,
  initialValues: {
    mode: null,
    selectedSearches: {},
    includeInformationChecks: false,
    includeAttachments: false
  }
}))(AreaSearchApplicationListPage) as React.ComponentType<OwnProps>);