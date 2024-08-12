import React, { Component } from "react";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { Row, Column } from "react-foundation";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
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
import { fetchRentBasisList, initializeRentBasis } from "@/rentbasis/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "@/rentbasis/constants";
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
import { RentBasisFieldPaths, RentBasisPropertyIdentifiersFieldPaths, RentBasisRentRatesFieldPaths } from "@/rentbasis/enums";
import { mapRentBasisSearchFilters } from "@/rentbasis/helpers";
import { formatDate, getApiResponseCount, getApiResponseMaxPage, getApiResponseResults, getFieldOptions, getLabelOfOption, getSearchQuery, getUrlParams, isFieldAllowedToRead, isMethodAllowed, setPageTitle } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import { getIsFetching, getRentBasisList } from "@/rentbasis/selectors";
import { withRentBasisAttributes } from "@/components/attributes/RentBasisAttributes";
import type { Attributes, Methods as MethodsType } from "types";
import type { RentBasisList } from "@/rentbasis/types";
type Props = {
  fetchRentBasisList: (...args: Array<any>) => any;
  history: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  initializeRentBasis: (...args: Array<any>) => any;
  isFetching: boolean;
  isFetchingRentBasisAttributes: boolean;
  // get via withRentBasisAttributes HOC
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  rentBasisAttributes: Attributes;
  // get via withRentBasisAttributes HOC
  rentBasisMethods: MethodsType;
  // get via withRentBasisAttributes HOC
  rentBasisListData: RentBasisList;
};
type State = {
  activePage: number;
  isSearchInitialized: boolean;
  sortKey: string;
  sortOrder: string;
};

class RentBasisListPage extends Component<Props, State> {
  _isMounted: boolean;
  state = {
    activePage: 1,
    isSearchInitialized: false,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings
    } = this.props;
    setPageTitle('Vuokrausperiaatteet');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.RENT_BASIS),
      pageTitle: 'Vuokrausperiaatteet',
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
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.RENT_BASIS_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      sortKey: searchQuery.sort_key ? searchQuery.sort_key : DEFAULT_SORT_KEY,
      sortOrder: searchQuery.sort_order ? searchQuery.sort_order : DEFAULT_SORT_ORDER
    }, async () => {
      await initializeSearchForm();

      if (this._isMounted) {
        setSearchFormReady();
      }
    });
  };
  handleSearchChange = (query, resetActivePage: boolean = false) => {
    const {
      history
    } = this.props;

    if (resetActivePage) {
      this.setState({
        activePage: 1
      });
    }

    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS),
      search: getSearchQuery(query)
    });
  };
  search = () => {
    const {
      fetchRentBasisList,
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
    searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
    searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;
    fetchRentBasisList(mapRentBasisSearchFilters(searchQuery));
  };
  handleCreateButtonClick = () => {
    const {
      history,
      initializeRentBasis,
      location: {
        search
      }
    } = this.props;
    initializeRentBasis({
      decisions: [{}],
      property_identifiers: [{}],
      rent_rates: [{}]
    });
    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      search: search
    });
  };
  handleRowClick = id => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.RENT_BASIS)}/${id}`,
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
      pathname: getRouteById(Routes.RENT_BASIS),
      search: getSearchQuery(query)
    });
  };
  getRentBasisList = (rentBasisList: RentBasisList) => {
    const results = getApiResponseResults(rentBasisList);
    return results.map(item => {
      return {
        id: item.id,
        property_identifiers: get(item, 'property_identifiers').map(item => item.identifier),
        build_permission_types: get(item, 'rent_rates').map(rate => get(rate, 'build_permission_type.id') || get(rate, 'build_permission_type')),
        start_date: get(item, 'start_date'),
        end_date: get(item, 'end_date')
      };
    });
  };
  getColumns = () => {
    const {
      rentBasisAttributes
    } = this.props;
    const columns = [];
    const buildPermissionTypeOptions = getFieldOptions(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE);

    if (isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS)) {
      columns.push({
        key: 'property_identifiers',
        sortable: false,
        text: 'Kohteen tunnus'
      });
    }

    if (isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)) {
      columns.push({
        key: 'build_permission_types',
        text: 'Pääkäyttötarkoitus',
        renderer: val => val ? getLabelOfOption(buildPermissionTypeOptions, val) : '-',
        sortable: false
      });
    }

    if (isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.START_DATE)) {
      columns.push({
        key: 'start_date',
        text: 'Alkupvm',
        renderer: val => formatDate(val) || '-'
      });
    }

    if (isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.END_DATE)) {
      columns.push({
        key: 'end_date',
        text: 'Loppupvm',
        renderer: val => formatDate(val) || '-'
      });
    }

    return columns;
  };
  handleSortingChange = ({
    sortKey,
    sortOrder
  }) => {
    const {
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;
    this.setState({
      sortKey,
      sortOrder
    });
    this.handleSearchChange(searchQuery);
  };

  render() {
    const {
      isFetching,
      isFetchingRentBasisAttributes,
      rentBasisListData,
      rentBasisMethods
    } = this.props;
    const {
      activePage,
      isSearchInitialized,
      sortKey,
      sortOrder
    } = this.state;
    const count = getApiResponseCount(rentBasisListData);
    const rentBasisList = this.getRentBasisList(rentBasisListData);
    const maxPage = getApiResponseMaxPage(rentBasisListData, LIST_TABLE_PAGE_SIZE);
    const columns = this.getColumns();
    if (isFetchingRentBasisAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!rentBasisMethods) return null;
    if (!isMethodAllowed(rentBasisMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.RENT_BASIS} /></PageContainer>;
    return <PageContainer>
        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(rentBasisMethods, Methods.POST)}>
              <AddButtonSecondary className='no-top-margin' label='Luo vuokrausperuste' onClick={this.handleCreateButtonClick} />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search isSearchInitialized={isSearchInitialized} onSearch={this.handleSearchChange} sortKey={sortKey} sortOrder={sortOrder} />
          </Column>
        </Row>

        <TableFilters amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`} filterOptions={[]} filterValue={[]} />

        <TableWrapper>
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>}
          <SortableTable columns={columns} data={rentBasisList} listTable onRowClick={this.handleRowClick} onSortingChange={this.handleSortingChange} serverSideSorting showCollapseArrowColumn sortable sortKey={sortKey} sortOrder={sortOrder} />
          <Pagination activePage={activePage} maxPage={maxPage} onPageClick={page => this.handlePageClick(page)} />
        </TableWrapper>
      </PageContainer>;
  }

}

export default flowRight(withRentBasisAttributes, withRouter, connect(state => {
  return {
    isFetching: getIsFetching(state),
    rentBasisListData: getRentBasisList(state)
  };
}, {
  fetchRentBasisList,
  initialize,
  initializeRentBasis,
  receiveTopNavigationSettings
}))(RentBasisListPage);