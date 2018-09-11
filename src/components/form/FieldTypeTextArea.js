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
  rows?: number,
  setRefForField: Function,
  type?: string,
}

const FieldTypeTextArea = ({
  autoBlur,
  autoComplete,
  displayError,
  disabled,
  input,
  input: {onBlur, onChange},
  isDirty,
  placeholder,
  rows = 3,
  setRefForField,
  type = 'text',
}: Props) => {
  const handleChange = (e: any) => {
    if(autoBlur) {
      onBlur(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  const handleSetRefForField = (element: any) => {
    if(setRefForField) {
      setRefForField(element);
    }
  };

  return (
    <textarea className={classNames('form-field__textarea', {'has-error': displayError}, {'is-dirty': isDirty})}
      ref={handleSetRefForField}
      id={input.name}
      autoComplete={autoComplete}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      type={type}
      {...input}
      onChange={handleChange}
    />
  );
};

export default FieldTypeTextArea;
