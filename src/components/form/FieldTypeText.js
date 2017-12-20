// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  input: Object,
  inputStyle: Object,
  isInline?: boolean,
  label: string,
  meta: Object,
  placeholder: string,
  showLabel: boolean,
  type: string,
}

const FieldTypeText = ({
  input,
  inputStyle,
  isInline,
  label,
  meta: {dirty, error, touched},
  placeholder,
  type = 'text',
}: Props) => (
  <div className={classnames('mvj-form-field', {'inline': isInline})}>
    {label && <label className='title'>{label}</label>}
    <div className={classnames('mvj-form-field__text', {'is-dirty': dirty})} style={inputStyle}>
      <input {...input} type={type} placeholder={placeholder}/>
      {touched && error && <span className='error'>{error}</span>}
    </div>
  </div>
);

export default FieldTypeText;
