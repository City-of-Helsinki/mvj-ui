// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import {getAttributeFieldOptions, getLabelOfOption} from '$src/util/helpers';
import {getRouteById} from '$src/root/routes';
import {
  createLease,
  fetchAttributes,
  fetchLeases,
  fetchLessors,
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {
  getAttributes,
  getIsFetching,
  getLeasesList,
  getLessors,
} from '../selectors';
import {getContentLeases, getLeasesFilteredByDocumentType} from '../helpers';
import {
  formatDate,
  getLessorOptions,
  getSearchQuery,
} from '$util/helpers';
import Button from '$components/button/Button';
import CreateLease from './leaseSections/CreateLease';
import EditableMap from '$components/map/EditableMap';
import Loader from '$components/loader/Loader';
import Modal from '$components/modal/Modal';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import SearchWrapper from '$components/search/SearchWrapper';
import Search from './search/Search';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';

import mapGreenIcon from '$assets/icons/map-green.svg';
import mapIcon from '$assets/icons/map.svg';
import tableGreenIcon from '$assets/icons/table-green.svg';
import tableIcon from '$assets/icons/table.svg';

import type {LeaseList} from '../types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Object,
  createLease: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  fetchLessors: Function,
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

class LeaseListPage extends Component {
  props: Props

  state: State = {
    activePage: 1,
    documentType: [],
    isModalOpen: false,
    visualizationType: 'table',
  }

  search: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchAttributes,
      fetchLeases,
      fetchLessors,
      receiveTopNavigationSettings,
    } = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: false,
    });

    fetchAttributes();
    fetchLessors();

    const page = Number(query.page);

    if(!page || !isNumber(page) || query.page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
      query.offset = (page - 1) * PAGE_SIZE;
    }
    query.limit = PAGE_SIZE;

    fetchLeases(getSearchQuery(query));
    delete query.limit;
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.getWrappedInstance().initialize(query);
  }

  showCreateLeaseModal = () => {
    const {initialize} = this.props;

    this.setState({
      isModalOpen: true,
    });
    initialize('create-lease-form', {});
  }

  hideCreateLeaseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  handleSearchChange = (query) => {
    const {fetchLeases} = this.props;
    const {router} = this.context;

    query.limit = PAGE_SIZE;
    fetchLeases(getSearchQuery(query));

    this.setState({activePage: 1});
    delete query.limit;
    delete query.offset;
    delete query.page;

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
      attributes,
      createLease,
      leases: content,
      lessors,
      isFetching,
    } = this.props;
    const leases = getContentLeases(content, attributes);
    const count = this.getLeasesCount(content);
    const maxPage = this.getLeasesMaxPage(content);
    //TODO: Filter leases by document type on front-end for demo purposes. Move to backend and end points are working
    const filteredLeases = getLeasesFilteredByDocumentType(leases, documentType);
    const lessorOptions = getLessorOptions(lessors);
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);

    return (
      <PageContainer>
        <Modal
          isOpen={isModalOpen}
          onClose={this.hideCreateLeaseModal}
          title={'Luo vuokratunnus'}
        >
          <CreateLease
            attributes={attributes}
            lessors={lessors}
            onSubmit={(lease) => createLease(lease)}
          />
        </Modal>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin full-width'
              label='Luo uusi vuokratunnus'
              onClick={this.showCreateLeaseModal}
              title='Luo uusi vuokratunnus'
            />
          }
          searchComponent={
            <Search
              attributes={attributes}
              onSearch={(query) => this.handleSearchChange(query)}
              ref={(input) => { this.search = input; }}
            />
          }
        />
        <TableControllers
          buttonSelectorOptions={stateOptions}
          buttonSelectorValue={documentType}
          onButtonSelectorChange={(value) => {this.setState({documentType: value});}}
          iconSelectorOptions={[
            {value: 'table', label: 'Taulukko', icon: tableIcon, iconSelected: tableGreenIcon},
            {value: 'map', label: 'Kartta', icon: mapIcon, iconSelected: mapGreenIcon}]
          }
          iconSelectorValue={visualizationType}
          onIconSelectorChange={
            (value) => this.setState({visualizationType: value})
          }
          title={`Löytyi ${count} kpl`}
        />
        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <div>
            {visualizationType === 'table' && (
              <div>
                <Table
                  data={filteredLeases}
                  dataKeys={[
                    {key: 'identifier', label: 'Vuokratunnus'},
                    {key: 'real_property_unit', label: 'Vuokrakohde'},
                    {key: 'tenant', label: 'Vuokralainen'},
                    {key: 'lessor', label: 'Vuokranantaja', renderer: (val) => getLabelOfOption(lessorOptions, val)},
                    {key: 'address', label: 'Osoite'},
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
              <EditableMap />
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
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        leases: getLeasesList(state),
        lessors: getLessors(state),
      };
    },
    {
      createLease,
      fetchAttributes,
      fetchLeases,
      fetchLessors,
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseListPage);