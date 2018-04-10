// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

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
import SearchWrapper from '$components/search/SearchWrapper';
import Search from './search/Search';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';

import mapGreenIcon from '$assets/icons/map-green.svg';
import mapIcon from '$assets/icons/map.svg';
import tableGreenIcon from '$assets/icons/table-green.svg';
import tableIcon from '$assets/icons/table.svg';

type Props = {
  attributes: Object,
  createLease: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  fetchLessors: Function,
  isFetching: boolean,
  leases: Object,
  lessors: Array<Object>,
  router: Object,
  receiveTopNavigationSettings: Function,
}

type State = {
  documentType: Array<string>,
  isModalOpen: boolean,
  visualizationType: string,
}

class LeaseList extends Component {
  props: Props

  state: State = {
    documentType: [],
    isModalOpen: false,
    newLeaseStatus: '',
    newLeaseTitle: '',
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
    fetchLeases(getSearchQuery(query));
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.getWrappedInstance().initialize(query);
    // this.search;
  }

  showModal = () => {
    this.setState({
      isModalOpen: true,
    });
  }

  hideModal = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  handleSearchChange = (query) => {
    const {fetchLeases} = this.props;
    const {router} = this.context;
    const search = getSearchQuery(query);
    fetchLeases(search);

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

  render() {
    const {
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
    //TODO: Filter leases by document type on front-end for demo purposes. Move to backend and end points are working
    const filteredLeases = getLeasesFilteredByDocumentType(leases, documentType);
    const lessorOptions = getLessorOptions(lessors);
    const stateOptions = getAttributeFieldOptions(attributes, 'state');

    return (
      <PageContainer>
        <Modal
          isOpen={isModalOpen}
          onClose={this.hideModal}
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
              onClick={this.showModal}
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
          title={`Löytyi ${filteredLeases.length} kpl`}
        />
        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <div>
            {visualizationType === 'table' && (
              <Table
                amount={filteredLeases.length}
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
      receiveTopNavigationSettings,
    },
  ),
)(LeaseList);
