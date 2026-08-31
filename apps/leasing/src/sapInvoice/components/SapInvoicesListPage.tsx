import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { useLocation, useNavigate } from "react-router";
import { Row, Column } from "@/components/grid/Grid";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "./Search";
import SortableTable, {
  type Column as TableColumn,
} from "@/components/table/SortableTable";
import TableFiltersLegacy from "@/components/table/TableFiltersLegacy";
import TableWrapper from "@/components/table/TableWrapper";
import { fetchAttributes as fetchInvoiceAttributes } from "@/invoices/slice";
import { fetchSapInvoices } from "@/sapInvoice/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "@/sapInvoice/constants";
import { Methods, PermissionMissingTexts } from "@/enums";
import { InvoiceFieldPaths, InvoiceRowsFieldPaths } from "@/invoices/enums";
import { getContactFullName } from "@/contacts/helpers";
import { formatReceivableTypesString } from "@/invoices/helpers";
import { getContentLeaseIdentifier } from "@/leases/helpers";
import {
  getSapInvoices,
  mapSapInvoiceSearchFilters,
} from "@/sapInvoice/helpers";
import {
  formatDate,
  formatNumber,
  getApiResponseCount,
  getApiResponseMaxPage,
  getFieldOptions,
  getSearchQuery,
  getUrlParams,
  isEmptyValue,
  isFieldAllowedToRead,
  isMethodAllowed,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getAttributes as getInvoiceAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceAttributes,
  getMethods as getInvoiceMethods,
} from "@/invoices/selectors";
import {
  getIsFetching,
  getSapInvoices as getSapInvoiceList,
} from "@/sapInvoice/selectors";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { Attributes } from "types";

const getColumns = (invoiceAttributes: Attributes): Array<TableColumn> => {
  const receivableTypeOptions = getFieldOptions(
    invoiceAttributes,
    InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
  );
  const columns = [];

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
    columns.push({
      key: "send_to_sap_date",
      text: "Sap lähetyspvm",
      renderer: (val) => formatDate(val),
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)) {
    columns.push({
      key: "recipient",
      text: "Laskunsaaja",
      renderer: (val) => getContactFullName(val) || "-",
      sortable: false,
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
    columns.push({
      key: "due_date",
      text: "Eräpäivä",
      renderer: (val) => formatDate(val),
    });
  }

  if (
    isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)
  ) {
    columns.push({
      key: "billed_amount",
      text: "Laskutettu",
      renderer: (val) => (!isEmptyValue(val) ? `${formatNumber(val)} €` : "-"),
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.LEASE)) {
    columns.push({
      key: "lease",
      text: "Vuokraustunnus",
      renderer: (val) => getContentLeaseIdentifier(val),
      sortable: false,
    });
  }

  if (
    isFieldAllowedToRead(
      invoiceAttributes,
      InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
    )
  ) {
    columns.push({
      key: "receivableTypes",
      text: "Saamislaji",
      arrayRenderer: (val) =>
        formatReceivableTypesString(receivableTypeOptions, val) || "-",
      sortable: false,
    });
  }

  if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.LEASE)) {
    columns.push({
      key: "link",
      text: "",
      renderer: () => <ExternalLinkIcon className="icon-small icon-green" />,
      sortable: false,
    });
  }

  return columns;
};

const SapInvoicesListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const invoiceAttributes = useAppSelector(getInvoiceAttributes);
  const invoiceMethods = useAppSelector(getInvoiceMethods);
  const isFetchingInvoiceAttributes = useAppSelector(
    getIsFetchingInvoiceAttributes,
  );
  const isFetching = useAppSelector(getIsFetching);
  const sapInvoiceList = useAppSelector(getSapInvoiceList);
  const userActiveServiceUnit = useAppSelector(getUserActiveServiceUnit);

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

  const searchFormInitialValues = useMemo(() => {
    const initialValues = { ...searchQuery };

    if (initialValues.service_unit === undefined && userActiveServiceUnit) {
      initialValues.service_unit = userActiveServiceUnit.id;
    }

    delete initialValues.page;
    delete initialValues.sort_key;
    delete initialValues.sort_order;

    return initialValues;
  }, [searchQuery, userActiveServiceUnit]);

  const columns = useMemo(() => {
    return invoiceAttributes ? getColumns(invoiceAttributes) : [];
  }, [invoiceAttributes]);

  const sapInvoices = useMemo(
    () => getSapInvoices(sapInvoiceList),
    [sapInvoiceList],
  );
  const count = useMemo(
    () => getApiResponseCount(sapInvoiceList),
    [sapInvoiceList],
  );
  const maxPage = useMemo(
    () => getApiResponseMaxPage(sapInvoiceList, LIST_TABLE_PAGE_SIZE),
    [sapInvoiceList],
  );

  useEffect(() => {
    setPageTitle("SAP laskut");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.SAP_INVOICES),
        pageTitle: "SAP laskut",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (!isFetchingInvoiceAttributes && !invoiceMethods && !invoiceAttributes) {
      dispatch(fetchInvoiceAttributes());
    }
  }, [
    dispatch,
    invoiceAttributes,
    invoiceMethods,
    isFetchingInvoiceAttributes,
  ]);

  const applySearchQuery = useCallback(
    (query: Record<string, any>) => {
      navigate({
        pathname: getRouteById(Routes.SAP_INVOICES),
        search: getSearchQuery(query),
      });
    },
    [navigate],
  );

  const search = useCallback(() => {
    const query = { ...searchQuery };
    const page = query.page ? Number(query.page) : 1;

    if (page > 1) {
      query.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    query.limit = LIST_TABLE_PAGE_SIZE;
    delete query.page;
    query.sort_key = query.sort_key || DEFAULT_SORT_KEY;
    query.sort_order = query.sort_order || DEFAULT_SORT_ORDER;

    if (query.service_unit === undefined && userActiveServiceUnit) {
      query.service_unit = userActiveServiceUnit.id;
    }

    dispatch(fetchSapInvoices(mapSapInvoiceSearchFilters(query)));
  }, [dispatch, searchQuery, userActiveServiceUnit]);

  useEffect(() => {
    search();
  }, [search]);

  const handleRowClick = useCallback((id, row) => {
    window.open(
      `${getRouteById(Routes.LEASES)}/${row.lease.id}?tab=6&opened_invoice=${id}`,
      "_blank",
    );
  }, []);

  const handleSearchChange = useCallback(
    (query: Record<string, any>) => {
      applySearchQuery(query);
    },
    [applySearchQuery],
  );

  const handleSortingChange = useCallback(
    ({ sortKey, sortOrder }) => {
      const query = {
        ...searchQuery,
        sort_key: sortKey,
        sort_order: sortOrder,
      };
      applySearchQuery(query);
    },
    [applySearchQuery, searchQuery],
  );

  const handlePageClick = useCallback(
    (page: number) => {
      const query = { ...searchQuery };

      if (page > 1) {
        query.page = page;
      } else {
        delete query.page;
      }

      applySearchQuery(query);
    },
    [applySearchQuery, searchQuery],
  );

  if (isFetchingInvoiceAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!invoiceMethods) return null;
  if (!isMethodAllowed(invoiceMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.INVOICE} />
      </PageContainer>
    );
  return (
    <PageContainer>
      <Row>
        <Column small={12} large={8} />
        <Column small={12} large={4}>
          {userActiveServiceUnit && (
            <Search
              onSearch={handleSearchChange}
              sortKey={sortKey}
              sortOrder={sortOrder}
              initialValues={searchFormInitialValues}
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
          data={sapInvoices}
          listTable
          onRowClick={handleRowClick}
          onSortingChange={handleSortingChange}
          serverSideSorting
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

export default SapInvoicesListPage;
