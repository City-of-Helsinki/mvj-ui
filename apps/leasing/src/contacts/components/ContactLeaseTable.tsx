import { Link, Table } from "hds-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import GreenBox from "@/components/content/GreenBox";
import PageContainerHDS from "@/components/content/PageContainerHDS";
import Loader from "@/components/loader/Loader";
import {
  fetchLeasesForContact,
  fetchLeasesForContactAttributes,
} from "@/leases/actions";
import {
  LeaseFieldPaths,
  LeaseFieldTitles,
  TenantContactType,
} from "@/leases/enums";
import {
  getIsFetchingLeasesForContact,
  getIsFetchingLeasesForContactAttributes,
  getLeasesForContact,
  getLeasesForContactAttributes,
} from "@/leases/selectors";
import { getRouteById, Routes } from "@/root/routes";
import { isFieldAllowedToRead } from "@/util/helpers";

import { TENANT_CONTACT_TYPE_LABELS } from "../constants";

import type { Attributes } from "@/types";
import type { Contact } from "@/contacts/types";
import type { TableProps } from "hds-react";

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
  return roles.sort(
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

type Props = {
  contact: Contact;
};

const getLeaseDetailsHref = (rowId: number | string) => {
  return `${getRouteById(Routes.LEASES)}/${rowId}`;
};

const ContactLeaseTable: React.FC<Props> = ({ contact }: Props) => {
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const isFetchingAttributes = useSelector(
    getIsFetchingLeasesForContactAttributes,
  );
  const attributes: Attributes = useSelector(getLeasesForContactAttributes);
  const isFetchingLeases = useSelector(getIsFetchingLeasesForContact);
  const leasesForContact = useSelector(getLeasesForContact);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!attributes && !isFetchingAttributes) {
      dispatch(fetchLeasesForContactAttributes());
    }
  }, [dispatch, attributes, isFetchingAttributes]);

  useEffect(() => {
    dispatch(fetchLeasesForContact({ contact: contact.id, limit: 10000 }));
  }, [dispatch, contact.id]);

  const handleSortingChange = (
    order: "asc" | "desc",
    columnKey: string,
    handleSort: () => void,
  ): void => {
    setSortKey(columnKey);
    setSortOrder(order);
    handleSort();
  };

  const tableColumns = useMemo(() => {
    const cols: TableProps["cols"] = [];
    if (
      attributes &&
      isFieldAllowedToRead(attributes, LeaseFieldPaths.IDENTIFIER)
    ) {
      cols.push({
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
      });
    }
    cols.push({
      key: "is_active",
      headerName: "Vuokraus voimassa",
      isSortable: true,
      transform: ({ is_active }: { is_active: boolean }) =>
        is_active ? "Kyllä" : "-",
    });
    cols.push({
      key: "roles",
      headerName: "Rooli",
      isSortable: true,
    });
    cols.push({
      key: "contact_role_active",
      headerName: "Rooli voimassa",
      isSortable: true,
      transform: ({ contact_role_active }: { contact_role_active: boolean }) =>
        contact_role_active ? "Kyllä" : "-",
    });
    cols.push({
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
    });
    return cols;
  }, [attributes]);

  const tableRows = useMemo(() => {
    const leases: ContactLease[] = leasesForContact?.results ?? [];
    return leases.map((lease) => ({
      lease_id: lease.id,
      lease_identifier: lease.identifier.identifier,
      is_active: lease.is_active,
      contact_role_active: lease.contact_role_active,
      roles: joinContactRoles(lease.contact_roles),
      has_overdue_invoices: lease.has_overdue_invoices,
    }));
  }, [leasesForContact]);

  if (isFetchingAttributes || !attributes || isFetchingLeases)
    return (
      <PageContainerHDS>
        <Loader isLoading={true} />
      </PageContainerHDS>
    );

  return (
    <GreenBox>
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
    </GreenBox>
  );
};

export default ContactLeaseTable;
