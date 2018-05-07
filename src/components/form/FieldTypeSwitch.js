// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  optionLabel?: string,
}

const FieldTypeSwitch = ({
  disabled,
  displayError,
  input: {name, onChange, value},
  isDirty,
  optionLabel,
}: Props) => {
  const handleChange = () => {
    return onChange(value ? false : true);
  };

  return (
    <div className={classNames(
      `form-field__switch`,
      {'has-error': displayError},
      {'is-dirty': isDirty})}>
      {optionLabel && <label className={classNames('switch-option-label', {'label-off': !value})}>{optionLabel}</label>}
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
  );
};

export default FieldTypeSwitch;
