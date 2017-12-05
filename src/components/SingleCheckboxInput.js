// @flow
import React from 'react';
type Props = {
  isChecked: boolean,
  label: string,
  onChange: Function,
}
const SingleCheckboxInput = ({isChecked, label, onChange}: Props) => {
  return (
    <label className='single-checkbox-input'>
      <input type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default SingleCheckboxInput;
