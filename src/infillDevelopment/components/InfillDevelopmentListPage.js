// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

import Button from '$components/button/Button';
import ListItem from '$components/content/ListItem';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import SortableTable from '$components/table/SortableTable';
import TableControllers from '$components/table/TableControllers';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchInfillDevelopmentAttributes, fetchInfillDevelopments, receiveFormInitialValues} from '$src/infillDevelopment/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {getContentInfillDevelopmentList} from '$src/infillDevelopment/helpers';
import {cloneObject, getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
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
  maxPage: number,
  selectedStates: Array<string>,
}

class InfillDevelopmentListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    infillDevelopments: [],
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
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('infillDevelopment'),
      pageTitle: 'Täydennysrakentamiskorvaukset',
      showSearch: false,
    });

    const page = query.page ? Number(query.page) : 1;
    if(page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
    }

    this.handleSearch();
    this.initializeSearchForm();

    if(isEmpty(attributes)) {
      fetchInfillDevelopmentAttributes();
    }
  }

  componentDidUpdate = (prevProps) => {
    if(JSON.stringify(this.props.location.query) !== JSON.stringify(prevProps.location.query)) {
      this.handleSearch();
      this.initializeSearchForm();
    }
    if(prevProps.infillDevelopmentList !== this.props.infillDevelopmentList) {
      this.updateTableData();
    }
  }

  initializeSearchForm = () => {
    const {initialize, router: {location: {query}}} = this.props;
    initialize(FormNames.SEARCH, query);
  }

  handleCreateButtonClick = () => {
    const {receiveFormInitialValues} = this.props;
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

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

  handleSearch = () => {
    const {fetchInfillDevelopments} = this.props;
    const {router: {location: {query: locationQuery}}} = this.context;
    const query = cloneObject(locationQuery);

    const page = Number(query.page);
    if(page && isNumber(page) && query.page <= 1) {
      query.offset = (page - 1) * PAGE_SIZE;
    }

    query.limit = PAGE_SIZE;
    fetchInfillDevelopments(getSearchQuery(query));
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('infillDevelopment')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

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
    this.setState({
      selectedStates: states,
    });
  }

  render() {
    const {attributes, isFetching} = this.props;
    const {activePage, infillDevelopments, maxPage, selectedStates} = this.state;
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);
    const filteredInfillDevelopments = selectedStates.length
      ? (infillDevelopments.filter((infillDevelopment) => selectedStates.indexOf(infillDevelopment.state) !== -1))
      : infillDevelopments;

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              onClick={this.handleCreateButtonClick}
              text='Luo täydennysrakentamiskorvaus'
            />
          }
          searchComponent={
            <Search
              onSearch={this.handleSearchChange}
            />
          }
        />
        <TableControllers
          buttonSelectorOptions={stateOptions}
          buttonSelectorValue={selectedStates}
          onButtonSelectorChange={this.handleSelectedStatesChange}
          title={isFetching ? 'Ladataan...' : `Löytyi ${infillDevelopments.length} kpl`}
        />
        {isFetching &&
          <Row>
            <Column>
              <LoaderWrapper><Loader isLoading={!!isFetching} /></LoaderWrapper>
            </Column>
          </Row>
        }
        {!isFetching &&
          <div>
            <SortableTable
              columns={[
                {key: 'name', text: 'Hankkeen nimi'},
                {key: 'detailed_plan_identifier', text: 'Asemakaavan nro'},
                {key: 'leaseIdentifiers', text: 'Vuokratunnus', renderer: (val) => val.length ? val.map((item, index) => <ListItem key={index}>{item}</ListItem>) : '-'},
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
          </div>
        }
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
