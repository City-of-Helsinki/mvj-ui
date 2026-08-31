import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { useLocation, useNavigate } from "react-router";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  IconAngleDown,
  IconAngleUp,
  Pagination,
  Table,
  type TableProps,
} from "hds-react";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainerHDS from "@/components/content/PageContainerHDS";
import ContentContainerHds from "@/components/content/ContentContainerHds";
import Search from "./search/Search";
import { fetchContacts, initializeContactForm } from "@/contacts/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "@/contacts/constants";
import { Methods, PermissionMissingTexts } from "@/enums";
import { ContactFieldPaths, ContactFieldTitles } from "@/contacts/enums";
import {
  getContactFullName,
  mapContactSearchFilters,
} from "@/contacts/helpers";
import {
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
import { getContactList, getIsFetching } from "@/contacts/selectors";
import { useContactAttributes } from "@/components/attributes/ContactAttributes";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { Contact, ContactId, ContactsActiveLease } from "@/contacts/types";
import MultiItemCollapse from "@/components/table/MultiItemCollapse";

const sortLeasesByIdentifier = (
  leases: ContactsActiveLease[],
): ContactsActiveLease[] => {
  return [...leases].sort((a, b) =>
    a.lease_identifier.localeCompare(b.lease_identifier),
  );
};

const hasRowMultipleValues = (row: Contact): boolean => {
  return row.contacts_active_leases && row.contacts_active_leases.length > 1;
};

const ContactListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { contactAttributes, contactMethods, isFetchingContactAttributes } =
    useContactAttributes();
  const contactList = useAppSelector(getContactList);
  const isFetching = useAppSelector(getIsFetching);
  const userActiveServiceUnit = useAppSelector(getUserActiveServiceUnit);

  const queryParams = useMemo(
    () => getUrlParams(location.search),
    [location.search],
  );
  const sortKey = queryParams.sort_key || DEFAULT_SORT_KEY;
  const sortOrder = queryParams.sort_order || DEFAULT_SORT_ORDER;
  const activePage = queryParams.page ? Number(queryParams.page) : 1;
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const count = getApiResponseCount(contactList);
  const contacts = getApiResponseResults(contactList);
  const maxPage = getApiResponseMaxPage(contactList, LIST_TABLE_PAGE_SIZE);

  const typeOptions = useMemo(
    () => getFieldOptions(contactAttributes, ContactFieldPaths.TYPE),
    [contactAttributes],
  );

  useEffect(() => {
    setPageTitle("Asiakkaat");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.CONTACTS),
        pageTitle: "Asiakkaat",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (!userActiveServiceUnit) return;

    const search = () => {
      const searchQuery = { ...queryParams };
      const page = searchQuery.page ? Number(searchQuery.page) : 1;

      if (page > 1) {
        searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
      }

      searchQuery.limit = LIST_TABLE_PAGE_SIZE;
      delete searchQuery.page;
      searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
      searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;

      if (searchQuery.service_unit === undefined) {
        searchQuery.service_unit = "";
      }

      dispatch(fetchContacts(mapContactSearchFilters(searchQuery)));
    };

    search();
  }, [dispatch, location.search, userActiveServiceUnit, queryParams]);

  const handleSearchChange = (
    query: Record<string, any>,
    resetActivePage: boolean = false,
  ) => {
    const searchQuery = { ...query };
    if (!resetActivePage && queryParams.page) {
      searchQuery.page = queryParams.page;
    }
    navigate({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(searchQuery),
    });
  };

  const handleCreateButtonClick = () => {
    dispatch(initializeContactForm({}));
    navigate({
      pathname: getRouteById(Routes.CONTACT_NEW),
      search: location.search,
    });
  };

  const handleRowClick = (id: number | string) => {
    navigate({
      pathname: `${getRouteById(Routes.CONTACTS)}/${id}`,
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
    navigate({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(query),
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

    navigate({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(searchQuery),
    });
  };

  const renderClickableCell = (
    content: React.ReactNode,
    rowId: number | string,
  ) => (
    <button
      className="contact-list-row-link"
      type="button"
      onClick={() => handleRowClick(rowId)}
    >
      {content}
    </button>
  );

  const toggleRowExpanded = (rowId: ContactId) => {
    const rowKey = String(rowId);
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const renderExpandToggle = (row: Contact) => {
    if (!hasRowMultipleValues(row)) {
      return null;
    }
    const isExpanded = !!expandedRows[String(row.id)];

    return (
      <Button
        className="contact-list-expand-button"
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

  const columns = useMemo(() => {
    const cols: TableProps["cols"] = [];

    const renderMultiItemColumnContent = (
      row: Contact,
      columnKey: string,
      valueTransform?: (value: unknown) => unknown,
    ) => {
      const items = row[columnKey];
      const isExpanded = !!expandedRows[String(row.id)];
      const sortedItems =
        Array.isArray(items) && columnKey === "contacts_active_leases"
          ? sortLeasesByIdentifier(items)
          : items;

      return (
        <MultiItemCollapse
          items={sortedItems}
          itemRenderer={valueTransform}
          open={isExpanded}
          useTagForCount
        />
      );
    };

    if (isFieldAllowedToRead(contactAttributes, ContactFieldPaths.TYPE)) {
      cols.push({
        key: "type",
        headerName: ContactFieldTitles.TYPE,
        isSortable: true,
        transform: (row: Contact) =>
          renderClickableCell(
            getLabelOfOption(typeOptions, row.type) || "-",
            row.id,
          ),
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.FIRST_NAME) ||
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.LAST_NAME) ||
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.NAME)
    ) {
      cols.push({
        key: "names",
        headerName: "Nimi",
        isSortable: true,
        transform: (row: Contact) =>
          renderClickableCell(getContactFullName(row) || "-", row.id),
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.BUSINESS_ID)
    ) {
      cols.push({
        key: "business_id",
        headerName: ContactFieldTitles.BUSINESS_ID,
        isSortable: true,
        transform: (row: Contact) =>
          renderClickableCell(row.business_id || "-", row.id),
      });
    }

    if (isFieldAllowedToRead(contactAttributes, ContactFieldPaths.ID)) {
      cols.push({
        key: "id",
        headerName: ContactFieldTitles.ID,
        isSortable: false,
        transform: (row: Contact) => renderClickableCell(row.id, row.id),
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.SERVICE_UNIT)
    ) {
      cols.push({
        key: "service_unit",
        headerName: ContactFieldTitles.SERVICE_UNIT,
        isSortable: false,
        transform: (row: Contact) =>
          renderClickableCell(row.service_unit?.name || "-", row.id),
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.ACTIVE_LEASES)
    ) {
      cols.push({
        key: "contacts_active_leases",
        headerName: ContactFieldTitles.ACTIVE_LEASES,
        isSortable: false,
        transform: (row: Contact) =>
          renderMultiItemColumnContent(
            row,
            "contacts_active_leases",
            (lease: ContactsActiveLease) => lease.lease_identifier,
          ),
      });
    }

    // Column for the expand/collapse button for rows with multiple values.
    cols.push({
      key: "expand",
      headerName: "",
      isSortable: false,
      transform: (row: Contact) => renderExpandToggle(row),
    });

    return cols;
    // Exhaustive deps includes functions that are recreated on every render,
    // which would cause unnecessary re-renders of the table.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactAttributes, typeOptions, expandedRows]);

  if (isFetchingContactAttributes)
    return (
      <PageContainerHDS>
        <Loader isLoading={true} />
      </PageContainerHDS>
    );

  if (!contactMethods) return null;

  if (!isMethodAllowed(contactMethods, Methods.GET))
    return (
      <PageContainerHDS>
        <AuthorizationError text={PermissionMissingTexts.CONTACT} />
      </PageContainerHDS>
    );

  return (
    <PageContainerHDS>
      <ContentContainerHds>
        <Search
          isSearchInitialized={!!userActiveServiceUnit}
          onSearch={handleSearchChange}
          sortKey={sortKey}
          sortOrder={sortOrder}
          allowCreate={isMethodAllowed(contactMethods, Methods.POST)}
          onCreateContact={handleCreateButtonClick}
        />

        {isFetching && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={true} />
          </LoaderWrapper>
        )}
        <span>{isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}</span>
        <Table
          ariaLabelSortButtonUnset="Not sorted"
          ariaLabelSortButtonAscending="Sorted in ascending order"
          ariaLabelSortButtonDescending="Sorted in descending order"
          id="contact-list-table"
          indexKey="id"
          renderIndexCol={true}
          cols={columns}
          rows={contacts}
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
      </ContentContainerHds>
    </PageContainerHDS>
  );
};

export default ContactListPage;
