// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  autoBlur: boolean,
  autoComplete?: string,
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder: string,
  type?: string,
}

const FieldTypeBasic = ({
  autoBlur,
  autoComplete,
  displayError,
  disabled,
  input,
  input: {onBlur, onChange},
  isDirty,
  placeholder,
  type = 'text',
}: Props) => {
  const handleChange = (e: any) => {
    if(autoBlur) {
      onBlur(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <input className={classNames('form-field__input', {'has-error': displayError}, {'is-dirty': isDirty})}
      id={input.name}
      autoComplete={autoComplete}
      disabled={disabled}
      placeholder={placeholder}
      type={type}
      {...input}
      onChange={handleChange}
    />
  );
};

export default FieldTypeBasic;
