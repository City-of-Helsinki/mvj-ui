// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  input: Object,
  isInline?: boolean,
  inputStyle: Object,
  showLabel: boolean,
  label: string,
  placeholder: string,
  type: string,
  meta: Object,
}

const FieldTypeText = ({input, isInline, inputStyle, label, placeholder, type = 'text', meta: {touched, error}}: Props) => (
  <div className={classnames('mvj-form-field', {'inline': isInline})}>
    {label && <label className='title'>{label}</label>}
    <div className='mvj-form-field__text' style={inputStyle}>
      <input {...input} type={type} placeholder={placeholder}/>
      {touched && error && <span className='error'>{error}</span>}
    </div>
  </div>
);

export default FieldTypeText;
