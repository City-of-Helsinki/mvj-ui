// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchInfillDevelopments, receiveFormInitialValues} from '$src/infillDevelopment/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {PermissionMissingTexts} from '$src/enums';
import {
  FormNames,
  InfillDevelopmentCompensationFieldPaths,
  InfillDevelopmentCompensationLeasesFieldPaths,
} from '$src/infillDevelopment/enums';
import {getContentInfillDevelopmentList} from '$src/infillDevelopment/helpers';
import {
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getInfillDevelopments, getIsFetching} from '$src/infillDevelopment/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Attributes, Methods} from '$src/types';
import type {InfillDevelopmentList} from '$src/infillDevelopment/types';

const getInfillDevelopmentCount = (infillDevelopmentList: InfillDevelopmentList) => {
  return get(infillDevelopmentList, 'count', 0);
};

const getInfillDevelopmentMaxPage = (infillDevelopmentList: InfillDevelopmentList) => {
  const count = getInfillDevelopmentCount(infillDevelopmentList);

  if(!count) {
    return 0;
  }
  return Math.ceil(count/LIST_TABLE_PAGE_SIZE);
};

type Props = {
  fetchInfillDevelopments: Function,
  history: Object,
  infillDevelopmentAttributes: Attributes, // get via withCommonAttributes HOC
  infillDevelopmentMethods: Methods, // get via withCommonAttributes HOC
  infillDevelopmentList: InfillDevelopmentList,
  initialize: Function,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes HOC
  location: Object,
  receiveFormInitialValues: Function,
  receiveTopNavigationSettings: Function,
}

type State = {
  activePage: number,
  count: number,
  infillDevelopmentAttributes: Attributes,
  infillDevelopments: Array<Object>,
  infillDevelopmentList: InfillDevelopmentList,
  isSearchInitialized: boolean,
  maxPage: number,
  selectedStates: Array<string>,
  stateOptions: Array<Object>,
}

class InfillDevelopmentListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    infillDevelopmentAttributes: {},
    infillDevelopments: [],
    infillDevelopmentList: {},
    isSearchInitialized: false,
    maxPage: 1,
    selectedStates: [],
    stateOptions: [],
  }

  componentDidMount() {
    const {
      initialize,
      receiveTopNavigationSettings,
      location: {search},
    } = this.props;
    const query = getUrlParams(search);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
      pageTitle: 'Täydennysrakentamiskorvaukset',
      showSearch: false,
    });

    this.search();

    const page = query.page ? Number(query.page) : 1;
    this.setState({activePage: page});

    const states = isArray(query.state)
      ? query.state
      : query.state ? [query.state] : null;

    if(states) {
      this.setState({selectedStates: states});
    }

    const setSearchFormReadyFlag = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      try {
        const searchQuery = {...query};
        delete searchQuery.page;
        delete searchQuery.state;

        await initialize(FormNames.SEARCH, searchQuery);
        setSearchFormReadyFlag();
      } catch(e) {
        console.error(`Failed to initialize search form with error, ${e}`);
      }
    };

    initializeSearchForm();
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.infillDevelopmentAttributes !== state.infillDevelopmentAttributes) {
      newState.infillDevelopmentAttributes = props.infillDevelopmentAttributes;
      newState.stateOptions = getFieldOptions(props.infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.STATE, false);
    }

    if(props.infillDevelopmentList !== state.infillDevelopmentList) {
      newState.infillDevelopmentList = props.infillDevelopmentList;
      newState.count = getInfillDevelopmentCount(props.infillDevelopmentList);
      newState.infillDevelopments = getContentInfillDevelopmentList(props.infillDevelopmentList);
      newState.maxPage = getInfillDevelopmentMaxPage(props.infillDevelopmentList);
    }

    return newState;
  }

  componentDidUpdate = (prevProps) => {
    const {location: {search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.search();

      delete searchQuery.page;

      if(!Object.keys(searchQuery).length) {
        this.setState({selectedStates: []});
        initialize(FormNames.SEARCH, {});
      }
    }
  }

  handleCreateButtonClick = () => {
    const {history, location: {search}, receiveFormInitialValues} = this.props;

    receiveFormInitialValues({});

    return history.push({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENT_NEW),
      search: search,
    });
  }

  handleSearchChange = (query: Object) => {
    const {history} = this.props;

    this.setState({activePage: 1});
    delete query.page;

    return history.push({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENTS),
      search: getSearchQuery(query),
    });
  }

  search = () => {
    const {fetchInfillDevelopments, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    fetchInfillDevelopments(getSearchQuery(searchQuery));
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${id}`,
      search: search,
    });
  };

  handlePageClick = (page: number) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    if(page > 1) {
      query.page = page;
    } else {
      query.page = undefined;
    }

    this.setState({activePage: page});

    return history.push({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENTS),
      search: getSearchQuery(query),
    });
  }

  handleSelectedStatesChange = (states: Array<string>) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.page;
    searchQuery.state = states;

    this.setState({selectedStates: states});

    this.handleSearchChange(searchQuery);
  }

  getColumns = () => {
    const {infillDevelopmentAttributes, stateOptions} = this.state;
    const columns = [];

    if(isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.NAME)) {
      columns.push({key: 'name', text: 'Hankkeen nimi'});
    }

    if(isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER)) {
      columns.push({key: 'detailed_plan_identifier', text: 'Asemakaavan nro'});
    }

    if(isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES)) {
      columns.push({
        key: 'leaseIdentifiers',
        text: 'Vuokratunnus',
      });
    }

    if(isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.STATE)) {
      columns.push({key: 'state', text: 'Neuvotteluvaihe', renderer: (val) => getLabelOfOption(stateOptions, val) || '-'});
    }

    return columns;
  }

  render() {
    const {infillDevelopmentMethods, isFetching, isFetchingCommonAttributes} = this.props;
    const {activePage, count, infillDevelopments, isSearchInitialized, maxPage, selectedStates, stateOptions} = this.state;
    const filteredInfillDevelopments = selectedStates.length
      ? (infillDevelopments.filter((infillDevelopment) => selectedStates.indexOf(infillDevelopment.state) !== -1))
      : infillDevelopments;
    const columns = this.getColumns();

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!infillDevelopmentMethods.GET) return <PageContainer><AuthorizationError text={PermissionMissingTexts.INFILL_DEVELOPMENT} /></PageContainer>;

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <Authorization allow={infillDevelopmentMethods.POST}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo täydennysrakentamiskorvaus'
                onClick={this.handleCreateButtonClick}
              />
            </Authorization>
          </Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              states={selectedStates}
            />

            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={stateOptions}
              filterValue={selectedStates}
              onFilterChange={this.handleSelectedStatesChange}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
          <SortableTable
            columns={columns}
            data={filteredInfillDevelopments}
            listTable
            onRowClick={this.handleRowClick}
            showCollapseArrowColumn
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
  withCommonAttributes,
  withRouter,
  connect(
    (state) => {
      return {
        infillDevelopmentList: getInfillDevelopments(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchInfillDevelopments,
      initialize,
      receiveFormInitialValues,
      receiveTopNavigationSettings,
    }
  )
)(InfillDevelopmentListPage);
