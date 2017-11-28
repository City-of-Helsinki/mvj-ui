// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  label: string,
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  options?: Array<any>,
  type: string,
}

const FieldTypeCheckbox = ({label, className, input, displayError, disabled, options, type = 'checkbox'}: Props) => {

  const {name, onChange, value} = input;
  const hasMultipleValues = options && options.length > 1;
  console.log(classNames(`mvj-form-field__${type}`, className, {'has-error': displayError}));
  return (
    <div className='mvj-form-field'>
      {label && <label className='title'>{label}</label>}
      <fieldset
        id={input.name}
        className={classNames(`mvj-form-field__${type}`, className, {'has-error': displayError})}
        disabled={disabled}
      >
        {options && options.map((option, index) => {
          const {value: optionValue, label: optionLabel} = option;
          return (
            <label key={index} className='option-label'>
              <input type={type}
                name={hasMultipleValues ? `${name}[${index}]` : name}
                value={optionValue}
                checked={hasMultipleValues ? value.indexOf(optionValue) !== -1 : !!value }
                onChange={(event) => {
                  if (hasMultipleValues) {
                    const newValue = [...value];
                    if (event.target.checked) {
                      newValue.push(optionValue);
                    } else {
                      newValue.splice(newValue.indexOf(optionValue), 1);
                    }
                    return onChange(newValue);
                  }

                  return onChange(value === event.target.value ? false : event.target.value);
                }}/>
              {optionLabel}
            </label>
          );
        }

        )}
      </fieldset>
    </div>
  );
};

export default FieldTypeCheckbox;
