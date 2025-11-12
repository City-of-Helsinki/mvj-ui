import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import flowRight from "lodash/flowRight";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { Row, Column } from "react-foundation";
import debounce from "lodash/debounce";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import FieldTypeSelect from "@/components/form/final-form/FieldTypeSelect";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import CreateLeaseModal from "./createLease/CreateLeaseModal";
import IconRadioButtons from "@/components/button/IconRadioButtons";
import LeaseListMap from "@/leases/components/leaseSections/map/LeaseListMap";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import MapIcon from "@/components/icons/MapIcon";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import Search from "./search/Search";
import SortableTable from "@/components/table/SortableTable";
import TableFilters from "@/components/table/TableFilters";
import TableIcon from "@/components/icons/TableIcon";
import TableFilterWrapper from "@/components/table/TableFilterWrapper";
import TableWrapper from "@/components/table/TableWrapper";
import VisualisationTypeWrapper from "@/components/table/VisualisationTypeWrapper";
import { fetchAreaNoteList } from "@/areaNote/actions";
import { fetchServiceUnits } from "@/serviceUnits/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { createLease, fetchLeases, fetchLeasesByBBox } from "@/leases/actions";
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
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
import {
  LeaseAreasFieldPaths,
  LeaseAreaAddressesFieldPaths,
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeaseTenantsFieldPaths,
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
  getAreaNoteList,
  getMethods as getAreaNoteMethods,
} from "@/areaNote/selectors";
import {
  getIsFetching,
  getIsFetchingByBBox,
  getLeasesList,
} from "@/leases/selectors";
import { getLessorList } from "@/lessor/selectors";
import {
  getUsersPermissions,
  getUserActiveServiceUnit,
} from "@/usersPermissions/selectors";
import { withLeaseAttributes } from "@/components/attributes/LeaseAttributes";
import { withUiDataList } from "@/components/uiData/UiDataListHOC";
import {
  getServiceUnits,
  getIsFetching as getIsFetchingServiceUnits,
} from "@/serviceUnits/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { AreaNoteList } from "@/areaNote/types";
import type { LeaseList } from "@/leases/types";
import type { LessorList } from "@/lessor/types";
import type { ServiceUnits } from "@/serviceUnits/types";
import type {
  UsersPermissions as UsersPermissionsType,
  UserServiceUnit,
} from "@/usersPermissions/types";
import { ButtonLabels } from "@/components/enums";

const VisualizationTypes = {
  MAP: "map",
  TABLE: "table",
};
const visualizationTypeOptions = [
  {
    value: VisualizationTypes.TABLE,
    label: "Taulukko",
    icon: <TableIcon className="icon-medium" />,
  },
  {
    value: VisualizationTypes.MAP,
    label: "Kartta",
    icon: <MapIcon className="icon-medium" />,
  },
];
type Props = {
  areaNotes: AreaNoteList;
  createLease: (...args: Array<any>) => any;
  fetchAreaNoteList: (...args: Array<any>) => any;
  fetchLeases: (...args: Array<any>) => any;
  fetchLeasesByBBox: (...args: Array<any>) => any;
  fetchLessors: (...args: Array<any>) => any;
  fetchServiceUnits: (...args: Array<any>) => any;
  history: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  isFetching: boolean;
  isFetchingByBBox: boolean;
  isFetchingLeaseAttributes: boolean;
  isFetchingServiceUnits: boolean;
  leaseAttributes: Attributes;
  leaseMethods: MethodsType;
  leases: LeaseList;
  lessors: LessorList;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  serviceUnits: ServiceUnits;
  userActiveServiceUnit: UserServiceUnit;
  usersPermissions: UsersPermissionsType;
};
type State = {
  activePage: number;
  isModalOpen: boolean;
  leaseStates: Array<any>;
  isSearchInitialized: boolean;
  sortKey: string;
  sortOrder: string;
  visualizationType: string;
  serviceUnitOptions: Array<Record<string, any>>;
  selectedServiceUnitOptionValue: unknown; // empty string if no value, otherwise number
};

class LeaseListPage extends PureComponent<Props, State> {
  _isMounted: boolean;
  _hasFetchedLeases: boolean; // Check if search has been done yet

