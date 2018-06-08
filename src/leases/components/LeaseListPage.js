// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

import Button from '$components/button/Button';
import CreateLeaseModal from './createLease/CreateLeaseModal';
import EditableMap from '$src/areaNote/components/EditableMap';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MapIcon from '$components/icons/MapIcon';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import SearchWrapper from '$components/search/SearchWrapper';
import Search from './search/Search';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';
import TableIcon from '$components/icons/TableIcon';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {
  createLease,
  fetchAttributes,
  fetchLeases,
} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContentLeases, getLeasesFilteredByDocumentType} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {
  getAttributes,
  getIsFetching,
  getLeasesList,
} from '$src/leases/selectors';

import type {LeaseList} from '../types';
import type {AreaNoteList} from '$src/areaNote/types';

const PAGE_SIZE = 25;

type Props = {
  areaNotes: AreaNoteList,
  attributes: Object,
  createLease: Function,
  fetchAreaNoteList: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  initialize: Function,
  isFetching: boolean,
  leases: LeaseList,
  lessors: Array<Object>,
  router: Object,
  receiveTopNavigationSettings: Function,
}

type State = {
  activePage: number,
  documentType: Array<string>,
  isModalOpen: boolean,
  visualizationType: string,
}

class LeaseListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    documentType: [],
    isModalOpen: false,
    visualizationType: 'table',
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      attributes,
      fetchAreaNoteList,
      fetchAttributes,
      fetchLeases,
      receiveTopNavigationSettings,
    } = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: false,
    });
    const searchQuery = {...query};
    const page = Number(searchQuery.page);

    if(!page || !isNumber(page) || page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }
    searchQuery.limit = PAGE_SIZE;

    fetchLeases(getSearchQuery(query));

    if(isEmpty(attributes)) {
      fetchAttributes();
    }
    fetchAreaNoteList();
  }

  componentDidMount = () => {
    const {initialize, router: {location: {query}}} = this.props;
    initialize(FormNames.SEARCH, query);
  }

  showCreateLeaseModal = () => {
    const {initialize} = this.props;

    this.setState({
      isModalOpen: true,
    });
    initialize(FormNames.CREATE_LEASE, {});
  }

  hideCreateLeaseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  handleSearchChange = (query) => {
    const {fetchLeases} = this.props;
    const {router} = this.context;

    const searchQuery = {...query};
    searchQuery.limit = PAGE_SIZE;
    fetchLeases(getSearchQuery(searchQuery));
    delete query.page;

    this.setState({activePage: 1});
    return router.push({
      pathname: getRouteById('leases'),
      query,
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('leases')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {fetchLeases, router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
      query.offset = (page - 1) * PAGE_SIZE;
    } else {
      query.page = undefined;
      query.offset = undefined;
    }
    query.limit = PAGE_SIZE;

    fetchLeases(getSearchQuery(query));

    this.setState({activePage: page});
    delete query.limit;
    delete query.offset;

    return router.push({
      pathname: getRouteById('leases'),
      query,
    });
  }

  getLeasesCount = (leases: LeaseList) => {
    return get(leases, 'count', 0);
  }

  getLeasesMaxPage = (leases: LeaseList) => {
    const count = this.getLeasesCount(leases);
    if(!count) {
      return 0;
    }
    else {
      return Math.ceil(count/PAGE_SIZE);
    }
  }

  render() {
    const {
      activePage,
      documentType,
      isModalOpen,
      visualizationType,
    } = this.state;
    const {
      areaNotes,
      attributes,
      createLease,
      leases: content,
      isFetching,
    } = this.props;
    const leases = getContentLeases(content);
    const count = this.getLeasesCount(content);
    const maxPage = this.getLeasesMaxPage(content);
    //TODO: Filter leases by document type on front-end for demo purposes. Move to backend and end points are working
    const filteredLeases = getLeasesFilteredByDocumentType(leases, documentType);
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);

    return (
      <PageContainer>
        <CreateLeaseModal
          isOpen={isModalOpen}
          onClose={this.hideCreateLeaseModal}
          onSubmit={createLease}
        />
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin full-width'
              label='Luo vuokratunnus'
              onClick={this.showCreateLeaseModal}
              title='Luo vuokratunnus'
            />
          }
          searchComponent={
            <Search
              attributes={attributes}
              onSearch={this.handleSearchChange}
            />
          }
        />
        <TableControllers
          buttonSelectorOptions={stateOptions}
          buttonSelectorValue={documentType}
          onButtonSelectorChange={(value) => {this.setState({documentType: value});}}
          iconSelectorOptions={[
            {value: 'table', label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
            {value: 'map', label: 'Kartta', icon: <MapIcon className='icon-medium' />},
          ]}
          iconSelectorValue={visualizationType}
          onIconSelectorChange={
            (value) => this.setState({visualizationType: value})
          }
          title={`Löytyi ${count} kpl`}
        />
        {isFetching && <Row><Column><LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper></Column></Row>}
        {!isFetching &&
          <div>
            {visualizationType === 'table' && (
              <div>
                <Table
                  data={filteredLeases}
                  dataKeys={[
                    {key: 'identifier', label: 'Vuokratunnus'},
                    {key: 'real_property_unit', label: 'Vuokrakohde'},
                    {key: 'address', label: 'Osoite'},
                    {key: 'tenant', label: 'Vuokralainen'},
                    {key: 'lessor', label: 'Vuokranantaja'},
                    {key: 'state', label: 'Tyyppi', renderer: (val) => getLabelOfOption(stateOptions, val)},
                    {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDate(val)},
                    {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDate(val)},
                  ]}
                  onRowClick={this.handleRowClick}
                />
                <Pagination
                  activePage={activePage}
                  maxPage={maxPage}
                  onPageClick={(page) => this.handlePageClick(page)}
                />
              </div>
            )}
            {visualizationType === 'map' && (
              <EditableMap
                areaNotes={areaNotes}
                showEditTools={false}
              />
            )}
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
        areaNotes: getAreaNoteList(state),
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        leases: getLeasesList(state),
      };
    },
    {
      createLease,
      fetchAreaNoteList,
      fetchAttributes,
      fetchLeases,
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseListPage);
