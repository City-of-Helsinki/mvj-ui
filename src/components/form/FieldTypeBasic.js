// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder: string,
  type: string,
}

const FieldTypeBasic = ({displayError, disabled, input, isDirty, placeholder, type}: Props) => {
  return (
    <input className={classNames('form-field__input', {'has-error': displayError}, {'is-dirty': isDirty})}
      id={input.name}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      {...input}
    />
  );
};

export default FieldTypeBasic;
