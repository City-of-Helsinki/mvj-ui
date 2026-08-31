import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Column } from "@/components/grid/Grid";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { useLocation, useNavigate } from "react-router";
import { isArray } from "lodash-es";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "@/infillDevelopment/components/search/Search";
import SortableTable from "@/components/table/SortableTable";
import TableFiltersLegacy from "@/components/table/TableFiltersLegacy";
import TableWrapper from "@/components/table/TableWrapper";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import {
  fetchAttributes as fetchInfillDevelopmentAttributes,
  fetchInfillDevelopments,
  receiveFormInitialValues,
} from "@/infillDevelopment/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
} from "@/infillDevelopment/constants";
import { Methods, PermissionMissingTexts } from "@/enums";
import {
  InfillDevelopmentCompensationFieldPaths,
  InfillDevelopmentCompensationLeasesFieldPaths,
} from "@/infillDevelopment/enums";
import {
  getContentInfillDevelopmentListResults,
  mapInfillDevelopmentSearchFilters,
} from "@/infillDevelopment/helpers";
import {
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
  getAttributes as getInfillDevelopmentAttributes,
  getInfillDevelopments,
  getIsFetching,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
  getMethods as getInfillDevelopmentMethods,
} from "@/infillDevelopment/selectors";

const InfillDevelopmentListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const infillDevelopmentAttributes = useAppSelector(
    getInfillDevelopmentAttributes,
  );
  const infillDevelopmentMethods = useAppSelector(getInfillDevelopmentMethods);
  const infillDevelopmentList = useAppSelector(getInfillDevelopments);
  const isFetching = useAppSelector(getIsFetching);
  const isFetchingInfillDevelopmentAttributes = useAppSelector(
    getIsFetchingInfillDevelopmentAttributes,
  );

  const searchQuery = useMemo(
    () => getUrlParams(location.search),
    [location.search],
  );

  const activePage = searchQuery.page ? Number(searchQuery.page) : 1;
  const sortKey = searchQuery.sort_key
    ? searchQuery.sort_key
    : DEFAULT_SORT_KEY;
  const sortOrder = searchQuery.sort_order
    ? searchQuery.sort_order
    : DEFAULT_SORT_ORDER;

  const [selectedStates, setSelectedStates] = useState<Array<string>>([]);

  useEffect(() => {
    const states = isArray(searchQuery.state)
      ? searchQuery.state
      : searchQuery.state
        ? [searchQuery.state]
        : [];
    setSelectedStates(states);
  }, [searchQuery.state]);

  const stateOptions = useMemo(() => {
    return getFieldOptions(
      infillDevelopmentAttributes,
      InfillDevelopmentCompensationFieldPaths.STATE,
      false,
    );
  }, [infillDevelopmentAttributes]);

  const searchInitialValues = useMemo(() => {
    const initialValues = { ...searchQuery };
    delete initialValues.page;
    delete initialValues.lease_state;
    delete initialValues.sort_key;
    delete initialValues.sort_order;
    return initialValues;
  }, [searchQuery]);

  const count = useMemo(
    () => getApiResponseCount(infillDevelopmentList),
    [infillDevelopmentList],
  );
  const infillDevelopments = useMemo(
    () => getContentInfillDevelopmentListResults(infillDevelopmentList),
    [infillDevelopmentList],
  );
  const maxPage = useMemo(
    () => getApiResponseMaxPage(infillDevelopmentList, LIST_TABLE_PAGE_SIZE),
    [infillDevelopmentList],
  );

  useEffect(() => {
    setPageTitle("Täydennysrakentamiskorvaukset");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
        pageTitle: "Täydennysrakentamiskorvaukset",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (!isFetchingInfillDevelopmentAttributes && !infillDevelopmentMethods) {
      dispatch(fetchInfillDevelopmentAttributes());
    }
  }, [
    dispatch,
    infillDevelopmentMethods,
    isFetchingInfillDevelopmentAttributes,
  ]);

  const search = useCallback(() => {
    const query = { ...searchQuery };
    const page = query.page ? Number(query.page) : 1;
    delete query.page;

    if (page > 1) {
      query.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    query.limit = LIST_TABLE_PAGE_SIZE;
    query.sort_key = query.sort_key || DEFAULT_SORT_KEY;
    query.sort_order = query.sort_order || DEFAULT_SORT_ORDER;
    dispatch(fetchInfillDevelopments(mapInfillDevelopmentSearchFilters(query)));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    search();
  }, [search]);

  const handleCreateButtonClick = useCallback(() => {
    dispatch(receiveFormInitialValues({}));
    return navigate({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENT_NEW),
      search: location.search,
    });
  }, [dispatch, location.search, navigate]);

  const handleSearchChange = useCallback(
    (
      query: Record<string, any>,
      resetActivePage: boolean = false,
      resetFilters: boolean = false,
    ) => {
      if (resetActivePage) {
        delete query.page;
      }

      if (resetFilters) {
        setSelectedStates([]);
      }

      return navigate({
        pathname: getRouteById(Routes.INFILL_DEVELOPMENTS),
        search: getSearchQuery(query),
      });
    },
    [navigate],
  );

  const handleRowClick = useCallback(
    (id: number) => {
      return navigate({
        pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${id}`,
        search: location.search,
      });
    },
    [location.search, navigate],
  );

  const handlePageClick = useCallback(
    (page: number) => {
      const query = getUrlParams(location.search);

      if (page > 1) {
        query.page = page;
      } else {
        query.page = undefined;
      }

      return navigate({
        pathname: getRouteById(Routes.INFILL_DEVELOPMENTS),
        search: getSearchQuery(query),
      });
    },
    [location.search, navigate],
  );

  const handleSelectedStatesChange = useCallback(
    (states: Array<string>) => {
      const query = getUrlParams(location.search);
      delete query.page;
      query.state = states;
      setSelectedStates(states);
      handleSearchChange(query, true);
    },
    [handleSearchChange, location.search],
  );

  const handleSortingChange = useCallback(
    ({ sortKey, sortOrder }) => {
      const query = getUrlParams(location.search);
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
      handleSearchChange(query);
    },
    [handleSearchChange, location.search],
  );

  const columns = useMemo(() => {
    const nextColumns = [];

    if (
      isFieldAllowedToRead(
        infillDevelopmentAttributes,
        InfillDevelopmentCompensationFieldPaths.NAME,
      )
    ) {
      nextColumns.push({
        key: "name",
        text: "Hankkeen nimi",
      });
    }

    if (
      isFieldAllowedToRead(
        infillDevelopmentAttributes,
        InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER,
      )
    ) {
      nextColumns.push({
        key: "detailed_plan_identifier",
        text: "Asemakaavan nro",
      });
    }

    if (
      isFieldAllowedToRead(
        infillDevelopmentAttributes,
        InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES,
      )
    ) {
      nextColumns.push({
        key: "leaseIdentifiers",
        text: "Vuokraustunnus",
        sortable: false,
      });
    }

    if (
      isFieldAllowedToRead(
        infillDevelopmentAttributes,
        InfillDevelopmentCompensationFieldPaths.STATE,
      )
    ) {
      nextColumns.push({
        key: "state",
        text: "Neuvotteluvaihe",
        renderer: (val) => getLabelOfOption(stateOptions, val) || "-",
      });
    }

    return nextColumns;
  }, [infillDevelopmentAttributes, stateOptions]);

  if (isFetchingInfillDevelopmentAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!infillDevelopmentMethods) return null;
  if (!isMethodAllowed(infillDevelopmentMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.INFILL_DEVELOPMENT} />
      </PageContainer>
    );

  return (
    <PageContainer>
      <Row>
        <Column small={12} large={4}>
          <Authorization
            allow={isMethodAllowed(infillDevelopmentMethods, Methods.POST)}
          >
            <AddButtonSecondary
              className="no-top-margin"
              label="Luo täydennysrakentamiskorvaus"
              onClick={handleCreateButtonClick}
            />
          </Authorization>
        </Column>
        <Column small={12} large={8}>
          <Search
            initialValues={searchInitialValues}
            onSearch={handleSearchChange}
            sortKey={sortKey}
            sortOrder={sortOrder}
            states={selectedStates}
          />
        </Column>
      </Row>

      <TableFiltersLegacy
        alignFiltersRight
        amountText={isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
        filterOptions={stateOptions}
        filterValue={selectedStates}
        onFilterChange={handleSelectedStatesChange}
      />

      <TableWrapper>
        {isFetching && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={isFetching} />
          </LoaderWrapper>
        )}
        <SortableTable
          columns={columns}
          data={infillDevelopments}
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
          onPageClick={handlePageClick}
        />
      </TableWrapper>
    </PageContainer>
  );
};

export default InfillDevelopmentListPage;
