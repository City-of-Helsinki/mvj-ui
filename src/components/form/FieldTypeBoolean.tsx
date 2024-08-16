import React from "react";
import classNames from "classnames";
type Props = {
  autoBlur: boolean;
  disabled: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  label?: string;
};

const FieldTypeBoolean = ({
  autoBlur = false,
  disabled = false,
  displayError = false,
  input,
  input: {
    name,
    onBlur,
    onChange,
    value
  },
  isDirty = false,
  label
}: Props): JSX.Element => {
  const options = [{
    value: false,
    label: 'Ei'
  }, {
    value: true,
    label: 'Kyllä'
  }];

  const handleChange = (e: any) => {
    if (autoBlur) {
      onBlur(e.target.value === 'true');
    } else {
      onChange(e.target.value === 'true');
    }
  };

  return <fieldset id={name} className={classNames('form-field__boolean', {
    'has-error': displayError
  }, {
    'is-dirty': isDirty
  })} disabled={disabled}>
      {label && <legend>{label}</legend>}
      {options && options.map((option, index) => {
      const {
        value: optionValue,
        label: optionLabel
      } = option;
      return <label key={index} className='option-label'>
            <input type='radio' checked={optionValue === value} name={name} onChange={handleChange} value={Boolean(optionValue).toString()} />
            <span>{optionLabel}</span>
          </label>;
    })}
    </fieldset>;
};

export default FieldTypeBoolean;