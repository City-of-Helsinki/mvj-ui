// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: String,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  options: ?Array<any>,
  placeholder: String,
}

const FieldTypeSelect = ({input, displayError, disabled, options, placeholder}: Props) => {
  return (
    <select
      id={input.name}
      disabled={disabled}
      className={classNames('form-field__select', {'has-error': displayError})}
      {...input}>
      <option value=''>{placeholder}</option>
      {options && options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
    </select>
  );
};

export default FieldTypeSelect;
