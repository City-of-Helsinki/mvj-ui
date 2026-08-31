import { Link, Pagination, Table } from "hds-react";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { useLocation, useNavigate } from "react-router";

import GreenBox from "@/components/content/GreenBox";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import {
  fetchLeasesForContact,
  fetchLeasesForContactAttributes,
} from "@/leases/slice";
import {
  LeaseFieldPaths,
  LeaseFieldTitles,
  TenantContactType,
} from "@/leases/enums";
import { mapLeasesForContactSearchFilters } from "@/leases/helpers";
import {
  getIsFetchingLeasesForContact,
  getIsFetchingLeasesForContactAttributes,
  getLeasesForContact,
  getLeasesForContactAttributes,
} from "@/leases/selectors";
import { getRouteById, Routes } from "@/root/routes";
import {
  getApiResponseCount,
  getApiResponseMaxPage,
  getApiResponseResults,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";

import { TENANT_CONTACT_TYPE_LABELS } from "../constants";

import type { Attributes } from "@/types";
import type { Contact } from "@/contacts/types";

const joinContactRoles = (roles: string[]): string => {
  if (!roles || roles.length === 0) {
    return "-";
  }
  return (
    sortContactRoles(roles)
      .map((role) => TENANT_CONTACT_TYPE_LABELS[role] ?? role)
      .join(", ") || "-"
  );
};
const sortContactRoles = (roles: string[]): string[] => {
  const typeOrder: string[] = [
    TenantContactType.TENANT,
    TenantContactType.BILLING,
    TenantContactType.CONTACT,
  ];
  return [...roles].sort(
    (a, b) =>
      (typeOrder.indexOf(a) + 1 || Infinity) -
      (typeOrder.indexOf(b) + 1 || Infinity),
  );
};

type ContactLease = {
  id: number;
  identifier: Record<string, any>;
  contact_roles: Array<string>;
  contact_role_active: boolean;
  is_active: boolean;
  has_overdue_invoices: boolean;
};

const DEFAULT_SORT_KEY = "lease_identifier";
const DEFAULT_SORT_ORDER = "asc";

type Props = {
  contact: Contact;
};

const getLeaseDetailsHref = (rowId: number | string) => {
  return `${getRouteById(Routes.LEASES)}/${rowId}`;
};

const ContactLeaseTable: React.FC<Props> = ({ contact }: Props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isFetchingAttributes = useAppSelector(
    getIsFetchingLeasesForContactAttributes,
  );
  const attributes: Attributes = useAppSelector(getLeasesForContactAttributes);
  const isFetchingLeases = useAppSelector(getIsFetchingLeasesForContact);
  const leasesForContact = useAppSelector(getLeasesForContact);

  const queryParams = useMemo(
    () => getUrlParams(location.search),
    [location.search],
  );
  const sortKey = queryParams.sort_key || DEFAULT_SORT_KEY;
  const sortOrder = (queryParams.sort_order || DEFAULT_SORT_ORDER) as
    "asc" | "desc";
  const activePage = queryParams.page ? Number(queryParams.page) : 1;

  useEffect(() => {
    if (!attributes && !isFetchingAttributes) {
      dispatch(fetchLeasesForContactAttributes());
    }
  }, [dispatch, attributes, isFetchingAttributes]);

  useEffect(() => {
    const offset = (activePage - 1) * LIST_TABLE_PAGE_SIZE;
    dispatch(
      fetchLeasesForContact(
        mapLeasesForContactSearchFilters({
          contact: contact.id,
          limit: LIST_TABLE_PAGE_SIZE,
          offset: offset,
          sort_key: sortKey,
          sort_order: sortOrder,
        }),
      ),
    );
  }, [dispatch, contact.id, activePage, sortKey, sortOrder]);

  const handleSortingChange = (
    order: "asc" | "desc",
    columnKey: string,
    handleSort: () => void,
  ): void => {
    const searchQuery = getUrlParams(location.search);

    handleSort();

    searchQuery.sort_key = columnKey;
    searchQuery.sort_order = order;
    delete searchQuery.page;

    navigate({
      pathname: location.pathname,
      search: getSearchQuery(searchQuery),
    });
  };

  const tableColumns = useMemo(() => {
    if (
      !attributes ||
      !isFieldAllowedToRead(attributes, LeaseFieldPaths.IDENTIFIER)
    ) {
      return [];
    }
    return [
      {
        key: "lease_identifier",
        headerName: LeaseFieldTitles.IDENTIFIER,
        isSortable: true,
        transform: (row: { lease_id: number; lease_identifier: string }) => (
          <Link
            href={getLeaseDetailsHref(row.lease_id)}
            className="contact-lease-list-identifier-link"
          >
            {row.lease_identifier}
          </Link>
        ),
      },
      {
        key: "is_active",
        headerName: "Vuokraus voimassa",
        isSortable: true,
        transform: ({ is_active }: { is_active: boolean }) =>
          is_active ? "Kyllä" : "-",
      },
      {
        key: "roles",
        headerName: "Rooli",
        isSortable: true,
      },
      {
        key: "contact_role_active",
        headerName: "Rooli voimassa",
        isSortable: true,
        transform: ({
          contact_role_active,
        }: {
          contact_role_active: boolean;
        }) => (contact_role_active ? "Kyllä" : "-"),
      },
      {
        key: "has_overdue_invoices",
        headerName: "Vuokrarästejä",
        isSortable: true,
        transform: ({
          has_overdue_invoices,
        }: {
          has_overdue_invoices: boolean;
        }) =>
          has_overdue_invoices ? (
            <strong style={{ color: "var(--color-error)" }}>Kyllä</strong>
          ) : (
            "-"
          ),
      },
    ];
  }, [attributes]);

  const tableRows = useMemo(() => {
    const leases: ContactLease[] =
      getApiResponseResults(leasesForContact) ?? [];
    return leases.map((lease) => ({
      lease_id: lease.id,
      lease_identifier: lease.identifier.identifier,
      is_active: lease.is_active,
      contact_role_active: lease.contact_role_active,
      roles: joinContactRoles(lease.contact_roles),
      has_overdue_invoices: lease.has_overdue_invoices,
    }));
  }, [leasesForContact]);

  const count = getApiResponseCount(leasesForContact);
  const maxPage = getApiResponseMaxPage(leasesForContact, LIST_TABLE_PAGE_SIZE);

  const handlePageClick = (page: number) => {
    const query = getUrlParams(location.search);
    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }
    navigate({
      pathname: location.pathname,
      search: getSearchQuery(query),
    });
  };

  if (isFetchingAttributes || !attributes || isFetchingLeases)
    return (
      <LoaderWrapper className="relative-overlay-wrapper">
        <Loader isLoading={true} />
      </LoaderWrapper>
    );

  return (
    <GreenBox className="with-top-margin">
      <h3>Asiakkaan vuokraukset</h3>
      <span>{isFetchingLeases ? "Ladataan..." : `Löytyi ${count} kpl`}</span>
      <Table
        ariaLabelSortButtonUnset="Ei järjestetty"
        ariaLabelSortButtonAscending="Järjestä nousevasti"
        ariaLabelSortButtonDescending="Järjestä laskevasti"
        id="contact-lease-list-table"
        indexKey="lease_id"
        renderIndexCol={false}
        cols={tableColumns}
        rows={tableRows}
        onSort={handleSortingChange}
        initialSortingColumnKey={sortKey}
        initialSortingOrder={sortOrder}
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
    </GreenBox>
  );
};

export default ContactLeaseTable;
