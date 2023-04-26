// @flow
import React from 'react';

type Props = {
  children?: any,
}

const FormWrapperLeft = ({children}: Props): React$Node =>
  <div className='form-wrapper__left'>{children}</div>;

export default FormWrapperLeft;
