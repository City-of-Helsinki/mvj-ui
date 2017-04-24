// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  options?: Array<any>,
  type: string,
}

const FieldTypeCheckbox = ({input, displayError, disabled, options, type}: Props) => {

  const {name, onChange, value} = input;
  const hasMultipleValues = options && options.length > 1;

  return (
    <fieldset
      id={input.name}
      className={classNames(`form-field__${type}`, {'has-error': displayError})}
      disabled={disabled}
    >
      {options && options.map((label, index) =>
        <label key={index}>
          <input type={type}
                 name={hasMultipleValues ? `${name}[${index}]` : name}
                 value={label}
                 checked={value.indexOf(label) !== -1}
                 onChange={(event) => {

                   if (hasMultipleValues) {
                     const newValue = [...value];
                     if (event.target.checked) {
                       newValue.push(label);
                     } else {
                       newValue.splice(newValue.indexOf(label), 1);
                     }
                     return onChange(newValue);
                   }

                   return onChange(value === event.target.value ? null : event.target.value);
                 }}/>
          {label}
        </label>
      )}
    </fieldset>

  );
};

export default FieldTypeCheckbox;
