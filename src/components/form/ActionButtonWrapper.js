// @flow
import React from 'react';

type Props = {
  children: any,
}

const ActionButtonWrapper = ({children}: Props) =>
  <div className='form__action-button-wrapper'>{children}</div>;

export default ActionButtonWrapper;
