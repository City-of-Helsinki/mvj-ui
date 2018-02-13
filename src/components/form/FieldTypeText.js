// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  disabled: boolean,
  input: Object,
  inputClassName?: string,
  inputStyle?: Object,
  isInline?: boolean,
  label: string,
  labelClassName?: string,
  meta: Object,
  placeholder: string,
  showLabel: boolean,
  type: string,
}

const FieldTypeText = ({
  disabled = false,
  input,
  inputClassName,
  inputStyle,
  isInline,
  label,
  labelClassName,
  meta: {dirty, error, touched},
  placeholder,
  type = 'text',
}: Props) => (
  <div className={classnames('mvj-form-field', {'inline': isInline})}>
    {label && <label className={classnames('mvj-form-field-label', labelClassName)}>{label}</label>}
    <div className={classnames('mvj-form-field__text', inputClassName, {'is-dirty': dirty})} style={inputStyle}>
      <input {...input} disabled={disabled} type={type} placeholder={placeholder}/>
      {touched && error && <span className='error'>{error}</span>}
    </div>
  </div>
);

export default FieldTypeText;
