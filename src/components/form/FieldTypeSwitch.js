// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  label: string,
  meta: Object,
  optionLabel: string,
}

const FieldTypeSwitch = ({
  disabled,
  displayError,
  input: {name, onChange, value},
  label,
  meta: {dirty},
  optionLabel,
}: Props) => {
  const handleChange = () => {
    return onChange(value ? false : true);
  };

  return (
    <div className='mvj-form-field'>
      {label && <label className='title'>{label}</label>}
      <div className={classNames(`mvj-form-field__switch`, {'has-error': displayError}, {'is-dirty': dirty})}>
        {optionLabel && <label className={classNames('mvj-form-field__switch-option-label', {'label-off': !value})}>{optionLabel}</label>}
        <div className="switch">
          <input
            type="checkbox"
            checked={value}
            disabled={disabled}
            name={name}
            onChange={handleChange}
            value={value}
          />
          <div className="slider" onClick={handleChange}></div>
        </div>
      </div>
    </div>
  );
};

export default FieldTypeSwitch;
