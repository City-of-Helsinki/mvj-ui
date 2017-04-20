// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: String,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  options: ?Array,
  placeholder: String,
}

const FieldTypeSelect = ({input, displayError, disabled, options, placeholder}: Props) => {
  return (
    <select
      id={input.name}
      disabled={disabled}
      placeholder={placeholder}
      className={classNames('form-field__select', {'has-error': displayError})}
      {...input}>
      {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
    </select>
  );
};

export default FieldTypeSelect;
