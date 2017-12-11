// @flow
import React from 'react';
type Props = {
  disabled?: boolean,
  isChecked: boolean,
  label: string,
  onChange: Function,
}
const SingleCheckboxInput = ({disabled, isChecked, label, onChange}: Props) => {
  return (
    <label className='single-checkbox-input'>
      <input type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default SingleCheckboxInput;
