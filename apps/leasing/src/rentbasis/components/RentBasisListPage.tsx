import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "final-form";
import { Form } from "react-final-form";
import { Row, Column } from "@/components/grid/Grid";
import { useLocation, useNavigate } from "react-router";
import { debounce, get } from "lodash-es";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "./search/Search";
import SortableTable from "@/components/table/SortableTable";
import TableFiltersLegacy from "@/components/table/TableFiltersLegacy";
import TableWrapper from "@/components/table/TableWrapper";
import {
  fetchRentBasisList,
  fetchAttributes as fetchRentBasisAttributes,
} from "@/rentbasis/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "@/rentbasis/constants";
import { Methods, PermissionMissingTexts } from "@/enums";
import {
  RentBasisFieldPaths,
  RentBasisPropertyIdentifiersFieldPaths,
  RentBasisRentRatesFieldPaths,
} from "@/rentbasis/enums";
import { mapRentBasisSearchFilters } from "@/rentbasis/helpers";
import {
  formatDate,
  getApiResponseCount,
  getApiResponseMaxPage,
  getApiResponseResults,
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
  getRentBasisList as getRentBasisListData,
} from "@/rentbasis/selectors";
import {
  getAttributes as getRentBasisAttributes,
  getIsFetchingAttributes as getIsFetchingRentBasisAttributes,
  getMethods as getRentBasisMethods,
} from "@/rentbasis/selectors";
import type { RentBasisList } from "@/rentbasis/types";

