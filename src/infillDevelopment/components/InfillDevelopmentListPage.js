// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MultiItemCollapse from '$components/table/MultiItemCollapse';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchInfillDevelopmentAttributes, fetchInfillDevelopments, receiveFormInitialValues} from '$src/infillDevelopment/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {getContentInfillDevelopmentList} from '$src/infillDevelopment/helpers';
import {getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getInfillDevelopments, getIsFetching} from '$src/infillDevelopment/selectors';

import type {Attributes, InfillDevelopmentList} from '$src/infillDevelopment/types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  fetchInfillDevelopmentAttributes: Function,
  fetchInfillDevelopments: Function,
  infillDevelopmentList: InfillDevelopmentList,
  initialize: Function,
  isFetching: boolean,
  location: Object,
  receiveFormInitialValues: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  activePage: number,
  count: number,
  infillDevelopments: Array<Object>,
  isSearchInitialized: boolean,
  maxPage: number,
  selectedStates: Array<string>,
}

class InfillDevelopmentListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    infillDevelopments: [],
    isSearchInitialized: false,
    maxPage: 1,
    selectedStates: [],
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      attributes,
      fetchInfillDevelopmentAttributes,
      initialize,
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('infillDevelopment'),
      pageTitle: 'Täydennysrakentamiskorvaukset',
      showSearch: false,
    });

    if(isEmpty(attributes)) {
      fetchInfillDevelopmentAttributes();
    }

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

  componentDidUpdate = (prevProps) => {
    const {location: {query, search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;

    if(currentSearch !== prevSearch) {
      this.search();

      const searchQuery = {...query};
      delete searchQuery.page;

      if(!Object.keys(searchQuery).length) {
        this.setState({selectedStates: []});
        initialize(FormNames.SEARCH, {});
      }
    }

    if(prevProps.infillDevelopmentList !== this.props.infillDevelopmentList) {
      this.updateTableData();
    }
  }

  handleCreateButtonClick = () => {
    const {receiveFormInitialValues, location: {query}} = this.props;
    const {router} = this.context;

    receiveFormInitialValues({});

    return router.push({
      pathname: getRouteById('newInfillDevelopment'),
      query,
    });
  }

  handleSearchChange = (query: Object) => {
    const {router} = this.context;

    this.setState({activePage: 1});
    delete query.page;

    return router.push({
      pathname: getRouteById('infillDevelopment'),
      query,
    });
  }

  search = () => {
    const {fetchInfillDevelopments, location: {query}} = this.props;
    const page = query.page ? Number(query.page) : 1;
    const searchQuery = {...query};

    delete searchQuery.page;

    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }

    searchQuery.limit = PAGE_SIZE;
    fetchInfillDevelopments(getSearchQuery(searchQuery));
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {location: {query}} = this.props;

    return router.push({
      pathname: `${getRouteById('infillDevelopment')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {location: {query}} = this.props;

    if(page > 1) {
      query.page = page;
    } else {
      query.page = undefined;
    }

    this.setState({activePage: page});

    return router.push({
      pathname: getRouteById('infillDevelopment'),
      query,
    });
  }

  updateTableData = () => {
    const {infillDevelopmentList} = this.props;

    this.setState({
      count: this.getInfillDevelopmentCount(infillDevelopmentList),
      infillDevelopments: getContentInfillDevelopmentList(infillDevelopmentList),
      maxPage: this.getInfillDevelopmentMaxPage(infillDevelopmentList),
    });
  }

  getInfillDevelopmentCount = (infillDevelopmentList: InfillDevelopmentList) => {
    return get(infillDevelopmentList, 'count', 0);
  }

  getInfillDevelopmentMaxPage = (infillDevelopmentList: InfillDevelopmentList) => {
    const count = this.getInfillDevelopmentCount(infillDevelopmentList);

    if(!count) {
      return 0;
    }
    return Math.ceil(count/PAGE_SIZE);
  }

  handleSelectedStatesChange = (states: Array<string>) => {
    const {location: {query}} = this.props;
    const searchQuery = {...query};

    delete searchQuery.page;
    searchQuery.state = states;

    this.setState({selectedStates: states});

    this.handleSearchChange(searchQuery);
  }

  render() {
    const {attributes, isFetching} = this.props;
    const {activePage, infillDevelopments, isSearchInitialized, maxPage, selectedStates} = this.state;
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);
    const filteredInfillDevelopments = selectedStates.length
      ? (infillDevelopments.filter((infillDevelopment) => selectedStates.indexOf(infillDevelopment.state) !== -1))
      : infillDevelopments;
    const count = filteredInfillDevelopments.length;

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo täydennysrakentamiskorvaus'
              onClick={this.handleCreateButtonClick}
            />
          </Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              states={selectedStates}
            />
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6}></Column>
          <Column small={12} medium={6}>
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
            columns={[
              {key: 'name', text: 'Hankkeen nimi'},
              {key: 'detailed_plan_identifier', text: 'Asemakaavan nro'},
              {
                key: 'leaseIdentifiers',
                text: 'Vuokratunnus',
                disabled: true,
                renderer: (val) => <MultiItemCollapse
                  items={val}
                  itemRenderer={(item) => item}
                />,
              },
              {key: 'state', text: 'Neuvotteluvaihe', renderer: (val) => getLabelOfOption(stateOptions, val) || '-'},
            ]}
            data={filteredInfillDevelopments}
            onRowClick={this.handleRowClick}
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
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        infillDevelopmentList: getInfillDevelopments(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchInfillDevelopmentAttributes,
      fetchInfillDevelopments,
      initialize,
      receiveFormInitialValues,
      receiveTopNavigationSettings,
    }
  )
)(InfillDevelopmentListPage);
