import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { initialize } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import PageContainer from "/src/components/content/PageContainer";
import Pagination from "/src/components/table/Pagination";
import RemoveButton from "/src/components/form/RemoveButton";
import Search from "/src/leaseholdTransfer/components/search/Search";
import SortableTable from "/src/components/table/SortableTable";
import TableFilters from "/src/components/table/TableFilters";
import TableWrapper from "/src/components/table/TableWrapper";
import { deleteLeaseholdTransferAndUpdateList, fetchLeaseholdTransferList } from "/src/leaseholdTransfer/actions";
import { receiveTopNavigationSettings } from "/src/components/topNavigation/actions";
import { LIST_TABLE_PAGE_SIZE } from "/src/util/constants";
import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER } from "/src/leaseholdTransfer/constants";
import { ConfirmationModalTexts, FormNames, Methods, PermissionMissingTexts } from "enums";
import { ButtonColors } from "/src/components/enums";
import { LeaseholdTransferFieldPaths, LeaseholdTransferFieldTitles } from "/src/leaseholdTransfer/enums";
import { getContentLeaseholdTransfers, mapLeaseholdTransferSearchFilters } from "/src/leaseholdTransfer/helpers";
import { formatDate, getApiResponseCount, getApiResponseMaxPage, getSearchQuery, getUrlParams, isFieldAllowedToRead, isMethodAllowed, setPageTitle } from "/src/util/helpers";
import { getRouteById, Routes } from "/src/root/routes";
import { getIsFetching, getLeaseholdTransferList } from "/src/leaseholdTransfer/selectors";
import { withLeaseholdTransferAttributes } from "/src/components/attributes/LeaseholdTransferAttributes";
import type { Attributes, Methods as MethodsType } from "types";
import type { LeaseholdTransferList } from "/src/leaseholdTransfer/types";
type Props = {
  deleteLeaseholdTransferAndUpdateList: (...args: Array<any>) => any;
  fetchLeaseholdTransferList: (...args: Array<any>) => any;
  history: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  isFetching: boolean;
  isFetchingLeaseholdTransferAttributes: boolean;
  leaseholdTransferAttributes: Attributes;
  leaseholdTransferList: LeaseholdTransferList;
  leaseholdTransferMethods: MethodsType;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
};
type State = {
  activePage: number;
  count: number;
  isSearchInitialized: boolean;
  leaseholdTransferList: LeaseholdTransferList;
  leaseholdTransfers: Array<Record<string, any>>;
  maxPage: number;
  sortKey: string;
  sortOrder: string;
};

