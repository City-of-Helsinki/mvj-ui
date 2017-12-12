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
    <div className='single-checkbox-input'>
      <input type="checkbox" className="styled-checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  );
};

export default SingleCheckboxInput;
