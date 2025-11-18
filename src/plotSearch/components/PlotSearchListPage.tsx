import React, { Fragment, PureComponent } from "react";
import flowRight from "lodash/flowRight";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { initialize } from "redux-form";
import { withRouter } from "react-router";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
import ExternalLink from "@/components/links/ExternalLink";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import IconRadioButtons from "@/components/button/IconRadioButtons";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import MapIcon from "@/components/icons/MapIcon";
import PageContainer from "@/components/content/PageContainer";
import Pagination from "@/components/table/Pagination";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import Search from "@/plotSearch/components/search/Search";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import SortableTable from "@/components/table/SortableTable";
import TableFilters from "@/components/table/TableFilters";
import TableFilterWrapper from "@/components/table/TableFilterWrapper";
import TableWrapper from "@/components/table/TableWrapper";
import TableIcon from "@/components/icons/TableIcon";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import VisualisationTypeWrapper from "@/components/table/VisualisationTypeWrapper";
import { createPlotSearch, fetchPlotSearchList } from "@/plotSearch/actions";
import { getIsFetching, getPlotSearchList } from "@/plotSearch/selectors";
import { getRouteById, Routes } from "@/root/routes";
import {
  formatDate,
  getLabelOfOption,
  setPageTitle,
  getFieldOptions,
  getSearchQuery,
  getApiResponseCount,
  getApiResponseMaxPage,
  getUrlParams,
  isMethodAllowed,
} from "@/util/helpers";
import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  DEFAULT_PLOT_SEARCH_STATES,
} from "@/plotSearch/constants";
import { getContentPlotSearchListResults } from "@/plotSearch/helpers";
import type { PlotSearch, PlotSearchList } from "@/plotSearch/types";
import CreatePlotSearchModal from "@/plotSearch/components/CreatePlotSearchModal";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import { withPlotSearchAttributes } from "@/components/attributes/PlotSearchAttributes";
import type { Attributes, Methods as MethodsType } from "types";
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
type OwnProps = {};
type Props = OwnProps & {
  history: Record<string, any>;
  location: Record<string, any>;
  createPlotSearch: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  plotSearchAttributes: Attributes;
  isFetchingPlotSearchAttributes: boolean;
  isFetching: boolean;
  plotSearchListData: PlotSearchList;
  initialize: (...args: Array<any>) => any;
  fetchPlotSearchList: (...args: Array<any>) => any;
  plotSearchMethods: MethodsType;
};
type State = {
  properties: Array<Record<string, any>>;
  activePage: number;
  visualizationType: string;
  plotSearchStates: Array<string>;
  isSearchInitialized: boolean;
  count: number;
  sortKey: string;
  sortOrder: string;
  maxPage: number;
  selectedStates: Array<string>;
  isModalOpen: boolean;
};

class PlotSearchListPage extends PureComponent<Props, State> {
  _isMounted: boolean;
  state = {
    properties: [],
    visualizationType: VisualizationTypes.TABLE,
    plotSearchStates: DEFAULT_PLOT_SEARCH_STATES,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    activePage: 1,
    count: 0,
    isSearchInitialized: false,
    maxPage: 0,
    selectedStates: [],
    isModalOpen: false,
  };

