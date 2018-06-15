// @flow
import React from 'react';

type Props = {
  label: string,
  name: string,
  onChange: Function,
}

const AddFileButton = ({label, name, onChange}: Props) =>
  <div className='add-file-button'>
    <label htmlFor={name} className='add-file-button__label'><i />{label}</label>
    <input
      className='add-file-button__input'
      name={name}
      id={name}
      type='file'
      onChange={onChange}
    />
  </div>;

export default AddFileButton;
