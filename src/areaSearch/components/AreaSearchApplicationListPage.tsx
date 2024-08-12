import React, { Fragment, useEffect, useState } from "react";
import flowRight from "lodash/flowRight";
import isArray from "lodash/isArray";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { formValueSelector, initialize, reduxForm } from "redux-form";
import { withRouter } from "react-router";
import debounce from "lodash/debounce";
import AuthorizationError from "components/authorization/AuthorizationError";
import { FieldTypes, FormNames, Methods, PermissionMissingTexts } from "enums";
import { getUsersPermissions } from "usersPermissions/selectors";
import Loader from "components/loader/Loader";
import LoaderWrapper from "components/loader/LoaderWrapper";
import PageContainer from "components/content/PageContainer";
import Pagination from "components/table/Pagination";
import { receiveTopNavigationSettings } from "components/topNavigation/actions";
import Search from "areaSearch/components/search/Search";
import { LIST_TABLE_PAGE_SIZE } from "util/constants";
import SortableTable from "components/table/SortableTable";
import TableFilters from "components/table/TableFilters";
import TableFilterWrapper from "components/table/TableFilterWrapper";
import TableWrapper from "components/table/TableWrapper";
import IconRadioButtons from "components/button/IconRadioButtons";
import TableIcon from "components/icons/TableIcon";
import MapIcon from "components/icons/MapIcon";
import { getRouteById, Routes } from "root/routes";
import { formatDate, getLabelOfOption, setPageTitle, getFieldOptions, getSearchQuery, getApiResponseCount, getApiResponseMaxPage, getUrlParams, isMethodAllowed } from "util/helpers";
import { withAreaSearchAttributes } from "components/attributes/AreaSearchAttributes";
import { getAreaSearchList, getAreaSearchListByBBox, getIsEditingAreaSearch, getIsFetchingAreaSearchList, getIsFetchingAreaSearchListByBBox, getLastAreaSearchEditError } from "areaSearch/selectors";
import { DEFAULT_AREA_SEARCH_STATES, DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "areaSearch/constants";
import { editAreaSearch, fetchAreaSearchList, fetchAreaSearchListByBBox } from "areaSearch/actions";
import { getUserFullName } from "users/helpers";
import { areaSearchSearchFilters } from "areaSearch/helpers";
import { BOUNDING_BOX_FOR_SEARCH_QUERY, MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES } from "areaSearch/constants";
import AreaSearchListMap from "areaSearch/components/map/AreaSearchListMap";
import VisualisationTypeWrapper from "components/table/VisualisationTypeWrapper";
import { ButtonColors } from "components/enums";
import Button from "components/button/Button";
import EditAreaSearchPreparerModal from "areaSearch/components/EditAreaSearchPreparerModal";
import Authorization from "components/authorization/Authorization";
import AddButtonSecondary from "components/form/AddButtonSecondary";
import FormField from "components/form/FormField";
import type { Attributes, Methods as MethodsType } from "types";
import type { ApiResponse } from "types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
import AreaSearchExportModal from "areaSearch/components/AreaSearchExportModal";
import { getUserActiveServiceUnit } from "usersPermissions/selectors";
import type { UserServiceUnit } from "usersPermissions/types";
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

const AreaSearchApplicationListPage = ({
  history,
  location: {
    search
  },
  usersPermissions,
  receiveTopNavigationSettings,
  areaSearchListAttributes,
  areaSearchListMethods,
  isFetchingAreaSearchListAttributes,
  isFetching,
  initializeForm,
  isFetchingByBBox,
  fetchAreaSearchList,
  fetchAreaSearchListByBBox,
  areaSearches,
  areaSearchesByBBox,
  editAreaSearch,
  isEditingAreaSearch,
  lastEditError,
  change,
  selectedSearches,
  userActiveServiceUnit
}: Props) => {
  const [properties, setProperties] = useState([])
  const [sortKey, setSortKey] = useState(DEFAULT_SORT_KEY)
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER)
  const [activePage, setActivePage] = useState(1)
  const [count, setCount] = useState(0)
  const [isSearchInitialized, setIsSearchInitialized] = useState(false)
  const [maxPage, setMaxPage] = useState(0)
  const [selectedStates, setSelectedStates] = useState(DEFAULT_AREA_SEARCH_STATES)
  const [visualizationType, setVisualizationType] = useState(VisualizationTypes.TABLE)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [editModalTargetAreaSearch, setEditModalTargetAreaSearch] = useState(null)
  const [hasFetchedAreaSearches, setHasFetchedAreaSearches] = useState(false)

  useEffect(() => {
    const searchQuery = getUrlParams(search);
    setPageTitle('Aluehaun hakemukset');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_SEARCH),
      pageTitle: 'Aluehaun hakemukset',
      showSearch: false
    });

    if (searchQuery.visualization === VisualizationTypes.MAP) {
      setVisualizationType(VisualizationTypes.MAP);
      searchByBBox();
    } else {
      searchFunc();
    }

    setSearchFormValues();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, [])

  const handleVisualizationTypeChange = (value: string) => {
    setVisualizationType(value);
  };
  
  useEffect(() => {
    const searchQuery = getUrlParams(search);

    if (visualizationType === VisualizationTypes.MAP) {
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
  }, [visualizationType])

  const handleAreaSearchStatesChange = (values: Array<string>) => {
    const searchQuery = getUrlParams(search);
    delete searchQuery.page;
    searchQuery.state = values;
    setSelectedStates(values);
    handleSearchChange(searchQuery, true);
  };

  const getColumns = () => {
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
        }} onBlur={(_, value) => updateAllSearchesSelected({ ...selectedSearches,
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
        <Button className={ButtonColors.LINK} onClick={() => openAreaSearchEditModal(row.id)} text={val || 'Avoin'} />
      </span>
    });
    columns.push({
      key: 'preparer',
      text: 'Käsittelijä',
      renderer: (val, row) => <span onMouseUp={e => e.stopPropagation()}>
        <Button className={ButtonColors.LINK} onClick={() => openAreaSearchEditModal(row.id)} text={getUserFullName(val) || 'Avoin'} />
      </span>
    });
    return columns;
  };

  const openAreaSearchEditModal = (id: number) => {
    setIsEditModalOpen(true),
    setEditModalTargetAreaSearch(id)
  };

  const closeAreaSearchEditModal = () => {
    setIsEditModalOpen(false)
    setEditModalTargetAreaSearch(null)
  };

  const openExportModal = () => {
    setIsExportModalOpen(true)
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false)
  };

  const submitAreaSearchEditModal = (data: Record<string, any>) => {
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

  const searchFunc = () => {
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

  const searchByBBox = () => {
    const searchQuery = getUrlParams(search);
    const leaseStates = getSearchStates(searchQuery);

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

  const handleRowClick = id => {
    return history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}/${id}`,
      search: search
    });
  };

  const handleSortingChange = ({
    sortKey,
    sortOrder
  }) => {
    const searchQuery = getUrlParams(search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    setSortKey(sortKey)
    setSortOrder(sortOrder)
    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(searchQuery)
    });
  };

  const handlePageClick = (page: number) => {
    const query = getUrlParams(search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    setActivePage(page)

    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(query)
    });
  };

  const updateTableData = () => {
    setCount(getApiResponseCount(areaSearches))
    setMaxPage(getApiResponseMaxPage(areaSearches, LIST_TABLE_PAGE_SIZE))
    change('selectedSearches', {});
    change('allSelected', false);
  };

  const handleSearchChange = (query: Record<string, any>, resetActivePage: boolean = true) => {
    const urlQuery = getUrlParams(search);

    if (resetActivePage) {
      setActivePage(1);
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

  useEffect(() => {
    const handleSearch = () => {
      setSearchFormValues();
      searchFunc();
    };
    
    if (userActiveServiceUnit) {
      if (!hasFetchedAreaSearches) {
        // No search has been done yet
        handleSearch();
        setHasFetchedAreaSearches(true);
      } else if (!search.includes('service_unit')) {
        // Search again after changing user active service unit only if not explicitly setting the service unit filter
        handleSearch();
      }
    }
  }, [userActiveServiceUnit])

  useEffect(() => {
    const searchQuery = getUrlParams(search);
    
    if (!isEditingAreaSearch && !lastEditError) {
      closeAreaSearchEditModal();
      
      switch (visualizationType) {
        case VisualizationTypes.MAP:
          searchByBBox();
          break;

        case VisualizationTypes.TABLE:
          searchFunc();
          break;
      }

      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if (!Object.keys(searchQuery).length) {
        setSearchFormValues();
      }
    }
  }, [search])

  useEffect(() => {
    updateTableData()
  }, [areaSearches])

  const handlePopState = () => {
    setSearchFormValues();
  };

  const handleMapViewportChanged = debounce((mapOptions: Record<string, any>) => {
    const searchQuery = getUrlParams(search);
    searchQuery.in_bbox = mapOptions.bBox.split(',');
    searchQuery.zoom = mapOptions.zoom;
    return history.push({
      pathname: getRouteById(Routes.AREA_SEARCH),
      search: getSearchQuery(searchQuery)
    });
  }, 1000);

  const getSearchStates = (query: Record<string, any>) => {
    if (isArray(query.state)) {
      return query.state;
    }

    if (query.state) {
      return [query.state];
    }

    return query.search || query?.state ? [] : DEFAULT_AREA_SEARCH_STATES;
  };
  const setSearchFormValues = () => {
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    const states = getSearchStates(searchQuery);

    const setSearchFormReady = () => {
      setIsSearchInitialized(true)
    };

    setActivePage(page)
    setIsSearchInitialized(false)
    setSelectedStates(states)
  };
      
  useEffect(() => {
    const initialValues = { ...searchQuery };
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
  
    initializeForm(FormNames.AREA_SEARCH_SEARCH, initialValues);
  }, [setSearchFormValues])

  const openCreateAreaSearch = () => {
    history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}/uusi`
    });
  };
  const selectAllSearches = (event: React.FocusEvent<HTMLInputElement>, value: boolean) => {
    change('selectedSearches', areaSearches?.results.reduce((acc, result) => {
      acc[result.id] = value;
      return acc;
    }, {}));
  };

  const updateAllSearchesSelected = (selectedSearches: Record<string, any>) => {
    const isAllSelected = areaSearches?.results.every(search => selectedSearches[search.id] === true);
    change('allSelected', isAllSelected);
  };

    const searchQuery = getUrlParams(search);
    const columns = getColumns();
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

    if (!selectedSearches) {
      return <Loader isLoading={true} />;
    }

    return <PageContainer className="AreaSearchApplicationListPage">
        <Row>
          <Column small={12} medium={4} large={4}>
            <Authorization allow={isMethodAllowed(areaSearchListMethods, Methods.POST)}>
              <AddButtonSecondary className='no-top-margin' label='Luo aluehakemus' onClick={openCreateAreaSearch} />
            </Authorization>
          </Column>
          <Column small={12} medium={8} large={8}>
            {/**@ts-ignore */}
            <Search isSearchInitialized={isSearchInitialized} onSearch={handleSearchChange} states={selectedStates} handleSubmit={() => {}} />
          </Column>
        </Row>

        {<TableFilterWrapper filterComponent={<TableFilters amountText={amountText} filterOptions={stateOptions} filterValue={selectedStates} onFilterChange={handleAreaSearchStatesChange} />} visualizationComponent={<VisualisationTypeWrapper>
              {<IconRadioButtons legend={'Kartta/taulukko'} onChange={handleVisualizationTypeChange} options={visualizationTypeOptions} radioName='visualization-type-radio' value={visualizationType} />}
            </VisualisationTypeWrapper>} />}
        <TableWrapper>
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>}
          {visualizationType === 'table' && <Fragment>
              <SortableTable columns={columns} data={areaSearches?.results || []} listTable onRowClick={handleRowClick} onSortingChange={handleSortingChange} serverSideSorting showCollapseArrowColumn sortable sortKey={sortKey} sortOrder={sortOrder} footer={({
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
              }} onBlur={selectAllSearches} onChange={selectAllSearches} />
                  </td>
                </tr>} />

              <Pagination activePage={activePage} maxPage={maxPage} onPageClick={page => handlePageClick(page)} />
            </Fragment>}
          {visualizationType === 'map' && <AreaSearchListMap allowToEdit={false} isLoading={isFetchingByBBox} onViewportChanged={handleMapViewportChanged} />}
        </TableWrapper>
        <Button onClick={openExportModal} text="Tulosta" disabled={selectedSearches?.length === 0} />
        <EditAreaSearchPreparerModal isOpen={isEditModalOpen} onClose={closeAreaSearchEditModal} onSubmit={submitAreaSearchEditModal} areaSearchId={editModalTargetAreaSearch} />
        <AreaSearchExportModal isOpen={isExportModalOpen} onClose={closeExportModal} />
      </PageContainer>;
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