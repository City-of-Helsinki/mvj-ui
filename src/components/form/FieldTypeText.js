// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  disableTouched: boolean,
  input: Object,
  label: string,
  labelClassName?: string,
  meta: Object,
  placeholder: string,
  showLabel: boolean,
  type: string,
}

const FieldTypeText = ({
  className,
  disabled = false,
  disableDirty = false,
  disableTouched = false,
  input,
  label,
  labelClassName,
  meta: {dirty, error, touched},
  placeholder,
  type = 'text',
}: Props) => (
  <div className={classNames('mvj-form-field', className)}>
    {label && <label className={classNames('mvj-form-field-label', labelClassName)}>{label}</label>}
    <div className={classNames(
      'mvj-form-field-component',
      'mvj-form-field__text',
      {'is-dirty': (!disableDirty && dirty)})}>
      <input {...input} disabled={disabled} type={type} placeholder={placeholder}/>
      {(touched || disableTouched) && error && <span className='error'>{error}</span>}
    </div>
  </div>
);

export default FieldTypeText;
