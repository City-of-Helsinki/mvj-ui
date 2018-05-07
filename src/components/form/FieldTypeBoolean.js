// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
}

const FieldTypeBoolean = ({
  disabled = false,
  displayError = false,
  input,
  input: {name, onChange, value},
  isDirty = false,

}: Props) => {
  const options = [
    {value: false, label: 'Ei'},
    {value: true, label: 'Kyllä'},
  ];
  return (
    <fieldset
      id={name}
      className={classNames(
        'form-field__boolean',
        {'has-error': displayError},
        {'is-dirty': isDirty})
      }
      disabled={disabled}
    >
      {options && options.map((option, index) => {
        const {value: optionValue, label: optionLabel} = option;
        return (
          <label key={index} className='option-label'>
            <input
              type='radio'
              checked={optionValue === value}
              name={name}
              onChange={(event) => onChange(event.target.value === 'true' ? true : false)}
              value={optionValue}
            />
            <span>{optionLabel}</span>
          </label>
        );
      }
      )}
    </fieldset>
  );
};

export default FieldTypeBoolean;
