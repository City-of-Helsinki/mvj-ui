// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  autoComplete?: string,
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder: string,
}

const FieldTypeBasic = ({autoComplete, displayError, disabled, input, isDirty, placeholder}: Props) => {
  return (
    <input className={classNames('form-field__input', {'has-error': displayError}, {'is-dirty': isDirty})}
      id={input.name}
      autoComplete={autoComplete}
      disabled={disabled}
      placeholder={placeholder}
      type='text'
      {...input}
    />
  );
};

export default FieldTypeBasic;
