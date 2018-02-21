// @flow
import React, {Component} from 'react';

import IconRadioButtons from '../../components/IconRadioButtons';
import tableIcon from '../../../assets/icons/table.svg';
import tableGreenIcon from '../../../assets/icons/table-green.svg';
import mapIcon from '../../../assets/icons/map.svg';
import mapGreenIcon from '../../../assets/icons/map-green.svg';

const visualizationTypeOptions = [
  {value: 'table', label: 'Taulukko', icon: tableIcon, iconSelected: tableGreenIcon},
  {value: 'map', label: 'Kartta', icon: mapIcon, iconSelected: mapGreenIcon},
];

type Props = {
  visualizationType: string,
  onVisualizationTypeChange: Function,
}


class TableControllers extends Component {
  props: Props

  render () {
    const {visualizationType, onVisualizationTypeChange} = this.props;

    return (
      <div className='table-controllers'>
        <div className='table-info'>
          <div className='amount-wrapper'>
            <span>Viimeksi muokattuja</span>
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