  componentDidMount() {
    const { receiveTopNavigationSettings } = this.props;
    setPageTitle("Tonttihaut");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_SEARCH),
      pageTitle: "Tonttihaut",
      showSearch: false,
    });
    this.search();
    this.setSearchFormValues();
    window.addEventListener("popstate", this.handlePopState);
    this._isMounted = true;
  }

  handleVisualizationTypeChange = () => {};
  handlePlotSearchStatesChange = () => {
    const {
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    delete searchQuery.page;
    this.handleSearchChange(searchQuery, true);
  };
  getColumns = () => {
    const { plotSearchAttributes } = this.props;
    const columns = [];
    const typeOptions = getFieldOptions(plotSearchAttributes, "type");
    const subtypeOptions = getFieldOptions(plotSearchAttributes, "subtype");
    const stageOptions = getFieldOptions(plotSearchAttributes, "stage");
    columns.push({
      key: "name",
      text: "Haku",
      sortable: false,
    });
    columns.push({
      key: "type",
      text: "Hakutyyppi",
      sortable: false,
      renderer: (val) => getLabelOfOption(typeOptions, val),
    });
    columns.push({
      key: "subtype",
      text: "Haun alatyyppi",
      sortable: false,
      renderer: (val) => getLabelOfOption(subtypeOptions, val),
    });
    columns.push({
      key: "stage",
      text: "Haun vaihe",
      sortable: false,
      renderer: (val) => getLabelOfOption(stageOptions, val),
    });
    columns.push({
      key: "begin_at",
      text: "Alkupvm",
      sortable: false,
      renderer: (val) => formatDate(val),
    });
    columns.push({
      key: "end_at",
      text: "Loppupvm",
      sortable: false,
      renderer: (val) => formatDate(val),
    });
    columns.push({
      key: "latest_decicion",
      text: "Viimeisin päätös",
      sortable: false,
      renderer: (id) =>
        id ? (
          <ExternalLink href={"/"} text={id} /> // getReferenceNumberLink(id)
        ) : null,
    });
    columns.push({
      key: "id",
      text: "Kohteen tunnus",
      sortable: false,
      renderer: (id) =>
        id ? (
          <ExternalLink href={"/"} text={id} /> // getReferenceNumberLink(id)
        ) : null,
    });
    return columns;
  };
  search = () => {
    const {
      fetchPlotSearchList,
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if (page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;
    fetchPlotSearchList(searchQuery);
  };
  handleRowClick = (id) => {
    const {
      history,
      location: { search },
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.PLOT_SEARCH)}/${id}`,
      search: search,
    });
  };
  handleSortingChange = () => {};
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
      pathname: getRouteById(Routes.PLOT_SEARCH),
      search: getSearchQuery(query),
    });
  };
  updateTableData = () => {
    const { plotSearchListData } = this.props;
    this.setState({
      count: getApiResponseCount(plotSearchListData),
      properties: getContentPlotSearchListResults(plotSearchListData),
      maxPage: getApiResponseMaxPage(plotSearchListData, LIST_TABLE_PAGE_SIZE),
    });
  };
  handleCreatePlotSearch = (plot_search: PlotSearch) => {
    const { createPlotSearch } = this.props;
    createPlotSearch(plot_search);
  };
  openModalhandleCreatePlotSearch = () => {
    const { initialize } = this.props;
    this.setState({
      isModalOpen: true,
    });
    initialize(FormNames.PLOT_SEARCH_CREATE, {});
  };
  hideCreatePlotSearchModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };
  handleSearchChange = (
    query: Record<string, any>,
    resetActivePage: boolean = true,
  ) => {
    const { history } = this.props;

    if (resetActivePage) {
      this.setState({
        activePage: 1,
      });
      delete query.page;
    }

    return history.push({
      pathname: getRouteById(Routes.PLOT_SEARCH),
      search: getSearchQuery(query),
    });
  };

  componentDidUpdate(prevProps) {
    const {
      location: { search: currentSearch },
    } = this.props;
    const {
      location: { search: prevSearch },
    } = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if (currentSearch !== prevSearch) {
      this.search();
      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if (!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }

    if (prevProps.plotSearchListData !== this.props.plotSearchListData) {
      this.updateTableData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePopState);
    this._isMounted = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  };
  setSearchFormValues = () => {
    const {
      location: { search },
      initialize,
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
      delete initialValues.page;
      delete initialValues.state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.PLOT_SEARCH_SEARCH, initialValues);
    };

    this.setState(
      {
        activePage: page,
        isSearchInitialized: false,
      },
      async () => {
        await initializeSearchForm();

        if (this._isMounted) {
          setSearchFormReady();
        }
      },
    );
  };

  render() {
    const { plotSearchMethods } = this.props;
    const {
      visualizationType,
      plotSearchStates,
      sortKey,
      sortOrder,
      isModalOpen,
    } = this.state;
    const columns = this.getColumns();
    const { isFetching, isFetchingPlotSearchAttributes, plotSearchAttributes } =
      this.props;
    const {
      activePage,
      isSearchInitialized,
      properties,
      maxPage,
      selectedStates,
    } = this.state;
    const plotSearchStateFilterOptions = getFieldOptions(
      plotSearchAttributes,
      "state",
      false,
    );
    const filteredProperties = selectedStates.length
      ? properties.filter(
          (contract) => selectedStates.indexOf(contract.state) !== -1,
        )
      : properties;
    const count = filteredProperties.length;
    if (isFetchingPlotSearchAttributes)
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    if (!plotSearchMethods) return null;
    if (!isMethodAllowed(plotSearchMethods, Methods.GET))
      return (
        <PageContainer>
          <AuthorizationError text={PermissionMissingTexts.PLOT_SEARCH} />
        </PageContainer>
      );
    return (
      <PageContainer>
        <Authorization allow={isMethodAllowed(plotSearchMethods, Methods.POST)}>
          <CreatePlotSearchModal
            isOpen={isModalOpen}
            onClose={this.hideCreatePlotSearchModal}
            onSubmit={this.handleCreatePlotSearch}
          />
        </Authorization>
        <Row>
          <Column small={12} large={4}>
            <Authorization
              allow={isMethodAllowed(plotSearchMethods, Methods.POST)}
            >
              <AddButtonSecondary
                className="no-top-margin"
                label="Luo tonttihaku"
                onClick={this.openModalhandleCreatePlotSearch}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              states={selectedStates}
              handleSubmit={() => {}}
            />
          </Column>
        </Row>

        <TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={isFetching ? "Ladataan..." : `Löytyi ${count} kpl`}
              filterOptions={plotSearchStateFilterOptions}
              filterValue={plotSearchStates}
              onFilterChange={this.handlePlotSearchStatesChange}
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
                data={filteredProperties}
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
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withRouter,
  withPlotSearchAttributes,
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        isFetching: getIsFetching(state),
        plotSearchListData: getPlotSearchList(state),
      };
    },
    {
      receiveTopNavigationSettings,
      createPlotSearch,
      initialize,
      fetchPlotSearchList,
    },
  ),
)(PlotSearchListPage) as React.ComponentType<OwnProps>;
