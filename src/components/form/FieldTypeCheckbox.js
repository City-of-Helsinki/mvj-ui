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

const handleChange = (event, input, label) => {
  const newValue = [...input.value];
  if (event.target.checked) {
    newValue.push(label);
  } else {
    newValue.splice(newValue.indexOf(label), 1);
  }

  return input.onChange(newValue);
};

const FieldTypeCheckbox = ({input, displayError, disabled, options, type}: Props) => {
  return (
    <fieldset
      id={input.name}
      className={classNames(`form-field__${type}`, {'has-error': displayError})}
      disabled={disabled}
    >
      {options.map((label, index) =>
        <label key={index}>
          <input type={type}
                 name={`${input.name}[${index}]`}
                 value={label}
                 checked={input.value.indexOf(label) !== -1}
                 onChange={(event) => handleChange(event, input, label)}/>
          {label}
        </label>
      )}
    </fieldset>

  );
};

export default FieldTypeCheckbox;
