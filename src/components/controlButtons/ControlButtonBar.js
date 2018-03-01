// @flow
import React from 'react';

type Props = {
  buttonsComponent?: any,
  infoComponent?: any,
}

const ControlButtonBar = ({buttonsComponent, infoComponent}: Props) =>
  <div className='control-button-bar'>
    <div className='info-component-wrapper'>{infoComponent}</div>
    <div className='control-buttons-wrapper'>{buttonsComponent}</div>
  </div>;

export default ControlButtonBar;
