import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialize } from "redux-form";
import { Row, Column } from "@/components/grid/Grid";
import debounce from "lodash/debounce";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import CreateLeaseModal from "./createLease/CreateLeaseModal";
import IconRadioButtons from "@/components/button/IconRadioButtons";
import LeaseListMap from "@/leases/components/leaseSections/map/LeaseListMap";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import MapIcon from "@/components/icons/MapIcon";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "./search/Search";
import SortableTable from "@/components/table/SortableTable";
import TableFilters from "@/components/table/TableFilters";
import TableIcon from "@/components/icons/TableIcon";
import TableFilterWrapper from "@/components/table/TableFilterWrapper";
import TableWrapper from "@/components/table/TableWrapper";
import VisualisationTypeWrapper from "@/components/table/VisualisationTypeWrapper";
import { fetchAreaNoteList } from "@/areaNote/actions";
import { fetchServiceUnits } from "@/serviceUnits/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import {
  createLease,
  fetchLeases,
  fetchLeasesByBBox,
  fetchAttributes as fetchLeaseAttributes,
} from "@/leases/actions";
import { fetchLessors } from "@/lessor/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import {
  DEFAULT_LEASE_STATES,
  DEFAULT_ONLY_ACTIVE_LEASES,
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  MAX_ZOOM_LEVEL_TO_FETCH_LEASES,
  BOUNDING_BOX_FOR_SEARCH_QUERY,
  leaseStateFilterOptions,
} from "@/leases/constants";
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
import {
  LeaseAreasFieldPaths,
  LeaseAreaAddressesFieldPaths,
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeaseTenantsFieldPaths,
} from "@/leases/enums";
import {
  getContentLeaseListResults,
  mapLeaseSearchFilters,
} from "@/leases/helpers";
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
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getIsFetching,
  getIsFetchingByBBox,
  getLeasesList,
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseAttributes,
  getMethods as getLeaseMethods,
} from "@/leases/selectors";
import { getLessorList } from "@/lessor/selectors";
import { getUserServiceUnits } from "@/usersPermissions/selectors";
import {
  getServiceUnits,
  getIsFetching as getIsFetchingServiceUnits,
} from "@/serviceUnits/selectors";
import type { Attributes } from "types";
import { ButtonLabels } from "@/components/enums";
import {
  getAttributes as getUiDataAttributes,
  getIsFetching as getIsFetchingUiData,
  getIsFetchingAttributes as getIsFetchingUiDataAttributes,
  getMethods as getUiDataMethods,
  getUiDataList,
} from "@/uiData/selectors";
import { useLocation, useNavigate } from "react-router";
import {
  fetchAttributes as fetchUiDataAttributes,
  fetchUiDataList,
} from "@/uiData/actions";
import FieldTypeMultiSelect from "@/components/form/final-form/FieldTypeMultiSelect";
import type { Option } from "@/components/multi-select/SelectItem";

const VisualizationTypes = {
  MAP: "map",
  TABLE: "table",
};
const visualizationTypeOptions = [
  {
    value: VisualizationTypes.TABLE,
    label: "Taulukko",
    icon: <TableIcon className="icon-medium" />,
  },
  {
    value: VisualizationTypes.MAP,
    label: "Kartta",
    icon: <MapIcon className="icon-medium" />,
  },
];

