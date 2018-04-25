// @flow
import React from 'react';

type Props = {
  children?: any,
}

const FormWrapperLeft = ({children}: Props) =>
  <div className='form-wrapper__left'>{children}</div>;

export default FormWrapperLeft;
