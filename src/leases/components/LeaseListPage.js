// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {getFormValues, initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

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
import SortableTable from '$components/table/SortableTable';
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
  location: Object,
  router: Object,
  receiveTopNavigationSettings: Function,
  searchFormValues: Object,
}

type State = {
  activePage: number,
  documentType: Array<string>,
  isModalOpen: boolean,
  visualizationType: string,
}

class LeaseListPage extends Component<Props, State> {
  firstLeaseModalField: any

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
      receiveTopNavigationSettings,
    } = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: false,
    });

    const page = query.page ? Number(query.page) : 1;
    this.setState({activePage: page});
    this.search();

    if(isEmpty(attributes)) {
      fetchAttributes();
    }

    fetchAreaNoteList();
  }

  componentDidMount = () => {
    const {initialize, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    delete searchQuery.page;
    initialize(FormNames.SEARCH, searchQuery);
  }

  componentDidUpdate(prevProps) {
    const {location: {query, search: currentSearch}, searchFormValues, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const {activePage} = this.state;

    if(currentSearch !== prevSearch) {
      this.search();

      const searchQuery = {...query};
      delete searchQuery.page;
      if(searchQuery !== searchFormValues) {
        initialize(FormNames.SEARCH, searchQuery);
      }

      const page = query.page ? Number(query.page) : 1;
      if(page !== activePage) {
        this.setState({activePage: page});
      }
    }
  }

  showCreateLeaseModal = () => {
    this.setState({
      isModalOpen: true,
    });
  }

  hideCreateLeaseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  search = () => {
    const {fetchLeases, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }
    searchQuery.limit = PAGE_SIZE;
    fetchLeases(getSearchQuery(searchQuery));
  }

  handleSearchChange = (query) => {
    const {router} = this.context;

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
    const {router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});
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
              onClick={this.showCreateLeaseModal}
              text='Luo vuokratunnus'
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
          onButtonSelectorChange={(value) => {
            this.setState({documentType: value});}
          }
          iconSelectorOptions={[
            {value: 'table', label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
            {value: 'map', label: 'Kartta', icon: <MapIcon className='icon-medium' />},
          ]}
          iconSelectorValue={visualizationType}
          onIconSelectorChange={
            (value) => this.setState({visualizationType: value})
          }
          title={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
        />
        {isFetching && <Row><Column><LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper></Column></Row>}
        {!isFetching &&
          <div>
            {visualizationType === 'table' && (
              <div>
                <SortableTable
                  columns={[
                    {key: 'identifier', text: 'Vuokratunnus'},
                    {key: 'real_property_unit', text: 'Vuokrakohde'},
                    {key: 'address', text: 'Osoite'},
                    {key: 'tenant', text: 'Vuokralainen'},
                    {key: 'lessor', text: 'Vuokranantaja'},
                    {key: 'state', text: 'Tyyppi', renderer: (val) => getLabelOfOption(stateOptions, val)},
                    {key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val)},
                    {key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val)},
                  ]}
                  data={filteredLeases}
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
const formName = FormNames.SEARCH;

export default flowRight(
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        leases: getLeasesList(state),
        searchFormValues: getFormValues(formName)(state),
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
