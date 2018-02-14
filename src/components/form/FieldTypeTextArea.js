// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
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
  disabled = false,
  disableTouched = false,
  input,
  label,
  labelClassName,
  meta: {dirty, error, touched},
  placeholder,
  rows = 5,
}: Props) => (
  <div className='mvj-form-field'>
    {label && <label className={classnames('mvj-form-field-label', labelClassName)}>{label}</label>}
    <div className={classnames('mvj-form-field__textarea', {'is-dirty': dirty})}>
      <textarea {...input} disabled={disabled} placeholder={placeholder} rows={rows}/>
      {(touched || disableTouched) && error && <span className='error'>{error}</span>}
    </div>
  </div>
);

export default FieldTypeTextArea;
