import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { Field, Form } from "react-final-form";
import debounce from "lodash/debounce";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import SearchRow from "@/components/search/SearchRow";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import CreateLeaseModal from "./createLease/CreateLeaseModal";
import LeaseListMap from "@/leases/components/leaseSections/map/LeaseListMap";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainerHDS from "@/components/content/PageContainerHDS";
import Search from "./search/Search";
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
import { Methods, PermissionMissingTexts } from "@/enums";
import {
  LeaseAreasFieldPaths,
  LeaseAreaAddressesFieldPaths,
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeaseTenantsFieldPaths,
  LeaseAreasFieldTitles,
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
import type { Option } from "@/components/multi-select/SelectItem";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  IconAngleDown,
  IconAngleUp,
  IconMap,
  IconScrollContent,
  Link,
  Pagination,
  Select,
  Table,
  type TableProps,
  Tabs,
} from "hds-react";
import MultiItemCollapse from "@/components/table/MultiItemCollapse";

const VisualizationTypes = {
  MAP: "map",
  TABLE: "table",
};

const LeaseListPage: React.FC = () => {
  const hasFetchedLeases = useRef(false); // Check if search has been done yet
  const previousSortRef = useRef<{ sortKey: string; sortOrder: string } | null>(
    null,
  );
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchInitialized, setIsSearchInitialized] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [visualizationType, setVisualizationType] = useState(
    VisualizationTypes.TABLE,
  );

  const queryParams = useMemo(
    () => getUrlParams(location.search),
    [location.search],
  );
  const sortKey = queryParams.sort_key || DEFAULT_SORT_KEY;
  const sortOrder = queryParams.sort_order || DEFAULT_SORT_ORDER;
  const activePage = queryParams.page ? Number(queryParams.page) : 1;

  const getOnlyActiveLeasesValue = (query: Record<string, any>) => {
    return query.only_active_leases != undefined
      ? query.only_active_leases
      : query.search
        ? undefined
        : DEFAULT_ONLY_ACTIVE_LEASES;
  };

  const getLeaseStates = (query: Record<string, any>) => {
    return isArray(query.lease_state)
      ? query.lease_state
      : query.lease_state
        ? [query.lease_state]
        : query.search || "lease_state" in query
          ? []
          : DEFAULT_LEASE_STATES;
  };

  const initialValues = useMemo(() => {
    const values: any = { ...queryParams };

    const tenantContactTypes = [queryParams.tenantcontact_type].flatMap(
      (value) => value || [],
    );
    const serviceUnits = [queryParams.service_unit].flatMap(
      (value) => value || [],
    );

    if (tenantContactTypes.length) {
      values.tenantcontact_type = tenantContactTypes;
    }
    if (serviceUnits.length) {
      values.service_unit = serviceUnits;
    }

    values.lease_state = getLeaseStates(queryParams);

    delete values.page;
    delete values.sort_key;
    delete values.sort_order;
    delete values.in_bbox;
    delete values.visualization;
    delete values.zoom;

    return values;
  }, [queryParams]);

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

  const debouncedFetchLeases = useMemo(
    () =>
      debounce((searchQuery: Record<string, any>) => {
        dispatch(fetchLeases(mapLeaseSearchFilters(searchQuery)));
      }, 1000),
    [dispatch],
  );

  const debouncedFetchLeasesByBBox = useMemo(
    () =>
      debounce((searchQuery: Record<string, any>) => {
        dispatch(fetchLeasesByBBox(mapLeaseSearchFilters(searchQuery)));
      }, 1000),
    [dispatch],
  );

  useEffect(() => {
    return () => {
      debouncedFetchLeases.cancel();
      debouncedFetchLeasesByBBox.cancel();
    };
  }, [debouncedFetchLeases, debouncedFetchLeasesByBBox]);

  useEffect(() => {
    const searchQuery = getUrlParams(location.search);
    const currentSort = {
      sortKey: searchQuery.sort_key || DEFAULT_SORT_KEY,
      sortOrder: searchQuery.sort_order || DEFAULT_SORT_ORDER,
    };
    const isSortChanged =
      !!previousSortRef.current &&
      (previousSortRef.current.sortKey !== currentSort.sortKey ||
        previousSortRef.current.sortOrder !== currentSort.sortOrder);

    previousSortRef.current = currentSort;

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

    const search = (isImmediate: boolean = false) => {
      const searchQuery = { ...queryParams };
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

      if (isImmediate) {
        dispatch(fetchLeases(mapLeaseSearchFilters(searchQuery)));
      } else {
        debouncedFetchLeases(searchQuery);
      }
    };

    const searchByBBox = (isImmediate: boolean = false) => {
      const searchQuery = { ...queryParams };
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

      if (isImmediate) {
        dispatch(fetchLeasesByBBox(mapLeaseSearchFilters(searchQuery)));
      } else {
        debouncedFetchLeasesByBBox(searchQuery);
      }
    };

    const setSearchFormValues = () => {
      setIsSearchInitialized(false);
      setIsSearchInitialized(true);
    };

    const searchByType = () => {
      const currentVisualizationType =
        queryParams.visualization === VisualizationTypes.MAP
          ? VisualizationTypes.MAP
          : VisualizationTypes.TABLE;

      setSearchFormValues();

      switch (currentVisualizationType) {
        case VisualizationTypes.MAP:
          searchByBBox();
          break;

        case VisualizationTypes.TABLE:
          search(isSortChanged);
          break;
      }
    };

    const initializeSearch = () => {
      setSearchFormValues();
      if (queryParams.visualization === VisualizationTypes.MAP) {
        setVisualizationType(VisualizationTypes.MAP);
        searchByBBox(true);
      } else {
        search(true);
      }
    };

    if (!hasFetchedLeases.current) {
      // No search has been done yet
      initializeSearch();
      hasFetchedLeases.current = true;
      return;
    }

    searchByType();
  }, [
    dispatch,
    location.search,
    navigate,
    userServiceUnits,
    debouncedFetchLeases,
    debouncedFetchLeasesByBBox,
    queryParams,
  ]);

  const serviceUnitOptions: Array<Option> = useMemo(
    () => getFieldOptions(leaseAttributes, "service_unit", false),
    [leaseAttributes],
  );

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
      delete searchQuery.page;
    }

    if (resetFilters) {
      delete searchQuery.lease_state;
    }

    const nextSearch = getSearchQuery(searchQuery);
    if (nextSearch === location.search) {
      return;
    }

    return navigate({
      pathname: getRouteById(Routes.LEASES),
      search: nextSearch,
    });
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

    return navigate({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };

  const renderClickableCell = (
    content: React.ReactNode,
    rowId: number | string,
  ) => {
    return (
      <button
        className="lease-list-row-link"
        type="button"
        onClick={() => handleRowClick(rowId)}
      >
        {content}
      </button>
    );
  };

  const getLeaseDetailsHref = (rowId: number | string) => {
    const search = location.search || "";
    return `${getRouteById(Routes.LEASES)}/${rowId}${search}`;
  };

  const hasRowMultipleValues = (row: Record<string, any>): boolean => {
    const getValueCount = (value: unknown): number => {
      if (!isArray(value)) {
        return 0;
      }

      return value.reduce(
        (count, item) => count + (isArray(item) ? item.length : 1),
        0,
      );
    };

    return ["lease_area_identifiers", "addresses", "tenants"].some(
      (key) => getValueCount(row[key]) > 1,
    );
  };

  const toggleRowExpanded = (rowId: number | string) => {
    const rowKey = String(rowId);
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const renderExpandToggle = (row: Record<string, any>) => {
    if (!hasRowMultipleValues(row)) {
      return null;
    }

    const isExpanded = !!expandedRows[String(row.id)];

    return (
      <Button
        className="lease-list-expand-button"
        aria-label={
          isExpanded ? "Piilota rivin lisätiedot" : "Näytä rivin lisätiedot"
        }
        aria-expanded={isExpanded}
        variant={ButtonVariant.Supplementary}
        size={ButtonSize.Small}
        onClick={() => {
          toggleRowExpanded(row.id);
        }}
        iconStart={isExpanded ? <IconAngleUp /> : <IconAngleDown />}
      >
        &nbsp;
      </Button>
    );
  };

  const getColumns = () => {
    const stateOptions = getFieldOptions(
      leaseAttributes,
      LeaseFieldPaths.STATE,
      false,
    );
    const columns: TableProps["cols"] = [];

    const renderAddressValues = (value: unknown) => {
      if (!isArray(value)) {
        return value;
      }

      return (
        <>
          {value.map((item, index) => (
            <React.Fragment key={`${String(item)}-${index}`}>
              {item}
              {index < value.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    };

    const getCollapseItems = (
      columnKey: string,
      rawValue: unknown,
    ): unknown => {
      // MultiItemCollapse is used generically for any array value.
      // Only addresses need shape normalization because they may be nested
      // as grouped values per lease area.
      if (columnKey !== "addresses" || !isArray(rawValue)) {
        return rawValue;
      }

      const grouped = rawValue
        .filter((group) => isArray(group))
        .map((group) => group.filter((address) => !!address));

      if (!grouped.length) {
        return rawValue;
      }

      // Preserve area-level grouping when there are multiple areas,
      // but flatten a single area so each address can collapse individually.
      return grouped.length === 1 ? grouped[0] : grouped;
    };

    const renderColumnContent = (
      row: Record<string, any>,
      columnKey: string,
      valueTransform?: (
        value: unknown,
        rowData: Record<string, any>,
      ) => unknown,
    ) => {
      const rawValue = row[columnKey];
      const rowExpanded = !!expandedRows[String(row.id)];
      const collapseItems = getCollapseItems(columnKey, rawValue);

      if (isArray(collapseItems)) {
        return (
          <MultiItemCollapse
            items={collapseItems}
            itemRenderer={(value) => {
              const transformedValue = valueTransform
                ? valueTransform(value, row)
                : value;
              return transformedValue || "-";
            }}
            open={rowExpanded}
            useTagForCount
          />
        );
      }

      const transformedValue = valueTransform
        ? valueTransform(rawValue, row)
        : rawValue;
      return transformedValue || "-";
    };

    columns.push({
      key: "_expand",
      headerName: "",
      isSortable: false,
      transform: (row: Record<string, any>) => renderExpandToggle(row),
    });

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.IDENTIFIER)) {
      columns.push({
        key: "identifier",
        headerName: LeaseFieldTitles.IDENTIFIER_SHORT,
        isSortable: true,
        transform: (row: Record<string, any>) => (
          <Link
            href={getLeaseDetailsHref(row.id)}
            className="lease-list-identifier-link"
          >
            {row.identifier}
          </Link>
        ),
      });
    }

    if (
      isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.IDENTIFIER)
    ) {
      columns.push({
        key: "lease_area_identifiers",
        headerName: LeaseAreasFieldTitles.LEASE_AREAS_SHORT,
        isSortable: false,
        transform: (row: Record<string, any>) =>
          renderClickableCell(
            renderColumnContent(row, "lease_area_identifiers"),
            row.id,
          ),
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
        headerName: LeaseFieldTitles.ADDRESS,
        isSortable: false,
        transform: (row: Record<string, any>) =>
          renderClickableCell(
            renderColumnContent(row, "addresses", (value) =>
              renderAddressValues(value),
            ),
            row.id,
          ),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)) {
      columns.push({
        key: "tenants",
        headerName: LeaseFieldTitles.TENANT,
        isSortable: false,
        transform: (row: Record<string, any>) =>
          renderClickableCell(renderColumnContent(row, "tenants"), row.id),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.LESSOR)) {
      columns.push({
        key: "lessor",
        headerName: LeaseFieldTitles.LESSOR,
        isSortable: true,
        transform: (row: Record<string, any>) =>
          renderClickableCell(renderColumnContent(row, "lessor"), row.id),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.STATE)) {
      columns.push({
        key: "state",
        headerName: LeaseFieldTitles.STATE,
        isSortable: true,
        transform: (row: Record<string, any>) =>
          renderClickableCell(
            renderColumnContent(row, "state", (value) =>
              getLabelOfOption(stateOptions, value),
            ),
            row.id,
          ),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.START_DATE)) {
      columns.push({
        key: "start_date",
        headerName: LeaseFieldTitles.START_DATE,
        isSortable: true,
        transform: (row: Record<string, any>) =>
          renderClickableCell(
            renderColumnContent(row, "start_date", (value) =>
              formatDate(value),
            ),
            row.id,
          ),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.END_DATE)) {
      columns.push({
        key: "end_date",
        headerName: LeaseFieldTitles.END_DATE,
        isSortable: true,
        transform: (row: Record<string, any>) =>
          renderClickableCell(
            renderColumnContent(row, "end_date", (value) => formatDate(value)),
            row.id,
          ),
      });
    }

    return columns;
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
  const handleSortingChange = (
    order: "asc" | "desc",
    colKey: string,
    handleSort: () => void,
  ): void => {
    const searchQuery = getUrlParams(location.search);

    handleSort();

    searchQuery.sort_key = colKey;
    searchQuery.sort_order = order;
    delete searchQuery.page;

    return navigate({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };

  const handleMapViewportChanged = useMemo(
    () =>
      debounce((mapOptions: Record<string, any>) => {
        const searchQuery = getUrlParams(location.search);
        searchQuery.in_bbox = mapOptions.bBox.split(",");
        searchQuery.zoom = mapOptions.zoom;
        return navigate({
          pathname: getRouteById(Routes.LEASES),
          search: getSearchQuery(searchQuery),
        });
      }, 1000),
    [location.search, navigate],
  );

  useEffect(() => {
    return () => {
      handleMapViewportChanged.cancel();
    };
  }, [handleMapViewportChanged]);

  const leaseList = getContentLeaseListResults(leases, queryParams);
  const count = getApiResponseCount(leases);
  const maxPage = getApiResponseMaxPage(leases, LIST_TABLE_PAGE_SIZE);
  const columns = getColumns();
  if (isFetchingLeaseAttributes)
    return (
      <PageContainerHDS>
        <Loader isLoading={true} />
      </PageContainerHDS>
    );
  if (!leaseMethods) return null;
  if (!isMethodAllowed(leaseMethods, Methods.GET))
    return (
      <PageContainerHDS>
        <AuthorizationError text={PermissionMissingTexts.LEASE} />
      </PageContainerHDS>
    );
  return (
    <Form
      initialValues={initialValues}
      onSubmit={(values) => handleSearchChange(values)}
      enableReinitialize
    >
      {() => (
        <PageContainerHDS>
          <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
            <CreateLeaseModal
              isOpen={isModalOpen}
              onClose={hideCreateLeaseModal}
              onSubmit={(data) => dispatch(createLease(data))}
            />
          </Authorization>
          <Row>
            <Column small={12} large={12}>
              <Search
                isSearchInitialized={isSearchInitialized}
                onSearch={handleSearchChange}
                showCreateLeaseModal={showCreateLeaseModal}
              />
            </Column>
          </Row>

          <SearchRow style={{ marginTop: "10px" }}>
            <Row className="lease-search-row__advanced">
              <Row className="lease-search-fieldset-group">
                <Field name="service_unit">
                  {({ input: { value, onChange } }) => {
                    const selectedOptions = serviceUnitOptions.filter(
                      (option) =>
                        (Array.isArray(value) ? value : [value]).some(
                          (v) => v == option.value,
                        ),
                    );
                    return (
                      <Select
                        id="service_unit"
                        texts={{
                          label: LeaseFieldTitles.SERVICE_UNIT,
                          placeholder: "Valitse palvelukokonaisuus",
                          language: "fi",
                        }}
                        value={selectedOptions}
                        options={serviceUnitOptions}
                        onChange={(selectedOptions) => {
                          const values = selectedOptions.map(
                            (option) => option.value,
                          );
                          onChange(values);
                        }}
                        style={{ width: "100%" }}
                        multiSelect
                      />
                    );
                  }}
                </Field>
                <Field name="lease_state">
                  {({ input: { value, onChange } }) => {
                    const selectedOptions = leaseStateFilterOptions.filter(
                      (option) =>
                        (Array.isArray(value) ? value : [value]).some(
                          (v) => v == option.value,
                        ),
                    );
                    return (
                      <Select
                        id="lease_state"
                        texts={{
                          label: "Tyyppi",
                          placeholder: "Valitse tyyppi",
                          language: "fi",
                        }}
                        value={selectedOptions}
                        options={leaseStateFilterOptions}
                        onChange={(selectedOptions) => {
                          const values = selectedOptions.map(
                            (option) => option.value,
                          );
                          onChange(values);
                        }}
                        style={{ width: "100%" }}
                        multiSelect
                      />
                    );
                  }}
                </Field>
              </Row>
            </Row>
          </SearchRow>
          <Tabs
            initiallyActiveTab={
              visualizationType === VisualizationTypes.MAP ? 1 : 0
            }
          >
            <Tabs.TabList>
              <Tabs.Tab
                onClick={() =>
                  handleVisualizationTypeChange(VisualizationTypes.TABLE)
                }
              >
                <span>
                  <IconScrollContent />
                  &nbsp;Taulukko
                </span>
              </Tabs.Tab>
              <Tabs.Tab
                onClick={() =>
                  handleVisualizationTypeChange(VisualizationTypes.MAP)
                }
              >
                <span>
                  <IconMap />
                  &nbsp;Kartta
                </span>
              </Tabs.Tab>
            </Tabs.TabList>
            <Tabs.TabPanel>
              <>
                {isFetching && (
                  <LoaderWrapper className="relative-overlay-wrapper">
                    <Loader isLoading={true} />
                  </LoaderWrapper>
                )}
                <span>
                  {isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
                </span>
                <Table
                  ariaLabelSortButtonUnset="Not sorted"
                  ariaLabelSortButtonAscending="Sorted in ascending order"
                  ariaLabelSortButtonDescending="Sorted in descending order"
                  id="lease-list-table"
                  indexKey="id"
                  renderIndexCol={false}
                  cols={columns}
                  rows={leaseList}
                  onSort={handleSortingChange}
                  initialSortingColumnKey={sortKey}
                  initialSortingOrder={sortOrder as "asc" | "desc"}
                  key={`${sortKey}-${sortOrder}`}
                  dense
                />
                <Pagination
                  language="fi"
                  onChange={(event, index) => {
                    event.preventDefault();
                    handlePageClick(index + 1);
                  }}
                  pageCount={maxPage || 1}
                  pageHref={() => "#"}
                  pageIndex={activePage - 1}
                  paginationAriaLabel={`Sivuvalitsin, ${activePage} / ${maxPage}`}
                  siblingCount={5}
                />
              </>
            </Tabs.TabPanel>
            <Tabs.TabPanel>
              <LeaseListMap
                allowToEdit={false}
                isLoading={isFetchingByBBox}
                onViewportChanged={handleMapViewportChanged}
              />
            </Tabs.TabPanel>
          </Tabs>
        </PageContainerHDS>
      )}
    </Form>
  );
};

export default LeaseListPage;
