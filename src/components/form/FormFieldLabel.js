// @flow
import React from 'react';

type Props = {
  children?: any,
}

const FormFieldLabel = ({children}: Props) =>
  <label className='form-field__label'>{children}</label>;

export default FormFieldLabel;
