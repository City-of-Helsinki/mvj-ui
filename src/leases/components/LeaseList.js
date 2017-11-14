// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row} from 'react-foundation';

import {fetchAttributes} from '../../attributes/actions';
import {fetchLeases} from '../actions';
import ActionDropdown from '../../components/ActionDropdown';
import {getIsFetching, getLeasesList} from '../selectors';
import Search from './Search';
import TableControllers from './TableControllers';

type Props = {
  fetchAttributes: Function,
  fetchLeases: Function,
  isFetching: boolean,
  leases: Array<any>,
}

type State = {
  documentType: string,
  visualizationType: string,

}

class LeaseList extends Component {
  props: Props

  state: State = {
    documentType: 'all',
    visualizationType: 'table',
  }

  componentWillMount() {
    const {fetchAttributes, fetchLeases} = this.props;

    fetchAttributes();
    fetchLeases();
  }

  render() {
    const {documentType, visualizationType} = this.state;
    return (
      <div className='lease-list'>
        <Row>
          <div className='lease-list__search-wrapper'>
            <Search />
          </div>
          <div className='lease-list__dropdown-wrapper'>
            <ActionDropdown
              title={'Luo uusi'}
              options={[
                {value: 'application', label: 'Hakemus'},
                {value: 'lease', label: 'Vuokraus'},
                {value: 'area', label: 'Rasitealue'},
              ]}
            />
          </div>
        </Row>
        <Row>
          <TableControllers
            documentType={documentType}
            onDocumentTypeChange={(value) => {this.setState({documentType: value});}}
            visualizationType={visualizationType}
            onVisualizationTypeChange={(value) => {this.setState({visualizationType: value});}}
          />
        </Row>
        <Row>
          {visualizationType === 'table' && (
            <h1>Taulukko</h1>
          )}
          {visualizationType === 'map' && (
            <h1>Kartta</h1>
          )}
        </Row>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
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
