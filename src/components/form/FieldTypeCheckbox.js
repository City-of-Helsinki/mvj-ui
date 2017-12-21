// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  label: string,
  meta: Object,
  options?: Array<any>,
  type: string,
}

const FieldTypeCheckbox = ({
  className,
  disabled,
  displayError,
  input: {name, onBlur, value},
  label,
  meta: {dirty},
  options,
  type = 'checkbox',
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

      return onBlur(newValue);
    }
    return onBlur(value === event.target.value ? false : event.target.value);
  };

  return (
    <div className='mvj-form-field'>
      {label && <label className='title'>{label}</label>}
      <fieldset
        id={name}
        className={classNames(`mvj-form-field__${type}`, className, {'has-error': displayError}, {'is-dirty': dirty})}
        disabled={disabled}
      >
        {options && options.map((option, index) => {
          const {value: optionValue, label: optionLabel} = option;
          return (
            <label key={index} className='option-label'>
              <input type={type}
                checked={hasMultipleValues ? value.indexOf(optionValue) !== -1 : !!value}
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
    </div>
  );
};

export default FieldTypeCheckbox;
