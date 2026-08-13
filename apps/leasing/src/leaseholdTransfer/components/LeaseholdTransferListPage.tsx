import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Row, Column } from "@/components/grid/Grid";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import RemoveButton from "@/components/form/RemoveButton";
import Search from "@/leaseholdTransfer/components/search/Search";
import SortableTable from "@/components/table/SortableTable";
import TableFiltersLegacy from "@/components/table/TableFiltersLegacy";
import TableWrapper from "@/components/table/TableWrapper";
import {
  deleteLeaseholdTransferAndUpdateList,
  fetchAttributes as fetchLeaseholdTransferAttributes,
  fetchLeaseholdTransferList,
} from "@/leaseholdTransfer/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
} from "@/leaseholdTransfer/constants";
import {
  ConfirmationModalTexts,
  Methods,
  PermissionMissingTexts,
} from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseholdTransferFieldPaths,
  LeaseholdTransferFieldTitles,
} from "@/leaseholdTransfer/enums";
import {
  getContentLeaseholdTransfers,
  mapLeaseholdTransferSearchFilters,
} from "@/leaseholdTransfer/helpers";
import {
  formatDate,
  getApiResponseCount,
  getApiResponseMaxPage,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getAttributes as getLeaseholdTransferAttributes,
  getIsFetching,
  getIsFetchingAttributes as getIsFetchingLeaseholdTransferAttributes,
  getLeaseholdTransferList,
  getMethods as getLeaseholdTransferMethods,
} from "@/leaseholdTransfer/selectors";
import type { Attributes } from "types";

const LeaseholdTransferListPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isFetching = useSelector(getIsFetching);
  const leaseholdTransferList = useSelector(getLeaseholdTransferList);
  const isFetchingLeaseholdTransferAttributes = useSelector(
    getIsFetchingLeaseholdTransferAttributes,
  );
  const leaseholdTransferAttributes = useSelector(
    getLeaseholdTransferAttributes,
  );
  const leaseholdTransferMethods = useSelector(getLeaseholdTransferMethods);

  const searchQuery = useMemo(
    () => getUrlParams(location.search),
    [location.search],
  );

  const activePage = searchQuery.page ? Number(searchQuery.page) : 1;
  const sortKey = searchQuery.sort_key || DEFAULT_SORT_KEY;
  const sortOrder = searchQuery.sort_order || DEFAULT_SORT_ORDER;

  const searchFormInitialValues = useMemo(() => {
    const initialValues = { ...searchQuery };
    delete initialValues.page;
    delete initialValues.sort_key;
    delete initialValues.sort_order;

    return initialValues;
  }, [searchQuery]);

  const count = useMemo(
    () => getApiResponseCount(leaseholdTransferList),
    [leaseholdTransferList],
  );
  const leaseholdTransfers = useMemo(
    () => getContentLeaseholdTransfers(leaseholdTransferList),
    [leaseholdTransferList],
  );
  const maxPage = useMemo(
    () => getApiResponseMaxPage(leaseholdTransferList, LIST_TABLE_PAGE_SIZE),
    [leaseholdTransferList],
  );

  useEffect(() => {
    setPageTitle("Vuokraoikeuden siirrot");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.LEASEHOLD_TRANSFER),
        pageTitle: "Vuokraoikeuden siirrot",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (
      !isFetchingLeaseholdTransferAttributes &&
      !leaseholdTransferAttributes &&
      !leaseholdTransferMethods
    ) {
      dispatch(fetchLeaseholdTransferAttributes());
    }
  }, [
    dispatch,
    isFetchingLeaseholdTransferAttributes,
    leaseholdTransferAttributes,
    leaseholdTransferMethods,
  ]);

  const getMappedSearchQuery = useCallback(() => {
    const query = { ...searchQuery };
    const page = query.page ? Number(query.page) : 1;

    if (page > 1) {
      query.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    query.limit = LIST_TABLE_PAGE_SIZE;
    delete query.page;
    query.sort_key = query.sort_key || DEFAULT_SORT_KEY;
    query.sort_order = query.sort_order || DEFAULT_SORT_ORDER;

    return mapLeaseholdTransferSearchFilters(query);
  }, [searchQuery]);

  const search = useCallback(() => {
    dispatch(fetchLeaseholdTransferList(getMappedSearchQuery()));
  }, [dispatch, getMappedSearchQuery]);

  useEffect(() => {
    search();
  }, [search]);

  const handleSearchChange = useCallback(
    (query: Record<string, any>, resetActivePage: boolean = false) => {
      const nextQuery = { ...query };

      if (resetActivePage) {
        delete nextQuery.page;
      }

      return navigate({
        pathname: getRouteById(Routes.LEASEHOLD_TRANSFER),
        search: getSearchQuery(nextQuery),
      });
    },
    [navigate],
  );

  const handleSortingChange = useCallback(
    ({ sortKey, sortOrder }) => {
      const query = {
        ...searchQuery,
        sort_key: sortKey,
        sort_order: sortOrder,
      };

      handleSearchChange(query);
    },
    [handleSearchChange, searchQuery],
  );

  const handlePageClick = useCallback(
    (page: number) => {
      const query = { ...searchQuery };

      if (page > 1) {
        query.page = page;
      } else {
        delete query.page;
      }

      return navigate({
        pathname: getRouteById(Routes.LEASEHOLD_TRANSFER),
        search: getSearchQuery(query),
      });
    },
    [navigate, searchQuery],
  );

  if (isFetchingLeaseholdTransferAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!leaseholdTransferMethods) return null;
  if (!isMethodAllowed(leaseholdTransferMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.LEASEHOLD_TRANSFER} />
      </PageContainer>
    );

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        const handleDelete = (id: number) => {
          if (!appDispatch) return;
          appDispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              const mappedSearchQuery = getMappedSearchQuery();
              dispatch(
                deleteLeaseholdTransferAndUpdateList({
                  id,
                  searchQuery: mappedSearchQuery,
                }),
              );
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText:
              ConfirmationModalTexts.DELETE_LEASEHOLD_TRASFER.BUTTON,
            confirmationModalLabel:
              ConfirmationModalTexts.DELETE_LEASEHOLD_TRASFER.LABEL,
            confirmationModalTitle:
              ConfirmationModalTexts.DELETE_LEASEHOLD_TRASFER.TITLE,
          });
        };

        const columns = [];

        if (
          isFieldAllowedToRead(
            leaseholdTransferAttributes as Attributes,
            LeaseholdTransferFieldPaths.PROPERTIES,
          )
        ) {
          columns.push({
            key: "properties",
            text: LeaseholdTransferFieldTitles.PROPERTIES,
            sortable: false,
          });
        }

        if (
          isFieldAllowedToRead(
            leaseholdTransferAttributes as Attributes,
            LeaseholdTransferFieldPaths.INSTITUTION_IDENTIFIER,
          )
        ) {
          columns.push({
            key: "institution_identifier",
            text: LeaseholdTransferFieldTitles.INSTITUTION_IDENTIFIER,
          });
        }

        if (
          isFieldAllowedToRead(
            leaseholdTransferAttributes as Attributes,
            LeaseholdTransferFieldPaths.DECISION_DATE,
          )
        ) {
          columns.push({
            key: "decision_date",
            text: LeaseholdTransferFieldTitles.DECISION_DATE,
            renderer: (val) => formatDate(val),
          });
        }

        if (
          isFieldAllowedToRead(
            leaseholdTransferAttributes as Attributes,
            LeaseholdTransferFieldPaths.PARTIES,
          )
        ) {
          columns.push({
            key: "conveyors",
            text: LeaseholdTransferFieldTitles.CONVEYORS,
            renderer: (val) => val.name,
            sortable: false,
          });
        }

        if (
          isFieldAllowedToRead(
            leaseholdTransferAttributes as Attributes,
            LeaseholdTransferFieldPaths.PARTIES,
          )
        ) {
          columns.push({
            key: "acquirers",
            text: LeaseholdTransferFieldTitles.ACQUIRERS,
            renderer: (val) => val.name,
            sortable: false,
          });
        }

        if (
          isFieldAllowedToRead(
            leaseholdTransferAttributes as Attributes,
            LeaseholdTransferFieldPaths.DELETED,
          )
        ) {
          columns.push({
            key: "deleted",
            text: LeaseholdTransferFieldTitles.DELETED,
            renderer: (val) => formatDate(val),
            sortable: false,
          });
        }

        if (isMethodAllowed(leaseholdTransferMethods, Methods.DELETE)) {
          columns.push({
            key: "id",
            text: "",
            renderer: (val) => (
              <RemoveButton
                className="third-level"
                onClick={() => handleDelete(val)}
                title="Poista vuokraoikeuden siirto"
              />
            ),
            sortable: false,
          });
        }

        return (
          <PageContainer>
            <Row>
              <Column small={12} large={4}></Column>
              <Column small={12} large={8}>
                <Search
                  onSearch={handleSearchChange}
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  initialValues={searchFormInitialValues}
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
                data={leaseholdTransfers}
                listTable
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
      }}
    </AppConsumer>
  );
};

export default LeaseholdTransferListPage;