const LeaseListPage: React.FC = () => {
  const hasFetchedLeases = useRef(false); // Check if search has been done yet
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isFetching = useSelector(getIsFetching);
  const isFetchingByBBox = useSelector(getIsFetchingByBBox);
  const isFetchingServiceUnits = useSelector(getIsFetchingServiceUnits);
  const leases = useSelector(getLeasesList);
  const lessors = useSelector(getLessorList);
  const serviceUnits = useSelector(getServiceUnits);
  const userServiceUnits = useSelector(getUserServiceUnits);

  const isFetchingLeaseAttributes = useSelector(getIsFetchingLeaseAttributes);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const leaseMethods = useSelector(getLeaseMethods);

  const isFetchingUiDataAttributes = useSelector(getIsFetchingUiDataAttributes);
  const isFetchingUiDataList = useSelector(getIsFetchingUiData);
  const uiDataAttributes = useSelector(getUiDataAttributes);
  const uiDataList = useSelector(getUiDataList);
  const uiDataMethods = useSelector(getUiDataMethods);

  const [activePage, setActivePage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaseStates, setLeaseStates] =
    useState<Array<string>>(DEFAULT_LEASE_STATES);
  const [isSearchInitialized, setIsSearchInitialized] = useState(false);
  const [sortKey, setSortKey] = useState(DEFAULT_SORT_KEY);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER);
  const [visualizationType, setVisualizationType] = useState(
    VisualizationTypes.TABLE,
  );
  const [serviceUnitOptions, setServiceUnitOptions] = useState<Array<Option>>(
    [],
  );
  const [selectedServiceUnitOptionValues, setSelectedServiceUnitOptionValues] =
    useState<Array<string | number>>([]);

  useEffect(() => {
    setPageTitle("Vuokraukset");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.LEASES),
        pageTitle: "Vuokraukset",
        showSearch: false,
      }),
    );

    if (!isFetchingServiceUnits && isEmpty(serviceUnits)) {
      dispatch(fetchServiceUnits());
    }

    dispatch(
      fetchAreaNoteList({
        limit: 10000,
      }),
    );

    if (isEmpty(lessors)) {
      dispatch(
        fetchLessors({
          limit: 10000,
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFetchingUiDataAttributes && !uiDataAttributes && !uiDataMethods) {
      dispatch(fetchUiDataAttributes());
    }

    if (!isFetchingUiDataList && isEmpty(uiDataList)) {
      dispatch(
        fetchUiDataList({
          limit: 100000,
        }),
      );
    }
  }, [
    dispatch,
    isFetchingUiDataAttributes,
    isFetchingUiDataList,
    uiDataAttributes,
    uiDataList,
    uiDataMethods,
  ]);

  useEffect(() => {
    if (!isFetchingLeaseAttributes && !leaseAttributes && !leaseMethods) {
      dispatch(fetchLeaseAttributes());
    }
  }, [dispatch, isFetchingLeaseAttributes, leaseAttributes, leaseMethods]);

  useEffect(() => {
    const searchQuery = getUrlParams(location.search);
    if (!userServiceUnits || userServiceUnits.length === 0) {
      return;
    }

    // Update query on initialization to include user's service units
    if (
      searchQuery.service_unit === undefined &&
      userServiceUnits?.length > 0 &&
      !hasFetchedLeases.current
    ) {
      const updatedQuery = {
        ...searchQuery,
        service_unit: userServiceUnits.map((unit) => String(unit.id)),
      };
      navigate({
        pathname: getRouteById(Routes.LEASES),
        search: getSearchQuery(updatedQuery),
      });
      return;
    }

    if (searchQuery.visualization === VisualizationTypes.MAP) {
      setVisualizationType(VisualizationTypes.MAP);
    } else {
      setVisualizationType(VisualizationTypes.TABLE);
    }

    const search = () => {
      const searchQuery = getUrlParams(location.search);
      const page = searchQuery.page ? Number(searchQuery.page) : 1;
      const leaseStates = getLeaseStates(searchQuery);
      const onlyActiveLeases = getOnlyActiveLeasesValue(searchQuery);

      if (page > 1) {
        searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
      }

      if (onlyActiveLeases != undefined) {
        searchQuery.only_active_leases = onlyActiveLeases;
      }

      if (leaseStates.length) {
        searchQuery.lease_state = leaseStates;
      }

      searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
      searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;

      if (searchQuery.service_unit === undefined) {
        searchQuery.service_unit = "";
      }

      searchQuery.limit = LIST_TABLE_PAGE_SIZE;
      delete searchQuery.page;
      delete searchQuery.in_bbox;
      delete searchQuery.visualization;
      delete searchQuery.zoom;
      dispatch(fetchLeases(mapLeaseSearchFilters(searchQuery)));
    };

    const searchByBBox = () => {
      const searchQuery = getUrlParams(location.search);
      const leaseStates = getLeaseStates(searchQuery);
      const onlyActiveLeases = getOnlyActiveLeasesValue(searchQuery);

      if (searchQuery && searchQuery.search && searchQuery.search.length > 6) {
        searchQuery.in_bbox = BOUNDING_BOX_FOR_SEARCH_QUERY;
      } else if (
        !searchQuery.zoom ||
        searchQuery.zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES
      )
        return;

      if (onlyActiveLeases != undefined) {
        searchQuery.only_active_leases = onlyActiveLeases;
      }

      if (leaseStates.length) {
        searchQuery.lease_state = leaseStates;
      }

      if (searchQuery.service_unit === undefined) {
        searchQuery.service_unit = "";
      }

      searchQuery.limit = 10000;
      delete searchQuery.page;
      delete searchQuery.visualization;
      delete searchQuery.zoom;
      delete searchQuery.sort_key;
      delete searchQuery.sort_order;
      dispatch(fetchLeasesByBBox(mapLeaseSearchFilters(searchQuery)));
    };

    const setSearchFormValues = () => {
      const searchQuery = getUrlParams(location.search);
      const page = searchQuery.page ? Number(searchQuery.page) : 1;
      const states = getLeaseStates(searchQuery);

      const initializeSearchForm = () => {
        const initialValues = { ...searchQuery };
        const onlyActiveLeases = getOnlyActiveLeasesValue(searchQuery);
        const tenantContactTypes = [searchQuery.tenantcontact_type].flatMap(
          (value) => value || [],
        );

        if (searchQuery.service_unit) {
          setSelectedServiceUnitOptionValues(
            [searchQuery.service_unit]
              .flatMap((unit) => unit ?? [])
              .map(Number),
          );
        }

        if (onlyActiveLeases != undefined) {
          initialValues.only_active_leases = onlyActiveLeases;
        }

        if (tenantContactTypes.length) {
          initialValues.tenantcontact_type = tenantContactTypes;
        }

        delete initialValues.page;
        delete initialValues.lease_state;
        delete initialValues.sort_key;
        delete initialValues.sort_order;
        delete initialValues.in_bbox;
        delete initialValues.visualization;
        delete initialValues.zoom;
        dispatch(initialize(FormNames.LEASE_SEARCH, initialValues));
      };

      setActivePage(page);
      setIsSearchInitialized(false);
      setLeaseStates(states);
      setSortKey(
        searchQuery.sort_key ? searchQuery.sort_key : DEFAULT_SORT_KEY,
      );
      setSortOrder(
        searchQuery.sort_order ? searchQuery.sort_order : DEFAULT_SORT_ORDER,
      );

      initializeSearchForm();
      setIsSearchInitialized(true);
    };

    const searchByType = () => {
      const searchQuery = getUrlParams(location.search);
      const currentVisualizationType =
        searchQuery.visualization === VisualizationTypes.MAP
          ? VisualizationTypes.MAP
          : VisualizationTypes.TABLE;

      setSearchFormValues();

      switch (currentVisualizationType) {
        case VisualizationTypes.MAP:
          searchByBBox();
          break;

        case VisualizationTypes.TABLE:
          search();
          break;
      }
    };

    const initializeSearch = () => {
      const searchQuery = getUrlParams(location.search);

      setSearchFormValues();
      if (searchQuery.visualization === VisualizationTypes.MAP) {
        setVisualizationType(VisualizationTypes.MAP);
        searchByBBox();
      } else {
        search();
      }
    };

    if (!hasFetchedLeases.current) {
      // No search has been done yet
      initializeSearch();
      hasFetchedLeases.current = true;
      return;
    }

    searchByType();
  }, [dispatch, location.search, navigate, userServiceUnits]);

  useEffect(() => {
    // Update service unit options if they have changed
    if (
      leaseAttributes?.service_unit &&
      leaseAttributes?.service_unit?.choices.length !==
        serviceUnitOptions.length
    ) {
      setServiceUnitOptions(
        getFieldOptions(leaseAttributes, "service_unit", false),
      );
    }
  }, [leaseAttributes, serviceUnitOptions.length]);

  const getLeaseStates = (query: Record<string, any>) => {
    return isArray(query.lease_state)
      ? query.lease_state
      : query.lease_state
        ? [query.lease_state]
        : query.search || Object.hasOwn(query, "lease_state")
          ? []
          : DEFAULT_LEASE_STATES;
  };

  const getOnlyActiveLeasesValue = (query: Record<string, any>) => {
    return query.only_active_leases != undefined
      ? query.only_active_leases
      : query.search
        ? undefined
        : DEFAULT_ONLY_ACTIVE_LEASES;
  };

  const showCreateLeaseModal = () => {
    setIsModalOpen(true);
  };

  const hideCreateLeaseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (
    formValues: Record<string, any>,
    resetActivePage: boolean = false,
    resetFilters: boolean = false,
  ) => {
    const query = getUrlParams(location.search);
    const searchQuery = { ...formValues };

    if (query.lease_state && !formValues.lease_state) {
      searchQuery.lease_state = query.lease_state;
    }

    if (query.sort_key) {
      searchQuery.sort_key = query.sort_key;
    }

    if (query.sort_order) {
      searchQuery.sort_order = query.sort_order;
    }

    if (query.in_bbox) {
      searchQuery.in_bbox = query.in_bbox;
    }

    if (query.zoom) {
      searchQuery.zoom = query.zoom;
    }

    if (query.visualization) {
      searchQuery.visualization = query.visualization;
    }

    if (resetActivePage) {
      setActivePage(1);
      delete searchQuery.page;
    }

    if (resetFilters) {
      setLeaseStates(DEFAULT_LEASE_STATES);
      delete searchQuery.lease_state;
    }

    return navigate({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };

  const debouncedServiceUnitSearch = useRef(
    debounce(
      (
        values: Array<string | number>,
        handleSearchChange: (query: Record<string, any>) => void,
        locationSearch: string,
      ) => {
        // get other form values from query params
        const searchQuery = getUrlParams(locationSearch);
        handleSearchChange(
          Object.assign(searchQuery, { service_unit: values }),
        );
      },
      500,
    ),
  ).current;

  const handleServiceUnitChange = (values: Array<string | number>) => {
    setSelectedServiceUnitOptionValues(values);
    debouncedServiceUnitSearch(values, handleSearchChange, location.search);
  };

  const handleRowClick = (id) => {
    return navigate({
      pathname: `${getRouteById(Routes.LEASES)}/${id}`,
      search: location.search,
    });
  };

  const handlePageClick = (page: number) => {
    const searchQuery = getUrlParams(location.search);
    if (page > 1) {
      searchQuery.page = page;
    } else {
      delete searchQuery.page;
    }

    setActivePage(page);
    return navigate({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };

  const getColumns = () => {
    const stateOptions = getFieldOptions(
      leaseAttributes,
      LeaseFieldPaths.STATE,
      false,
    );
    const columns = [];

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.IDENTIFIER)) {
      columns.push({
        key: "identifier",
        text: LeaseFieldTitles.IDENTIFIER,
      });
    }

    if (
      isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.IDENTIFIER)
    ) {
      columns.push({
        key: "lease_area_identifiers",
        text: "Vuokrakohde",
        sortable: false,
      });
    }

    if (
      isFieldAllowedToRead(
        leaseAttributes,
        LeaseAreaAddressesFieldPaths.ADDRESSES,
      )
    ) {
      columns.push({
        key: "addresses",
        text: "Osoite",
        sortable: false,
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)) {
      columns.push({
        key: "tenants",
        text: "Vuokralainen",
        sortable: false,
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.LESSOR)) {
      columns.push({
        key: "lessor",
        text: "Vuokranantaja",
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.STATE)) {
      columns.push({
        key: "state",
        text: "Tyyppi",
        renderer: (val) => getLabelOfOption(stateOptions, val),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.START_DATE)) {
      columns.push({
        key: "start_date",
        text: "Alkupvm",
        renderer: (val) => formatDate(val),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.END_DATE)) {
      columns.push({
        key: "end_date",
        text: "Loppupvm",
        renderer: (val) => formatDate(val),
      });
    }

    return columns;
  };

  const handleLeaseStatesChange = (values: Array<string>) => {
    const searchQuery = getUrlParams(location.search);
    delete searchQuery.page;
    searchQuery.lease_state = values;
    setLeaseStates(values);
    handleSearchChange(searchQuery, true);
  };

  const handleVisualizationTypeChange = (value: string) => {
    const searchQuery = getUrlParams(location.search);
    setVisualizationType(value);

    if (value === VisualizationTypes.MAP) {
      searchQuery.visualization = VisualizationTypes.MAP;
    } else {
      delete searchQuery.visualization;
    }

    navigate({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };

  const handleSortingChange = ({ sortKey, sortOrder }) => {
    const searchQuery = getUrlParams(location.search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    setSortKey(sortKey);
    setSortOrder(sortOrder);
    return navigate({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };

  const handleMapViewportChanged = debounce(
    (mapOptions: Record<string, any>) => {
      const searchQuery = getUrlParams(location.search);
      searchQuery.in_bbox = mapOptions.bBox.split(",");
      searchQuery.zoom = mapOptions.zoom;
      return navigate({
        pathname: getRouteById(Routes.LEASES),
        search: getSearchQuery(searchQuery),
      });
    },
    1000,
  );
  const leaseList = getContentLeaseListResults(
    leases,
    getUrlParams(location.search),
  );
  const count = getApiResponseCount(leases);
  const maxPage = getApiResponseMaxPage(leases, LIST_TABLE_PAGE_SIZE);
  const columns = getColumns();
  if (isFetchingLeaseAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!leaseMethods) return null;
  if (!isMethodAllowed(leaseMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.LEASE} />
      </PageContainer>
    );
  const serviceUnitFilter = (
    <SearchRow>
      <SearchLabelColumn>
        <SearchLabel>{LeaseFieldTitles.SERVICE_UNIT}</SearchLabel>
      </SearchLabelColumn>
      <SearchInputColumn>
        <FieldTypeMultiSelect
          autoBlur={false}
          disabled={false}
          displayError={false}
          input={{
            name: "service_unit",
            onChange: handleServiceUnitChange,
            onBlur: () => {},
            onFocus: () => {},
            value: selectedServiceUnitOptionValues,
          }}
          isDirty={false}
          options={serviceUnitOptions}
          placeholder=""
          setRefForField={() => {}}
          meta={undefined}
        />
      </SearchInputColumn>
    </SearchRow>
  );
  return (
    <PageContainer>
      <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
        <CreateLeaseModal
          isOpen={isModalOpen}
          onClose={hideCreateLeaseModal}
          onSubmit={(data) => dispatch(createLease(data))}
        />
      </Authorization>
      <Row>
        <Column small={12} large={4}>
          <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
            <AddButtonSecondary
              className="no-top-margin"
              label={ButtonLabels.CREATE_LEASE_IDENTIFIER}
              onClick={showCreateLeaseModal}
            />
          </Authorization>
        </Column>
        <Column small={12} large={8}>
          <Search
            isSearchInitialized={isSearchInitialized}
            onSearch={handleSearchChange}
          />
        </Column>
      </Row>

      <TableFilterWrapper
        filterComponent={
          <TableFilters
            amountText={isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
            filterOptions={leaseStateFilterOptions}
            filterValue={leaseStates}
            onFilterChange={handleLeaseStatesChange}
            componentToRenderUnderTitle={serviceUnitFilter}
          />
        }
        visualizationComponent={
          <VisualisationTypeWrapper>
            <IconRadioButtons
              legend={"Kartta/taulukko"}
              onChange={handleVisualizationTypeChange}
              options={visualizationTypeOptions}
              radioName="visualization-type-radio"
              value={visualizationType}
            />
          </VisualisationTypeWrapper>
        }
      />

      <TableWrapper>
        {isFetching && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={true} />
          </LoaderWrapper>
        )}
        {visualizationType === "table" && (
          <>
            <SortableTable
              columns={columns}
              data={leaseList}
              listTable
              onRowClick={handleRowClick}
              onSortingChange={handleSortingChange}
              serverSideSorting
              showCollapseArrowColumn
              sortable
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
            <Pagination
              activePage={activePage}
              maxPage={maxPage}
              onPageClick={(page) => handlePageClick(page)}
            />
          </>
        )}
        {visualizationType === "map" && (
          <LeaseListMap
            allowToEdit={false}
            isLoading={isFetchingByBBox}
            onViewportChanged={handleMapViewportChanged}
          />
        )}
      </TableWrapper>
    </PageContainer>
  );
};

export default LeaseListPage;
