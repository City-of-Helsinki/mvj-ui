// @flow
import React from 'react';

type Props = {
  disabled?: boolean,
  onChange: Function,
  placeholder?: string,
  rows?: number,
  value: string,
}

const TextAreaInput = ({disabled, onChange, placeholder = '', rows = 3, value = ''}: Props) => {
  return (
    <textarea
      className='text--area-input'
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      resize={false}
      value={value}
    />
  );
};

export default TextAreaInput;
