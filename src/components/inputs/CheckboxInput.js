// @flow
import React from 'react';

type Props = {
  checkboxName: string,
  legend?: string,
  onChange: Function,
  options: Array<Object>,
  value?: Array<string>,
}

const CheckboxButtons = ({
  checkboxName,
  legend,
  onChange,
  options,
  value,
}: Props) => {
  return (
    <fieldset className='inputs__checkbox'>
      {legend && <legend>{legend}</legend>}
      {options.map((option, index) => {
        const handleChange = () => {
          const newValue = value ? [...value] : [],
            optionValue = option.value;

          if (newValue.indexOf(optionValue) === -1) {
            newValue.push(optionValue);
          } else {
            newValue.splice(newValue.indexOf(optionValue), 1);
          }
          onChange(newValue);
        };

        const isChecked = value ? value.indexOf(option.value) !== -1 : false;

        return (
          <label
            key={index}
            className='inputs__checkbox_label'
          >
            <input
              className='inputs__checkbox_checkbox'
              checked={isChecked}
              name={checkboxName}
              onChange={handleChange}
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
