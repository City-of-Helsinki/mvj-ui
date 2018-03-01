// @flow
import React from 'react';

type Props = {
  children?: any,
}

const FormSection = ({children}: Props) =>
  <div className='form-section'>{children}</div>;

export default FormSection;
