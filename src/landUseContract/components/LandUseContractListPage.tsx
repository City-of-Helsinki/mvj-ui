import React, { Component } from "react";
import { Row, Column } from "react-foundation";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import flowRight from "lodash/flowRight";
import isArray from "lodash/isArray";
import Authorization from "components/authorization/Authorization";
import AuthorizationError from "components/authorization/AuthorizationError";
import { FormNames, Methods, PermissionMissingTexts } from "enums";
import AddButtonSecondary from "components/form/AddButtonSecondary";
import CreateLandUseContractModal from "./createLandUseContract/CreateLandUseContractModal";
import Loader from "components/loader/Loader";
import LoaderWrapper from "components/loader/LoaderWrapper";
import PageContainer from "components/content/PageContainer";
import Pagination from "components/table/Pagination";
import Search from "./search/Search";
import SortableTable from "components/table/SortableTable";
import TableFilters from "components/table/TableFilters";
import TableWrapper from "components/table/TableWrapper";
import { receiveTopNavigationSettings } from "components/topNavigation/actions";
import { createLandUseContract, fetchLandUseContractList } from "landUseContract/actions";
import { LIST_TABLE_PAGE_SIZE } from "util/constants";
import { getContentLandUseContractListResults } from "landUseContract/helpers";
import { getApiResponseCount, getApiResponseMaxPage, getFieldOptions, getLabelOfOption, getSearchQuery, getUrlParams, setPageTitle, isMethodAllowed } from "util/helpers";
import { getRouteById, Routes } from "root/routes";
import { getIsFetching, getLandUseContractList } from "landUseContract/selectors";
import { withLandUseContractAttributes } from "components/attributes/LandUseContractAttributes";
import type { Attributes, Methods as MethodType } from "types";
import type { LandUseContract, LandUseContractList } from "landUseContract/types";
type Props = {
  createLandUseContract: (...args: Array<any>) => any;
  fetchLandUseContractList: (...args: Array<any>) => any;
  history: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  isFetching: boolean;
  isFetchingLandUseContractAttributes: boolean;
  landUseContractAttributes: Attributes;
  landUseContractListData: LandUseContractList;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  landUseContractMethods: MethodType;
};
type State = {
  activePage: number;
  count: number;
  isModalOpen: boolean;
  isSearchInitialized: boolean;
  landUseContracts: Array<Record<string, any>>;
  maxPage: number;
  selectedStates: Array<string>;
};

