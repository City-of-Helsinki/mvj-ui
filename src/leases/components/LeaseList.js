// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getRouteById} from '../../root/routes';
import {createLease, fetchAttributes, fetchLeases} from '../actions';
import {receiveTopNavigationSettings} from '../../components/topNavigation/actions';
import {getAttributes, getIsFetching, getLeasesList} from '../selectors';
import {leaseTypeOptions} from '../constants';
import {getContentLeases, getLeasesFilteredByDocumentType} from '../helpers';
import {getSearchQuery} from '../../util/helpers';
import Button from '../../components/button/Button';
import CreateLease from '../components/leaseSections/CreateLease';
import EditableMap from '../../components/map/EditableMap';
import Loader from '../../components/loader/Loader';
import Modal from '../../components/modal/Modal';
import PageContainer from '../../components/content/PageContainer';
import SearchWrapper from '../../components/search/SearchWrapper';
import Search from './search/Search';
import Table from '../../components/table/Table';
import TableControllers from '../../components/table/TableControllers';

import mapGreenIcon from '../../../assets/icons/map-green.svg';
import mapIcon from '../../../assets/icons/map.svg';
import tableGreenIcon from '../../../assets/icons/table-green.svg';
import tableIcon from '../../../assets/icons/table.svg';

type Props = {
  attributes: Object,
  createLease: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  isFetching: boolean,
  leases: Object,
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
    const {fetchAttributes, fetchLeases, receiveTopNavigationSettings} = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      pageTitle: 'Vuokraukset',
      showSearch: false,
    });
    fetchAttributes();
    fetchLeases(getSearchQuery(query));
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
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
      isFetching,
    } = this.props;
    const leases = getContentLeases(content, attributes);
    //TODO: Filter leases by document type on front-end for demo purposes. Move to backend and end points are working
    const filteredLeases = getLeasesFilteredByDocumentType(leases, documentType);

    return (
      <PageContainer>
        <Modal
          isOpen={isModalOpen}
          onClose={this.hideModal}
          title={'Luo vuokratunnus'}
        >
          <CreateLease
            attributes={attributes}
            onSubmit={(lease) => createLease(lease)}
          />
        </Modal>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin full-width'
              onClick={this.showModal}
              text='Luo uusi vuokratunnus'
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
          buttonSelectorOptions={leaseTypeOptions}
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
                  {key: 'person', label: 'Vuokranantaja'},
                  {key: 'address', label: 'Osoite'},
                  {key: 'status', label: 'Tyyppi'},
                  {key: 'start_date', label: 'Alkupvm'},
                  {key: 'end_date', label: 'Loppupvm'},
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
      };
    },
    {
      createLease,
      fetchLeases,
      fetchAttributes,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseList);
