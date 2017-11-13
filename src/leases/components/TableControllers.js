// @flow
import React, {Component} from 'react';

import StyledRadioButtons from '../../components/StyledRadioButtons';
import IconRadioButtons from '../../components/IconRadioButtons';

const documentTypeOptions = [
  {value: 'all', label: 'Kaikki'},
  {value: 'application', label: 'Hakemukset'},
  {value: 'lease', label: 'Vuokraukset'},
];

const visualizationTypeOptions = [
  {value: 'table', label: 'Taulukko', icon: '../../../assets/icons/table.svg', iconSelected: '../../../assets/icons/table-green.svg'},
  {value: 'map', label: 'Kartta', icon: '../../../assets/icons/map.svg', iconSelected: '../../../assets/icons/map-green.svg'},
];

type Props = {
  documentType: string,
  onDocumentTypeChange: Function,
  visualizationType: string,
  onVisualizationTypeChange: Function,
}


class TableControllers extends Component {
  props: Props

  render () {
    const {documentType, onDocumentTypeChange, visualizationType, onVisualizationTypeChange} = this.props;

    return (
      <div className='table-controllers'>
        <div className='table-info'>
          <div className='amount-wrapper'>
            <span>Löytyi 32 kpl</span>
          </div>
          <div className='document-type-wrapper'>
            <StyledRadioButtons
              options={documentTypeOptions}
              radioName='radio-buttons-document-type'
              value={documentType}
              onChange={(value) => onDocumentTypeChange(value)}
            />
          </div>
          <div className='visualization-type-wrapper'>
            <IconRadioButtons
              options={visualizationTypeOptions}
              radioName='radio-buttons-visualization-type'
              value={visualizationType}
              onChange={(value) => onVisualizationTypeChange(value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TableControllers;
