// @flow
import React from 'react';

type Props = {
  checkboxName: string,
  legend?: string,
  onChange: Function,
  options: Array<Object>,
  value: any,
}

const CheckboxButtons = ({
  checkboxName,
  legend,
  onChange,
  options,
  value,
}: Props) => {
  const hasMultipleValues = options && options.length > 1;

  const handleChange = (event: any, optionValue) => {
    if (hasMultipleValues) {
      const newValue = [...value];

      if (event.target.checked) {
        newValue.push(optionValue);
      } else {
        newValue.splice(newValue.indexOf(optionValue), 1);
      }

      return onChange(newValue);
    }
    return onChange(value ? false : true);
  };

  return (
    <fieldset className='inputs__checkbox'>
      {legend && <legend>{legend}</legend>}
      {options.map((option, index) => {
        return (
          <label
            key={index}
            className='inputs__checkbox_label'
          >
            <input
              className='inputs__checkbox_checkbox'
              checked={hasMultipleValues
                ? value.indexOf(option.value) !== -1
                : !!value && value !== 'false'
              }
              name={checkboxName}
              onChange={(event) => handleChange(event, option.value)}
              type='checkbox'
              value={option.value}
            />
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
};

export default CheckboxButtons;
