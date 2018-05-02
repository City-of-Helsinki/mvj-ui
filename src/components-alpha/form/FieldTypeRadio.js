// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  options: ?Array<any>,
  type: string,
}

const FieldTypeRadio = ({input: {name, onChange}, displayError, disabled, options, type}: Props) => {
  return (
    <fieldset
      id={name}
      className={classNames(`form-field__${type}`, {'has-error': displayError})}
      disabled={disabled}
    >
      {options && options.map((label, index) =>
        <label key={index}>
          <input
            name={name}
            onChange={(event) => onChange(event.target.value)}
            type={type}
            value={label}

          />
          {label}
        </label>
      )}
    </fieldset>

  );
};

export default FieldTypeRadio;