class LeaseholdTransferListPage extends PureComponent<Props, State> {
  _isMounted: boolean;
  state = {
    activePage: 1,
    count: 0,
    isSearchInitialized: false,
    leaseholdTransferList: {},
    leaseholdTransfers: [],
    maxPage: 0,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings
    } = this.props;
    setPageTitle('Vuokraoikeuden siirrot');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASEHOLD_TRANSFER),
      pageTitle: 'Vuokraoikeuden siirrot',
      showSearch: false
    });
    this.search();
    this.setSearchFormValues();
    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.leaseholdTransferList !== state.leaseholdTransferList) {
      newState.leaseholdTransferList = props.leaseholdTransferList;
      newState.count = getApiResponseCount(props.leaseholdTransferList);
      newState.leaseholdTransfers = getContentLeaseholdTransfers(props.leaseholdTransferList);
      newState.maxPage = getApiResponseMaxPage(props.leaseholdTransferList, LIST_TABLE_PAGE_SIZE);
    }

    return !isEmpty(newState) ? newState : null;
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
      await initialize(FormNames.LEASEHOLD_TRANSFER_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      sortKey: searchQuery.sort_key || DEFAULT_SORT_KEY,
      sortOrder: searchQuery.sort_order || DEFAULT_SORT_ORDER
    }, async () => {
      await initializeSearchForm();

      if (this._isMounted) {
        setSearchFormReady();
      }
    });
  };
  getSearchQuery = () => {
    const {
      location: {
        search
      }
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
    return mapLeaseholdTransferSearchFilters(searchQuery);
  };
  search = () => {
    const {
      fetchLeaseholdTransferList
    } = this.props;
    const searchQuery = this.getSearchQuery();
    fetchLeaseholdTransferList(searchQuery);
  };
  handleSearchChange = (query: any, resetActivePage: boolean = false) => {
    const {
      history
    } = this.props;

    if (resetActivePage) {
      this.setState({
        activePage: 1
      });
    }

    return history.push({
      pathname: getRouteById(Routes.LEASEHOLD_TRANSFER),
      search: getSearchQuery(query)
    });
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
      pathname: getRouteById(Routes.LEASEHOLD_TRANSFER),
      search: getSearchQuery(query)
    });
  };

  render() {
    const {
      deleteLeaseholdTransferAndUpdateList,
      isFetching,
      isFetchingLeaseholdTransferAttributes,
      leaseholdTransferMethods
    } = this.props;
    const {
      activePage,
      count,
      isSearchInitialized,
      leaseholdTransfers,
      maxPage,
      sortKey,
      sortOrder
    } = this.state;
    if (isFetchingLeaseholdTransferAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!leaseholdTransferMethods) return null;
    if (!isMethodAllowed(leaseholdTransferMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.LEASEHOLD_TRANSFER} /></PageContainer>;
    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleDelete = (id: number) => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              const searchQuery = this.getSearchQuery();
              deleteLeaseholdTransferAndUpdateList({
                id,
                searchQuery
              });
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText: ConfirmationModalTexts.DELETE_LEASEHOLD_TRASFER.BUTTON,
            confirmationModalLabel: ConfirmationModalTexts.DELETE_LEASEHOLD_TRASFER.LABEL,
            confirmationModalTitle: ConfirmationModalTexts.DELETE_LEASEHOLD_TRASFER.TITLE
          });
        };

        const getColumns = () => {
          const {
            leaseholdTransferAttributes,
            leaseholdTransferMethods
          } = this.props;
          const columns = [];

          if (isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.PROPERTIES)) {
            columns.push({
              key: 'properties',
              text: LeaseholdTransferFieldTitles.PROPERTIES,
              sortable: false
            });
          }

          if (isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.INSTITUTION_IDENTIFIER)) {
            columns.push({
              key: 'institution_identifier',
              text: LeaseholdTransferFieldTitles.INSTITUTION_IDENTIFIER
            });
          }

          if (isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.DECISION_DATE)) {
            columns.push({
              key: 'decision_date',
              text: LeaseholdTransferFieldTitles.DECISION_DATE,
              renderer: val => formatDate(val)
            });
          }

          if (isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.PARTIES)) {
            columns.push({
              key: 'conveyors',
              text: LeaseholdTransferFieldTitles.CONVEYORS,
              renderer: val => val.name,
              sortable: false
            });
          }

          if (isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.PARTIES)) {
            columns.push({
              key: 'acquirers',
              text: LeaseholdTransferFieldTitles.ACQUIRERS,
              renderer: val => val.name,
              sortable: false
            });
          }

          if (isFieldAllowedToRead(leaseholdTransferAttributes, LeaseholdTransferFieldPaths.DELETED)) {
            columns.push({
              key: 'deleted',
              text: LeaseholdTransferFieldTitles.DELETED,
              renderer: val => formatDate(val),
              sortable: false
            });
          }

          if (isMethodAllowed(leaseholdTransferMethods, Methods.DELETE)) {
            columns.push({
              key: 'id',
              text: '',
              renderer: val => <RemoveButton className='third-level' onClick={() => handleDelete(val)} title='Poista vuokraoikeuden siirto' />,
              sortable: false
            });
          }

          return columns;
        };

        return <PageContainer>
              <Row>
                <Column small={12} large={4}></Column>
                <Column small={12} large={8}>
                  <Search isSearchInitialized={isSearchInitialized} onSearch={this.handleSearchChange} sortKey={sortKey} sortOrder={sortOrder} />
                </Column>
              </Row>
              <TableFilters amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`} filterOptions={[]} filterValue={[]} />

              <TableWrapper>
                {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>}
                <SortableTable columns={getColumns()} data={leaseholdTransfers} listTable onSortingChange={this.handleSortingChange} serverSideSorting showCollapseArrowColumn sortable sortKey={sortKey} sortOrder={sortOrder} />
                <Pagination activePage={activePage} maxPage={maxPage} onPageClick={this.handlePageClick} />
              </TableWrapper>
            </PageContainer>;
      }}
      </AppConsumer>;
  }

}

export default flowRight(withLeaseholdTransferAttributes, withRouter, connect(state => {
  return {
    isFetching: getIsFetching(state),
    leaseholdTransferList: getLeaseholdTransferList(state)
  };
}, {
  deleteLeaseholdTransferAndUpdateList,
  fetchLeaseholdTransferList,
  initialize,
  receiveTopNavigationSettings
}))(LeaseholdTransferListPage);