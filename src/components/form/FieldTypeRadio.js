// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: String,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  options: ?Array,
  type: String,
}

const FieldTypeRadio = ({input, displayError, disabled, options, type}: Props) => {
  const {name, onChange} = input;

  return (
    <fieldset
      id={input.name}
      className={classNames(`form-field__${type}`, {'has-error': displayError})}
      disabled={disabled}
    >
      {options.map((label, index) =>
        <label key={index}>
          <input
            name={name}
            type={type}
            value={label}
            onChange={(event) => onChange(event.target.value)}
          />
          {label}
        </label>
      )}
    </fieldset>

  );
};

export default FieldTypeRadio;
