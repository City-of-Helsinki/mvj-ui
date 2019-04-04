// @flow
import React from 'react';

type Props = {
  name: string,
  onChange: Function,
  value: ?Object,
}

const FileInput = ({
  name,
  onChange,
  value,
}: Props) => {
  return (
    <div className='file__file-input'>
      <input type="file" id={name} name={name} onChange={onChange}/>
      <label htmlFor={name}><span>{value && value.name ? value.name: 'Valitse tiedosto…'}</span></label>
    </div>
  );
};

export default FileInput;
