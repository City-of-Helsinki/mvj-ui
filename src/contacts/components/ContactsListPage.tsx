import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { initialize } from "redux-form";
import flowRight from "lodash/flowRight";
import { Row, Column } from "react-foundation";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "./search/Search";
import SortableTable from "@/components/table/SortableTable";
import TableFilters from "@/components/table/TableFilters";
import TableWrapper from "@/components/table/TableWrapper";
import { fetchContacts, initializeContactForm } from "@/contacts/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "@/contacts/constants";
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
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
import { withContactAttributes } from "@/components/attributes/ContactAttributes";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type {
  ContactList,
  ContactRow,
  ContactsActiveLease,
} from "@/contacts/types";
import type { Attributes, Methods as MethodsType } from "types";
import type { RootState } from "@/root/types";
import type { UserServiceUnit } from "@/usersPermissions/types";
type Props = {
  contactAttributes: Attributes;
  contactList: ContactList;
  contactMethods: MethodsType;
  fetchContacts: (...args: Array<any>) => any;
  history: Record<string, any>;
  initializeContactForm: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  isFetching: boolean;
  isFetchingContactAttributes: boolean;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  router: Record<string, any>;
  userActiveServiceUnit: UserServiceUnit;
};
type State = {
  activePage: number;
  contactAttributes: Attributes;
  contactList: ContactList;
  contacts: Array<Record<string, any>>;
  count: number;
  isSearchInitialized: boolean;
  maxPage: number;
  sortKey: string;
  sortOrder: string;
  typeOptions: Array<Record<string, any>>;
};

class ContactListPage extends Component<Props, State> {
  _isMounted: boolean;
  _hasFetchedContacts: boolean;
  state = {
    activePage: 1,
    contactAttributes: null,
    contactList: {},
    contacts: [],
    count: 0,
    isSearchInitialized: false,
    maxPage: 0,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    typeOptions: [],
    userActiveServiceUnit: undefined,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.contactAttributes !== state.contactAttributes) {
      newState.contactAttributes = props.contactAttributes;
      newState.typeOptions = getFieldOptions(
        props.contactAttributes,
        ContactFieldPaths.TYPE,
      );
    }

    if (props.contactList !== state.contactList) {
      newState.contactList = props.contactList;
      newState.count = getApiResponseCount(props.contactList);
      newState.contacts = getApiResponseResults(props.contactList);
      newState.maxPage = getApiResponseMaxPage(
        props.contactList,
        LIST_TABLE_PAGE_SIZE,
      );
    }

