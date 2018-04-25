// @flow
import React from 'react';

import BackIcon from '../icons/BackIcon';

type Props = {
  buttonComponent?: any,
  infoComponent?: any,
  onBack?: Function;
}

const ControlButtonBar = ({buttonComponent, infoComponent, onBack}: Props) =>
  <div className='control-button-bar'>
    {onBack &&
      <div className='back-button-wrapper'>
        <button onClick={onBack}><BackIcon /></button>
      </div>
    }

    <div className='info-component-wrapper'>{infoComponent}</div>
    <div className='control-buttons-wrapper'>{buttonComponent}</div>
  </div>;

export default ControlButtonBar;
