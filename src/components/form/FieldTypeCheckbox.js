// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  label: string,
  options: Array<Object>,
}

const FieldTypeCheckbox = ({
  disabled = false,
  displayError = false,
  input,
  input: {name, onBlur, value},
  isDirty = false,
  label,
  options,

}: Props): React$Node => {
  const hasMultipleValues = options && options.length > 1;

  const handleChange = (event: any, optionValue) => {
    if (hasMultipleValues) {
      const newValue = [...value];

      if (event.target.checked) {
        newValue.push(optionValue);
      } else {
        newValue.splice(newValue.indexOf(optionValue), 1);
      }

      return onBlur(newValue);
    }

    return onBlur(!!value && value !== 'false' ? false : true);
  };

  return (
    <fieldset
      id={name}
      className={classNames(
        'form-field__checkbox',
        {'has-error': displayError},
        {'is-dirty': isDirty})
      }
      disabled={disabled}
    >
      {label && <legend>{label}</legend>}
      {options && options.map((option, index) => {
        const {value: optionValue, label: optionLabel} = option;

        return (
          <label key={index} className='option-label'>
            <input
              type='checkbox'
              checked={hasMultipleValues
                ? value.indexOf(optionValue) !== -1
                : !!value && value !== 'false'
              }
              name={hasMultipleValues ? `${name}[${index}]` : name}
              onChange={(event) => handleChange(event, optionValue)}
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

export default FieldTypeCheckbox;
