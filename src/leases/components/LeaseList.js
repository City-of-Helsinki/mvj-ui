// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {createLease, fetchAttributes, fetchLeases} from '../actions';
import ActionDropdown from '../../components/ActionDropdown';
import Loader from '../../components/loader/Loader';
import {getAttributes, getIsFetching, getLeasesList} from '../selectors';
import Modal from '../../components/Modal';
import Search from './search/Search';
import CreateLease from '../components/leaseSections/CreateLease';
import TableControllers from './TableControllers';
import Table from '../../components/Table';
import * as contentHelpers from '../helpers';
import {getSearchQuery} from './search/helpers';

type Props = {
  attributes: Object,
  createLease: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  isFetching: boolean,
  router: Object,
  leases: Object,
}

type State = {
  documentType: Array<string>,
  isCreateLeaseIdentifierModalOpen: boolean,
  newLeaseStatus: string,
  newLeaseTitle: string,
  visualizationType: string,
}

class LeaseList extends Component {
  props: Props

  state: State = {
    documentType: [],
    isCreateLeaseIdentifierModalOpen: false,
    newLeaseStatus: '',
    newLeaseTitle: '',
    visualizationType: 'table',
  }

  search: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchAttributes, fetchLeases} = this.props;
    const {router: {location: {query}}} = this.props;

    fetchAttributes();
    fetchLeases(getSearchQuery(query));
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  showModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: true,
    });
  }

  hideModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: false,
    });
  }

  handleSearchChange = (query) => {
    const {fetchLeases} = this.props;
    const {router} = this.context;
    const search = getSearchQuery(query);
    fetchLeases(search);

    return router.push({
      pathname: `/leases`,
      query,
    });
  }

  handleEditClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;
    return router.push({
      pathname: `/leases/${id}`,
      query,
    });
  };

  openCreateLeaseModal = (status: string, title: string) => {
    this.setState({
      newLeaseStatus: status,
      newLeaseTitle: title,
    });
    this.showModal('CreateLeaseIdentifier');
  }

  render() {
    const {documentType, isCreateLeaseIdentifierModalOpen, newLeaseStatus, newLeaseTitle, visualizationType} = this.state;
    const {attributes, createLease, leases: content, isFetching} = this.props;
    const leases = contentHelpers.getContentLeases(content, attributes);
    const districtOptions = contentHelpers.getDistrictOptions(attributes);
    const municipalityOptions = contentHelpers.getMunicipalityOptions(attributes);
    const typeOptions = contentHelpers.getTypeOptions(attributes);

    return (
      <div className='lease-list'>
        <Modal
          title={newLeaseTitle ? newLeaseTitle : 'Luo vuokratunnus'}
          isOpen={isCreateLeaseIdentifierModalOpen}
          onClose={() => this.hideModal('CreateLeaseIdentifier')}
        >
          <CreateLease
            districtOptions={districtOptions}
            status={newLeaseStatus}
            onSubmit={(lease) => createLease(lease)}
            municipalityOptions={municipalityOptions}
            typeOptions={typeOptions}
          />
        </Modal>
        <Row>
          <div className='lease-list__search-wrapper'>
            <Search
              ref={(input) => { this.search = input; }}
              districtOptions={districtOptions}
              municipalityOptions={municipalityOptions}
              typeOptions={typeOptions}
              onSearch={(query) => this.handleSearchChange(query)}
            />
          </div>
          <div className='lease-list__dropdown-wrapper'>
            <ActionDropdown
              title={'Luo uusi'}
              options={[
                {value: 'application', label: 'Hakemus', action: () => this.openCreateLeaseModal('H', 'Luo hakemus')},
                {value: 'reservation', label: 'Varaus', action: () => this.openCreateLeaseModal('R', 'Luo varaus')},
                {value: 'lease', label: 'Vuokraus', action: () => this.openCreateLeaseModal('V', 'Luo vuokraus')},
                {value: 'permission', label: 'Lupa', action: () => this.openCreateLeaseModal('L', 'Luo lupa')},
                {value: 'area', label: 'Muistettavat ehdot'},
              ]}
            />
          </div>
        </Row>
        <Row>
          <TableControllers
            amount={leases.length}
            documentType={documentType}
            onDocumentTypeChange={(value) => {this.setState({documentType: value});}}
            visualizationType={visualizationType}
            onVisualizationTypeChange={(value) => {this.setState({visualizationType: value});}}
          />
        </Row>
        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <Row>
            {visualizationType === 'table' && (
              <Table
                amount={leases.length}
                data={leases}
                dataKeys={[
                  {key: 'identifier', label: 'Vuokratunnus'},
                  {key: 'real_property_unit', label: 'Vuokrakohde'},
                  {key: 'tenant', label: 'Vuokralainen'},
                  {key: 'person', label: 'Vuokranantaja'},
                  {key: 'address', label: 'Osoite'},
                  {key: 'status', label: 'Tyyppi'},
                  {key: 'start_date', label: 'Alkupvm'},
                  {key: 'end_date', label: 'Loppupvm'},
                ]}
                onRowClick={this.handleEditClick}
              />
            )}
            {visualizationType === 'map' && (
              <h1>Kartta</h1>
            )}
          </Row>
        }
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        leases: getLeasesList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      createLease,
      fetchLeases,
      fetchAttributes,
    },
  ),
)(LeaseList);
