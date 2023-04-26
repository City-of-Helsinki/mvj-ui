// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  autoBlur: boolean,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  label: string,
  options: Array<Object>,
}

const FieldTypeRadioWithField = ({
  autoBlur = false,
  disabled,
  displayError,
  input: {name, onBlur, onChange, value},
  isDirty,
  label,
  options,
}: Props): React$Node => {
  const handleChange = (e: any) =>  {
    if (autoBlur) {
      onBlur(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  return(
    <fieldset
      id={name}
      className={classNames(
        'form-field__radio-with-field',
        {'has-error': displayError},
        {'is-dirty': isDirty})
      }
      disabled={disabled}
    >
      {label && <legend>{label}</legend>}
      {options && options.map((option, index) => {
        const {
          value: optionValue,
          label: optionLabel,
          labelStyles,
          field,
          fieldStyles,
          errorField,
          errorFieldStyles,
        } = option;
        return (
          <div key={index} className='form-field__radio-with-field_option'>
            <label className='form-field__radio-with-field_option-label' style={labelStyles}>
              <input
                type='radio'
                checked={optionValue === value}
                name={name}
                onChange={handleChange}
                value={optionValue}
              />
              <span className='form-field__radio-with-field_option-text'>{optionLabel}</span>
            </label>
            <div>
              <div className='form-field__radio-with-field_option-field' style={fieldStyles}>{field}</div>
              <div className='form-field__radio-with-field_option-error-field' style={errorFieldStyles}>{errorField}</div>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
};

export default FieldTypeRadioWithField;
