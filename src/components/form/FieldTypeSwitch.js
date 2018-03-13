// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  displayError: boolean,
  input: Object,
  label: string,
  labelClassName?: string,
  meta: Object,
  optionLabel: string,
}

const FieldTypeSwitch = ({
  className,
  disabled,
  disableDirty = false,
  displayError,
  input: {name, onChange, value},
  label,
  labelClassName,
  meta: {dirty},
  optionLabel,
}: Props) => {
  const handleChange = () => {
    return onChange(value ? false : true);
  };

  return (
    <div className={classNames('mvj-form-field', className)}>
      {label && <label className={classNames('mvj-form-field-label', labelClassName)}>{label}</label>}
      <div className={classNames(
        'mvj-form-field-component',
        `mvj-form-field__switch`,
        {'has-error': displayError},
        {'is-dirty': (!disableDirty && dirty)})}>
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
