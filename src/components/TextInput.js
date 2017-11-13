// @flow
import React from 'react';

type Props = {
  value: string,
  onChange: Function,
  placeholder?: string,
  type?: string,
}

const TextInput = ({value = '', onChange, placeholder = '', type = 'text'}: Props) => {
  return (
    <input
      className='text-input'
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default TextInput;
