// @flow
import React from 'react';

type Props = {
  input: Object,
  showLabel: boolean,
  label: string,
  placeholder: string,
  type: string,
  meta: Object,
}

const FieldTypeText = ({input, label, placeholder, type = 'text', meta: {touched, error}}: Props) => (
  <div className='mvj-form-field'>
    <label>{label}</label>
    <div className='mvj-form-field__text'>
      <input {...input} type={type} placeholder={placeholder}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

export default FieldTypeText;
