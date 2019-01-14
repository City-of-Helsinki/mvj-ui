// @flow
import React from 'react';

type Props = {
  children?: any,
  required?: boolean,
  title?: string,
}

const FormTextTitle = ({
  children,
  required = false,
  title,
}: Props) => <p className='form__text-title'>{children || title}{required &&<i className='required'> *</i>}</p>;

export default FormTextTitle;
