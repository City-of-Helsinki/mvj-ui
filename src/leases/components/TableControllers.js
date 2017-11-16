// @flow
import React, {Component} from 'react';

import StyledRadioButtons from '../../components/StyledRadioButtons';
import IconRadioButtons from '../../components/IconRadioButtons';
import tableIcon from '../../../assets/icons/table.svg';
import tableGreenIcon from '../../../assets/icons/table-green.svg';
import mapIcon from '../../../assets/icons/map.svg';
import mapGreenIcon from '../../../assets/icons/map-green.svg';

const documentTypeOptions = [
  {value: 'all', label: 'Kaikki'},
  {value: 'application', label: 'Hakemukset'},
  {value: 'reservation', label: 'Varaukset'},
  {value: 'lease', label: 'Vuokraukset'},
  {value: 'permission', label: 'Luvat'},
];

const visualizationTypeOptions = [
  {value: 'table', label: 'Taulukko', icon: tableIcon, iconSelected: tableGreenIcon},
  {value: 'map', label: 'Kartta', icon: mapIcon, iconSelected: mapGreenIcon},
];

type Props = {
  amount: number,
  documentType: string,
  onDocumentTypeChange: Function,
  visualizationType: string,
  onVisualizationTypeChange: Function,
}


class TableControllers extends Component {
  props: Props

  render () {
    const {amount, documentType, onDocumentTypeChange, visualizationType, onVisualizationTypeChange} = this.props;

    return (
      <div className='table-controllers'>
        <div className='table-info'>
          <div className='amount-wrapper'>
            <span>Löytyi {amount} kpl</span>
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