    return newState;
  }

  componentDidMount() {
    const { receiveTopNavigationSettings } = this.props;
    setPageTitle("Asiakkaat");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CONTACTS),
      pageTitle: "Asiakkaat",
      showSearch: false,
    });
    window.addEventListener("popstate", this.handlePopState);
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: currentSearch },
      userActiveServiceUnit,
    } = this.props;
    const {
      location: { search: prevSearch },
      userActiveServiceUnit: prevUserActiveServiceUnit,
    } = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    const handleSearch = () => {
      this.setSearchFormValues();
      this.search();
    };

    if (userActiveServiceUnit) {
      if (!this._hasFetchedContacts) {
        // No search has been done yet
        handleSearch();
        this._hasFetchedContacts = true;
      } else if (
        userActiveServiceUnit !== prevUserActiveServiceUnit &&
        !currentSearch.includes("service_unit")
      ) {
        // Search again after changing user active service unit only if not explicitly setting the service unit filter
        handleSearch();
      }
    }

    if (currentSearch !== prevSearch) {
      this.search();
      // Ignore these two from searchquery length check
      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if (!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePopState);
    this._isMounted = false;
    this._hasFetchedContacts = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  };
  setSearchFormValues = () => {
    const {
      location: { search },
      initialize,
      userActiveServiceUnit,
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    const setSearchFormReady = () => {
      this.setState({
        isSearchInitialized: true,
      });
    };

    const initializeSearchForm = async () => {
      const initialValues = { ...searchQuery };

      if (initialValues.service_unit === undefined && userActiveServiceUnit) {
        initialValues.service_unit = userActiveServiceUnit.id;
      }

      delete initialValues.page;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.CONTACT_SEARCH, initialValues);
    };

    this.setState(
      {
        activePage: page,
        isSearchInitialized: false,
        sortKey: searchQuery.sort_key ? searchQuery.sort_key : DEFAULT_SORT_KEY,
        sortOrder: searchQuery.sort_order
          ? searchQuery.sort_order
          : DEFAULT_SORT_ORDER,
      },
      async () => {
        await initializeSearchForm();

        if (this._isMounted) {
          setSearchFormReady();
        }
      },
    );
  };
  handleCreateButtonClick = () => {
    const { initializeContactForm } = this.props;
    const {
      history,
      location: { search },
    } = this.props;
    initializeContactForm({});
    return history.push({
      pathname: getRouteById(Routes.CONTACT_NEW),
      search: search,
    });
  };
  handleSearchChange = (query: any, resetActivePage: boolean = false) => {
    const { history } = this.props;

    if (resetActivePage) {
      this.setState({
        activePage: 1,
      });
    }

    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(query),
    });
  };

  search = () => {
    const {
      fetchContacts,
      location: { search },
      userActiveServiceUnit,
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if (page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;
    searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
    searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;

    if (searchQuery.service_unit === undefined && userActiveServiceUnit) {
      searchQuery.service_unit = userActiveServiceUnit.id;
    }

    fetchContacts(mapContactSearchFilters(searchQuery));
  };
  handleRowClick = (id) => {
    const {
      history,
      location: { search },
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}/${id}`,
      search: search,
    });
  };
  handlePageClick = (page: number) => {
    const {
      history,
      location: { search },
    } = this.props;
    const query = getUrlParams(search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({
      activePage: page,
    });
    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(query),
    });
  };
  getColumns = () => {
    const { contactAttributes } = this.props;
    const { typeOptions } = this.state;
    const columns = [];

    if (isFieldAllowedToRead(contactAttributes, ContactFieldPaths.TYPE)) {
      columns.push({
        key: "type",
        text: ContactFieldTitles.TYPE,
        renderer: (val) => getLabelOfOption(typeOptions, val),
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.FIRST_NAME) ||
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.LAST_NAME) ||
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.NAME)
    ) {
      columns.push({
        key: "names",
        text: "Nimi",
        renderer: (val, row) => getContactFullName(row),
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.BUSINESS_ID)
    ) {
      columns.push({
        key: "business_id",
        text: ContactFieldTitles.BUSINESS_ID,
      });
    }

    if (isFieldAllowedToRead(contactAttributes, ContactFieldPaths.ID)) {
      columns.push({
        key: "id",
        text: ContactFieldTitles.ID,
        sortable: false,
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.SERVICE_UNIT)
    ) {
      columns.push({
        key: "service_unit.name",
        text: ContactFieldTitles.SERVICE_UNIT,
        sortable: false,
      });
    }

    if (
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.ACTIVE_LEASES)
    ) {
      columns.push({
        key: "contacts_active_leases",
        text: ContactFieldTitles.ACTIVE_LEASES,
        renderer: (_val: ContactsActiveLease, row: ContactRow) =>
          (row.contacts_active_leases || [])
            .map((activeLease) => activeLease.lease_identifier)
            .join(", ") || "",
        sortable: false,
      });
    }

    return columns;
  };
  handleSortingChange = ({ sortKey, sortOrder }) => {
    const {
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    this.setState({
      sortKey,
      sortOrder,
    });
    this.handleSearchChange(searchQuery);
  };

  render() {
    const {
      contactMethods,
      isFetching,
      isFetchingContactAttributes,
      userActiveServiceUnit,
    } = this.props;
    const {
      activePage,
      contacts,
      count,
      isSearchInitialized,
      maxPage,
      sortKey,
      sortOrder,
    } = this.state;
    const columns = this.getColumns();
    if (isFetchingContactAttributes)
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    if (!contactMethods) return null;
    if (!isMethodAllowed(contactMethods, Methods.GET))
      return (
        <PageContainer>
          <AuthorizationError text={PermissionMissingTexts.CONTACT} />
        </PageContainer>
      );
    return (
      <PageContainer>
        <Row>
          <Column small={12} large={4}>
            <Authorization
              allow={isMethodAllowed(contactMethods, Methods.POST)}
            >
              <AddButtonSecondary
                className="no-top-margin"
                label="Luo asiakas"
                onClick={this.handleCreateButtonClick}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            {userActiveServiceUnit && (
              <Search
                isSearchInitialized={isSearchInitialized}
                onSearch={this.handleSearchChange}
                sortKey={sortKey}
                sortOrder={sortOrder}
              />
            )}

            <TableFilters
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
            data={contacts}
            listTable
            onRowClick={this.handleRowClick}
            onSortingChange={this.handleSortingChange}
            serverSideSorting
            sortable
            sortKey={sortKey}
            sortOrder={sortOrder}
          />
          <Pagination
            activePage={activePage}
            maxPage={maxPage}
            onPageClick={this.handlePageClick}
          />
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withContactAttributes,
  withRouter,
  connect(
    (state: RootState) => {
      return {
        contactList: getContactList(state),
        isFetching: getIsFetching(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
      };
    },
    {
      fetchContacts,
      initialize,
      initializeContactForm,
      receiveTopNavigationSettings,
    },
  ),
)(ContactListPage);
