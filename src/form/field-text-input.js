// @flow
import React from 'react';
import classNames from 'classnames';

import ErrorBlock from './error-block';

type Props = {
  className: String,
  disabled: Boolean,
  ErrorComponent: Function | Object,
  hint: String,
  input: Object,
  label: String,
  meta: Object,
  placeholder: String,
  required: Boolean,
  type: String,
}

const FieldTextInput = ({input, placeholder, type, label, meta, ErrorComponent, className, disabled, required, hint}: Props) => {
  const displayError = meta.error && meta.touched;
  return (
    <div className={classNames('form-field', className)}>
      {label && <label className="form-field__label" htmlFor={input.name}>{label}{required && ' *'}</label>}
      {hint && <span className="form-field__hint">{hint}</span>}
      <input className={classNames('form-field__input', {'error': displayError})}
             id={input.name}
             type={type}
             disabled={disabled}
             placeholder={placeholder}
             {...input}
      />
      {displayError && <ErrorComponent {...meta}/>}
    </div>

  );
};

FieldTextInput.defaultProps = {
  ErrorComponent: ErrorBlock,
  required: true,
};

export default FieldTextInput;