const RentBasisListPage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isFetching = useSelector(getIsFetching);
  const rentBasisListData = useSelector(getRentBasisListData);
  const isFetchingRentBasisAttributes = useSelector(
    getIsFetchingRentBasisAttributes,
  );
  const rentBasisAttributes = useSelector(getRentBasisAttributes);
  const rentBasisMethods = useSelector(getRentBasisMethods);

  const [activePage, setActivePage] = useState(1);
  const [isSearchInitialized, setIsSearchInitialized] = useState(false);
  const [sortKey, setSortKey] = useState(DEFAULT_SORT_KEY);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER);

  const previousSortRef = useRef<{ sortKey: string; sortOrder: string } | null>(
    null,
  );

  const searchFormRef = useRef(
    createForm({
      onSubmit: (values) => handleSearchChange(values, true),
    }),
  );

  useEffect(() => {
    setPageTitle("Vuokrausperiaatteet");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.RENT_BASIS),
        pageTitle: "Vuokrausperiaatteet",
        showSearch: false,
      }),
    );

    dispatch(fetchRentBasisAttributes());
  }, [dispatch]);

  useEffect(() => {
    const searchQuery = getUrlParams(location.search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    setActivePage(page);
    setSortKey(searchQuery.sort_key || DEFAULT_SORT_KEY);
    setSortOrder(searchQuery.sort_order || DEFAULT_SORT_ORDER);
    setIsSearchInitialized(false);

    const initializeSearchForm = () => {
      const initialValues = { ...searchQuery };
      delete initialValues.page;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      searchFormRef.current.initialize(initialValues);
      setIsSearchInitialized(true);
    };

    initializeSearchForm();
  }, [location.search, dispatch]);

  const debouncedFetchRentBasisList = useMemo(
    () =>
      debounce((searchQuery: Record<string, any>) => {
        dispatch(fetchRentBasisList(mapRentBasisSearchFilters(searchQuery)));
      }, 1000),
    [dispatch],
  );

  useEffect(() => {
    return () => {
      debouncedFetchRentBasisList.cancel();
    };
  }, [debouncedFetchRentBasisList]);

  useEffect(() => {
    const searchQuery = getUrlParams(location.search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    delete searchQuery.page;

    const currentSort = {
      sortKey: searchQuery.sort_key || DEFAULT_SORT_KEY,
      sortOrder: searchQuery.sort_order || DEFAULT_SORT_ORDER,
    };
    const isSortChanged =
      !!previousSortRef.current &&
      (previousSortRef.current.sortKey !== currentSort.sortKey ||
        previousSortRef.current.sortOrder !== currentSort.sortOrder);
    previousSortRef.current = currentSort;

    if (page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    searchQuery.sort_key = currentSort.sortKey;
    searchQuery.sort_order = currentSort.sortOrder;

    if (isSortChanged) {
      dispatch(fetchRentBasisList(mapRentBasisSearchFilters(searchQuery)));
    } else {
      debouncedFetchRentBasisList(searchQuery);
    }
  }, [location.search, dispatch, debouncedFetchRentBasisList]);

  const handleCreateButtonClick = () => {
    return navigate({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      search: location.search,
    });
  };

  const handleRowClick = (id) => {
    return navigate({
      pathname: `${getRouteById(Routes.RENT_BASIS)}/${id}`,
      search: location.search,
    });
  };

  const handlePageClick = (page: number) => {
    const query = getUrlParams(location.search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    setActivePage(page);
    return navigate({
      pathname: getRouteById(Routes.RENT_BASIS),
      search: getSearchQuery(query),
    });
  };

  const getRentBasisList = (rentBasisList: RentBasisList) => {
    const results = getApiResponseResults(rentBasisList);
    return results.map((item) => {
      return {
        id: item.id,
        property_identifiers: get(item, "property_identifiers").map(
          (item) => item.identifier,
        ),
        build_permission_types: get(item, "rent_rates").map(
          (rate) =>
            get(rate, "build_permission_type.id") ||
            get(rate, "build_permission_type"),
        ),
        start_date: get(item, "start_date"),
        end_date: get(item, "end_date"),
      };
    });
  };

  const getColumns = () => {
    const columns = [];
    const buildPermissionTypeOptions = getFieldOptions(
      rentBasisAttributes,
      RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE,
    );

    if (
      isFieldAllowedToRead(
        rentBasisAttributes,
        RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS,
      )
    ) {
      columns.push({
        key: "property_identifiers",
        sortable: false,
        text: "Kohteen tunnus",
      });
    }

    if (
      isFieldAllowedToRead(
        rentBasisAttributes,
        RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE,
      )
    ) {
      columns.push({
        key: "build_permission_types",
        text: "Pääkäyttötarkoitus",
        renderer: (val) =>
          val ? getLabelOfOption(buildPermissionTypeOptions, val) : "-",
        sortable: false,
      });
    }

    if (
      isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.START_DATE)
    ) {
      columns.push({
        key: "start_date",
        text: "Alkupvm",
        renderer: (val) => formatDate(val) || "-",
      });
    }

    if (
      isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.END_DATE)
    ) {
      columns.push({
        key: "end_date",
        text: "Loppupvm",
        renderer: (val) => formatDate(val) || "-",
      });
    }

    return columns;
  };

  const handleSearchChange = (query, resetActivePage: boolean = false) => {
    if (resetActivePage) {
      setActivePage(1);
    }

    return navigate({
      pathname: getRouteById(Routes.RENT_BASIS),
      search: getSearchQuery(query),
    });
  };

  const handleSortingChange = ({ sortKey, sortOrder }) => {
    const searchQuery = getUrlParams(location.search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    setSortKey(sortKey);
    setSortOrder(sortOrder);
    handleSearchChange(searchQuery);
  };

  const count = getApiResponseCount(rentBasisListData);
  const rentBasisList = getRentBasisList(rentBasisListData);
  const maxPage = getApiResponseMaxPage(
    rentBasisListData,
    LIST_TABLE_PAGE_SIZE,
  );
  const columns = getColumns();
  if (isFetchingRentBasisAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!rentBasisMethods) return null;
  if (!isMethodAllowed(rentBasisMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.RENT_BASIS} />
      </PageContainer>
    );
  return (
    <Form
      form={searchFormRef.current}
      onSubmit={searchFormRef.current.submit}
      enableReinitialize
    >
      {() => (
        <PageContainer>
          <Row>
            <Column small={12} large={4}>
              <Authorization
                allow={isMethodAllowed(rentBasisMethods, Methods.POST)}
              >
                <AddButtonSecondary
                  className="no-top-margin"
                  label="Luo vuokrausperuste"
                  onClick={handleCreateButtonClick}
                />
              </Authorization>
            </Column>
            <Column small={12} large={8}>
              <Search
                isSearchInitialized={isSearchInitialized}
                onSearch={handleSearchChange}
                sortKey={sortKey}
                sortOrder={sortOrder}
              />
            </Column>
          </Row>

          <TableFiltersLegacy
            amountText={isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
            filterOptions={[]}
            filterValue={[]}
          />

          <TableWrapper>
            {isFetching && (
              <LoaderWrapper className="relative-overlay-wrapper">
                <Loader isLoading={isFetching} />
              </LoaderWrapper>
            )}
            <SortableTable
              columns={columns}
              data={rentBasisList}
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
          </TableWrapper>
        </PageContainer>
      )}
    </Form>
  );
};

export default RentBasisListPage;
