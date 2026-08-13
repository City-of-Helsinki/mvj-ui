import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Row, Column } from "@/components/grid/Grid";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import CreateInvoiceNoteModal from "@/invoiceNote/components/CreateInvoiceNoteModal";
import ExternalLink from "@/components/links/ExternalLink";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "@/invoiceNote/components/Search";
import ShowMore from "@/components/showMore/ShowMore";
import SortableTable from "@/components/table/SortableTable";
import TableFiltersLegacy from "@/components/table/TableFiltersLegacy";
import TableWrapper from "@/components/table/TableWrapper";
import {
  createInvoiceNoteAndFetchList,
  fetchAttributes as fetchInvoiceNoteAttributes,
  fetchInvoiceNoteList,
  hideCreateInvoiceNoteModal,
  receiveInvoiceNoteList,
  showCreateInvoiceNoteModal,
} from "@/invoiceNote/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { Methods, PermissionMissingTexts } from "@/enums";
import {
  InvoiceNoteFieldPaths,
  InvoiceNoteFieldTitles,
} from "@/invoiceNote/enums";
import { getContentLeaseIdentifier } from "@/leases/helpers";
import {
  formatDate,
  getApiResponseCount,
  getApiResponseMaxPage,
  getApiResponseResults,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getAttributes as getInvoiceNoteAttributes,
  getInvoiceNoteList,
  getIsCreateModalOpen,
  getIsFetching,
  getIsFetchingAttributes as getIsFetchingInvoiceNoteAttributes,
  getMethods as getInvoiceNoteMethods,
} from "@/invoiceNote/selectors";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { Attributes } from "types";

const getColumns = (invoiceNoteAttributes: Attributes) => {
  const columns = [];

  if (
    isFieldAllowedToRead(invoiceNoteAttributes, InvoiceNoteFieldPaths.LEASE)
  ) {
    columns.push({
      key: "lease",
      text: InvoiceNoteFieldTitles.LEASE,
      renderer: (val) =>
        val ? (
          <ExternalLink
            className="no-margin"
            href={`${getRouteById(Routes.LEASES)}/${val.id}?tab=6`}
            text={getContentLeaseIdentifier(val) || "-"}
          />
        ) : (
          "-"
        ),
    });
  }

  if (
    isFieldAllowedToRead(
      invoiceNoteAttributes,
      InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE,
    )
  ) {
    columns.push({
      key: "billing_period_start_date",
      text: InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE,
      renderer: (val) => formatDate(val),
    });
  }

  if (
    isFieldAllowedToRead(
      invoiceNoteAttributes,
      InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE,
    )
  ) {
    columns.push({
      key: "billing_period_end_date",
      text: InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE,
      renderer: (val) => formatDate(val),
    });
  }

  if (
    isFieldAllowedToRead(invoiceNoteAttributes, InvoiceNoteFieldPaths.NOTES)
  ) {
    columns.push({
      key: "notes",
      text: InvoiceNoteFieldTitles.NOTES,
      renderer: (val) => <ShowMore className="no-margin" text={val} />,
    });
  }

  return columns;
};

const InvoiceNoteListPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const invoiceNoteAttributes = useSelector(getInvoiceNoteAttributes);
  const invoiceNoteMethods = useSelector(getInvoiceNoteMethods);
  const isFetchingInvoiceNoteAttributes = useSelector(
    getIsFetchingInvoiceNoteAttributes,
  );
  const invoiceNoteList = useSelector(getInvoiceNoteList);
  const isCreateModalOpen = useSelector(getIsCreateModalOpen);
  const isFetching = useSelector(getIsFetching);
  const userActiveServiceUnit = useSelector(getUserActiveServiceUnit);

  const hasFetchedInvoiceNotesRef = useRef(false);
  const prevSearchRef = useRef(location.search);
  const prevUserActiveServiceUnitRef = useRef(userActiveServiceUnit);

  const searchQuery = useMemo(
    () => getUrlParams(location.search),
    [location.search],
  );
  const activePage = searchQuery.page ? Number(searchQuery.page) : 1;
  const searchInitialValues = useMemo(() => {
    const initialValues = { ...searchQuery };

    if (initialValues.service_unit === undefined && userActiveServiceUnit) {
      initialValues.service_unit = userActiveServiceUnit.id;
    }

    delete initialValues.page;

    return initialValues;
  }, [searchQuery, userActiveServiceUnit]);

  const columns = useMemo(() => {
    return invoiceNoteAttributes ? getColumns(invoiceNoteAttributes) : [];
  }, [invoiceNoteAttributes]);

  const count = useMemo(
    () => getApiResponseCount(invoiceNoteList),
    [invoiceNoteList],
  );
  const invoiceNotes = useMemo(
    () => getApiResponseResults(invoiceNoteList),
    [invoiceNoteList],
  );
  const maxPage = useMemo(
    () => getApiResponseMaxPage(invoiceNoteList, LIST_TABLE_PAGE_SIZE),
    [invoiceNoteList],
  );

  useEffect(() => {
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.INVOICE_NOTES),
        pageTitle: "Laskujen tiedotteet",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (
      !isFetchingInvoiceNoteAttributes &&
      !invoiceNoteMethods &&
      !invoiceNoteAttributes
    ) {
      dispatch(fetchInvoiceNoteAttributes());
    }
  }, [
    dispatch,
    invoiceNoteAttributes,
    invoiceNoteMethods,
    isFetchingInvoiceNoteAttributes,
  ]);

  const search = useCallback(() => {
    const query = { ...searchQuery };
    const page = query.page ? Number(query.page) : 1;

    if (page > 1) {
      query.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    query.limit = LIST_TABLE_PAGE_SIZE;
    delete query.page;

    if (query.service_unit === undefined && userActiveServiceUnit) {
      query.service_unit = userActiveServiceUnit.id;
    }

    dispatch(fetchInvoiceNoteList(query));
  }, [dispatch, searchQuery, userActiveServiceUnit]);

  useEffect(() => {
    const currentSearch = location.search;
    const prevSearch = prevSearchRef.current;
    const prevUserActiveServiceUnit = prevUserActiveServiceUnitRef.current;

    const handleSearch = () => {
      search();
    };

    if (userActiveServiceUnit) {
      if (!hasFetchedInvoiceNotesRef.current) {
        handleSearch();
        hasFetchedInvoiceNotesRef.current = true;
      } else if (
        userActiveServiceUnit !== prevUserActiveServiceUnit &&
        !currentSearch.includes("service_unit")
      ) {
        handleSearch();
      }
    }

    if (currentSearch !== prevSearch) {
      handleSearch();
    }

    prevSearchRef.current = currentSearch;
    prevUserActiveServiceUnitRef.current = userActiveServiceUnit;
  }, [location.search, search, userActiveServiceUnit]);

  useEffect(() => {
    return () => {
      dispatch(receiveInvoiceNoteList({}));
      hasFetchedInvoiceNotesRef.current = false;
    };
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (query: Record<string, any>) => {
      return navigate({
        pathname: getRouteById(Routes.INVOICE_NOTES),
        search: getSearchQuery(query),
      });
    },
    [navigate],
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
        pathname: getRouteById(Routes.INVOICE_NOTES),
        search: getSearchQuery(query),
      });
    },
    [navigate, searchQuery],
  );

  const handleHideCreateInvoiceNoteModal = useCallback(() => {
    dispatch(hideCreateInvoiceNoteModal());
  }, [dispatch]);

  const handleShowCreateInvoiceNoteModal = useCallback(() => {
    dispatch(showCreateInvoiceNoteModal());
  }, [dispatch]);

  const createInvoiceNote = useCallback(
    (data: Record<string, any>) => {
      const query = getUrlParams(location.search);
      dispatch(
        createInvoiceNoteAndFetchList({
          data,
          query,
        }),
      );
    },
    [dispatch, location.search],
  );

  if (isFetchingInvoiceNoteAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!invoiceNoteMethods) return null;
  if (!isMethodAllowed(invoiceNoteMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.INVOICE_NOTE} />
      </PageContainer>
    );
  return (
    <PageContainer>
      <Authorization allow={isMethodAllowed(invoiceNoteMethods, Methods.POST)}>
        <CreateInvoiceNoteModal
          isOpen={isCreateModalOpen}
          onClose={handleHideCreateInvoiceNoteModal}
          onSubmit={createInvoiceNote}
        />
      </Authorization>
      <Row>
        <Column small={12} large={8}>
          <Authorization
            allow={isMethodAllowed(invoiceNoteMethods, Methods.POST)}
          >
            <AddButtonSecondary
              className="no-top-margin"
              label="Luo tiedote"
              onClick={handleShowCreateInvoiceNoteModal}
            />
          </Authorization>
        </Column>
        <Column small={12} large={4}>
          {userActiveServiceUnit && (
            <Search
              onSearch={handleSearchChange}
              initialValues={searchInitialValues}
            />
          )}
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6}></Column>
        <Column small={12} medium={6}>
          <TableFiltersLegacy
            amountText={isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
            filterOptions={[]}
            filterValue={[]}
          />
        </Column>
      </Row>

      <TableWrapper>
        {isFetching && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={isFetching} />
          </LoaderWrapper>
        )}

        <SortableTable
          columns={columns}
          data={invoiceNotes}
          listTable
          sortable={false}
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

export default InvoiceNoteListPage;
