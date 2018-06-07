// @flow
import React from 'react';

type Props = {
  children?: any,
  required?: boolean,
}

const FormFieldLabel = ({children, required = false}: Props) =>
  <label className='form-field__label' title={children ? `${children}${required ? ' *' : ''}` : ''}>{children}{required &&<i className='required'> *</i>}</label>;

export default FormFieldLabel;
