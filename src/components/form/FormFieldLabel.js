// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
  htmlFor: string,
  required?: boolean,
}

const FormFieldLabel = ({children, className, htmlFor, required = false}: Props) =>
  <label className={classNames('form-field__label', className)} htmlFor={htmlFor}>
    {children}
    {required &&<i className='required'> *</i>}
  </label>;

export default FormFieldLabel;
