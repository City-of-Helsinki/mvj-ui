// @flow
import React from 'react';

type Props = {
  required?: boolean,
  title: string,
}

const FormTextTitle = ({
  required = false,
  title,
}: Props) => <p className='form__text-title'>{title}{required &&<i className='required'> *</i>}</p>;

export default FormTextTitle;
