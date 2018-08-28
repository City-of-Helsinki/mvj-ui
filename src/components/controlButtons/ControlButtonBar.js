// @flow
import React from 'react';

import BackButton from '$components/button/BackButton';

type Props = {
  buttonComponent?: any,
  infoComponent?: any,
  onBack?: Function;
}

const ControlButtonBar = ({buttonComponent, infoComponent, onBack}: Props) =>
  <div className='control-button-bar'>
    {onBack &&
      <div className='back-button-wrapper'>
        <BackButton
          onClick={onBack}
          title='Takaisin'
        />
      </div>
    }

    <div className='info-component-wrapper'>{infoComponent}</div>
    <div className='control-buttons-wrapper'>{buttonComponent}</div>
  </div>;

export default ControlButtonBar;
