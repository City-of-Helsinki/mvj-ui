// @flow
import React from 'react';

type Props = {
  buttonComponent?: any,
  infoComponent?: any,
}

const ControlButtonBar = ({buttonComponent, infoComponent}: Props) =>
  <div className='control-button-bar'>
    <div className='info-component-wrapper'>{infoComponent}</div>
    <div className='control-buttons-wrapper'>{buttonComponent}</div>
  </div>;

export default ControlButtonBar;
