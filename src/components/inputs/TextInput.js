// @flow
import React from 'react';

type Props = {
  disabled?: boolean,
  onChange: Function,
  placeholder?: string,
  type?: string,
  value: string,
}

const TextInput = ({disabled, onChange, placeholder = '', type = 'text', value = ''}: Props) => {
  return (
    <input
      className='text-input'
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
};

export default TextInput;
