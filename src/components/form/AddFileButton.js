// @flow
import React from 'react';

import AddIcon from '$components/icons/AddIcon';

type Props = {
  label: string,
  name: string,
  onChange: Function,
}

const AddFileButton = ({label, name, onChange}: Props) => {
  let input: any;

  const handleKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      input.click();
    }
  };

  const setRefForFileInput = (element: any) => {
    input = element;
  };

  return(
    <div className='add-file-button'>
      <label htmlFor={name} onKeyDown={handleKeyDown} className='add-file-button__label' tabIndex={0}>
        <AddIcon />
        {label}
      </label>
      <input
        ref={setRefForFileInput}
        className='add-file-button__input'
        name={name}
        id={name}
        type='file'
        onChange={onChange}
      />
    </div>
  );
};

export default AddFileButton;