  firstLeaseModalField: any;
  state: any = {
    activePage: 1,
    isModalOpen: false,
    leaseStates: DEFAULT_LEASE_STATES,
    isSearchInitialized: false,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    visualizationType: VisualizationTypes.TABLE,
    serviceUnitOptions: [],
    selectedServiceUnitOptionValue: "",
  };
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      fetchAreaNoteList,
      fetchLessors,
      fetchServiceUnits,
      isFetchingServiceUnits,
      lessors,
      receiveTopNavigationSettings,
      serviceUnits,
      leaseAttributes,
    } = this.props;
    setPageTitle("Vuokraukset");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASES),
      pageTitle: "Vuokraukset",
      showSearch: false,
    });

    if (!isFetchingServiceUnits && isEmpty(serviceUnits)) {
      fetchServiceUnits();
    }

    fetchAreaNoteList({
      limit: 10000,
    });

    if (isEmpty(lessors)) {
      fetchLessors({
        limit: 10000,
      });
    }

    window.addEventListener("popstate", this.handlePopState);
    this._isMounted = true;
    this.setState({
      serviceUnitOptions: getFieldOptions(
        leaseAttributes,
        "service_unit",
        true,
      ),
    });
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: currentSearch },
      userActiveServiceUnit,
      leaseAttributes,
    } = this.props;
    const { visualizationType } = this.state;
    const {
      location: { search: prevSearch },
    } = prevProps;

    const initializeSearch = () => {
      const searchQuery = getUrlParams(currentSearch);
      this.setSearchFormValues();

      if (searchQuery.visualization === VisualizationTypes.MAP) {
        this.setState({
          visualizationType: VisualizationTypes.MAP,
        });
        this.searchByBBox();
      } else {
        this.search();
      }
    };

    const searchByType = () => {
      this.setSearchFormValues();

      switch (visualizationType) {
        case VisualizationTypes.MAP:
          this.searchByBBox();
          break;

        case VisualizationTypes.TABLE:
          this.search();
          break;
      }
    };

    if (userActiveServiceUnit) {
      if (!this._hasFetchedLeases) {
        // No search has been done yet
        initializeSearch();
        this._hasFetchedLeases = true;
      }
    }

    if (currentSearch !== prevSearch) {
      searchByType();
    }

    // Update service unit options if they have changed
    if (
      this.props.leaseAttributes?.service_unit &&
      leaseAttributes?.service_unit?.choices.length !==
        prevProps.leaseAttributes?.service_unit?.choices.length
    ) {
      this.setState({
        serviceUnitOptions: getFieldOptions(
          leaseAttributes,
          "service_unit",
          true,
        ),
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePopState);
    this._isMounted = false;
    this._hasFetchedLeases = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  };
  getLeaseStates = (query: Record<string, any>) => {
    return isArray(query.lease_state)
      ? query.lease_state
      : query.lease_state
        ? [query.lease_state]
        : query.search ||
            Object.prototype.hasOwnProperty.call(query, "lease_state")
          ? []
          : DEFAULT_LEASE_STATES;
  };
  getOnlyActiveLeasesValue = (query: Record<string, any>) => {
    return query.only_active_leases != undefined
      ? query.only_active_leases
      : query.search
        ? undefined
        : DEFAULT_ONLY_ACTIVE_LEASES;
  };
  setSearchFormValues = () => {
    const {
      location: { search },
      initialize,
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    const states = this.getLeaseStates(searchQuery);

    const setSearchFormReady = () => {
      this.setState({
        isSearchInitialized: true,
      });
    };

    const initializeSearchForm = async () => {
      const initialValues = { ...searchQuery };
      const onlyActiveLeases = this.getOnlyActiveLeasesValue(searchQuery);
      const tenantContactTypes = isArray(searchQuery.tenantcontact_type)
        ? searchQuery.tenantcontact_type
        : searchQuery.tenantcontact_type
          ? [searchQuery.tenantcontact_type]
          : [];

      if (initialValues.service_unit === undefined) {
        initialValues.service_unit = "";
      } else {
        this.setState({
          selectedServiceUnitOptionValue: initialValues.service_unit,
        });
      }

      if (onlyActiveLeases != undefined) {
        initialValues.only_active_leases = onlyActiveLeases;
      }

      if (tenantContactTypes.length) {
        initialValues.tenantcontact_type = tenantContactTypes;
      }

      delete initialValues.page;
      delete initialValues.lease_state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      delete initialValues.in_bbox;
      delete initialValues.visualization;
      delete initialValues.zoom;
      initialize(FormNames.LEASE_SEARCH, initialValues);
    };

    this.setState(
      {
        activePage: page,
        isSearchInitialized: false,
        leaseStates: states,
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
  showCreateLeaseModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };
  hideCreateLeaseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };
  search = () => {
    const {
      fetchLeases,
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    const leaseStates = this.getLeaseStates(searchQuery);
    const onlyActiveLeases = this.getOnlyActiveLeasesValue(searchQuery);

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
    fetchLeases(mapLeaseSearchFilters(searchQuery));
  };
  searchByBBox = () => {
    const {
      fetchLeasesByBBox,
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    const leaseStates = this.getLeaseStates(searchQuery);
    const onlyActiveLeases = this.getOnlyActiveLeasesValue(searchQuery);

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
    fetchLeasesByBBox(mapLeaseSearchFilters(searchQuery));
  };
  handleSearchChange = (
    formValues: Record<string, any>,
    resetActivePage: boolean = false,
    resetFilters: boolean = false,
  ) => {
    const {
      history,
      location: { search },
    } = this.props;
    const query = getUrlParams(search);
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
      this.setState({
        activePage: 1,
      });
      delete searchQuery.page;
    }

    if (resetFilters) {
      this.setState({
        leaseStates: DEFAULT_LEASE_STATES,
      });
      delete searchQuery.lease_state;
    }

    return history.push({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };
  handleServiceUnitChange = (value: unknown) => {
    const {
      location: { search },
    } = this.props;
    // get other form values from query params
    const query = getUrlParams(search);
    this.handleSearchChange(
      Object.assign(query, {
        service_unit: value,
      }),
    );
    this.setState({
      selectedServiceUnitOptionValue: value,
    });
  };
  handleRowClick = (id) => {
    const {
      history,
      location: { search },
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.LEASES)}/${id}`,
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
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(query),
    });
  };
  getColumns = () => {
    const { leaseAttributes } = this.props;
    const stateOptions = getFieldOptions(
      leaseAttributes,
      LeaseFieldPaths.STATE,
      false,
    );
    const columns = [];

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.IDENTIFIER)) {
      columns.push({
        key: "identifier",
        text: LeaseFieldTitles.IDENTIFIER,
      });
    }

    if (
      isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.IDENTIFIER)
    ) {
      columns.push({
        key: "lease_area_identifiers",
        text: "Vuokrakohde",
        sortable: false,
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
        text: "Osoite",
        sortable: false,
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)) {
      columns.push({
        key: "tenants",
        text: "Vuokralainen",
        sortable: false,
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.LESSOR)) {
      columns.push({
        key: "lessor",
        text: "Vuokranantaja",
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.STATE)) {
      columns.push({
        key: "state",
        text: "Tyyppi",
        renderer: (val) => getLabelOfOption(stateOptions, val),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.START_DATE)) {
      columns.push({
        key: "start_date",
        text: "Alkupvm",
        renderer: (val) => formatDate(val),
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.END_DATE)) {
      columns.push({
        key: "end_date",
        text: "Loppupvm",
        renderer: (val) => formatDate(val),
      });
    }

    return columns;
  };
  handleLeaseStatesChange = (values: Array<string>) => {
    const {
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    delete searchQuery.page;
    searchQuery.lease_state = values;
    this.setState({
      leaseStates: values,
    });
    this.handleSearchChange(searchQuery, true);
  };
  handleVisualizationTypeChange = (value: string) => {
    this.setState(
      {
        visualizationType: value,
      },
      () => {
        const {
          history,
          location: { search },
        } = this.props;
        const searchQuery = getUrlParams(search);

        if (value === VisualizationTypes.MAP) {
          searchQuery.visualization = VisualizationTypes.MAP;
        } else {
          delete searchQuery.visualization;
        }

        return history.push({
          pathname: getRouteById(Routes.LEASES),
          search: getSearchQuery(searchQuery),
        });
      },
    );
  };
  handleSortingChange = ({ sortKey, sortOrder }) => {
    const {
      history,
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    this.setState({
      sortKey,
      sortOrder,
    });
    return history.push({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  };
  handleMapViewportChanged = debounce((mapOptions: Record<string, any>) => {
    const {
      history,
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    searchQuery.in_bbox = mapOptions.bBox.split(",");
    searchQuery.zoom = mapOptions.zoom;
    return history.push({
      pathname: getRouteById(Routes.LEASES),
      search: getSearchQuery(searchQuery),
    });
  }, 1000);

  render() {
    const {
      activePage,
      isModalOpen,
      leaseStates,
      isSearchInitialized,
      sortKey,
      sortOrder,
      visualizationType,
      serviceUnitOptions,
      selectedServiceUnitOptionValue,
    } = this.state;
    const {
      createLease,
      isFetching,
      isFetchingByBBox,
      isFetchingLeaseAttributes,
      leaseAttributes,
      leaseMethods,
      leases: content,
      location: { query },
    } = this.props;
    const leases = getContentLeaseListResults(content, query);
    const count = getApiResponseCount(content);
    const maxPage = getApiResponseMaxPage(content, LIST_TABLE_PAGE_SIZE);
    const columns = this.getColumns();
    if (isFetchingLeaseAttributes)
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    if (!leaseMethods) return null;
    if (!isMethodAllowed(leaseMethods, Methods.GET))
      return (
        <PageContainer>
          <AuthorizationError text={PermissionMissingTexts.LEASE} />
        </PageContainer>
      );
    const serviceUnitFilter = (
      <SearchRow>
        <SearchLabelColumn>
          <SearchLabel>{LeaseFieldTitles.SERVICE_UNIT}</SearchLabel>
        </SearchLabelColumn>
        <SearchInputColumn>
          <FieldTypeSelect
            autoBlur={false}
            disabled={false}
            displayError={false}
            input={{
              onChange: this.handleServiceUnitChange,
              onBlur: () => {},
              value: selectedServiceUnitOptionValue,
            }}
            isDirty={false}
            options={serviceUnitOptions}
            placeholder=""
            setRefForField={() => {}}
          />
        </SearchInputColumn>
      </SearchRow>
    );
    return (
      <PageContainer>
        <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
          <CreateLeaseModal
            isOpen={isModalOpen}
            onClose={this.hideCreateLeaseModal}
            onSubmit={createLease}
          />
        </Authorization>
        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
              <AddButtonSecondary
                className="no-top-margin"
                label={ButtonLabels.CREATE_LEASE_IDENTIFIER}
                onClick={this.showCreateLeaseModal}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search
              attributes={leaseAttributes}
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
            />
          </Column>
        </Row>

        <TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
              filterOptions={leaseStateFilterOptions}
              filterValue={leaseStates}
              onFilterChange={this.handleLeaseStatesChange}
              componentToRenderUnderTitle={serviceUnitFilter}
            />
          }
          visualizationComponent={
            <VisualisationTypeWrapper>
              <IconRadioButtons
                legend={"Kartta/taulukko"}
                onChange={this.handleVisualizationTypeChange}
                options={visualizationTypeOptions}
                radioName="visualization-type-radio"
                value={visualizationType}
              />
            </VisualisationTypeWrapper>
          }
        />

        <TableWrapper>
          {isFetching && (
            <LoaderWrapper className="relative-overlay-wrapper">
              <Loader isLoading={true} />
            </LoaderWrapper>
          )}
          {visualizationType === "table" && (
            <Fragment>
              <SortableTable
                columns={columns}
                data={leases}
                listTable
                onRowClick={this.handleRowClick}
                onSortingChange={this.handleSortingChange}
                serverSideSorting
                showCollapseArrowColumn
                sortable
                sortKey={sortKey}
                sortOrder={sortOrder}
              />
              <Pagination
                activePage={activePage}
                maxPage={maxPage}
                onPageClick={(page) => this.handlePageClick(page)}
              />
            </Fragment>
          )}
          {visualizationType === "map" && (
            <LeaseListMap
              allowToEdit={false}
              isLoading={isFetchingByBBox}
              onViewportChanged={this.handleMapViewportChanged}
            />
          )}
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withLeaseAttributes,
  withUiDataList,
  connect(
    (state) => {
      return {
        areaNoteMethods: getAreaNoteMethods(state),
        areaNotes: getAreaNoteList(state),
        isFetching: getIsFetching(state),
        isFetchingByBBox: getIsFetchingByBBox(state),
        isFetchingServiceUnits: getIsFetchingServiceUnits(state),
        leases: getLeasesList(state),
        lessors: getLessorList(state),
        serviceUnits: getServiceUnits(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      createLease,
      fetchAreaNoteList,
      fetchLeases,
      fetchLeasesByBBox,
      fetchLessors,
      fetchServiceUnits,
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseListPage);
