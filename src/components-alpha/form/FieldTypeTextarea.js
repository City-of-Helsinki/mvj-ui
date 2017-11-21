// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: String,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  placeholder: String,
  type: String,
}

const FieldTypeTextarea = ({input, type, displayError, disabled, placeholder}: Props) => {
  return (
    <textarea className={classNames('form-field__textarea', {'has-error': displayError})}
      id={input.name}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      {...input}
    />
  );
};

export default FieldTypeTextarea;