class LandUseContractListPage extends Component<Props, State> {
  _isMounted: boolean;
  state = {
    activePage: 1,
    count: 0,
    isModalOpen: false,
    isSearchInitialized: false,
    landUseContracts: [],
    maxPage: 0,
    selectedStates: []
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings
    } = this.props;
    setPageTitle('Maankäyttösopimukset');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LAND_USE_CONTRACTS),
      pageTitle: 'Maankäyttösopimukset',
      showSearch: false
    });
    this.search();
    this.setSearchFormValues();
    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: currentSearch
      }
    } = this.props;
    const {
      location: {
        search: prevSearch
      }
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

    if (prevProps.landUseContractListData !== this.props.landUseContractListData) {
      this.updateTableData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
    this._isMounted = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  };
  setSearchFormValues = () => {
    const {
      location: {
        search
      },
      initialize
    } = this.props;
    const searchQuery = getUrlParams(search);
    const states = isArray(searchQuery.state) ? searchQuery.state : searchQuery.state ? [searchQuery.lease_state] : [];
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    const setSearchFormReady = () => {
      this.setState({
        isSearchInitialized: true
      });
    };

    const initializeSearchForm = async () => {
      const initialValues = { ...searchQuery
      };
      delete initialValues.page;
      delete initialValues.state;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.LAND_USE_CONTRACT_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      selectedStates: states
    }, async () => {
      await initializeSearchForm();

      if (this._isMounted) {
        setSearchFormReady();
      }
    });
  };
  handleCreateButtonClick = () => {
    const {
      initialize
    } = this.props;
    this.setState({
      isModalOpen: true
    });
    initialize(FormNames.LAND_USE_CONTRACT_CREATE, {});
  };
  hideCreateLandUseContractModal = () => {
    this.setState({
      isModalOpen: false
    });
  };
  handleCreateLease = (landUseContract: LandUseContract) => {
    const {
      createLandUseContract
    } = this.props;
    createLandUseContract(landUseContract);
  };
  handleSearchChange = (query: Record<string, any>, resetActivePage: boolean = true) => {
    const {
      history
    } = this.props;

    if (resetActivePage) {
      this.setState({
        activePage: 1
      });
      delete query.page;
    }

    return history.push({
      pathname: getRouteById(Routes.LAND_USE_CONTRACTS),
      search: getSearchQuery(query)
    });
  };
  search = () => {
    const {
      fetchLandUseContractList,
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    delete searchQuery.page;

    if (page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    fetchLandUseContractList(searchQuery);
  };
  handleRowClick = id => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.LAND_USE_CONTRACTS)}/${id}`,
      search: search
    });
  };
  handlePageClick = (page: number) => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);

    if (page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({
      activePage: page
    });
    return history.push({
      pathname: getRouteById(Routes.LAND_USE_CONTRACTS),
      search: getSearchQuery(query)
    });
  };
  updateTableData = () => {
    const {
      landUseContractListData
    } = this.props;
    this.setState({
      count: getApiResponseCount(landUseContractListData),
      landUseContracts: getContentLandUseContractListResults(landUseContractListData),
      maxPage: getApiResponseMaxPage(landUseContractListData, LIST_TABLE_PAGE_SIZE)
    });
  };
  handleSelectedStatesChange = (states: Array<string>) => {
    const {
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    delete searchQuery.page;
    searchQuery.state = states;
    this.setState({
      selectedStates: states
    });
    this.handleSearchChange(searchQuery, true);
  };

  render() {
    const {
      isFetching,
      isFetchingLandUseContractAttributes,
      landUseContractAttributes,
      landUseContractMethods
    } = this.props;
    const {
      activePage,
      isModalOpen,
      isSearchInitialized,
      landUseContracts,
      maxPage,
      selectedStates
    } = this.state;
    const stateOptions = getFieldOptions(landUseContractAttributes, 'state', false);
    const filteredLandUseContracts = selectedStates.length ? landUseContracts.filter(contract => selectedStates.indexOf(contract.state) !== -1) : landUseContracts;
    const count = filteredLandUseContracts.length;
    if (isFetchingLandUseContractAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!landUseContractMethods) return null;
    if (!isMethodAllowed(landUseContractMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.LAND_USE_CONTRACTS} /></PageContainer>;
    return <PageContainer>
        <Authorization allow={isMethodAllowed(landUseContractMethods, Methods.POST)}>
          <CreateLandUseContractModal isOpen={isModalOpen} onClose={this.hideCreateLandUseContractModal} onSubmit={this.handleCreateLease} />
        </Authorization>

        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(landUseContractMethods, Methods.POST)}>
              <AddButtonSecondary className='no-top-margin' label='Luo maankäyttösopimus' onClick={this.handleCreateButtonClick} />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search isSearchInitialized={isSearchInitialized} onSearch={this.handleSearchChange} states={selectedStates} />
          </Column>
        </Row>

        <TableFilters alignFiltersRight amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`} filterOptions={stateOptions} filterValue={selectedStates} onFilterChange={this.handleSelectedStatesChange} />

        <TableWrapper>
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>}
          <SortableTable columns={[{
          key: 'identifier',
          text: 'MA-tunnus'
        }, {
          key: 'litigants',
          text: 'Osapuoli'
        }, {
          key: 'plan_number',
          text: 'Asemakaavan numero'
        }, {
          key: 'areas',
          text: 'Kohde'
        }, {
          key: 'project_area',
          text: 'Hankealue'
        }, {
          key: 'state',
          text: 'Neuvotteluvaihe',
          renderer: val => getLabelOfOption(stateOptions, val)
        }]} data={filteredLandUseContracts} listTable onRowClick={this.handleRowClick} showCollapseArrowColumn />
          <Pagination activePage={activePage} maxPage={maxPage} onPageClick={this.handlePageClick} />
        </TableWrapper>
      </PageContainer>;
  }

}

export default flowRight(withRouter, withLandUseContractAttributes, connect(state => {
  return {
    isFetching: getIsFetching(state),
    landUseContractListData: getLandUseContractList(state)
  };
}, {
  createLandUseContract,
  fetchLandUseContractList,
  initialize,
  receiveTopNavigationSettings
}))(LandUseContractListPage);