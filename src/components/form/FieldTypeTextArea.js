// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled: boolean,
  disableTouched: boolean,
  input: Object,
  label: string,
  labelClassName?: string,
  meta: Object,
  placeholder: string,
  rows: number,
}

const FieldTypeTextArea = ({
  className,
  disabled = false,
  disableTouched = false,
  input,
  label,
  labelClassName,
  meta: {dirty, error, touched},
  placeholder,
  rows = 5,
}: Props) => (
  <div className={classNames('mvj-form-field', className)}>
    {label && <label className={classNames('mvj-form-field-label', labelClassName)}>{label}</label>}
    <div className={classNames('mvj-form-field-component', 'mvj-form-field__textarea', {'is-dirty': dirty})}>
      <textarea {...input} disabled={disabled} placeholder={placeholder} rows={rows}/>
      {(touched || disableTouched) && error && <span className='error'>{error}</span>}
    </div>
  </div>
);

export default FieldTypeTextArea;
