// @flow
import React, {Component} from 'react';
import {Row} from 'react-foundation';

import ActionDropdown from '../../components/ActionDropdown';
import Search from './Search';
import TableControllers from './TableControllers';

type State = {
  documentType: string,
  visualizationType: string,
}

class LeaseList extends Component {
  state: State = {
    documentType: 'all',
    visualizationType: 'table',
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

export default LeaseList;
