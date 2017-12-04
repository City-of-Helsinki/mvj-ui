// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {fetchAttributes, fetchLeases} from '../actions';
import ActionDropdown from '../../components/ActionDropdown';
import Loader from '../../components/loader/Loader';
import {getAttributes, getIsFetching, getLeasesList} from '../selectors';
import Modal from '../../components/Modal';
import Search from './Search';
import CreateLease from '../components/leaseSections/CreateLease';
import TableControllers from './TableControllers';
import Table from '../../components/Table';
import * as contentHelpers from '../helpers';

type Props = {
  attributes: Object,
  fetchAttributes: Function,
  fetchLeases: Function,
  isFetching: boolean,
  router: Object,
  leases: Array<any>,
}

type State = {
  documentType: string,
  isCreateLeaseIdentifierModalOpen: boolean,
  visualizationType: string,
}

class LeaseList extends Component {
  props: Props

  state: State = {
    documentType: 'all',
    isCreateLeaseIdentifierModalOpen: false,
    visualizationType: 'table',
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchAttributes, fetchLeases} = this.props;
    // const {fetchLeases} = this.props;
    fetchAttributes();
    fetchLeases();
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

  handleEditClick = (id) => {
    const {router} = this.context;
    return router.push({
      pathname: `/beta/leases/${id}`,
      // query,
    });
  };

  render() {
    const {documentType, isCreateLeaseIdentifierModalOpen, visualizationType} = this.state;
    const {attributes, leases: content, isFetching} = this.props;
    const leases = contentHelpers.getContentLeases(content);
    const districtOptions = contentHelpers.getDistrictOptions(attributes);
    const municipalityOptions = contentHelpers.getMunicipalityOptions(attributes);
    const typeOptions = contentHelpers.getTypeOptions(attributes);

    return (
      <div className='lease-list'>
        <Modal
          title='Luo vuokratunnus'
          isOpen={isCreateLeaseIdentifierModalOpen}
          onClose={() => this.hideModal('CreateLeaseIdentifier')}
        >
          <CreateLease
            districtOptions={districtOptions}
            municipalityOptions={municipalityOptions}
            typeOptions={typeOptions}
          />
        </Modal>
        <Row>
          <div className='lease-list__search-wrapper'>
            <Search />
          </div>
          <div className='lease-list__dropdown-wrapper'>
            <ActionDropdown
              title={'Luo uusi'}
              options={[
                {value: 'application', label: 'Hakemus'},
                {value: 'reservation', label: 'Varaus'},
                {value: 'lease', label: 'Vuokraus', action: () => this.showModal('CreateLeaseIdentifier')},
                {value: 'permission', label: 'Lupa'},
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
                  {key: 'lease_type', label: 'Tyyppi'},
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
      fetchLeases,
      fetchAttributes,
    },
  ),
)(LeaseList);
